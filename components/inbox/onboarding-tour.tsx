"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Tag, UserPlus, Search, Star, Filter, MessageSquare, Users, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  action?: "click" | "view";
  icon?: React.ReactNode;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo à Nova Inbox da Clinia! 👋",
    description: "Vamos fazer um tour interativo pelas principais funcionalidades. Você precisará clicar nos elementos destacados para avançar!",
    target: "body",
    position: "center",
    action: "view",
    icon: <MessageSquare className="h-6 w-6" />
  },
  {
    id: "sidebar",
    title: "Barra Lateral",
    description: "Aqui você encontra navegação rápida, filtros de conversas e acesso ao chat interno com sua equipe.",
    target: "[data-tour='sidebar']",
    position: "right",
    action: "view",
    icon: <MessageSquare className="h-6 w-6" />
  },
  {
    id: "conversation-filters",
    title: "Filtros de Conversas",
    description: "Filtre suas conversas por: Todos, Minhas, Não lidas ou Não atribuídas. Clique em um filtro para continuar!",
    target: "[data-tour='conversation-filters']",
    position: "bottom",
    action: "click",
    icon: <Filter className="h-6 w-6" />
  },
  {
    id: "conversation-list",
    title: "Lista de Conversas",
    description: "Aqui estão todas as suas conversas. Você pode ver o canal de origem (WhatsApp, Instagram, Facebook), etiquetas e status. Clique em uma conversa para abri-la!",
    target: "[data-tour='conversation-list']",
    position: "right",
    action: "click",
    icon: <MessageSquare className="h-6 w-6" />
  },
  {
    id: "tags",
    title: "Etiquetas",
    description: "As etiquetas ajudam a organizar conversas. Quando há múltiplas etiquetas, você verá um ícone. Passe o mouse para ver todas. Clique em uma conversa com etiquetas para continuar!",
    target: "[data-tour='tags']",
    position: "bottom",
    action: "click",
    icon: <Tag className="h-6 w-6" />
  },
  {
    id: "search",
    title: "Busca",
    description: "Use a busca para encontrar conversas por nome ou conteúdo das mensagens. Clique no ícone de busca para testar!",
    target: "[data-tour='search']",
    position: "bottom",
    action: "click",
    icon: <Search className="h-6 w-6" />
  },
  {
    id: "chat-header",
    title: "Cabeçalho do Chat",
    description: "No cabeçalho você pode atribuir a conversa, adicionar etiquetas, alterar o status e buscar dentro da conversa.",
    target: "[data-tour='chat-header']",
    position: "bottom",
    action: "view",
    icon: <MessageSquare className="h-6 w-6" />
  },
  {
    id: "assign-user",
    title: "Atribuir Conversa",
    description: "Clique aqui para atribuir a conversa para você ou outro membro da equipe. Tente atribuir esta conversa para você mesmo!",
    target: "[data-tour='assign-user']",
    position: "bottom",
    action: "click",
    icon: <UserPlus className="h-6 w-6" />
  },
  {
    id: "add-tags",
    title: "Adicionar Etiquetas",
    description: "Clique aqui para adicionar ou remover etiquetas da conversa. As mudanças aparecerão como logs de atividade no chat!",
    target: "[data-tour='add-tags']",
    position: "bottom",
    action: "click",
    icon: <Tag className="h-6 w-6" />
  },
  {
    id: "drawer",
    title: "Drawer de Informações",
    description: "Clique no ícone de informações para abrir a drawer com detalhes do contato, agendamentos, histórico de chamadas e muito mais!",
    target: "[data-tour='drawer']",
    position: "left",
    action: "click",
    icon: <Info className="h-6 w-6" />
  },
  {
    id: "favorites",
    title: "Mensagens Favoritas",
    description: "Na drawer, você pode ver mensagens marcadas como favoritas. Marque mensagens importantes clicando na estrela.",
    target: "[data-tour='favorites']",
    position: "left",
    action: "view",
    icon: <Star className="h-6 w-6" />
  },
  {
    id: "internal-chat",
    title: "Chat Interno",
    description: "Na barra lateral, você pode iniciar conversas internas com membros da equipe. Clique em 'Iniciar conversa interna' para testar!",
    target: "[data-tour='internal-chat']",
    position: "right",
    action: "click",
    icon: <Users className="h-6 w-6" />
  },
  {
    id: "complete",
    title: "Parabéns! 🎉",
    description: "Você explorou as principais funcionalidades da inbox! Agora você está pronto para usar todas as ferramentas disponíveis.",
    target: "body",
    position: "center",
    action: "view",
    icon: <CheckCircle2 className="h-6 w-6" />
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [elementFound, setElementFound] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const stepData = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  // Garantir que só roda no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Buscar elemento quando passo muda
  useEffect(() => {
    if (!isOpen || !isClient) {
      setElement(null);
      setElementFound(false);
      return;
    }

    if (stepData.target === "body") {
      setElement(null);
      setElementFound(true);
      return;
    }

    const findElement = () => {
      const el = document.querySelector(stepData.target) as HTMLElement;
      if (el) {
        setElement(el);
        setElementFound(true);
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("tour-highlight");
      } else {
        setElementFound(false);
        setTimeout(findElement, 300);
      }
    };

    const timer = setTimeout(findElement, 100);
    return () => {
      clearTimeout(timer);
      if (element) {
        element.classList.remove("tour-highlight");
      }
    };
  }, [isOpen, currentStep, isClient, stepData.target]);

  // Listener de clique
  useEffect(() => {
    if (!element || stepData.action !== "click" || !isOpen) return;

    const handleClick = () => {
      setTimeout(() => handleNext(), 200);
    };

    element.style.pointerEvents = "auto";
    element.style.cursor = "pointer";
    element.style.zIndex = "10000";
    element.addEventListener("click", handleClick, true);
    
    return () => {
      element.removeEventListener("click", handleClick, true);
      element.style.pointerEvents = "";
      element.style.cursor = "";
      element.style.zIndex = "";
    };
  }, [element, stepData.action, isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCurrentStep(0);
    setElement(null);
    setElementFound(false);
    document.querySelectorAll(".tour-highlight").forEach(el => {
      el.classList.remove("tour-highlight");
    });
    onClose();
  };

  if (!isOpen || !isClient) return null;

  // Calcular posição da modal
  const getModalPosition = (): React.CSSProperties => {
    if (stepData.position === "center" || stepData.target === "body") {
      return {};
    }

    if (!element || typeof window === 'undefined') {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10001,
      };
    }

    const rect = element.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const isSidebar = stepData.target.includes('sidebar') || stepData.target.includes('internal-chat');

    let top = 0;
    let left = 0;
    let transform = "";

    switch (stepData.position) {
      case "top":
        top = rect.top + scrollY - 10;
        left = rect.left + scrollX + rect.width / 2;
        transform = "translate(-50%, -100%)";
        break;
      case "bottom":
        top = rect.bottom + scrollY + 10;
        left = rect.left + scrollX + rect.width / 2;
        transform = "translate(-50%, 0)";
        break;
      case "left":
        top = rect.top + scrollY + rect.height / 2;
        left = rect.left + scrollX - 10;
        transform = "translate(-100%, -50%)";
        break;
      case "right":
        if (isSidebar) {
          const container = document.querySelector('.flex.h-screen.overflow-hidden.bg-sidebar.p-2');
          if (container) {
            top = container.getBoundingClientRect().top + 8;
          } else {
            top = 8;
          }
          left = Math.max(rect.right + scrollX + 20, scrollX + 575);
          transform = "none";
        } else {
          top = rect.top + scrollY + rect.height / 2;
          left = rect.right + scrollX + 10;
          transform = "translate(0, -50%)";
        }
        break;
    }

    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      transform,
      zIndex: 10001,
      maxWidth: "400px",
    };
  };

  // Calcular overlay
  const getOverlayStyle = (): React.CSSProperties => {
    if (stepData.position === "center" || stepData.target === "body") {
      return { background: "rgba(0, 0, 0, 0.3)" };
    }

    if (!element || typeof window === 'undefined') {
      return { background: "rgba(0, 0, 0, 0.3)" };
    }

    const rect = element.getBoundingClientRect();
    return {
      background: `radial-gradient(
        ellipse ${rect.width + 20}px ${rect.height + 20}px at 
        ${rect.left + rect.width / 2}px 
        ${rect.top + rect.height / 2}px,
        transparent 0%,
        transparent 40%,
        rgba(0, 0, 0, 0.3) 100%
      )`,
    };
  };

  // Calcular highlight
  const getHighlightStyle = (): React.CSSProperties => {
    if (!element || typeof window === 'undefined') {
      return {};
    }

    const rect = element.getBoundingClientRect();
    return {
      top: `${rect.top + window.scrollY - 4}px`,
      left: `${rect.left + window.scrollX - 4}px`,
      width: `${rect.width + 8}px`,
      height: `${rect.height + 8}px`,
    };
  };

  const modalStyle = getModalPosition();
  const overlayStyle = getOverlayStyle();
  const highlightStyle = getHighlightStyle();

  return (
    <>
      {/* Overlay */}
      {Object.keys(overlayStyle).length > 0 && (
        <div
          className="fixed inset-0 z-[10000] pointer-events-auto"
          style={overlayStyle}
          onClick={(e) => {
            if (stepData.action === "click") {
              e.stopPropagation();
            }
          }}
        />
      )}

      {/* Highlight */}
      {element && Object.keys(highlightStyle).length > 0 && (
        <div
          className="fixed z-[10001] border-4 border-primary rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none animate-pulse"
          style={highlightStyle}
        />
      )}

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent
          className={cn(
            "z-[10002] max-w-md",
            stepData.position === "center" || stepData.target === "body" 
              ? "" 
              : "!top-auto !left-auto !-translate-x-0 !-translate-y-0"
          )}
          style={Object.keys(modalStyle).length > 0 ? modalStyle : undefined}
        >
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              {stepData.icon}
              <DialogTitle>{stepData.title}</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              {stepData.description}
            </DialogDescription>
          </DialogHeader>

          {stepData.action === "click" && element && elementFound && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-primary font-medium flex items-center gap-2">
                <span>💡</span>
                <span>Clique no elemento destacado para continuar</span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <Button variant="ghost" size="sm" onClick={handleComplete}>
              <X className="h-4 w-4 mr-2" />
              Pular tour
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={isFirstStep}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              {isLastStep ? (
                <Button onClick={handleComplete}>
                  Finalizar
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mt-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

