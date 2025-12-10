"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Save } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function AppointmentsPage() {
  const router = useRouter();
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [reminderHours, setReminderHours] = useState(24);
  const [cancellationHours, setCancellationHours] = useState(2);
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
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold">Agendamentos</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Gerencie configurações de agendamento
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Confirmação automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Confirmar agendamentos automaticamente
                  </p>
                </div>
                <Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder">Lembrete antes do agendamento (horas)</Label>
                <Input
                  id="reminder"
                  type="number"
                  value={reminderHours}
                  onChange={(e) => setReminderHours(Number(e.target.value))}
                  className="max-w-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation">Cancelamento mínimo (horas antes)</Label>
                <Input
                  id="cancellation"
                  type="number"
                  value={cancellationHours}
                  onChange={(e) => setCancellationHours(Number(e.target.value))}
                  className="max-w-xs"
                />
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

