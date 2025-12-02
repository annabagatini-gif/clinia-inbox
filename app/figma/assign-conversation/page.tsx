"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Lista de usuários e grupos disponíveis
const allUsers = [
  { id: "user1", name: "June Jensen", avatar: "JJ" },
  { id: "user2", name: "Anna B", avatar: "AB" },
  { id: "user3", name: "Carlos Silva", avatar: "CS" },
];

const allGroups = [
  { id: "group1", name: "Suporte Técnico", avatar: "ST" },
];

export default function AssignConversationPage() {
  const [selectedUserId, setSelectedUserId] = useState("user2"); // Anna B selecionada por padrão

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[400px] p-0">
          <div className="p-3 flex flex-col">
            <h4 className="text-sm font-semibold mb-2">Atribuir conversa</h4>
            <div className="space-y-2.5">
              {/* Seção de Usuários */}
              <div>
                <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Usuários</h5>
                <ScrollArea className="h-[140px] border rounded-md p-1.5">
                  <div className="space-y-1">
                    {/* Opção "Não atribuído" */}
                    <div
                      className={cn(
                        "group flex items-center justify-between gap-2 py-1 px-1.5 rounded-md cursor-pointer transition-colors",
                        !selectedUserId ? "bg-muted" : "hover:bg-muted"
                      )}
                      onClick={() => setSelectedUserId("")}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                          <Users className="h-3 w-3 text-slate-400" />
                        </div>
                        <span className="text-xs text-muted-foreground">Não atribuído</span>
                      </div>
                      {!selectedUserId && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    {allUsers.map((user) => (
                      <div
                        key={user.id}
                        className={cn(
                          "group flex items-center justify-between gap-2 py-1 px-1.5 rounded-md cursor-pointer transition-colors",
                          selectedUserId === user.id ? "bg-muted" : "hover:bg-muted"
                        )}
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-slate-200 text-slate-700 text-[10px]">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{user.name}</span>
                        </div>
                        {selectedUserId === user.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Seção de Grupos */}
              <div>
                <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Grupos</h5>
                <ScrollArea className="h-[80px] border rounded-md p-1.5">
                  <div className="space-y-1">
                    {/* Opção "Não atribuído" */}
                    <div
                      className={cn(
                        "group flex items-center justify-between gap-2 py-1 px-1.5 rounded-md cursor-pointer transition-colors",
                        !selectedUserId ? "bg-muted" : "hover:bg-muted"
                      )}
                      onClick={() => setSelectedUserId("")}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                          <Users className="h-3 w-3 text-slate-400" />
                        </div>
                        <span className="text-xs text-muted-foreground">Não atribuído</span>
                      </div>
                      {!selectedUserId && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    {allGroups.map((group) => (
                      <div
                        key={group.id}
                        className={cn(
                          "group flex items-center justify-between gap-2 py-1 px-1.5 rounded-md cursor-pointer transition-colors",
                          selectedUserId === group.id ? "bg-muted" : "hover:bg-muted"
                        )}
                        onClick={() => setSelectedUserId(group.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-slate-200 text-slate-700 text-[10px]">
                              {group.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{group.name}</span>
                        </div>
                        {selectedUserId === group.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

