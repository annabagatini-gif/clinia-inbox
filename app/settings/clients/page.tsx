"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [clients] = useState<Client[]>([
    { id: "1", name: "Ana Silva", email: "ana@email.com", phone: "(11) 99999-9999" },
    { id: "2", name: "Carlos Santos", email: "carlos@email.com", phone: "(11) 88888-8888" },
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar p-2 gap-2">
      <div className="hidden lg:flex">
        <InboxSidebar 
          activeTab="settings"
          onTabChange={() => {}}
          counts={{ all: 13, my: 8, unread: 0, unassigned: 3 }}
          showSettings={true}
          onSettingsClick={() => {}}
          onInboxClick={() => router.push("/")}
        />
      </div>

      <div className="flex-1 flex overflow-hidden bg-background rounded-lg">
        <SettingsSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Clientes</h1>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar cliente
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Visualize e gerencie os clientes
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar clientes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

