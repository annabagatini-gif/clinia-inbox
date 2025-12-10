"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Integration {
  id: string;
  name: string;
  description: string;
  type: "native" | "external";
  status: "connected" | "disconnected";
  logo?: string;
}

export default function IntegrationsPage() {
  const router = useRouter();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "WhatsApp Business",
      description: "Integração nativa com WhatsApp Business",
      type: "native",
      status: "connected",
    },
    {
      id: "2",
      name: "Google Calendar",
      description: "Sincronize agendamentos com Google Calendar",
      type: "external",
      status: "disconnected",
    },
    {
      id: "3",
      name: "Stripe",
      description: "Processe pagamentos com Stripe",
      type: "external",
      status: "disconnected",
    },
  ]);

  const handleToggle = (id: string) => {
    setIntegrations(integrations.map(i => 
      i.id === id 
        ? { ...i, status: i.status === "connected" ? "disconnected" : "connected" }
        : i
    ));
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
              <Zap className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold">Integrações Nativa e Externa</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Conecte serviços externos e use integrações nativas
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl space-y-4">
              {/* Integrações Nativas */}
              <div>
                <h2 className="font-semibold mb-4">Integrações Nativas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations
                    .filter(i => i.type === "native")
                    .map((integration) => (
                      <div key={integration.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {integration.description}
                            </p>
                          </div>
                          {integration.status === "connected" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${
                            integration.status === "connected" ? "text-green-600" : "text-gray-400"
                          }`}>
                            {integration.status === "connected" ? "Conectado" : "Desconectado"}
                          </span>
                          <Switch
                            checked={integration.status === "connected"}
                            onCheckedChange={() => handleToggle(integration.id)}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Integrações Externas */}
              <div className="border-t pt-6">
                <h2 className="font-semibold mb-4">Integrações Externas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations
                    .filter(i => i.type === "external")
                    .map((integration) => (
                      <div key={integration.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {integration.description}
                            </p>
                          </div>
                          {integration.status === "connected" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${
                            integration.status === "connected" ? "text-green-600" : "text-gray-400"
                          }`}>
                            {integration.status === "connected" ? "Conectado" : "Desconectado"}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggle(integration.id)}
                            >
                              {integration.status === "connected" ? "Desconectar" : "Conectar"}
                            </Button>
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

