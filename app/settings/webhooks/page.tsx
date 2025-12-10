"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Webhook, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
}

export default function WebhooksPage() {
  const router = useRouter();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: "1",
      url: "https://api.exemplo.com/webhook",
      events: ["message.received", "conversation.created"],
      status: "active",
    },
  ]);

  const handleToggle = (id: string) => {
    setWebhooks(webhooks.map(w => 
      w.id === id 
        ? { ...w, status: w.status === "active" ? "inactive" : "active" }
        : w
    ));
    toast.success("Webhook atualizado");
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
                <Webhook className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Webhooks</h1>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo webhook
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure webhooks para receber notificações em tempo real
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {webhook.status === "active" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${
                          webhook.status === "active" ? "text-green-600" : "text-gray-400"
                        }`}>
                          {webhook.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <Input
                        value={webhook.url}
                        readOnly
                        className="font-mono bg-muted mb-2"
                      />
                      <div className="flex flex-wrap gap-2">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="px-2 py-1 bg-muted rounded text-xs"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={webhook.status === "active"}
                        onCheckedChange={() => handleToggle(webhook.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setWebhooks(webhooks.filter(w => w.id !== webhook.id));
                          toast.success("Webhook removido");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {webhooks.length === 0 && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Nenhum webhook configurado
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeiro webhook
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

