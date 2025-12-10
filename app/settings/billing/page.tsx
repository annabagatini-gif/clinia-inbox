"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { CreditCard, Save, Plus } from "lucide-react";
import { toast } from "sonner";

export default function BillingPage() {
  const router = useRouter();
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

      <div className="flex-1 flex overflow-hidden bg-background rounded-lg">
        <SettingsSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b p-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold">Cobranças</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Gerencie sua assinatura e detalhes de pagamento
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl space-y-6">
              {/* Plano Atual */}
              <div className="border rounded-lg p-6">
                <h2 className="font-semibold mb-4">Plano Atual</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plano</span>
                    <span className="font-medium">Plano Profissional</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valor</span>
                    <span className="font-medium">R$ 299,90/mês</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Próxima cobrança</span>
                    <span className="font-medium">15/02/2024</span>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  Alterar plano
                </Button>
              </div>

              {/* Método de Pagamento */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Método de Pagamento</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar cartão
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expira em 12/25</p>
                  </div>
                </div>
              </div>

              {/* Histórico */}
              <div className="border rounded-lg p-6">
                <h2 className="font-semibold mb-4">Histórico de Pagamentos</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">15/01/2024</p>
                      <p className="text-sm text-muted-foreground">Plano Profissional</p>
                    </div>
                    <span className="font-medium">R$ 299,90</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">15/12/2023</p>
                      <p className="text-sm text-muted-foreground">Plano Profissional</p>
                    </div>
                    <span className="font-medium">R$ 299,90</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

