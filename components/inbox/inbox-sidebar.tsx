"use client";

import { Home, Inbox, Users, LayoutDashboard, ChevronRight, Search, MessageSquare, UserCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function InboxSidebar() {
  return (
    <div className="flex h-full flex-shrink-0">
      {/* Icon Bar - Lateral esquerda */}
      <div className="w-16 bg-[#1F2937] flex flex-col items-center py-4 gap-2">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-white"
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
          className="w-10 h-10 rounded-xl text-white/60 hover:text-white hover:bg-white/10"
        >
          <Home className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl bg-white/20 text-white hover:bg-white/30"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl text-white/60 hover:text-white hover:bg-white/10"
        >
          <UserCircle className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl text-white/60 hover:text-white hover:bg-white/10"
        >
          <Package className="h-5 w-5" />
        </Button>

        {/* User Avatar at bottom */}
        <div className="mt-auto">
          <div className="w-10 h-10 rounded-xl bg-[#1E3A47] flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        </div>
      </div>

      {/* Main Sidebar Content */}
      <div className="w-64 bg-[#F7F8FA] flex flex-col flex-shrink-0 h-full">

      {/* Navigation */}
      <ScrollArea className="flex-1 min-h-0 px-3 py-4">
        <div className="space-y-1">
          {/* Título Inbox */}
          <div className="flex items-center justify-between px-2 pb-3 pt-2">
            <h3 className="text-base font-semibold text-gray-900">Inbox</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-gray-200">
                <Search className="h-4 w-4 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-gray-200">
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-between gap-2 font-normal text-sm h-9 px-2 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Your Inbox
            </div>
            <span className="text-xs text-gray-500">22</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-normal text-sm h-9 px-2 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            <MessageSquare className="h-4 w-4" />
            Mentions
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between gap-2 font-normal text-sm h-9 px-2 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              All
            </div>
            <span className="text-xs text-gray-500">421</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-normal text-sm h-9 px-2 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            <UserCircle className="h-4 w-4" />
            Unassigned
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-normal text-sm h-9 px-2 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>

          <div className="pt-4">
            <Button
              variant="ghost"
              className="w-full justify-between gap-2 font-normal text-sm h-8 px-2 hover:bg-gray-200 rounded-lg text-gray-600"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                <span className="text-xs uppercase font-medium">TEAMS</span>
              </div>
            </Button>
          </div>

          <div className="pt-1">
            <Button
              variant="ghost"
              className="w-full justify-between gap-2 font-normal text-sm h-8 px-2 hover:bg-gray-200 rounded-lg text-gray-600"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                <span className="text-xs uppercase font-medium">TEAMMATES</span>
              </div>
            </Button>
          </div>

          <div className="pt-1">
            <Button
              variant="ghost"
              className="w-full justify-between gap-2 font-normal text-sm h-8 px-2 hover:bg-gray-200 rounded-lg text-gray-600"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                <span className="text-xs uppercase font-medium">VIEWS</span>
              </div>
            </Button>
          </div>
        </div>
      </ScrollArea>
      </div>
    </div>
  );
}

