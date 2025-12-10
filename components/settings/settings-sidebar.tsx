"use client";

import { useRouter, usePathname } from "next/navigation";
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
  ChevronDown,
  ChevronRight,
  Home,
  Settings as SettingsIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

interface SettingsCategory {
  id: string;
  label: string;
  icon: any;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  label: string;
  route: string;
  icon: any;
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
        route: "/settings/organization",
        icon: Building2,
      },
      {
        id: "connections",
        label: "Conexões",
        route: "/settings/connections",
        icon: Plug,
      },
      {
        id: "language-region",
        label: "Idioma e região",
        route: "/settings/language-region",
        icon: Globe,
      },
      {
        id: "billing",
        label: "Cobranças",
        route: "/settings/billing",
        icon: CreditCard,
      },
      {
        id: "teams",
        label: "Equipes",
        route: "/settings/teams",
        icon: Users,
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
        route: "/settings/professionals",
        icon: Users,
      },
      {
        id: "locations",
        label: "Localidades",
        route: "/settings/locations",
        icon: MapPin,
      },
      {
        id: "insurance",
        label: "Convênios",
        route: "/settings/insurance",
        icon: CreditCard,
      },
      {
        id: "clients",
        label: "Clientes",
        route: "/settings/clients",
        icon: Users,
      },
      {
        id: "hours-services",
        label: "Horários de funcionamento e serviços",
        route: "/settings/hours-services",
        icon: Clock,
      },
      {
        id: "appointments",
        label: "Agendamentos",
        route: "/settings/appointments",
        icon: Calendar,
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
        route: "/settings/tags",
        icon: TagIcon,
      },
      {
        id: "custom-fields",
        label: "Campos personalizados",
        route: "/settings/custom-fields",
        icon: Hash,
      },
      {
        id: "message-templates",
        label: "Modelos de mensagem",
        route: "/settings/message-templates",
        icon: FileText,
      },
      {
        id: "quick-replies",
        label: "Respostas rápidas",
        route: "/settings/quick-replies",
        icon: MessageSquare,
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
        route: "/settings/api-keys",
        icon: Key,
      },
      {
        id: "webhooks",
        label: "Webhooks",
        route: "/settings/webhooks",
        icon: Webhook,
      },
      {
        id: "integrations",
        label: "Integrações Nativa e Externa",
        route: "/settings/integrations",
        icon: Zap,
      },
    ],
  },
];

export function SettingsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const getCurrentCategory = () => {
    for (const category of SETTINGS_CATEGORIES) {
      const item = category.items.find((item) => pathname === item.route);
      if (item) return category.id;
    }
    return null;
  };

  const currentCategory = getCurrentCategory();
  
  // Inicializar com todas as categorias colapsadas
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Expandir automaticamente a categoria quando navegar para um item dela
  useEffect(() => {
    const category = getCurrentCategory();
    if (category) {
      setExpandedCategories((prev) => {
        if (!prev.includes(category)) {
          return [...prev, category];
        }
        return prev;
      });
    }
  }, [pathname]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId);
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-semibold text-lg">Configurações</h2>
      </div>

      {/* Menu de navegação */}
      <ScrollArea className="flex-1">
        <nav className="p-2">
          {/* Início */}
          <button
            onClick={() => router.push("/settings")}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors mb-1",
              pathname === "/settings"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <Home className="h-4 w-4" />
            <span>Início</span>
          </button>

          {/* Categorias */}
          {SETTINGS_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            const isExpanded = isCategoryExpanded(category.id);
            const isActive = currentCategory === category.id;

            return (
              <div key={category.id} className="mb-1">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "w-full flex items-center justify-start gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                    isActive
                      ? "bg-sidebar-accent/50 text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <CategoryIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{category.label}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                </button>

                {/* Subitens */}
                {isExpanded && (
                  <div className="ml-0 mt-1 space-y-1">
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isItemActive = pathname === item.route;

                      return (
                        <button
                          key={item.id}
                          onClick={() => router.push(item.route)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                            isItemActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          <ItemIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-left">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

