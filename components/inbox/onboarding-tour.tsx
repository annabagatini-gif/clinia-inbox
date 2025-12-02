"use client";

import { useState, useEffect } from "react";
// Removido Dialog - usando modal customizada sem regras pré-definidas
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
    title: "Bem-vindo à sua nova Inbox",
    description: "Este tour rápido te ajuda a aproveitar melhor a plataforma. Clique nos elementos destacados para explorar cada funcionalidade.",
    target: "body",
    position: "center",
    action: "view",
    icon: <MessageSquare className="h-6 w-6" />
  },
  {
    id: "sidebar",
    title: "Filtros e notificações",
    description: "Filtre conversas por atribuição ou grupo para focar no que importa. Use o botão de notificações para personalizar como você recebe alertas.",
    target: "[data-tour='sidebar']",
    position: "right",
    action: "view",
    icon: <MessageSquare className="h-6 w-6" />
  },
  {
    id: "internal-chat-button",
    title: "Comunicação com a equipe",
    description: "Inicie conversas internas para coordenar trabalho e compartilhar informações com sua equipe.",
    target: "[data-tour='internal-chat']",
    position: "right",
    action: "view",
    icon: <Users className="h-6 w-6" />
  },
  {
    id: "internal-chat-area",
    title: "Explore o chat interno",
    description: "Aqui você pode gerenciar seus chats internos: minimizar, restaurar, fechar conversas e navegar pela barra de ícones.",
    target: "[data-tour='sidebar']",
    position: "right",
    action: "view",
    icon: <Users className="h-6 w-6" />
  },
  {
    id: "conversation-filters",
    title: "Organize suas conversas",
    description: "Filtre por todas, suas, não lidas ou não atribuídas. Clique em um filtro para continuar.",
    target: "[data-tour='conversation-filters']",
    position: "bottom",
    action: "click",
    icon: <Filter className="h-6 w-6" />
  },
  {
    id: "conversation-list",
    title: "Todas as suas conversas",
    description: "Veja canal de origem, etiquetas e status. Clique em qualquer conversa para abrir.",
    target: "[data-tour='conversation-list']",
    position: "right",
    action: "click",
    icon: <MessageSquare className="h-6 w-6" />
  },
  {
    id: "tags",
    title: "Organize com etiquetas",
    description: "Categorize conversas para encontrá-las rapidamente. Passe o mouse para ver múltiplas etiquetas.",
    target: "[data-tour='tags']",
    position: "bottom",
    action: "click",
    icon: <Tag className="h-6 w-6" />
  },
  {
    id: "search",
    title: "Encontre rapidamente",
    description: "Busque por nome do contato ou conteúdo das mensagens.",
    target: "[data-tour='search']",
    position: "bottom",
    action: "click",
    icon: <Search className="h-6 w-6" />
  },
  {
    id: "chat-header",
    title: "Controle total da conversa",
    description: "Atribua conversas, adicione etiquetas, altere status e busque dentro da conversa.",
    target: "[data-tour='chat-header']",
    position: "bottom",
    action: "view",
    icon: <MessageSquare className="h-6 w-6" />
  },
  {
    id: "assign-user",
    title: "Atribua conversas",
    description: "Distribua o trabalho atribuindo conversas para você ou outros membros da equipe.",
    target: "[data-tour='assign-user']",
    position: "bottom",
    action: "click",
    icon: <UserPlus className="h-6 w-6" />
  },
  {
    id: "add-tags",
    title: "Personalize com etiquetas",
    description: "Adicione ou remova etiquetas. As mudanças aparecem no histórico do chat.",
    target: "[data-tour='add-tags']",
    position: "bottom",
    action: "click",
    icon: <Tag className="h-6 w-6" />
  },
  {
    id: "drawer",
    title: "Informações completas",
    description: "Acesse histórico, agendamentos, chamadas e outros detalhes do contato.",
    target: "[data-tour='drawer']",
    position: "left",
    action: "click",
    icon: <Info className="h-6 w-6" />
  },
  {
    id: "favorites",
    title: "Mensagens importantes",
    description: "Marque mensagens como favoritas para acessá-las rapidamente depois.",
    target: "[data-tour='favorites']",
    position: "left",
    action: "view",
    icon: <Star className="h-6 w-6" />
  },
  {
    id: "complete",
    title: "Tudo pronto!",
    description: "Você conheceu as principais funcionalidades. Está tudo pronto para começar.",
    target: "body",
    position: "center",
    action: "view",
    icon: <CheckCircle2 className="h-6 w-6" />
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  isPaused?: boolean;
  goToStepId?: string | null;
}

export function OnboardingTour({ isOpen, onClose, isPaused = false, goToStepId }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [elementFound, setElementFound] = useState(false);
  const [isClient, setIsClient] = useState(typeof window !== 'undefined');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [elementBorderRadius, setElementBorderRadius] = useState<string>('12px');
  const [secondaryElement, setSecondaryElement] = useState<HTMLElement | null>(null);
  const [secondaryHighlightRect, setSecondaryHighlightRect] = useState<DOMRect | null>(null);
  const [secondaryElementBorderRadius, setSecondaryElementBorderRadius] = useState<string>('12px');
  const [tertiaryElement, setTertiaryElement] = useState<HTMLElement | null>(null);
  const [tertiaryHighlightRect, setTertiaryHighlightRect] = useState<DOMRect | null>(null);
  const [tertiaryElementBorderRadius, setTertiaryElementBorderRadius] = useState<string>('12px');
  
  const stepData = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Avançar para um passo específico quando goToStepId mudar
  useEffect(() => {
    if (goToStepId && isOpen) {
      const stepIndex = tourSteps.findIndex(step => step.id === goToStepId);
      if (stepIndex !== -1 && stepIndex !== currentStep) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentStep(stepIndex);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }, 300);
      }
    }
  }, [goToStepId, isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setIsTransitioning(true);
      // Delay mais longo para animação de fade out + slide antes de mudar de passo
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        // Delay adicional para animação de fade in + slide
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      // Delay mais longo para animação de fade out + slide antes de mudar de passo
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        // Delay adicional para animação de fade in + slide
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 300);
    }
  };

  const handleComplete = () => {
    setCurrentStep(0);
    setElement(null);
    setElementFound(false);
    // Limpar qualquer classe tour-highlight que possa ter ficado
    document.querySelectorAll(".tour-highlight").forEach(el => {
      el.classList.remove("tour-highlight");
    });
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !isClient) {
      setElement(null);
      setElementFound(false);
      return;
    }

    // Limpar highlights anteriores
    document.querySelectorAll(".tour-highlight").forEach(el => {
      el.classList.remove("tour-highlight");
    });

    if (stepData.target === "body") {
      setElement(null);
      setElementFound(true);
      setSecondaryElement(null);
      setSecondaryHighlightRect(null);
      setTertiaryElement(null);
      setTertiaryHighlightRect(null);
      return;
    }

    // Lógica especial para passo "internal-chat-area" - destacar apenas as duas sidebars da esquerda
    if (stepData.id === "internal-chat-area") {
      let sidebarElement: HTMLElement | null = null;
      let iconBarElement: HTMLElement | null = null;
      let timeoutId: NodeJS.Timeout | null = null;

      const findBothElements = () => {
        sidebarElement = document.querySelector("[data-tour='sidebar']") as HTMLElement;
        iconBarElement = document.querySelector("[data-tour='icon-bar']") as HTMLElement;

        if (sidebarElement && iconBarElement) {
          const sidebarRect = sidebarElement.getBoundingClientRect();
          const iconBarRect = iconBarElement.getBoundingClientRect();
          const sidebarVisible = sidebarRect.width > 0 && sidebarRect.height > 0;
          const iconBarVisible = iconBarRect.width > 0 && iconBarRect.height > 0;

          if (sidebarVisible && iconBarVisible) {
            setElement(sidebarElement);
            setElementFound(true);
            setSecondaryElement(iconBarElement);
            // Não destacar o container do chat interno, apenas as duas sidebars
            setTertiaryElement(null);
            return;
          }
        }
        
        // Tentar novamente se não encontrou ambos
        timeoutId = setTimeout(findBothElements, 100);
      };

      findBothElements();

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    // Lógica padrão para outros passos
    let found = false;
    let currentElement: HTMLElement | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let rafId: number | null = null;

    const findElement = () => {
      const el = document.querySelector(stepData.target) as HTMLElement;
      if (el) {
        // Verificar se o elemento está visível
        const rect = el.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0 && 
                          window.getComputedStyle(el).display !== 'none' &&
                          window.getComputedStyle(el).visibility !== 'hidden';
        
        if (isVisible) {
          currentElement = el;
          setElement(el);
          setElementFound(true);
          found = true;
          
          // Usar requestAnimationFrame para garantir que o DOM está pronto
          rafId = requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            // Não adicionar classe tour-highlight para evitar camadas extras de overlay
          });
        } else {
          // Elemento encontrado mas não visível - tratar como não encontrado
          setElement(null);
          setElementFound(false);
          found = false;
          // Tentar novamente após um delay
          timeoutId = setTimeout(findElement, 300);
        }
      } else {
        // Continuar tentando até encontrar
        if (!found) {
          timeoutId = setTimeout(findElement, 300);
        }
      }
    };

    // Tentar encontrar imediatamente
    const el = document.querySelector(stepData.target) as HTMLElement;
    if (el) {
      // Verificar se o elemento está visível
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 && 
                        window.getComputedStyle(el).display !== 'none' &&
                        window.getComputedStyle(el).visibility !== 'hidden';
      
      if (isVisible) {
        currentElement = el;
        setElement(el);
        setElementFound(true);
        found = true;
        rafId = requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          // Não adicionar classe tour-highlight para evitar camadas extras de overlay
        });
      } else {
        // Elemento encontrado mas não visível - tratar como não encontrado
        setElement(null);
        setElementFound(false);
        timeoutId = setTimeout(findElement, 100);
      }
    } else {
      // Se não encontrar imediatamente, tentar após um delay
      timeoutId = setTimeout(findElement, 100);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      // Não precisamos remover a classe tour-highlight já que não a adicionamos mais
    };
  }, [isOpen, currentStep, isClient, stepData.target, stepData.id]);

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

  // Calcular highlight de forma consistente e simples
  useEffect(() => {
    if (!element || !elementFound || typeof window === 'undefined') {
      setHighlightRect(null);
      setSecondaryHighlightRect(null);
      return;
    }

    const updateHighlight = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        // Criar uma cópia do rect para armazenar
        setHighlightRect(new DOMRect(rect.left, rect.top, rect.width, rect.height));
        
        // Detectar o border-radius do elemento para aplicar ao highlight
        const computedStyle = window.getComputedStyle(element);
        const borderRadius = computedStyle.borderRadius || '12px';
        setElementBorderRadius(borderRadius);
      } else {
        setHighlightRect(null);
      }

      // Atualizar highlight secundário se existir
      if (secondaryElement) {
        const secondaryRect = secondaryElement.getBoundingClientRect();
        if (secondaryRect.width > 0 && secondaryRect.height > 0) {
          setSecondaryHighlightRect(new DOMRect(secondaryRect.left, secondaryRect.top, secondaryRect.width, secondaryRect.height));
          const secondaryComputedStyle = window.getComputedStyle(secondaryElement);
          const secondaryBorderRadius = secondaryComputedStyle.borderRadius || '12px';
          setSecondaryElementBorderRadius(secondaryBorderRadius);
        } else {
          setSecondaryHighlightRect(null);
        }
      }

      // Atualizar highlight terciário se existir (chat interno)
      if (tertiaryElement) {
        const tertiaryRect = tertiaryElement.getBoundingClientRect();
        if (tertiaryRect.width > 0 && tertiaryRect.height > 0) {
          setTertiaryHighlightRect(new DOMRect(tertiaryRect.left, tertiaryRect.top, tertiaryRect.width, tertiaryRect.height));
          const tertiaryComputedStyle = window.getComputedStyle(tertiaryElement);
          const tertiaryBorderRadius = tertiaryComputedStyle.borderRadius || '12px';
          setTertiaryElementBorderRadius(tertiaryBorderRadius);
        } else {
          setTertiaryHighlightRect(null);
        }
      }
    };

    // Atualizar imediatamente
    updateHighlight();

    // Recalcular quando necessário
    const handleUpdate = () => {
      requestAnimationFrame(updateHighlight);
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    
    // Observar mudanças no elemento usando MutationObserver
    const observer = new MutationObserver(handleUpdate);
    if (element) {
      observer.observe(element, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: false,
        subtree: false
      });
    }

    // Recalcular periodicamente para garantir consistência
    const intervalId = setInterval(handleUpdate, 100);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      observer.disconnect();
    };
  }, [element, elementFound, secondaryElement, tertiaryElement]);

  // Garantir que sempre renderize se isOpen for true
  // Sempre renderizar se isOpen for true - não bloquear por isClient
  if (!isOpen) return null;

  // Simplificado: sempre centralizar a modal - removida toda lógica complexa de posicionamento

  // Overlay base - sempre usar o mesmo estilo
  const overlayStyle: React.CSSProperties = { background: "rgba(0, 0, 0, 0.5)" };

  // Renderizar overlay base apenas quando não há highlights (os highlights criam overlay com boxShadow)
  // Se for o primeiro passo (body), sempre mostrar overlay base
  // Se for outros passos, só mostrar overlay base se não houver elementos encontrados
  const hasHighlights = elementFound && highlightRect !== null;
  const shouldShowBaseOverlay = stepData.target === "body" || !hasHighlights;
  
  // Padding consistente para o highlight (2px em todos os lados)
  const HIGHLIGHT_PADDING = 2;

  return (
    <>
      {/* Overlay base - só mostrar quando não há highlights (para evitar duplicação) e quando não estiver pausado */}
      {shouldShowBaseOverlay && !isPaused && (
        <div
          className="fixed inset-0 z-[10003] pointer-events-auto transition-opacity duration-400 ease-in-out"
          style={overlayStyle}
          onClick={(e) => {
            if (stepData.action === "click") {
              e.stopPropagation();
            }
          }}
          onMouseEnter={(e) => {
            // Prevenir que tooltips apareçam ao passar o mouse sobre o overlay
            e.stopPropagation();
          }}
          onMouseMove={(e) => {
            // Prevenir que tooltips apareçam ao mover o mouse sobre o overlay
            e.stopPropagation();
          }}
        />
      )}

      {/* Highlight para elemento atual - cria o buraco no overlay usando boxShadow */}
      {highlightRect && stepData.target !== "body" && (
        <div
          className={cn(
            "fixed z-[10004] pointer-events-none transition-all duration-500 ease-in-out",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}
          style={{
            top: `${highlightRect.top - HIGHLIGHT_PADDING}px`,
            left: `${highlightRect.left - HIGHLIGHT_PADDING}px`,
            width: `${highlightRect.width + (HIGHLIGHT_PADDING * 2)}px`,
            height: `${highlightRect.height + (HIGHLIGHT_PADDING * 2)}px`,
            backgroundColor: 'transparent',
            borderRadius: elementBorderRadius, // Usar o mesmo border-radius do elemento destacado
            // Quando pausado, não criar overlay (boxShadow), apenas manter o elemento destacado
            // Se houver elemento secundário, não criar boxShadow aqui (será criado no secundário)
            boxShadow: isPaused || secondaryHighlightRect ? 'none' : '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      {/* Highlight secundário para passo "internal-chat-area" - barra de ícones */}
      {secondaryHighlightRect && stepData.id === "internal-chat-area" && (
        <div
          className={cn(
            "fixed z-[10004] pointer-events-none transition-all duration-500 ease-in-out",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}
          style={{
            top: `${secondaryHighlightRect.top - HIGHLIGHT_PADDING}px`,
            left: `${secondaryHighlightRect.left - HIGHLIGHT_PADDING}px`,
            width: `${secondaryHighlightRect.width + (HIGHLIGHT_PADDING * 2)}px`,
            height: `${secondaryHighlightRect.height + (HIGHLIGHT_PADDING * 2)}px`,
            backgroundColor: 'transparent',
            borderRadius: secondaryElementBorderRadius,
            // Criar overlay com buraco usando boxShadow - este será o único overlay quando há dois elementos
            boxShadow: isPaused ? 'none' : '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      {/* Modal customizada - sem regras pré-definidas do Dialog */}
      {/* Não mostrar modal quando pausado */}
      {isOpen && !isPaused && (
        <div
          className={cn(
            "fixed inset-0 z-[10005] flex items-center justify-center pointer-events-none transition-opacity duration-400 ease-in-out"
          )}
          onClick={(e) => {
            // Prevenir fechamento ao clicar fora
            e.stopPropagation();
          }}
        >
          <div
            className={cn(
              "bg-background rounded-lg border shadow-lg p-6 w-full mx-4 pointer-events-auto relative transition-all duration-500 ease-in-out",
              isTransitioning ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
            )}
            style={{
              position: "relative",
              maxWidth: "420px",
              minWidth: "320px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão X no canto superior direito */}
            <button
              onClick={handleComplete}
              className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Fechar tour"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-2 pr-8">
              <h2 className="text-lg font-semibold leading-none">
                {stepData.title}
              </h2>
            </div>
            
            {/* Description */}
            <p className="text-base text-muted-foreground mb-4">
              {stepData.description}
            </p>

            {/* Aviso de clique */}
            {stepData.action === "click" && element && elementFound && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium flex items-center gap-2">
                  <span>Clique no elemento destacado para continuar</span>
                </p>
              </div>
            )}

            {/* Botões */}
            <div className="flex items-center justify-between mt-6 gap-2">
              {/* Mostrar botão Anterior apenas se não for o primeiro passo */}
              {!isFirstStep ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  className="flex-shrink-0 bg-white hover:bg-gray-50 border-gray-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              ) : (
                <div></div>
              )}

              <div className="flex items-center gap-2 flex-shrink-0">
                {isLastStep ? (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleComplete}
                    className="bg-white hover:bg-gray-50 border-gray-200"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    className="bg-white hover:bg-gray-50 border-gray-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Indicador de progresso */}
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
          </div>
        </div>
      )}
    </>
  );
}
