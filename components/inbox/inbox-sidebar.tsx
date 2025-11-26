"use client";

import { useState } from "react";
import Image from "next/image";
import { Home, Inbox, Users, LayoutDashboard, ChevronRight, Search, MessageSquare, UserCircle, Package, MessagesSquare, Bot, Workflow, Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Minus, X } from "lucide-react";
import { CURRENT_USER } from "@/lib/user-config";

interface InboxSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts?: {
    all: number;
    my: number;
    unread: number;
    unassigned: number;
  };
}

// Lista de usuários com status
const internalUsers = [
  { id: "user1", name: "June Jensen", avatar: "JJ", status: "online" as const },
  { id: "user2", name: "Anna B", avatar: "AB", status: "online" as const },
  { id: "user3", name: "Carlos Mendes", avatar: "CM", status: "away" as const },
  { id: "user4", name: "Sofia Lima", avatar: "SL", status: "offline" as const },
  { id: "user5", name: "Pedro Santos", avatar: "PS", status: "online" as const },
  { id: "user6", name: "Laura Costa", avatar: "LC", status: "busy" as const },
  { id: "user7", name: "Rafael Oliveira", avatar: "RO", status: "online" as const },
  { id: "user8", name: "Mariana Silva", avatar: "MS", status: "away" as const },
];

interface MiniChat {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userStatus: "online" | "away" | "busy" | "offline";
  isMinimized: boolean;
  messages: Array<{
    id: string;
    content: string;
    timestamp: string;
    isUser: boolean;
  }>;
}

const MAX_MINIMIZED_CHATS = 5; // Número máximo de conversas minimizadas

export function InboxSidebar({ activeTab, onTabChange, counts }: InboxSidebarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationPreference, setNotificationPreference] = useState<"all" | "assigned" | "none">("all");
  const [isInternalConversationOpen, setIsInternalConversationOpen] = useState(false);
  const [miniChats, setMiniChats] = useState<MiniChat[]>([]);
  const [miniChatMessages, setMiniChatMessages] = useState<Record<string, string>>({});

  const handleSendMiniChatMessage = (chatId: string) => {
    const message = miniChatMessages[chatId]?.trim();
    if (!message) return;

    setMiniChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const newMessage = {
          id: `msg-${Date.now()}`,
          content: message,
          timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          isUser: true,
        };
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }
      return chat;
    }));

    setMiniChatMessages(prev => ({ ...prev, [chatId]: "" }));

    // Simular resposta após 1 segundo
    setTimeout(() => {
      setMiniChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          const responseMessage = {
            id: `msg-${Date.now()}`,
            content: "Mensagem recebida!",
            timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            isUser: false,
          };
          return {
            ...chat,
            messages: [...chat.messages, responseMessage],
          };
        }
        return chat;
      }));
    }, 1000);
  };

  const handleMinimizeMiniChat = (chatId: string) => {
    setMiniChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isMinimized: true } : chat
    ));
  };

  const handleRestoreMiniChat = (chatId: string) => {
    setMiniChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isMinimized: false }
        : { ...chat, isMinimized: true } // Minimizar outros chats
    ));
  };

  const handleCloseMiniChat = (chatId: string) => {
    setMiniChats(prev => prev.filter(chat => chat.id !== chatId));
    setMiniChatMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[chatId];
      return newMessages;
    });
  };
  
  // Valores padrão caso counts não seja fornecido
  const allCount = counts?.all ?? 13;
  const myCount = counts?.my ?? 8;
  const unreadCount = counts?.unread ?? 0;
  const unassignedCount = counts?.unassigned ?? 3;
  return (
      <div className="flex h-full flex-shrink-0 gap-2">
        {/* Icon Bar - Lateral esquerda */}
        <div className="w-16 bg-sidebar flex flex-col items-center py-4 gap-2 rounded-2xl shadow-sm">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-[#2C5866] flex items-center justify-center mb-4 overflow-hidden">
          <Image
            src="/clinia-logo.png.png"
            alt="Clinia Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Navigation Icons */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300 cursor-pointer"
                >
                  <Home className="h-7 w-7" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Início
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-xl bg-gray-200 text-gray-900 hover:bg-gray-300 cursor-pointer"
              >
                <Inbox className="h-7 w-7" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Caixa de entrada
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300 cursor-pointer"
              >
                <Bot className="h-7 w-7" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Agentes
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300 cursor-pointer"
              >
                <Workflow className="h-7 w-7" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Fluxos
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Bottom Icons */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <Dialog open={isInternalConversationOpen} onOpenChange={setIsInternalConversationOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300"
                  data-tour="internal-chat"
                >
                  <MessagesSquare className="h-7 w-7" />
                </Button>
                  </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                Iniciar conversa interna
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Iniciar conversa interna</DialogTitle>
                <DialogDescription>
                  Selecione um usuário para iniciar uma conversa
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[400px] pr-4">
                <div className="space-y-2 py-2">
                  {internalUsers.filter(user => user.id !== CURRENT_USER.id).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-slate-200 text-slate-700 text-sm">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            user.status === "online" ? "bg-green-500" :
                            user.status === "away" ? "bg-yellow-500" :
                            user.status === "busy" ? "bg-red-500" :
                            "bg-gray-400"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge 
                              variant="outline" 
                              className={`text-xs h-5 px-1.5 ${
                                user.status === "online" ? "border-green-500 text-green-700 bg-green-50" :
                                user.status === "away" ? "border-yellow-500 text-yellow-700 bg-yellow-50" :
                                user.status === "busy" ? "border-red-500 text-red-700 bg-red-50" :
                                "border-gray-400 text-gray-600 bg-gray-50"
                              }`}
                            >
                              {user.status === "online" ? "Online" :
                               user.status === "away" ? "Ausente" :
                               user.status === "busy" ? "Ocupado" :
                               "Offline"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          // Verificar se já existe um chat com este usuário
                          const existingChat = miniChats.find(chat => chat.userId === user.id);
                          if (existingChat) {
                            // Se já existe um chat com este usuário, restaurar e expandir
                            setMiniChats(prev => prev.map(chat => 
                              chat.id === existingChat.id 
                                ? { ...chat, isMinimized: false }
                                : { ...chat, isMinimized: true } // Minimizar outros chats
                            ));
                            setIsInternalConversationOpen(false);
                            return;
                          }
                          
                          // Criar novo chat
                          const newChat: MiniChat = {
                            id: `chat-${user.id}-${Date.now()}`,
                            userId: user.id,
                            userName: user.name,
                            userAvatar: user.avatar,
                            userStatus: user.status,
                            isMinimized: false,
                            messages: [],
                          };
                          
                          setMiniChats(prev => {
                            // Minimizar todos os chats existentes
                            const minimized = prev.map(chat => ({ ...chat, isMinimized: true }));
                            
                            // Contar quantas conversas minimizadas teremos após minimizar todas
                            const minimizedCount = minimized.length;
                            
                            // Se já atingiu o limite máximo de conversas minimizadas
                            if (minimizedCount >= MAX_MINIMIZED_CHATS) {
                              // Remover a conversa minimizada mais antiga (primeira da lista)
                              minimized.shift();
                            }
                            
                            // Adicionar o novo chat expandido
                            return [...minimized, newChat];
                          });
                          
                          setMiniChatMessages(prev => ({ ...prev, [newChat.id]: "" }));
                          setIsInternalConversationOpen(false);
                        }}
                      >
                        Enviar mensagem
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <div className="w-10 h-10 rounded-xl bg-gray-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        </div>
      </div>

        {/* Main Sidebar Content */}
        <div className="w-64 bg-[#F9FAFB] flex flex-col flex-shrink-0 h-full rounded-2xl shadow-sm relative">
          
          {/* Mini Chats - Posicionados acima da barra Caixa de Entrada */}
          {miniChats.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 z-50 flex flex-col gap-2 px-2 pb-2">
              {/* Chat expandido */}
              {miniChats.filter(chat => !chat.isMinimized).map((chat) => (
                <div
                  key={chat.id}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col"
                  style={{ height: "400px", maxHeight: "400px" }}
                >
                  {/* Header do Mini Chat */}
                  <div className="bg-purple-100 px-3 py-2 flex items-center justify-between border-b">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-200 text-purple-700 text-xs">
                            {chat.userAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          chat.userStatus === "online" ? "bg-green-500" :
                          chat.userStatus === "away" ? "bg-yellow-500" :
                          chat.userStatus === "busy" ? "bg-red-500" :
                          "bg-gray-400"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{chat.userName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => handleMinimizeMiniChat(chat.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleCloseMiniChat(chat.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Área de Mensagens */}
                  <ScrollArea className="flex-1 px-3 py-2">
                    <div className="space-y-2">
                      {chat.messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-xs text-muted-foreground">Nenhuma mensagem ainda</p>
                        </div>
                      ) : (
                        chat.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                msg.isUser
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${
                                msg.isUser ? 'text-teal-100' : 'text-gray-500'
                              }`}>
                                {msg.timestamp}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input de Mensagem */}
                  <div className="border-t p-2">
                    <div className="flex items-end gap-2">
                      <Textarea
                        value={miniChatMessages[chat.id] || ""}
                        onChange={(e) => setMiniChatMessages(prev => ({ ...prev, [chat.id]: e.target.value }))}
                        placeholder="Mensagem"
                        className="min-h-[40px] max-h-[100px] resize-none text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMiniChatMessage(chat.id);
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        className="h-10 w-10 rounded-full bg-teal-600 hover:bg-teal-700 flex-shrink-0"
                        onClick={() => handleSendMiniChatMessage(chat.id)}
                        disabled={!miniChatMessages[chat.id]?.trim()}
                      >
                        <ArrowUp className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Avatares minimizados - abaixo do chat expandido */}
              {miniChats.filter(chat => chat.isMinimized).length > 0 && (
                <div className="flex flex-row gap-2 overflow-x-auto pb-1 w-full flex-shrink-0">
                  {miniChats.filter(chat => chat.isMinimized).map((chat) => (
                    // Chat minimizado - mostrar apenas o avatar
                    <div
                      key={chat.id}
                      className="relative group cursor-pointer inline-block flex-shrink-0"
                      onClick={() => handleRestoreMiniChat(chat.id)}
                      style={{ width: '40px', height: '40px' }}
                    >
                      <Avatar className="h-10 w-10 absolute inset-0">
                        <AvatarFallback className="bg-purple-200 text-purple-700 text-sm">
                          {chat.userAvatar}
                        </AvatarFallback>
                      </Avatar>
                      {/* Bolinha de status no canto inferior direito do avatar */}
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white z-10 ${
                        chat.userStatus === "online" ? "bg-green-500" :
                        chat.userStatus === "away" ? "bg-yellow-500" :
                        chat.userStatus === "busy" ? "bg-red-500" :
                        "bg-gray-400"
                      }`} />
                      {/* Botão X aparece no hover no cantinho superior direito do avatar */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 z-20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseMiniChat(chat.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

      {/* Navigation */}
      <ScrollArea className="flex-1 min-h-0 px-3 py-4">
        <div className="space-y-1">
          {/* Título Caixa de Entrada */}
          <div className="flex items-center justify-between px-2 pb-3 pt-2">
            <h3 className="text-base font-semibold text-gray-900">Caixa de Entrada</h3>
            <div className="flex items-center gap-1">
              <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-gray-200 cursor-pointer">
                          <Bell className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      Configurações de notificações
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Configurações de notificações</DialogTitle>
                    <DialogDescription>
                      Escolha quais notificações você deseja receber
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-3">
                    <Button
                      variant={notificationPreference === "all" ? "default" : "outline"}
                      className="w-full justify-start h-auto py-3 px-4"
                      onClick={() => {
                        setNotificationPreference("all");
                        setTimeout(() => setIsNotificationsOpen(false), 300);
                      }}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium">Todas as notificações</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          Receba notificações de todas as conversas
                        </span>
                      </div>
                    </Button>
                    
                    <Button
                      variant={notificationPreference === "assigned" ? "default" : "outline"}
                      className="w-full justify-start h-auto py-3 px-4"
                      onClick={() => {
                        setNotificationPreference("assigned");
                        setTimeout(() => setIsNotificationsOpen(false), 300);
                      }}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium">Apenas conversas atribuídas a mim</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          Receba notificações apenas das conversas que você está atendendo
                        </span>
                      </div>
                    </Button>
                    
                    <Button
                      variant={notificationPreference === "none" ? "default" : "outline"}
                      className="w-full justify-start h-auto py-3 px-4"
                      onClick={() => {
                        setNotificationPreference("none");
                        setTimeout(() => setIsNotificationsOpen(false), 300);
                      }}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium">Nenhuma notificação</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          Não receba notificações
                        </span>
                      </div>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => onTabChange("all")}
            className={cn(
              "w-full justify-between gap-3 text-sm h-10 px-3 rounded-lg cursor-pointer",
              activeTab === "all"
                ? "bg-gray-200 text-gray-900 font-medium hover:bg-gray-300"
                : "text-gray-700 font-normal hover:bg-gray-200"
            )}
          >
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5" />
              Todos os chats
            </div>
            {activeTab === "all" ? (
              <span className="text-xs bg-gray-900 text-white rounded-full px-2 py-0.5 font-semibold">
                {allCount}
              </span>
            ) : (
              <span className="text-xs text-gray-500">{allCount}</span>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => onTabChange("my")}
            className={cn(
              "w-full justify-between gap-3 text-sm h-10 px-3 rounded-lg cursor-pointer",
              activeTab === "my"
                ? "bg-gray-200 text-gray-900 font-medium hover:bg-gray-300"
                : "text-gray-700 font-normal hover:bg-gray-200"
            )}
          >
            <div className="flex items-center gap-3">
              <Inbox className="h-5 w-5" />
              Meus chats
            </div>
            {activeTab === "my" ? (
              <span className="text-xs bg-gray-900 text-white rounded-full px-2 py-0.5 font-semibold">
                {myCount}
              </span>
            ) : (
              <span className="text-xs text-gray-500">{myCount}</span>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => onTabChange("unassigned")}
            className={cn(
              "w-full justify-between gap-3 text-sm h-10 px-3 rounded-lg cursor-pointer",
              activeTab === "unassigned"
                ? "bg-gray-200 text-gray-900 font-medium hover:bg-gray-300"
                : "text-gray-700 font-normal hover:bg-gray-200"
            )}
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              Chats não atribuídos
            </div>
            {activeTab === "unassigned" ? (
              <span className="text-xs bg-gray-900 text-white rounded-full px-2 py-0.5 font-semibold">
                {unassignedCount}
              </span>
            ) : (
              <span className="text-xs text-gray-500">{unassignedCount}</span>
            )}
          </Button>

          <div className="pt-4">
            <h3 className="px-2 text-xs font-medium text-gray-500 mb-2 uppercase">
              Grupos
            </h3>
            
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal text-sm h-10 px-3 hover:bg-gray-200 rounded-lg text-gray-700"
              >
                <Users className="h-5 w-5" />
                Grupo 1
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal text-sm h-10 px-3 hover:bg-gray-200 rounded-lg text-gray-700"
              >
                <Users className="h-5 w-5" />
                Grupo 2
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal text-sm h-10 px-3 hover:bg-gray-200 rounded-lg text-gray-700"
              >
                <Users className="h-5 w-5" />
                Grupo 3
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
      </div>
    </div>
  );
}

