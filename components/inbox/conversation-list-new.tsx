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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
}

// Mapa de cores para as tags
const tagColors: Record<string, string> = {
  "Urgente": "bg-red-100 text-red-800 border-red-200",
  "Pagamento": "bg-green-100 text-green-800 border-green-200",
  "Pedido": "bg-blue-100 text-blue-800 border-blue-200",
  "Suporte": "bg-purple-100 text-purple-800 border-purple-200",
  "Bug": "bg-orange-100 text-orange-800 border-orange-200",
};

export function ConversationListNew({
  selectedId,
  onSelect,
}: ConversationListProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversations, setSelectedConversations] = useState<string[]>(
    []
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("all");
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

    // Filtro de tag
    if (filterTag !== "all" && !conv.tags.includes(filterTag)) return false;

    // Filtro de usuário
    if (filterUser !== "all" && conv.assignedTo?.id !== filterUser)
      return false;

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
    setFilterTag("all");
    setFilterUser("all");
  };

  const hasFilters =
    filterStatus !== "all" || filterTag !== "all" || filterUser !== "all";

  return (
    <TooltipProvider>
      <div className="w-[420px] border-r bg-background flex flex-col flex-shrink-0 overflow-hidden">
        {/* Header com Abas */}
        <div className="p-4 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Inbox</h2>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageSquarePlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Nova conversa</TooltipContent>
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
                      <label className="text-xs text-muted-foreground">
                        Etiquetas
                      </label>
                      <Select value={filterTag} onValueChange={setFilterTag}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="Urgente">Urgente</SelectItem>
                          <SelectItem value="Pagamento">Pagamento</SelectItem>
                          <SelectItem value="Pedido">Pedido</SelectItem>
                          <SelectItem value="Suporte">Suporte</SelectItem>
                          <SelectItem value="Bug">Bug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">
                        Usuário
                      </label>
                      <Select value={filterUser} onValueChange={setFilterUser}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="user1">June Jensen</SelectItem>
                          <SelectItem value="user2">Anna B</SelectItem>
                        </SelectContent>
                      </Select>
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

          {/* Abas */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 h-9">
              <TabsTrigger value="all" className="text-xs relative">
                Todos
                {allCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-xs"
                  >
                    {allCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="my" className="text-xs">
                Meus
                {myCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-xs"
                  >
                    {myCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unassigned" className="text-xs">
                Não atrib.
                {unassignedCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-xs"
                  >
                    {unassignedCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="groups" className="text-xs">
                Grupos
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search */}
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
          {sortedConversations.length > 0 && (
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
        <ScrollArea className="flex-1">
          <div className="space-y-0">
            {sortedConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedId === conversation.id}
                isChecked={selectedConversations.includes(conversation.id)}
                onSelect={onSelect}
                onCheck={handleSelectConversation}
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
}: {
  conversation: Conversation;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: (id: string) => void;
  onCheck: (id: string) => void;
}) {
  return (
    <div
      className={`group relative p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b cursor-pointer ${
        isSelected ? "bg-muted" : ""
      } ${conversation.isPinned ? "bg-muted/30" : ""}`}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 pt-1">
        <Checkbox
          checked={isChecked}
          onCheckedChange={() => onCheck(conversation.id)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

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
              {conversation.priority && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 text-xs px-1.5 h-5"
                >
                  {conversation.priority}
                </Badge>
              )}
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

