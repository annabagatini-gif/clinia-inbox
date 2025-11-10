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
  Mail,
  MailOpen,
  Ban,
  Trash2,
  Download,
  MessageSquarePlus,
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
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterUsers, setFilterUsers] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Calcula badges de contagem
  const allCount = mockConversations.filter((c) => c.status === "open").length;
  const myCount = mockConversations.filter(
    (c) => c.assignedTo?.id === "user1" && c.status === "open"
  ).length;
  const unassignedCount = mockConversations.filter(
    (c) => !c.assignedTo && c.status === "open"
  ).length;

  // Filtra conversas
  const filteredConversations = mockConversations.filter((conv) => {
    // Filtro de aba
    if (activeTab === "my" && conv.assignedTo?.id !== "user1") return false;
    if (activeTab === "unassigned" && conv.assignedTo) return false;
    if (activeTab === "groups") return false; // TODO: adicionar lógica de grupos

    // Filtro de busca
    if (
      searchQuery &&
      !conv.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filtro de status
    if (filterStatus !== "all" && conv.status !== filterStatus) return false;

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

  // Ordena: pinned first, then important, then by timestamp
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
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
    setFilterTags([]);
    setFilterUsers([]);
  };

  const hasFilters =
    filterStatus !== "all" || filterTags.length > 0 || filterUsers.length > 0;

  // Títulos das abas em português
  const tabTitles: Record<string, string> = {
    all: "Todos os chats",
    my: "Meus chats",
    unassigned: "Chats não atribuídos",
    groups: "Grupos",
  };

  return (
    <TooltipProvider>
      <div className="w-[420px] bg-[#F9FAFB] flex flex-col flex-shrink-0 overflow-hidden rounded-2xl shadow-md">
        {/* Header com Abas */}
        <div className="p-4 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">{tabTitles[activeTab]}</h2>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageSquarePlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Nova conversa</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectionMode ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectionMode(!selectionMode);
                      if (selectionMode) {
                        setSelectedConversations([]);
                      }
                    }}
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Selecionar múltiplas</TooltipContent>
              </Tooltip>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={hasFilters ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Filtros</h4>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">
                        Status
                      </label>
                      <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="open">Abertas</SelectItem>
                          <SelectItem value="closed">Fechadas</SelectItem>
                          <SelectItem value="blocked">Bloqueadas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground">
                          Etiquetas ({filterTags.length} selecionadas)
                        </label>
                        {filterTags.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => setFilterTags([])}
                          >
                            Limpar
                          </Button>
                        )}
                      </div>
                      <ScrollArea className="h-32 rounded border p-2">
                        <div className="space-y-2">
                          {allTags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`tag-${tag}`}
                                checked={filterTags.includes(tag)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFilterTags([...filterTags, tag]);
                                  } else {
                                    setFilterTags(
                                      filterTags.filter((t) => t !== tag)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`tag-${tag}`}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {tag}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground">
                          Usuários ({filterUsers.length} selecionados)
                        </label>
                        {filterUsers.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => setFilterUsers([])}
                          >
                            Limpar
                          </Button>
                        )}
                      </div>
                      <ScrollArea className="h-40 rounded border p-2">
                        <div className="space-y-2">
                          {allUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`user-${user.id}`}
                                checked={filterUsers.includes(user.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFilterUsers([...filterUsers, user.id]);
                                  } else {
                                    setFilterUsers(
                                      filterUsers.filter((u) => u !== user.id)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`user-${user.id}`}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {user.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Limpar filtros
                    </Button>
                  </div>
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
            <div className="flex items-center gap-2 px-1">
              <Checkbox
                checked={
                  selectedConversations.length === sortedConversations.length
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-xs text-muted-foreground">
                {selectedConversations.length > 0
                  ? `${selectedConversations.length} selecionada(s)`
                  : "Selecionar todas"}
              </span>
            </div>
          )}
        </div>

        {/* Lista de Conversas */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="space-y-0 min-h-full pr-2">
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
      className={`group relative p-3 flex items-start hover:bg-muted/50 transition-colors border-b cursor-pointer ${
        isSelected ? "bg-muted" : ""
      } ${conversation.isPinned ? "bg-muted/30" : ""}`}
    >
      {/* Checkbox - só aparece no modo seleção */}
      {selectionMode && (
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={isChecked}
            onCheckedChange={() => onCheck(conversation.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className="flex-1 min-w-0"
        onClick={() => onSelect(conversation.id)}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Avatar com Canal */}
            <div className="relative flex-shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-500 text-white font-medium text-sm">
                  {conversation.avatar}
                </AvatarFallback>
              </Avatar>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background flex items-center justify-center border">
                      {conversation.channel === "whatsapp" ? (
                        <span className="text-xs">💬</span>
                      ) : (
                        <span className="text-xs">📷</span>
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
              <Badge
                variant="default"
                className="rounded-full h-5 min-w-5 px-1.5 text-xs"
              >
                {conversation.unreadCount}
              </Badge>
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

