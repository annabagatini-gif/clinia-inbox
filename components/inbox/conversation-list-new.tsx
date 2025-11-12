"use client";

import { useState } from "react";
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

interface ConversationListProps {
  selectedId?: string;
  onSelect: (id: string) => void;
  activeTab: string;
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
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  
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

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterUnreadOnly(false);
    setFilterImportantOnly(false);
    setFilterTags([]);
    setFilterUsers([]);
  };

  const hasFilters =
    filterStatus !== "all" || filterUnreadOnly || filterImportantOnly || filterTags.length > 0 || filterUsers.length > 0;

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
    setConversations([newConversation, ...conversations]);
    
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
      <div className="w-[420px] bg-[#F9FAFB] flex flex-col flex-shrink-0 overflow-hidden rounded-2xl shadow-md h-full">
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
                <PopoverContent 
                  className="w-[280px] p-0" 
                  align="end"
                  side="bottom"
                  sideOffset={8}
                >
                  <ScrollArea className="max-h-[calc(100vh-200px)]">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3 min-h-[28px]">
                      <h4 className="font-semibold text-sm">Filtros</h4>
                      <div className="w-[84px] flex justify-end">
                        {hasFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs cursor-pointer"
                            onClick={clearFilters}
                          >
                            Limpar tudo
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Quick Filters Pills */}
                    <div className="flex flex-wrap gap-2 pb-3 mb-3 border-b">
                      <Badge
                        onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
                        className={`h-7 px-3 text-xs cursor-pointer transition-all ${
                          filterUnreadOnly
                            ? "bg-slate-200 text-slate-900 hover:bg-slate-300 border border-slate-400"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent"
                        }`}
                      >
                        <MailOpen className="h-3 w-3 mr-1.5" />
                        Não lidas
                      </Badge>
                      
                      <Badge
                        onClick={() => setFilterImportantOnly(!filterImportantOnly)}
                        className={`h-7 px-3 text-xs cursor-pointer transition-all ${
                          filterImportantOnly
                            ? "bg-slate-200 text-slate-900 hover:bg-slate-300 border border-slate-400"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent"
                        }`}
                      >
                        <Star className="h-3 w-3 mr-1.5" />
                        Importantes
                      </Badge>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2 pb-3 border-b">
                      <div className="flex items-center justify-between min-h-[24px]">
                        <label className="text-xs font-medium text-foreground">
                          Status
                        </label>
                        <div className="w-[60px] flex justify-end">
                          {filterStatus !== "all" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs cursor-pointer text-blue-600 hover:text-blue-700"
                              onClick={() => setFilterStatus("all")}
                            >
                              Limpar
                            </Button>
                          )}
                        </div>
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="h-9">
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
                    <div className="space-y-2 py-3 border-b">
                      <div className="flex items-center justify-between min-h-[24px]">
                        <label className="text-xs font-medium text-foreground">
                          Etiquetas {filterTags.length > 0 && `(${filterTags.length})`}
                        </label>
                        <div className="w-[60px] flex justify-end">
                          {filterTags.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs cursor-pointer text-purple-600 hover:text-purple-700"
                              onClick={() => setFilterTags([])}
                            >
                              Limpar
                            </Button>
                          )}
                        </div>
                      </div>
                      <ScrollArea className="h-32">
                        <div className="space-y-2 pr-2">
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
                                className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {tag}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Users Filter */}
                    <div className="space-y-2 pt-3">
                      <div className="flex items-center justify-between min-h-[24px]">
                        <label className="text-xs font-medium text-foreground">
                          Usuários {filterUsers.length > 0 && `(${filterUsers.length})`}
                        </label>
                        <div className="w-[60px] flex justify-end">
                          {filterUsers.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs cursor-pointer text-green-600 hover:text-green-700"
                              onClick={() => setFilterUsers([])}
                            >
                              Limpar
                            </Button>
                          )}
                        </div>
                      </div>
                      <ScrollArea className="h-32">
                        <div className="space-y-2 pr-2">
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
                                className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {user.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              {selectedConversations.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Check className="h-4 w-4 mr-2" />
                      Marcar como lida
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="h-4 w-4 mr-2" />
                      Marcar como importante
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Atribuir
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            <div className="border-t bg-slate-50">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex flex-wrap gap-2 flex-1">
                  {filterStatus !== "all" && (
                    <Badge
                      variant="secondary"
                      className="h-6 text-xs gap-1 pr-1 flex items-center"
                    >
                      Status: {filterStatus === "open" ? "Abertas" : filterStatus === "closed" ? "Fechadas" : "Bloqueadas"}
                      <button
                        onClick={() => setFilterStatus("all")}
                        className="ml-1 hover:bg-muted rounded-sm p-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}

                  {filterUnreadOnly && (
                    <Badge
                      variant="secondary"
                      className="h-6 text-xs gap-1 pr-1 flex items-center"
                    >
                      Não lidas
                      <button
                        onClick={() => setFilterUnreadOnly(false)}
                        className="ml-1 hover:bg-muted rounded-sm p-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}

                  {filterImportantOnly && (
                    <Badge
                      variant="secondary"
                      className="h-6 text-xs gap-1 pr-1 flex items-center"
                    >
                      Importantes
                      <button
                        onClick={() => setFilterImportantOnly(false)}
                        className="ml-1 hover:bg-muted rounded-sm p-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {filterTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="h-6 text-xs gap-1 pr-1 flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => setFilterTags(filterTags.filter((t) => t !== tag))}
                        className="ml-1 hover:bg-muted rounded-sm p-0.5 cursor-pointer"
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
                        variant="secondary"
                        className="h-6 text-xs gap-1 pr-1 flex items-center"
                      >
                        {user.name}
                        <button
                          onClick={() => setFilterUsers(filterUsers.filter((u) => u !== userId))}
                          className="ml-1 hover:bg-muted rounded-sm p-0.5 cursor-pointer"
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
                  className="h-7 text-xs cursor-pointer ml-2 flex-shrink-0 bg-white hover:bg-slate-100 border-slate-300"
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
  selectionMode,
}: {
  conversation: Conversation;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: (id: string) => void;
  onCheck: (id: string) => void;
  selectionMode: boolean;
}) {
  return (
    <div
      className={`group relative py-3 pr-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b cursor-pointer ${
        selectionMode ? 'pl-2' : 'pl-3'
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
        onClick={() => onSelect(conversation.id)}
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
                            className={`text-xs h-5 px-1.5 ${
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
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
                <DropdownMenuItem>
                  <Star className="h-4 w-4 mr-2" />
                  {conversation.isImportant
                    ? "Remover importante"
                    : "Marcar importante"}
                </DropdownMenuItem>
                <DropdownMenuItem>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="default"
                      className="rounded-full h-5 min-w-5 px-1.5 text-xs"
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
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

