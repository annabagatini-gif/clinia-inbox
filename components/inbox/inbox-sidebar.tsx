"use client";

import { Home, Inbox, Users, LayoutDashboard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function InboxSidebar() {
  return (
    <div className="w-64 border-r bg-background flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">C</span>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-normal"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-between gap-3 font-normal"
          >
            <div className="flex items-center gap-3">
              <Inbox className="h-4 w-4" />
              Inbox
            </div>
            <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
              22
            </span>
          </Button>

          <div className="pt-4">
            <h3 className="px-3 text-xs font-medium text-muted-foreground mb-2">
              INBOX
            </h3>
            
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-between gap-3 font-normal text-sm"
              >
                <span>Your Inbox</span>
                <span className="text-xs text-muted-foreground">22</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal text-sm"
              >
                Mentions
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between gap-3 font-normal text-sm"
              >
                <span>All</span>
                <span className="text-xs text-muted-foreground">421</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal text-sm"
              >
                Unassigned
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-normal text-sm"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="ghost"
              className="w-full justify-between gap-3 font-normal text-sm"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                <span>TEAMS</span>
              </div>
            </Button>
          </div>

          <div className="pt-2">
            <Button
              variant="ghost"
              className="w-full justify-between gap-3 font-normal text-sm"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                <span>TEAMMATES</span>
              </div>
            </Button>
          </div>

          <div className="pt-2">
            <Button
              variant="ghost"
              className="w-full justify-between gap-3 font-normal text-sm"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                <span>VIEWS</span>
              </div>
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-3 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 font-normal">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
          <span className="text-sm">User</span>
        </Button>
      </div>
    </div>
  );
}

