"use client";

import { useRouter } from "next/navigation";
import { 
  Building2, 
  Users, 
  MapPin, 
  CreditCard, 
  Globe, 
  Plug, 
  Calendar, 
  Clock,
  Stethoscope,
  FileText,
  Tag as TagIcon,
  Hash,
  MessageSquare,
  Zap,
  Key,
  Webhook,
  Link2,
  Home as HomeIcon,
  Settings as SettingsIcon
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";

interface SettingsCategory {
  id: string;
  label: string;
  icon: any;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  label: string;
  description: string;
  icon: any;
  route: string;
  iconColor: string;
  iconBg: string;
}

const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    id: "organization",
    label: "Dados da Organização",
    icon: Building2,
    items: [
      {
        id: "organization-name",
        label: "Nome da organização e App ID",
        description: "Configure o nome da sua organização e identifique seu App ID",
        icon: Building2,
        route: "/settings/organization",
        iconColor: "text-purple-600",
        iconBg: "bg-purple-50",
      },
      {
        id: "connections",
        label: "Conexões",
        description: "Gerencie as conexões da sua organização",
        icon: Plug,
        route: "/settings/connections",
        iconColor: "text-purple-600",
        iconBg: "bg-purple-50",
      },
      {
        id: "language-region",
        label: "Idioma e região",
        description: "Configure o idioma e região da sua organização",
        icon: Globe,
        route: "/settings/language-region",
        iconColor: "text-purple-600",
        iconBg: "bg-purple-50",
      },
      {
        id: "billing",
        label: "Cobranças",
        description: "Gerencie sua assinatura e detalhes de pagamento",
        icon: CreditCard,
        route: "/settings/billing",
        iconColor: "text-purple-600",
        iconBg: "bg-purple-50",
      },
      {
        id: "teams",
        label: "Equipes",
        description: "Gerencie equipes e permissões",
        icon: Users,
        route: "/settings/teams",
        iconColor: "text-purple-600",
        iconBg: "bg-purple-50",
      },
    ],
  },
  {
    id: "clinic-info",
    label: "Operações",
    icon: Stethoscope,
    items: [
      {
        id: "professionals",
        label: "Profissionais",
        description: "Gerencie os profissionais da clínica",
        icon: Users,
        route: "/settings/professionals",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
      },
      {
        id: "locations",
        label: "Localidades",
        description: "Configure as localidades da clínica",
        icon: MapPin,
        route: "/settings/locations",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
      },
      {
        id: "insurance",
        label: "Convênios",
        description: "Gerencie os convênios aceitos",
        icon: CreditCard,
        route: "/settings/insurance",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
      },
      {
        id: "clients",
        label: "Clientes",
        description: "Visualize e gerencie os clientes",
        icon: Users,
        route: "/settings/clients",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
      },
      {
        id: "hours-services",
        label: "Horários de funcionamento e serviços",
        description: "Configure horários e serviços disponíveis",
        icon: Clock,
        route: "/settings/hours-services",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
      },
      {
        id: "appointments",
        label: "Agendamentos",
        description: "Gerencie configurações de agendamento",
        icon: Calendar,
        route: "/settings/appointments",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
      },
    ],
  },
  {
    id: "personalization",
    label: "Automação",
    icon: SettingsIcon,
    items: [
      {
        id: "tags",
        label: "Etiquetas",
        description: "Gerencie etiquetas para organizar conversas",
        icon: TagIcon,
        route: "/settings/tags",
        iconColor: "text-orange-600",
        iconBg: "bg-orange-50",
      },
      {
        id: "custom-fields",
        label: "Campos personalizados",
        description: "Crie e gerencie campos personalizados",
        icon: Hash,
        route: "/settings/custom-fields",
        iconColor: "text-orange-600",
        iconBg: "bg-orange-50",
      },
      {
        id: "message-templates",
        label: "Modelos de mensagem",
        description: "Crie modelos de mensagem para respostas rápidas",
        icon: FileText,
        route: "/settings/message-templates",
        iconColor: "text-orange-600",
        iconBg: "bg-orange-50",
      },
      {
        id: "quick-replies",
        label: "Respostas rápidas",
        description: "Configure respostas rápidas para agilizar atendimento",
        icon: MessageSquare,
        route: "/settings/quick-replies",
        iconColor: "text-orange-600",
        iconBg: "bg-orange-50",
      },
    ],
  },
  {
    id: "external-connections",
    label: "Integrações",
    icon: Link2,
    items: [
      {
        id: "api-keys",
        label: "Chaves API",
        description: "Gerencie suas chaves de API",
        icon: Key,
        route: "/settings/api-keys",
        iconColor: "text-green-600",
        iconBg: "bg-green-50",
      },
      {
        id: "webhooks",
        label: "Webhooks",
        description: "Configure webhooks para integrações",
        icon: Webhook,
        route: "/settings/webhooks",
        iconColor: "text-green-600",
        iconBg: "bg-green-50",
      },
      {
        id: "integrations",
        label: "Integrações Nativa e Externa",
        description: "Gerencie integrações nativas e externas",
        icon: Zap,
        route: "/settings/integrations",
        iconColor: "text-green-600",
        iconBg: "bg-green-50",
      },
    ],
  },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar p-2 gap-2">
      {/* Sidebar principal - mesma da inbox */}
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
            <div className="flex items-center gap-2">
              <HomeIcon className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold">Início</h1>
            </div>
          </div>

          {/* Conteúdo */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="max-w-6xl mx-auto space-y-12">
                {SETTINGS_CATEGORIES.map((category) => {
                  const CategoryIcon = category.icon;

                  return (
                    <div key={category.id}>
                      {/* Título da categoria */}
                      <h2 className="text-xl font-semibold mb-6">{category.label}</h2>

                      {/* Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.items.map((item) => {
                          const ItemIcon = item.icon;

                          return (
                            <div
                              key={item.id}
                              onClick={() => router.push(item.route)}
                              className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                            >
                              <div className="flex flex-col gap-4">
                                {/* Ícone */}
                                <div className={`w-12 h-12 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                                  <ItemIcon className={`h-6 w-6 ${item.iconColor}`} />
                                </div>

                                {/* Título e Descrição */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-1">{item.label}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

