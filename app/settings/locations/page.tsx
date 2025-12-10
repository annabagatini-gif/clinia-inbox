"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Search } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
}

export default function LocationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [locations] = useState<Location[]>([
    {
      id: "1",
      name: "Unidade Centro",
      address: "Rua Principal, 123",
      city: "São Paulo - SP",
    },
    {
      id: "2",
      name: "Unidade Zona Sul",
      address: "Av. Paulista, 456",
      city: "São Paulo - SP",
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
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Localidades</h1>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar localidade
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure as localidades da clínica
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar localidades..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                    <p className="text-sm text-muted-foreground">{location.city}</p>
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

