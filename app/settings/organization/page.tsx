"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Save, Copy } from "lucide-react";
import { toast } from "sonner";

export default function OrganizationPage() {
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState("Clínica Exemplo");
  const [appId, setAppId] = useState("clinia-123456789");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Configurações salvas com sucesso!");
  };

  const handleCopyAppId = () => {
    navigator.clipboard.writeText(appId);
    toast.success("App ID copiado para a área de transferência!");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar p-2 gap-2">
      {/* Sidebar principal */}
      <div className="hidden lg:flex">
        <InboxSidebar 
          activeTab="settings"
          onTabChange={() => {}}
          counts={{
            all: 13,
            my: 8,
            unread: 0,
            unassigned: 3,
          }}
          showSettings={true}
          onSettingsClick={() => {}}
          onInboxClick={() => router.push("/")}
        />
      </div>

      {/* Container principal */}
      <div className="flex-1 flex overflow-hidden bg-background rounded-lg">
        {/* Sidebar de navegação de Settings */}
        <SettingsSidebar />

        {/* Área de conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b p-6">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold">Nome da organização e App ID</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure o nome da sua organização e identifique seu App ID
            </p>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl space-y-6">
              {/* Nome da Organização */}
              <div className="space-y-2">
                <Label htmlFor="organization-name">Nome da Organização</Label>
                <Input
                  id="organization-name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Digite o nome da organização"
                  className="max-w-md"
                />
                <p className="text-xs text-muted-foreground">
                  Este nome será exibido em toda a plataforma
                </p>
              </div>

              {/* App ID */}
              <div className="space-y-2">
                <Label htmlFor="app-id">App ID</Label>
                <div className="flex items-center gap-2 max-w-md">
                  <Input
                    id="app-id"
                    value={appId}
                    readOnly
                    className="bg-muted font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyAppId}
                    title="Copiar App ID"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Seu App ID único. Use este identificador para integrações e APIs.
                </p>
              </div>

              {/* Botão Salvar */}
              <div className="flex items-center gap-2 pt-4">
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

