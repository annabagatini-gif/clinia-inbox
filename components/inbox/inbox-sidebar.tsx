"use client";

import { useState } from "react";
import Image from "next/image";
import { Home, Inbox, Users, LayoutDashboard, ChevronRight, Search, MessageSquare, UserCircle, Package, MessagesSquare, Bot, Workflow } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface InboxSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function InboxSidebar({ activeTab, onTabChange }: InboxSidebarProps) {
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
                className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300"
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
                className="w-12 h-12 rounded-xl bg-gray-200 text-gray-900 hover:bg-gray-300"
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
                className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300"
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
                className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300"
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
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-gray-200">
                <Search className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => onTabChange("all")}
            className={cn(
              "w-full justify-between gap-3 text-sm h-10 px-3 rounded-lg",
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
                13
              </span>
            ) : (
              <span className="text-xs text-gray-500">13</span>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => onTabChange("my")}
            className={cn(
              "w-full justify-between gap-3 text-sm h-10 px-3 rounded-lg",
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
                8
              </span>
            ) : (
              <span className="text-xs text-gray-500">8</span>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => onTabChange("unassigned")}
            className={cn(
              "w-full justify-between gap-3 text-sm h-10 px-3 rounded-lg",
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
                3
              </span>
            ) : (
              <span className="text-xs text-gray-500">3</span>
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

