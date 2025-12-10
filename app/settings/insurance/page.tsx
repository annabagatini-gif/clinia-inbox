"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Plus, Search } from "lucide-react";

interface Insurance {
  id: string;
  name: string;
  code: string;
}

export default function InsurancePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [insurances] = useState<Insurance[]>([
    { id: "1", name: "Unimed", code: "UNI" },
    { id: "2", name: "SulAmérica", code: "SUL" },
    { id: "3", name: "Bradesco Saúde", code: "BRA" },
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
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Convênios</h1>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar convênio
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Gerencie os convênios aceitos
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar convênios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insurances.map((insurance) => (
                  <div key={insurance.id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-1">{insurance.name}</h3>
                    <p className="text-sm text-muted-foreground">Código: {insurance.code}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

