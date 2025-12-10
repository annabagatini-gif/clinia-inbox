"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plug, Save, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Connection {
  id: string;
  name: string;
  type: "whatsapp" | "email" | "sms";
  status: "connected" | "disconnected";
  lastSync?: string;
}

export default function ConnectionsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "1",
      name: "WhatsApp Business",
      type: "whatsapp",
      status: "connected",
      lastSync: "Há 5 minutos",
    },
    {
      id: "2",
      name: "Email",
      type: "email",
      status: "disconnected",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = (type: string) => {
    toast.info(`Conectando ${type}...`);
  };

  const handleDisconnect = (id: string) => {
    setConnections(connections.map(conn => 
      conn.id === id ? { ...conn, status: "disconnected" as const } : conn
    ));
    toast.success("Conexão desconectada");
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
        <SettingsSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b p-6">
            <div className="flex items-center gap-2 mb-2">
              <Plug className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold">Conexões</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Gerencie as conexões da sua organização
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl space-y-4">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <Plug className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{connection.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {connection.status === "connected" ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Conectado</span>
                            {connection.lastSync && (
                              <span className="text-xs text-muted-foreground">
                                • Última sincronização: {connection.lastSync}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Desconectado</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {connection.status === "connected" ? (
                      <Button
                        variant="outline"
                        onClick={() => handleDisconnect(connection.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Desconectar
                      </Button>
                    ) : (
                      <Button onClick={() => handleConnect(connection.type)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Conectar
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Adicionar nova conexão
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Conexão
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

