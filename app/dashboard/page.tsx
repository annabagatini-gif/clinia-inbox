"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Inbox, Bot, Workflow, Settings, User, ArrowRight } from "lucide-react";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";

function DashboardContent() {
  const router = useRouter();

  const modules = [
    {
      id: "inbox",
      title: "Inbox",
      description: "Visualize e gerencie suas conversas omnichannel",
      status: "12 novas mensagens",
      icon: Inbox,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      route: "/",
    },
    {
      id: "agents",
      title: "Agents",
      description: "Configure e gerencie seus agentes de IA",
      status: "5 agentes ativos",
      icon: Bot,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      route: "/agents",
    },
    {
      id: "flows",
      title: "Flows",
      description: "Crie e automatize fluxos de trabalho",
      status: "8 flows configurados",
      icon: Workflow,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      route: "/flows",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure as preferências do sistema",
      subDescription: "Configurações gerais",
      icon: Settings,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      route: "/settings",
    },
    {
      id: "my-account",
      title: "My Account",
      description: "Gerencie seu perfil e preferências",
      subDescription: "Perfil e dados pessoais",
      icon: User,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-50",
      route: "/account",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar p-2 gap-2">
      {/* Sidebar - mesma da inbox */}
      <div className="hidden lg:flex">
        <InboxSidebar 
          activeTab="dashboard"
          onTabChange={() => {}}
          counts={{
            all: 13,
            my: 8,
            unread: 0,
            unassigned: 3,
          }}
        />
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background rounded-lg">
        {/* Header */}
        <div className="border-b p-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Mensagem de Boas-vindas */}
            <div className="mb-8">
              <p className="text-muted-foreground">
                Bem-vindo ao seu painel de controle. Acesse os módulos abaixo.
              </p>
            </div>

            {/* Cards de Módulos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <div
                    key={module.id}
                    className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => router.push(module.route)}
                  >
                    <div className="flex flex-col gap-4">
                      {/* Ícone */}
                      <div className={`w-12 h-12 rounded-lg ${module.iconBg} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${module.iconColor}`} />
                      </div>

                      {/* Título e Descrição */}
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{module.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {module.description}
                        </p>
                        {module.subDescription && (
                          <p className="text-xs text-muted-foreground">
                            {module.subDescription}
                          </p>
                        )}
                      </div>

                      {/* Status/Contador */}
                      {module.status && (
                        <div className="text-sm font-medium text-muted-foreground">
                          {module.status}
                        </div>
                      )}

                      {/* Botão Acessar */}
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-4 py-2 rounded-md hover:bg-accent mt-auto transition-colors text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(module.route);
                        }}
                      >
                        <span>Acessar</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(DashboardContent), {
  ssr: false,
});

