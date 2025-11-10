"use client";

import { Home, Inbox, Users, LayoutDashboard, ChevronRight, Search, MessageSquare, UserCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function InboxSidebar() {
  return (
      <div className="flex h-full flex-shrink-0 gap-2">
        {/* Icon Bar - Lateral esquerda */}
        <div className="w-16 bg-[#F1F3F4] flex flex-col items-center py-4 gap-2 rounded-2xl shadow-sm">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-gray-300 flex items-center justify-center mb-4">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M8 12h8M12 8v8" />
          </svg>
        </div>

        {/* Navigation Icons */}
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300"
        >
          <Home className="h-6 w-6" />
        </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl bg-gray-200 text-gray-900 hover:bg-gray-300"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300"
        >
          <UserCircle className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-300"
        >
          <Package className="h-6 w-6" />
        </Button>

        {/* User Avatar at bottom */}
        <div className="mt-auto">
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
            className="w-full justify-between gap-3 font-normal text-sm h-10 px-3 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5" />
              Todos os chats
            </div>
            <span className="text-xs text-gray-500">421</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between gap-3 font-medium text-sm h-10 px-3 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300"
          >
            <div className="flex items-center gap-3">
              <Inbox className="h-5 w-5" />
              Meus chats
            </div>
            <span className="text-xs bg-gray-900 text-white rounded-full px-2 py-0.5 font-semibold">
              22
            </span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between gap-3 font-normal text-sm h-10 px-3 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              Chats não atribuídos
            </div>
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

