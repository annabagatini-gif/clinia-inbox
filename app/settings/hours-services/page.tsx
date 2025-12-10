"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clock, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function HoursServicesPage() {
  const router = useRouter();
  const [hours, setHours] = useState<Record<string, { open: string; close: string; enabled: boolean }>>({
    "Segunda": { open: "08:00", close: "18:00", enabled: true },
    "Terça": { open: "08:00", close: "18:00", enabled: true },
    "Quarta": { open: "08:00", close: "18:00", enabled: true },
    "Quinta": { open: "08:00", close: "18:00", enabled: true },
    "Sexta": { open: "08:00", close: "18:00", enabled: true },
    "Sábado": { open: "08:00", close: "12:00", enabled: true },
    "Domingo": { open: "", close: "", enabled: false },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Configurações salvas com sucesso!");
  };

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
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold">Horários de funcionamento e serviços</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure horários e serviços disponíveis
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl space-y-6">
              <div className="space-y-4">
                <h2 className="font-semibold">Horários de Funcionamento</h2>
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24">
                      <Label>{day}</Label>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={hours[day].open}
                        onChange={(e) => setHours({
                          ...hours,
                          [day]: { ...hours[day], open: e.target.value }
                        })}
                        disabled={!hours[day].enabled}
                        className="max-w-xs"
                      />
                      <span className="text-muted-foreground">até</span>
                      <Input
                        type="time"
                        value={hours[day].close}
                        onChange={(e) => setHours({
                          ...hours,
                          [day]: { ...hours[day], close: e.target.value }
                        })}
                        disabled={!hours[day].enabled}
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Serviços</h2>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar serviço
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">Consulta médica</p>
                    <p className="text-sm text-muted-foreground">Duração: 30 minutos</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">Exame</p>
                    <p className="text-sm text-muted-foreground">Duração: 60 minutos</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

