"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Chave de Produção",
      key: "sk_live_1234567890abcdef",
      createdAt: "15/01/2024",
      lastUsed: "Hoje às 14:30",
    },
  ]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Chave copiada para a área de transferência!");
  };

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    return key.slice(0, 8) + "..." + key.slice(-4);
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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Chaves API</h1>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova chave
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Gerencie suas chaves de API para integrações
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium mb-1">{apiKey.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Criada em {apiKey.createdAt}
                        {apiKey.lastUsed && ` • Último uso: ${apiKey.lastUsed}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setApiKeys(apiKeys.filter(k => k.id !== apiKey.id));
                        toast.success("Chave removida");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      readOnly
                      className="font-mono bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleShowKey(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {apiKeys.length === 0 && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Nenhuma chave API criada
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeira chave
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

