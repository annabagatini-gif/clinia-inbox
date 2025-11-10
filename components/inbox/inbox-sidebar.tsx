"use client";

import { Home, Inbox, Users, LayoutDashboard, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function InboxSidebar() {
  return (
    <div className="w-64 border-r bg-background flex flex-col flex-shrink-0 h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">C</span>
        </div>
      </div>

      <Separator className="flex-shrink-0" />

      {/* Navigation */}
      <ScrollArea className="flex-1 min-h-0 px-3 py-4">
        <div className="space-y-1">
          {/* Título Caixa de Entrada */}
          <div className="flex items-center justify-between px-3 pb-3">
            <h3 className="text-sm font-semibold">Caixa de Entrada</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-between gap-3 font-normal"
          >
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4" />
              Todos os chats
            </div>
            <span className="text-xs text-muted-foreground">421</span>
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-between gap-3 font-normal"
          >
            <div className="flex items-center gap-3">
              <Inbox className="h-4 w-4" />
              Meus chats
            </div>
            <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
              22
            </span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-normal"
          >
            <Users className="h-4 w-4" />
            Chats não atribuídos
          </Button>

          <div className="pt-4">
            <h3 className="px-3 text-xs font-medium text-muted-foreground mb-2 uppercase">
              Grupos
            </h3>
            
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal text-sm"
              >
                <Users className="h-4 w-4" />
                Grupo 1
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal text-sm"
              >
                <Users className="h-4 w-4" />
                Grupo 2
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal text-sm"
              >
                <Users className="h-4 w-4" />
                Grupo 3
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-3 border-t flex-shrink-0">
        <Button variant="ghost" className="w-full justify-start gap-3 font-normal h-12">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            U
          </div>
          <span className="text-sm truncate">User</span>
        </Button>
      </div>
    </div>
  );
}

