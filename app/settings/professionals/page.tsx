"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stethoscope, Plus, Search, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  status: "active" | "inactive";
}

export default function ProfessionalsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [professionals] = useState<Professional[]>([
    {
      id: "1",
      name: "Dr. João Silva",
      specialty: "Cardiologia",
      crm: "CRM 12345",
      status: "active",
    },
    {
      id: "2",
      name: "Dra. Maria Santos",
      specialty: "Pediatria",
      crm: "CRM 67890",
      status: "active",
    },
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
                <Stethoscope className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Profissionais</h1>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar profissional
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Gerencie os profissionais da clínica
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar profissionais..."
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
                      <TableHead>Especialidade</TableHead>
                      <TableHead>CRM</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {professionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell className="font-medium">{professional.name}</TableCell>
                        <TableCell>{professional.specialty}</TableCell>
                        <TableCell>{professional.crm}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            professional.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {professional.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
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

