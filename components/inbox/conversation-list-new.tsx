"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Pin,
  Star,
  Check,
  CheckCheck,
  CheckSquare,
  Mail,
  MailOpen,
  Ban,
  Trash2,
  Download,
  MessageSquarePlus,
  MessageCircle,
  Camera,
  X,
  Tag,
  UserPlus,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockConversations } from "@/lib/mock-data";
import { Conversation } from "@/types/inbox";
import { toast } from "sonner";

interface ConversationListProps {
  selectedId?: string;
  onSelect: (id: string) => void;
  activeTab: string;
  conversations?: Conversation[];
  onConversationUpdate?: (conversationId: string, updates: Partial<Conversation>) => void;
  onCountsChange?: (counts: {
    all: number;
    my: number;
    unread: number;
    unassigned: number;
  }) => void;
}

// Mapa de cores para as tags
const tagColors: Record<string, string> = {
  "Urgente": "bg-red-100 text-red-800 border-red-200",
  "Pagamento": "bg-green-100 text-green-800 border-green-200",
  "Pedido": "bg-blue-100 text-blue-800 border-blue-200",
  "Suporte": "bg-purple-100 text-purple-800 border-purple-200",
  "Bug": "bg-orange-100 text-orange-800 border-orange-200",
};

// Listas de etiquetas e usuários
const allTags = [
  "Urgente",
  "Pagamento",
  "Pedido",
  "Suporte",
  "Bug",
  "Feedback",
  "Dúvida",
  "Reclamação",
  "Elogio",
  "Renovação",
  "Cancelamento",
  "Integração",
  "Treinamento",
  "Documentação",
  "Cotação",
];

const allUsers = [
  { id: "user1", name: "June Jensen", avatar: "JJ" },
  { id: "user2", name: "Anna B", avatar: "AB" },
  { id: "user3", name: "Carlos Silva", avatar: "CS" },
  { id: "user4", name: "Maria Santos", avatar: "MS" },
  { id: "user5", name: "Pedro Costa", avatar: "PC" },
  { id: "user6", name: "Ana Oliveira", avatar: "AO" },
  { id: "user7", name: "Lucas Alves", avatar: "LA" },
  { id: "user8", name: "Julia Pereira", avatar: "JP" },
  { id: "user9", name: "Rafael Lima", avatar: "RL" },
  { id: "user10", name: "Camila Souza", avatar: "CS" },
  { id: "user11", name: "Bruno Martins", avatar: "BM" },
  { id: "user12", name: "Fernanda Rocha", avatar: "FR" },
  { id: "user13", name: "Thiago Dias", avatar: "TD" },
  { id: "user14", name: "Beatriz Ferreira", avatar: "BF" },
  { id: "user15", name: "Gabriel Mendes", avatar: "GM" },
];

export function ConversationListNew({
  selectedId,
  onSelect,
  activeTab,
  conversations: externalConversations,
  onConversationUpdate,
  onCountsChange,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversations, setSelectedConversations] = useState<string[]>(
    []
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterUnreadOnly, setFilterUnreadOnly] = useState<boolean>(false);
  const [filterImportantOnly, setFilterImportantOnly] = useState<boolean>(false);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterUsers, setFilterUsers] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [localConversations, setLocalConversations] = useState<Conversation[]>(mockConversations);
  
  // Usa conversas externas se fornecidas, senão usa as locais
  const conversations = externalConversations || localConversations;
  const [isAssignTagOpen, setIsAssignTagOpen] = useState(false);
  const [selectedTagsToAssign, setSelectedTagsToAssign] = useState<string[]>([]);
  const [isAssignUserOpen, setIsAssignUserOpen] = useState(false);
  const [selectedUserToAssign, setSelectedUserToAssign] = useState<string | null>(null);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("open");
  const [showKebabTooltip, setShowKebabTooltip] = useState(false);
  
  // Estados para modal de nova conversa
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newConnection, setNewConnection] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("55");
  const [newDDD, setNewDDD] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Calcula badges de contagem
  const allCount = conversations.filter((c) => c.status === "open").length;
  const myCount = conversations.filter(
    (c) => c.assignedTo?.id === "user1" && c.status === "open"
  ).length;
  const unreadCount = conversations.filter(
    (c) => c.unread && c.status === "open"
  ).length;
  const unassignedCount = conversations.filter(
    (c) => !c.assignedTo && c.status === "open"
  ).length;

  // Atualiza contadores no componente pai
  useEffect(() => {
    if (onCountsChange) {
      onCountsChange({
        all: allCount,
        my: myCount,
        unread: unreadCount,
        unassigned: unassignedCount,
      });
    }
  }, [allCount, myCount, unreadCount, unassignedCount, onCountsChange]);

  // Mostra tooltip automaticamente quando conversas são selecionadas
  useEffect(() => {
    if (selectedConversations.length > 0 || selectionMode) {
      // Pequeno delay para garantir que o componente foi renderizado
      const showTimer = setTimeout(() => {
        setShowKebabTooltip(true);
      }, 100);
      
      const hideTimer = setTimeout(() => {
        setShowKebabTooltip(false);
      }, 2600); // 2.5 segundos após aparecer
      
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShowKebabTooltip(false);
    }
  }, [selectedConversations.length, selectionMode]);

  // Filtra conversas
  const filteredConversations = conversations.filter((conv) => {
    // Filtro de aba
    if (activeTab === "all" && conv.status !== "open") return false;
    if (activeTab === "my" && (conv.assignedTo?.id !== "user1" || conv.status !== "open")) return false;
    if (activeTab === "unread" && (!conv.unread || conv.status !== "open")) return false;
    if (activeTab === "unassigned" && (conv.assignedTo || conv.status !== "open")) return false;
    if (activeTab === "groups") return false; // TODO: adicionar lógica de grupos

    // Filtro de busca
    if (
      searchQuery &&
      !conv.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filtro de status (multiselect)
    if (filterStatus !== "all") {
      if (conv.status !== filterStatus) return false;
    }

    // Filtro de não lidas
    if (filterUnreadOnly) {
      if (!conv.unread) return false;
    }

    // Filtro de importantes
    if (filterImportantOnly) {
      if (!conv.isImportant) return false;
    }

    // Filtro de tags (multiselect)
    if (filterTags.length > 0) {
      const hasMatchingTag = filterTags.some((tag) => conv.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Filtro de usuários (multiselect)
    if (filterUsers.length > 0) {
      const hasMatchingUser = filterUsers.some(
        (userId) => conv.assignedTo?.id === userId
      );
      if (!hasMatchingUser) return false;
    }

    return true;
  });

  // Ordena: pinned first, then by timestamp
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // TODO: Implementar ordenação por timestamp real
    return 0;
  });

  const handleSelectAll = () => {
    if (selectedConversations.length === sortedConversations.length) {
      setSelectedConversations([]);
    } else {
      setSelectedConversations(sortedConversations.map((c) => c.id));
    }
  };

  const handleSelectConversation = (id: string) => {
    if (selectedConversations.includes(id)) {
      setSelectedConversations(selectedConversations.filter((c) => c !== id));
    } else {
      setSelectedConversations([...selectedConversations, id]);
    }
  };

  const handleToggleUnread = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;
    
    if (onConversationUpdate && externalConversations) {
      onConversationUpdate(id, { unread: !conv.unread });
    } else {
      setLocalConversations(localConversations.map(conv => {
        if (conv.id === id) {
          return { ...conv, unread: !conv.unread };
        }
        return conv;
      }));
    }
  };

  const handleToggleImportant = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;
    
    if (onConversationUpdate && externalConversations) {
      onConversationUpdate(id, { isImportant: !conv.isImportant });
    } else {
      setLocalConversations(localConversations.map(conv => {
        if (conv.id === id) {
          return { ...conv, isImportant: !conv.isImportant };
        }
        return conv;
      }));
    }
  };

  const handleTogglePin = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;
    
    if (onConversationUpdate && externalConversations) {
      onConversationUpdate(id, { isPinned: !conv.isPinned });
    } else {
      setLocalConversations(localConversations.map(conv => {
        if (conv.id === id) {
          return { ...conv, isPinned: !conv.isPinned };
        }
        return conv;
      }));
    }
  };

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterUnreadOnly(false);
    setFilterImportantOnly(false);
    setFilterTags([]);
    setFilterUsers([]);
  };

  const handleAssignTags = () => {
    if (onConversationUpdate && externalConversations) {
      selectedConversations.forEach(id => {
        const conv = conversations.find(c => c.id === id);
        if (conv) {
          const newTags = [...new Set([...conv.tags, ...selectedTagsToAssign])];
          onConversationUpdate(id, { tags: newTags });
        }
      });
    } else {
      setLocalConversations(localConversations.map(conv => {
        if (selectedConversations.includes(conv.id)) {
          const newTags = [...new Set([...conv.tags, ...selectedTagsToAssign])];
          return { ...conv, tags: newTags };
        }
        return conv;
      }));
    }
    // Limpar seleção e fechar popover
    setSelectedTagsToAssign([]);
    setIsAssignTagOpen(false);
  };

  const handleAssignUser = () => {
    if (!selectedUserToAssign) return;
    
    const user = allUsers.find(u => u.id === selectedUserToAssign);
    if (!user) return;

    if (onConversationUpdate && externalConversations) {
      selectedConversations.forEach(id => {
        onConversationUpdate(id, {
          assignedTo: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          }
        });
      });
    } else {
      setLocalConversations(localConversations.map(conv => {
        if (selectedConversations.includes(conv.id)) {
          return { 
            ...conv, 
            assignedTo: {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
            }
          };
        }
        return conv;
      }));
    }
    // Limpar seleção e fechar dialog
    setSelectedUserToAssign(null);
    setIsAssignUserOpen(false);
  };

  const handleChangeStatus = () => {
    if (onConversationUpdate && externalConversations) {
      selectedConversations.forEach(id => {
        onConversationUpdate(id, {
          status: selectedStatus as "open" | "closed" | "blocked"
        });
      });
    } else {
      setLocalConversations(localConversations.map(conv => {
        if (selectedConversations.includes(conv.id)) {
          return { 
            ...conv, 
            status: selectedStatus as "open" | "closed" | "blocked"
          };
        }
        return conv;
      }));
    }
    // Resetar e fechar dialog
    setSelectedStatus("open");
    setIsChangeStatusOpen(false);
  };

  const handleExport = () => {
    // Simular exportação
    const count = selectedConversations.length;
    
    toast.success(`${count} ${count === 1 ? 'conversa exportada' : 'conversas exportadas'} com sucesso`, {
      duration: 5000,
    });
  };

  const hasFilters =
    filterStatus !== "all" || filterUnreadOnly || filterImportantOnly || filterTags.length > 0 || filterUsers.length > 0;

  const handleExportFiltered = () => {
    // Exportar conversas filtradas
    const count = filteredConversations.length;
    const filterText = hasFilters ? ' (filtradas)' : '';
    
    toast.success(`${count} ${count === 1 ? 'conversa' : 'conversas'}${filterText} exportada${count === 1 ? '' : 's'} com sucesso`, {
      duration: 5000,
    });
  };

  const handleSaveNewConversation = () => {
    // Criar nova conversa
    const newConversation: Conversation = {
      id: `new-${Date.now()}`,
      name: newContactName,
      avatar: newContactName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      lastMessage: "Conversa iniciada",
      timestamp: "agora",
      unread: false,
      unreadCount: 0,
      channel: newConnection as "whatsapp" | "instagram",
      tags: [],
      isPinned: false,
      isImportant: false,
      assignedTo: {
        id: "user1",
        name: "June Jensen",
        avatar: "JJ",
      },
      status: "open",
    };
    
    // Adicionar nova conversa no início da lista
    if (externalConversations && onConversationUpdate) {
      // Se há conversas externas, não podemos adicionar diretamente aqui
      // Por enquanto, vamos usar o estado local se não houver prop externa
      setLocalConversations([newConversation, ...localConversations]);
    } else {
      setLocalConversations([newConversation, ...localConversations]);
    }
    
    // Limpar formulário
    setNewContactName("");
    setNewConnection("");
    setNewCountryCode("55");
    setNewDDD("");
    setNewPhone("");
    setIsNewConversationOpen(false);
  };

  const handleCancelNewConversation = () => {
    setNewContactName("");
    setNewConnection("");
    setNewCountryCode("55");
    setNewDDD("");
    setNewPhone("");
    setIsNewConversationOpen(false);
  };

  // Títulos das abas em português
  const tabTitles: Record<string, string> = {
    all: "Todos os chats",
    my: "Meus chats",
    unread: "Não lidas",
    unassigned: "Chats não atribuídos",
    groups: "Grupos",
  };

  return (
    <TooltipProvider>
      <div className="w-[440px] bg-white flex flex-col flex-shrink-0 overflow-hidden rounded-2xl shadow-lg h-full">
        {/* Header com Abas */}
        <div className="p-4 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">{tabTitles[activeTab]}</h2>
            <div className="flex items-center gap-1">
              <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                        <MessageSquarePlus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Nova conversa</TooltipContent>
                </Tooltip>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar nova conversa</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Nome do contato */}
                    <div className="grid gap-2">
                      <Label htmlFor="contact-name">Nome do contato</Label>
                      <Input
                        id="contact-name"
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                        placeholder="Digite o nome do contato"
                      />
                    </div>

                    {/* Conexão */}
                    <div className="grid gap-2">
                      <Label htmlFor="connection">Conexão</Label>
                      <Select value={newConnection} onValueChange={setNewConnection}>
                        <SelectTrigger id="connection" className="w-full">
                          <SelectValue placeholder="Selecione o tipo de conexão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                          <SelectItem value="messenger">Messenger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Telefone */}
                    <div className="grid gap-2">
                      <Label>Telefone</Label>
                      <div className="flex gap-2">
                        <div className="w-20">
                          <Input
                            id="country-code"
                            value={newCountryCode}
                            onChange={(e) => setNewCountryCode(e.target.value.replace(/\D/g, ""))}
                            placeholder="55"
                            maxLength={3}
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            id="ddd"
                            value={newDDD}
                            onChange={(e) => setNewDDD(e.target.value.replace(/\D/g, ""))}
                            placeholder="DDD"
                            maxLength={2}
                            className={newDDD && newDDD.length < 2 ? "border-red-500" : ""}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            id="phone"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder="Número"
                            maxLength={9}
                            className={newPhone && newPhone.length < 8 ? "border-red-500" : ""}
                          />
                        </div>
                      </div>
                      {((newDDD && newDDD.length < 2) || (newPhone && newPhone.length < 8)) && (
                        <p className="text-xs text-red-500">
                          {newDDD && newDDD.length < 2 && "DDD deve ter 2 dígitos. "}
                          {newPhone && newPhone.length < 8 && "Número deve ter 8 ou 9 dígitos."}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelNewConversation}
                      className="cursor-pointer"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSaveNewConversation}
                      disabled={
                        !newContactName || 
                        !newConnection || 
                        !newDDD || 
                        newDDD.length < 2 ||
                        !newPhone || 
                        newPhone.length < 8
                      }
                      className="cursor-pointer"
                    >
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => {
                      setSelectionMode(!selectionMode);
                      if (selectionMode) {
                        setSelectedConversations([]);
                      }
                    }}
                  >
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Selecionar conversas</TooltipContent>
              </Tooltip>

              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Filtros</TooltipContent>
                </Tooltip>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Filtros</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 text-xs cursor-pointer ${hasFilters ? 'visible' : 'invisible'}`}
                        onClick={clearFilters}
                      >
                        Limpar tudo
                      </Button>
                    </div>

                    {/* Quick Filters Pills */}
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
                        className={`h-7 px-3 text-xs cursor-pointer transition-all ${
                          filterUnreadOnly
                            ? "bg-slate-700 text-white hover:bg-slate-800"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <MailOpen className="h-3 w-3 mr-1.5" />
                        Não lidas
                      </Badge>
                      
                      <Badge
                        onClick={() => setFilterImportantOnly(!filterImportantOnly)}
                        className={`h-7 px-3 text-xs cursor-pointer transition-all ${
                          filterImportantOnly
                            ? "bg-slate-700 text-white hover:bg-slate-800"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <Star className="h-3 w-3 mr-1.5" />
                        Importantes
                      </Badge>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Status</label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="open">Abertas</SelectItem>
                          <SelectItem value="closed">Fechadas</SelectItem>
                          <SelectItem value="blocked">Bloqueadas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tags Filter */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium">
                          Etiquetas {filterTags.length > 0 && `(${filterTags.length})`}
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 text-xs cursor-pointer text-slate-500 hover:text-slate-700 ${filterTags.length > 0 ? 'visible' : 'invisible'}`}
                          onClick={() => setFilterTags([])}
                        >
                          Limpar
                        </Button>
                      </div>
                      <div className="h-[120px] border rounded-md">
                        <ScrollArea className="h-full">
                          <div className="space-y-2 p-2">
                            {allTags.map((tag) => (
                              <div key={tag} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`tag-${tag}`}
                                  checked={filterTags.includes(tag)}
                                  onCheckedChange={() => {
                                    if (filterTags.includes(tag)) {
                                      setFilterTags(filterTags.filter((t) => t !== tag));
                                    } else {
                                      setFilterTags([...filterTags, tag]);
                                    }
                                  }}
                                  className="cursor-pointer"
                                />
                                <label
                                  htmlFor={`tag-${tag}`}
                                  className="text-sm cursor-pointer leading-none"
                                >
                                  {tag}
                                </label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>

                    {/* Users Filter */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium">
                          Usuários {filterUsers.length > 0 && `(${filterUsers.length})`}
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 text-xs cursor-pointer text-slate-500 hover:text-slate-700 ${filterUsers.length > 0 ? 'visible' : 'invisible'}`}
                          onClick={() => setFilterUsers([])}
                        >
                          Limpar
                        </Button>
                      </div>
                      <div className="h-[120px] border rounded-md">
                        <ScrollArea className="h-full">
                          <div className="space-y-2 p-2">
                            {allUsers.map((user) => (
                              <div key={user.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`user-${user.id}`}
                                  checked={filterUsers.includes(user.id)}
                                  onCheckedChange={() => {
                                    if (filterUsers.includes(user.id)) {
                                      setFilterUsers(filterUsers.filter((u) => u !== user.id));
                                    } else {
                                      setFilterUsers([...filterUsers, user.id]);
                                    }
                                  }}
                                  className="cursor-pointer"
                                />
                                <label
                                  htmlFor={`user-${user.id}`}
                                  className="text-sm cursor-pointer leading-none"
                                >
                                  {user.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={handleExportFiltered}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {hasFilters ? 'Exportar conversas filtradas' : 'Exportar todas as conversas'}
                </TooltipContent>
              </Tooltip>

              {selectedConversations.length > 0 && (
                <TooltipProvider>
                  <Tooltip open={showKebabTooltip}>
                    <TooltipTrigger asChild>
                      <div className="inline-block">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            setIsAssignTagOpen(true);
                          }}>
                            <Tag className="h-4 w-4 mr-2" />
                            Atribuir etiqueta
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Atribuir etiquetas às conversas selecionadas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            setIsAssignUserOpen(true);
                          }}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Atribuir usuário
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Atribuir usuário às conversas selecionadas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            setIsChangeStatusOpen(true);
                          }}>
                            <CircleDot className="h-4 w-4 mr-2" />
                            Alterar status da conversa
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Alterar o status das conversas selecionadas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <DropdownMenuSeparator />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem onSelect={handleExport}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Exportar conversas selecionadas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remover conversas selecionadas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clique para ver ações disponíveis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Dialog para atribuir etiquetas */}
              {selectedConversations.length > 0 && (
                <Dialog open={isAssignTagOpen} onOpenChange={setIsAssignTagOpen}>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Atribuir etiquetas</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <ScrollArea className="h-64 border rounded-md">
                        <div className="space-y-2 p-2">
                          {allTags.map((tag) => (
                            <div key={tag} className="flex items-center space-x-2">
                              <Checkbox
                                id={`assign-tag-${tag}`}
                                checked={selectedTagsToAssign.includes(tag)}
                                onCheckedChange={() => {
                                  if (selectedTagsToAssign.includes(tag)) {
                                    setSelectedTagsToAssign(selectedTagsToAssign.filter((t) => t !== tag));
                                  } else {
                                    setSelectedTagsToAssign([...selectedTagsToAssign, tag]);
                                  }
                                }}
                                className="cursor-pointer"
                              />
                              <label
                                htmlFor={`assign-tag-${tag}`}
                                className="text-sm cursor-pointer leading-none"
                              >
                                {tag}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedTagsToAssign([]);
                          setIsAssignTagOpen(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAssignTags}
                        disabled={selectedTagsToAssign.length === 0}
                      >
                        Aplicar ({selectedTagsToAssign.length})
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Dialog para atribuir usuário */}
              {selectedConversations.length > 0 && (
                <Dialog open={isAssignUserOpen} onOpenChange={setIsAssignUserOpen}>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Atribuir usuário</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <ScrollArea className="h-64 border rounded-md">
                        <div className="space-y-2 p-2">
                          {allUsers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`assign-user-${user.id}`}
                                checked={selectedUserToAssign === user.id}
                                onCheckedChange={() => {
                                  setSelectedUserToAssign(selectedUserToAssign === user.id ? null : user.id);
                                }}
                                className="cursor-pointer"
                              />
                              <label
                                htmlFor={`assign-user-${user.id}`}
                                className="text-sm cursor-pointer leading-none flex items-center gap-2"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                                    {user.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                {user.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedUserToAssign(null);
                          setIsAssignUserOpen(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAssignUser}
                        disabled={!selectedUserToAssign}
                      >
                        Aplicar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Dialog para alterar status */}
              {selectedConversations.length > 0 && (
                <Dialog open={isChangeStatusOpen} onOpenChange={setIsChangeStatusOpen}>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Alterar status da conversa</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Aberta</SelectItem>
                            <SelectItem value="closed">Fechada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedStatus("open");
                          setIsChangeStatusOpen(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleChangeStatus}
                      >
                        Aplicar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Select All Checkbox */}
          {selectionMode && sortedConversations.length > 0 && (
            <div className="flex items-center justify-between px-1 min-h-[28px]">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedConversations.length === sortedConversations.length &&
                    selectedConversations.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-xs text-muted-foreground">
                  {selectedConversations.length > 0
                    ? `${selectedConversations.length} selecionada(s)`
                    : "Selecionar todas"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {selectedConversations.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs cursor-pointer"
                    onClick={() => setSelectedConversations([])}
                  >
                    Limpar seleção
                  </Button>
                ) : (
                  <div className="h-7 w-[100px]"></div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 cursor-pointer"
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedConversations([]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Active Filters Badges */}
          {hasFilters && (
            <div className="px-4 py-3 border-t">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2 ml-[-16px]">
                  {filterStatus !== "all" && (
                    <Badge
                      className="h-6 text-xs gap-1 pr-1 flex items-center bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    >
                      Status: {filterStatus === "open" ? "Abertas" : filterStatus === "closed" ? "Fechadas" : "Bloqueadas"}
                      <button
                        onClick={() => setFilterStatus("all")}
                        className="ml-1 hover:bg-slate-300 rounded-sm p-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}

                  {filterUnreadOnly && (
                    <Badge
                      className="h-6 text-xs gap-1 pr-1 flex items-center bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    >
                      Não lidas
                      <button
                        onClick={() => setFilterUnreadOnly(false)}
                        className="ml-1 hover:bg-slate-300 rounded-sm p-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}

                  {filterImportantOnly && (
                    <Badge
                      className="h-6 text-xs gap-1 pr-1 flex items-center bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    >
                      Importantes
                      <button
                        onClick={() => setFilterImportantOnly(false)}
                        className="ml-1 hover:bg-slate-300 rounded-sm p-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {filterTags.map((tag) => (
                    <Badge
                      key={tag}
                      className="h-6 text-xs gap-1 pr-1 flex items-center bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    >
                      {tag}
                      <button
                        onClick={() => setFilterTags(filterTags.filter((t) => t !== tag))}
                        className="ml-1 hover:bg-slate-300 rounded-sm p-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  
                  {filterUsers.map((userId) => {
                    const user = allUsers.find((u) => u.id === userId);
                    return user ? (
                      <Badge
                        key={userId}
                        className="h-6 text-xs gap-1 pr-1 flex items-center bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      >
                        {user.name}
                        <button
                          onClick={() => setFilterUsers(filterUsers.filter((u) => u !== userId))}
                          className="ml-1 hover:bg-slate-300 rounded-sm p-0.5 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs cursor-pointer flex-shrink-0 bg-white hover:bg-slate-100 border-slate-300 mr-[-16px]"
                  onClick={clearFilters}
                >
                  Limpar tudo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Conversas */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="space-y-0 min-h-full">
            {sortedConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedId === conversation.id}
                isChecked={selectedConversations.includes(conversation.id)}
                onSelect={onSelect}
                onCheck={handleSelectConversation}
                onToggleUnread={handleToggleUnread}
                onToggleImportant={handleToggleImportant}
                onTogglePin={handleTogglePin}
                selectionMode={selectionMode}
              />
            ))}

            {sortedConversations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Nenhuma conversa encontrada
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

// Componente individual de conversa
function ConversationCard({
  conversation,
  isSelected,
  isChecked,
  onSelect,
  onCheck,
  onToggleUnread,
  onToggleImportant,
  onTogglePin,
  selectionMode,
}: {
  conversation: Conversation;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: (id: string) => void;
  onCheck: (id: string) => void;
  onToggleUnread: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onTogglePin: (id: string) => void;
  selectionMode: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className={`group relative py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b cursor-pointer ${
        selectionMode ? 'pl-5 pr-12' : 'pl-3 pr-4'
      } ${isSelected ? "bg-muted" : ""}`}
    >
      {/* Checkbox - só aparece no modo seleção */}
      {selectionMode && (
        <div className="flex-shrink-0 flex items-center h-10">
          <Checkbox
            checked={isChecked}
            onCheckedChange={() => onCheck(conversation.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className="flex-1 min-w-0 overflow-hidden"
        onClick={() => {
          onSelect(conversation.id);
          // Marca como lida se ainda não estiver lida
          if (conversation.unread) {
            onToggleUnread(conversation.id);
          }
        }}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Avatar com Canal */}
            <div className="relative flex-shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-slate-500 text-white font-medium text-sm">
                  {conversation.avatar}
                </AvatarFallback>
              </Avatar>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center border shadow-sm">
                      {conversation.channel === "whatsapp" ? (
                        <MessageCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <Camera className="h-3 w-3 text-pink-600" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {conversation.channel === "whatsapp"
                      ? "WhatsApp"
                      : "Instagram"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Nome e Indicadores */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-medium text-sm truncate ${
                    conversation.unread ? "font-semibold" : ""
                  }`}
                >
                  {conversation.name}
                </span>

                {conversation.isPinned && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Pin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>Fixada</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {conversation.isImportant && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>Importante</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {/* Tags */}
              {conversation.tags.length > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {conversation.tags.map((tag) => (
                    <TooltipProvider key={tag}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="outline"
                            className={`text-xs h-5 px-1.5 cursor-default ${
                              tagColors[tag] || "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            {tag}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>{tag}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Time & Actions */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {conversation.timestamp}
              </span>
            </div>

            {/* Kebab Menu */}
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen} modal={false}>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 transition-opacity ${
                    isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    onToggleUnread(conversation.id);
                  }}
                >
                  {conversation.unread ? (
                    <>
                      <MailOpen className="h-4 w-4 mr-2" />
                      Marcar como lida
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Marcar como não lida
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    onToggleImportant(conversation.id);
                  }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {conversation.isImportant
                    ? "Remover importante"
                    : "Marcar importante"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    onTogglePin(conversation.id);
                  }}
                >
                  <Pin className="h-4 w-4 mr-2" />
                  {conversation.isPinned ? "Desafixar" : "Fixar"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Ban className="h-4 w-4 mr-2" />
                  Bloquear
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Message Preview & Assigned User */}
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm text-muted-foreground truncate flex-1 ${
              conversation.unread ? "font-medium text-foreground" : ""
            }`}
          >
            {conversation.lastMessage}
          </p>

          <div className="flex items-center gap-2 flex-shrink-0">
            {conversation.unreadCount > 0 && (
              <TooltipProvider delayDuration={1000}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="default"
                      className="rounded-full h-5 min-w-5 px-1.5 text-xs flex items-center justify-center cursor-default"
                    >
                      {conversation.unreadCount}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {conversation.unreadCount} {conversation.unreadCount === 1 ? 'mensagem não lida' : 'mensagens não lidas'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {conversation.assignedTo && (
              <TooltipProvider delayDuration={1000}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-5 w-5 flex-shrink-0 cursor-default">
                      <AvatarFallback className="bg-slate-200 text-slate-700 text-xs flex items-center justify-center">
                        {conversation.assignedTo.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    Atribuído a {conversation.assignedTo.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

