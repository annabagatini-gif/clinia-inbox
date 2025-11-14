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

export function InboxSidebar({ activeTab, onTabChange, counts }: InboxSidebarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationPreference, setNotificationPreference] = useState<"all" | "assigned" | "none">("all");
  
  // Valores padrão caso counts não seja fornecido
  const allCount = counts?.all ?? 13;
  const myCount = counts?.my ?? 8;
  const unreadCount = counts?.unread ?? 0;
  const unassignedCount = counts?.unassigned ?? 3;
  return (
      <div className="flex h-full flex-shrink-0 gap-2">
        {/* Icon Bar - Lateral esquerda */}
        <div className="w-16 bg-[#F1F3F4] flex flex-col items-center py-4 gap-2 rounded-2xl shadow-sm">
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300"
                >
                  <MessagesSquare className="h-7 w-7" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Iniciar conversa interna
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-10 h-10 rounded-xl bg-gray-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        </div>
      </div>

        {/* Main Sidebar Content */}
        <div className="w-64 bg-[#F9FAFB] flex flex-col flex-shrink-0 h-full rounded-2xl shadow-sm">

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

