"use client";

import { useState, useEffect, useRef } from "react";
import { Smile, Paperclip, ArrowUp, Zap, ArrowLeft, Users, Check, CheckCheck, ChevronLeft, Bot, Sparkles, Mic, FileText, MessageSquare, FileText as FileTextIcon, Search, RotateCcw, Plus, X, Image, Video, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockMessages } from "@/lib/mock-data";
import { Conversation, Message, Annotation } from "@/types/inbox";
import { toast } from "sonner";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { AnnotationsDrawer } from "@/components/inbox/annotations-drawer";

interface ChatAreaProps {
  conversationId?: string;
  conversationName?: string;
  conversation?: Conversation;
  onBack?: () => void;
  onConversationUpdate?: (conversationId: string, updates: Partial<Conversation>) => void;
  onNavigateToConversation?: (contactName: string, phone: string) => void;
}

// Lista de usuários e grupos disponíveis
const allUsers = [
  { id: "user1", name: "June Jensen", avatar: "JJ", phone: "+55 11 98765-4321" },
  { id: "user2", name: "Anna B", avatar: "AB", phone: "+55 21 99876-5432" },
  { id: "user3", name: "Carlos Silva", avatar: "CS", phone: "+55 11 91234-5678" },
  { id: "user4", name: "Maria Santos", avatar: "MS", phone: "+55 31 98765-4321" },
  { id: "user5", name: "Pedro Costa", avatar: "PC", phone: "+55 11 97654-3210" },
  { id: "user6", name: "Ana Oliveira", avatar: "AO", phone: "+55 21 91234-5678" },
  { id: "user7", name: "Lucas Alves", avatar: "LA", phone: "+55 11 99876-5432" },
  { id: "user8", name: "Julia Pereira", avatar: "JP", phone: "+55 41 98765-4321" },
  { id: "user9", name: "Rafael Lima", avatar: "RL", phone: "+55 11 91234-5678" },
  { id: "user10", name: "Camila Souza", avatar: "CS", phone: "+55 21 98765-4321" },
];

const allGroups = [
  { id: "group1", name: "Suporte Técnico", avatar: "ST" },
  { id: "group2", name: "Vendas", avatar: "VD" },
  { id: "group3", name: "Financeiro", avatar: "FN" },
];

// Modelos de mensagem disponíveis
const messageTemplates = [
  {
    id: "template1",
    title: "Boas-vindas",
    content: "Olá! Bem-vindo(a) à nossa empresa. Como posso ajudá-lo(a) hoje?",
  },
  {
    id: "template2",
    title: "Agradecimento",
    content: "Obrigado(a) pelo contato! Nossa equipe entrará em contato em breve.",
  },
  {
    id: "template3",
    title: "Solicitação de informações",
    content: "Olá! Para melhor atendê-lo(a), preciso de algumas informações. Poderia me informar?",
  },
  {
    id: "template4",
    title: "Confirmação de pedido",
    content: "Seu pedido foi confirmado! O número do pedido é #12345. Você receberá atualizações por aqui.",
  },
  {
    id: "template5",
    title: "Suporte técnico",
    content: "Olá! Entendo que você está enfrentando problemas técnicos. Vou ajudá-lo(a) a resolver isso.",
  },
  {
    id: "template6",
    title: "Reagendamento",
    content: "Entendo que você precisa reagendar. Podemos encontrar um horário que funcione melhor para você?",
  },
  {
    id: "template7",
    title: "Follow-up",
    content: "Olá! Gostaria de saber como está indo com sua solicitação. Há algo mais em que possamos ajudar?",
  },
  {
    id: "template8",
    title: "Encerramento",
    content: "Foi um prazer atendê-lo(a)! Se precisar de mais alguma coisa, estarei à disposição.",
  },
  {
    id: "template9",
    title: "Mensagem de boas-vindas completa",
    content: "Olá! Bem-vindo(a) à nossa empresa. Estamos muito felizes em tê-lo(a) conosco. Nossa equipe está sempre pronta para ajudá-lo(a) com qualquer dúvida ou necessidade que possa ter. Não hesite em nos contatar a qualquer momento. Estamos aqui para garantir que você tenha a melhor experiência possível conosco. Esperamos poder ajudá-lo(a) em breve!",
  },
];

const quickReplies = [
  {
    id: "quick1",
    title: "Obrigado",
    content: "Obrigado pelo contato!",
  },
  {
    id: "quick2",
    title: "Entendido",
    content: "Entendido, vou verificar isso para você.",
  },
  {
    id: "quick3",
    title: "Em breve",
    content: "Vou retornar em breve com mais informações.",
  },
  {
    id: "quick4",
    title: "Confirmado",
    content: "Confirmado! Vou processar sua solicitação.",
  },
  {
    id: "quick5",
    title: "Preciso de mais informações",
    content: "Preciso de mais algumas informações para prosseguir. Poderia me ajudar?",
  },
  {
    id: "quick6",
    title: "Vou verificar",
    content: "Vou verificar isso e retorno em seguida.",
  },
  {
    id: "quick7",
    title: "Perfeito",
    content: "Perfeito! Está tudo certo.",
  },
  {
    id: "quick8",
    title: "Desculpe pelo transtorno",
    content: "Desculpe pelo transtorno. Vamos resolver isso rapidamente.",
  },
  {
    id: "quick9",
    title: "Enviar imagem de boas-vindas",
    content: "Bem-vindo! Estamos felizes em tê-lo conosco.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d7a?w=400&h=300&fit=crop",
  },
  {
    id: "quick10",
    title: "Enviar catálogo de produtos",
    content: "Segue nosso catálogo de produtos atualizado.",
    attachment: {
      name: "Catalogo_Produtos_2024.pdf",
      url: "https://example.com/catalogo.pdf",
      type: "application/pdf",
      size: 2048000,
    },
  },
  {
    id: "quick11",
    title: "Enviar imagem do produto",
    content: "Aqui está uma imagem do produto que você solicitou.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  },
  {
    id: "quick12",
    title: "Enviar manual de instruções",
    content: "Segue o manual de instruções para você.",
    attachment: {
      name: "Manual_Instrucoes.pdf",
      url: "https://example.com/manual.pdf",
      type: "application/pdf",
      size: 1536000,
    },
  },
  {
    id: "quick13",
    title: "Enviar imagem promocional",
    content: "Confira nossa promoção especial!",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop",
  },
  {
    id: "quick14",
    title: "Enviar planilha de preços",
    content: "Segue a planilha de preços atualizada.",
    attachment: {
      name: "Tabela_Precos.xlsx",
      url: "https://example.com/precos.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 512000,
    },
  },
];

export function ChatArea({ conversationId, conversationName, conversation, onBack, onConversationUpdate, onNavigateToConversation }: ChatAreaProps) {
  const [isAssignPopoverOpen, setIsAssignPopoverOpen] = useState(false);
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  const [isAutomationPopoverOpen, setIsAutomationPopoverOpen] = useState(false);
  const [isMessageTemplatePopoverOpen, setIsMessageTemplatePopoverOpen] = useState(false);
  const [isTemplatePreviewOpen, setIsTemplatePreviewOpen] = useState(false);
  const [isRewritePopoverOpen, setIsRewritePopoverOpen] = useState(false);
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof messageTemplates[0] | null>(null);
  const [isQuickReplyPopoverOpen, setIsQuickReplyPopoverOpen] = useState(false);
  const [quickReplySearchQuery, setQuickReplySearchQuery] = useState("");
  const [selectedQuickReply, setSelectedQuickReply] = useState<typeof quickReplies[0] | null>(null);
  const [isCreatingQuickReply, setIsCreatingQuickReply] = useState(false);
  const [userQuickReplies, setUserQuickReplies] = useState<typeof quickReplies>([]);
  const [newQuickReplyTitle, setNewQuickReplyTitle] = useState("");
  const [newQuickReplyContent, setNewQuickReplyContent] = useState("");
  const [newQuickReplyImage, setNewQuickReplyImage] = useState("");
  const [newQuickReplyImageFile, setNewQuickReplyImageFile] = useState<File | null>(null);
  const [newQuickReplyAttachmentName, setNewQuickReplyAttachmentName] = useState("");
  const [newQuickReplyAttachmentUrl, setNewQuickReplyAttachmentUrl] = useState("");
  const [newQuickReplyAttachmentFile, setNewQuickReplyAttachmentFile] = useState<File | null>(null);
  const [newQuickReplyAttachmentType, setNewQuickReplyAttachmentType] = useState<"file" | "image" | "video">("file");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [isAttachmentPopoverOpen, setIsAttachmentPopoverOpen] = useState(false);
  const [isEmojiPopoverOpen, setIsEmojiPopoverOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isContactConfirmDialogOpen, setIsContactConfirmDialogOpen] = useState(false);
  const [isViewAllContactsOpen, setIsViewAllContactsOpen] = useState(false);
  const [isContactDetailOpen, setIsContactDetailOpen] = useState(false);
  const [selectedContactDetail, setSelectedContactDetail] = useState<{ id: string; name: string; avatar: string; phone: string } | null>(null);
  const [savedContacts, setSavedContacts] = useState<string[]>([]);
  const [viewAllContactsData, setViewAllContactsData] = useState<Array<{ id: string; name: string; avatar: string; phone: string }>>([]);
  const [messageAttachmentFile, setMessageAttachmentFile] = useState<File | null>(null);
  const [messageAttachmentType, setMessageAttachmentType] = useState<"image" | "video" | "file" | "contact" | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contactPreviewData, setContactPreviewData] = useState<Array<{ id: string; name: string; phone: string }>>([]);
  const messageImageInputRef = useRef<HTMLInputElement>(null);
  const messageVideoInputRef = useRef<HTMLInputElement>(null);
  const messageFileInputRef = useRef<HTMLInputElement>(null);
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [originalMessageText, setOriginalMessageText] = useState<string>("");
  const [isRewritten, setIsRewritten] = useState(false);
  const [messages, setMessages] = useState<Message[]>(conversationId ? mockMessages[conversationId] || [] : []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiButtonRef = useRef<HTMLButtonElement>(null);
  const notifiedRemindersRef = useRef<Set<string>>(new Set());
  
  // Atualizar mensagens quando a conversa mudar
  useEffect(() => {
    if (conversationId) {
      setMessages(mockMessages[conversationId] || []);
      } else {
      setMessages([]);
    }
    // Resetar estado de reescrita ao mudar de conversa
    setMessageText("");
    setIsRewritten(false);
    setOriginalMessageText("");
    // Scroll para o final quando as mensagens mudarem
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [conversationId]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Verificar lembretes periodicamente
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      annotations.forEach((annotation) => {
        if (
          annotation.type === "reminder" &&
          !annotation.isCompleted &&
          annotation.reminderDate &&
          annotation.reminderTime &&
          !notifiedRemindersRef.current.has(annotation.id)
        ) {
          // Criar data/hora do lembrete no timezone local
          const [year, month, day] = annotation.reminderDate.split("-").map(Number);
          const [hours, minutes] = annotation.reminderTime.split(":").map(Number);
          
          const reminderDateTime = new Date(year, month - 1, day, hours, minutes, 0);
          const timeDiff = reminderDateTime.getTime() - now.getTime();
          
          // Verificar se o lembrete já chegou (passou ou está dentro de 1 minuto)
          // Permite até 24 horas depois do horário para não perder lembretes
          const maxDelay = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
          
          if (timeDiff <= 60000 && timeDiff >= -maxDelay) {
            console.log("Lembrete disparado:", {
              id: annotation.id,
              content: annotation.content,
              reminderDate: annotation.reminderDate,
              reminderTime: annotation.reminderTime,
              now: now.toLocaleString("pt-BR"),
              reminderDateTime: reminderDateTime.toLocaleString("pt-BR"),
              timeDiff: Math.round(timeDiff / 1000) + " segundos"
            });

            toast.info(`🔔 Lembrete: ${annotation.content}`, {
              description: conversationName ? `Conversa: ${conversationName}` : undefined,
              duration: 10000,
            });

            notifiedRemindersRef.current.add(annotation.id);
          }
        }
      });
    };

    // Limpar lembretes concluídos do conjunto de notificados
    annotations.forEach((annotation) => {
      if (annotation.isCompleted && notifiedRemindersRef.current.has(annotation.id)) {
        notifiedRemindersRef.current.delete(annotation.id);
      }
    });

    // Verificar imediatamente
    checkReminders();

    // Verificar a cada 10 segundos para ser mais preciso
    const interval = setInterval(checkReminders, 10000);

    return () => clearInterval(interval);
  }, [annotations, conversationName]);

  // Verificar se precisa usar modelo de mensagem
  // Por enquanto, apenas na conversa com ID "12" (Thiago Barbosa - 3d sem resposta)
  const requiresMessageTemplate = conversation?.id === "12";

  // Filtrar modelos de mensagem baseado na busca
  const filteredTemplates = messageTemplates.filter((template) =>
    template.title.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
    template.content.toLowerCase().includes(templateSearchQuery.toLowerCase())
  );

  // Combinar respostas rápidas pré-definidas com as criadas pelo usuário
  const allQuickReplies = [...quickReplies, ...userQuickReplies];
  
  // Filtrar respostas rápidas baseado na busca
  const filteredQuickReplies = allQuickReplies.filter((reply) =>
    reply.title.toLowerCase().includes(quickReplySearchQuery.toLowerCase()) ||
    reply.content.toLowerCase().includes(quickReplySearchQuery.toLowerCase())
  );

  const handleSelectTemplate = (template: typeof messageTemplates[0]) => {
    setSelectedTemplate(template);
  };

  const handleViewTemplate = () => {
    if (!selectedTemplate) return;
    setIsTemplatePreviewOpen(true);
  };

  const handleRewrite = (style: "grammar" | "formal" | "friendly" | "concise" | "clear") => {
    try {
      const trimmedText = messageText.trim();
      
      // Validação: mensagem vazia ou só espaços
      if (!trimmedText) {
        toast.error("Por favor, escreva uma mensagem antes de reescrever.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }
      
      // Validação: mensagem muito curta (menos de 3 caracteres)
      if (trimmedText.length < 3) {
        toast.error("A mensagem precisa ter pelo menos 3 caracteres para ser reescrita.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }
      
      // Validação: mensagem muito longa (mais de 5000 caracteres)
      if (trimmedText.length > 5000) {
        toast.error("A mensagem é muito longa. Por favor, reduza para no máximo 5000 caracteres.", {
          duration: 4000,
          closeButton: true,
        });
        return;
      }
      
      // Validação: mensagem com apenas números ou caracteres especiais (sem letras)
      const hasLetters = /[a-zA-ZÀ-ÿ]/.test(trimmedText);
      if (!hasLetters) {
        toast.error("A mensagem precisa conter pelo menos uma letra para ser reescrita.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }
      
      // Salvar o texto original se ainda não foi salvo
      if (!isRewritten) {
        setOriginalMessageText(messageText);
      }
      
      // Simular reescrita baseada no estilo
      let rewrittenText = messageText;
      
      switch (style) {
        case "grammar":
          // Simular correção de gramática
          rewrittenText = messageText
            .replace(/\bvc\b/gi, "você")
            .replace(/\btd\b/gi, "tudo")
            .replace(/\bq\b/gi, "que")
            .replace(/\bpq\b/gi, "porque")
            .replace(/\bnao\b/gi, "não")
            .replace(/\bvoce\b/gi, "você")
            .replace(/\bta\b/gi, "está")
            .replace(/\bto\b/gi, "estou")
            .replace(/\bpra\b/gi, "para")
            .replace(/\bpro\b/gi, "para o")
            .replace(/\bpros\b/gi, "para os")
            .replace(/\bpro\s+([a-z]+)\b/gi, "para $1")
            .replace(/\b(\w+)\.(\w+)/gi, "$1 $2") // Remove pontos no meio de palavras
            .replace(/\s+/g, " ")
            .trim();
          // Capitalizar primeira letra
          if (rewrittenText && rewrittenText.length > 0) {
            rewrittenText = rewrittenText.charAt(0).toUpperCase() + rewrittenText.slice(1);
          }
          break;
        case "formal":
          // Tornar mais formal
          rewrittenText = messageText
            .replace(/\boi\b/gi, "Olá")
            .replace(/\btchau\b/gi, "Adeus")
            .replace(/\bok\b/gi, "Entendido")
            .replace(/\bblz\b/gi, "Está bem")
            .replace(/\bobrigado\b/gi, "Agradeço")
            .replace(/\bobrigada\b/gi, "Agradeço")
            .replace(/\bvc\b/gi, "você")
            .replace(/\bvoce\b/gi, "você")
            .replace(/\b(\w+)\s+pra\s+/gi, "$1 para ")
            .replace(/\b(\w+)\s+pro\s+/gi, "$1 para o ")
            .replace(/\bta\b/gi, "está")
            .replace(/\bto\b/gi, "estou");
          // Capitalizar primeira letra e garantir pontuação adequada
          if (rewrittenText && rewrittenText.length > 0) {
            rewrittenText = rewrittenText.charAt(0).toUpperCase() + rewrittenText.slice(1);
            if (!rewrittenText.match(/[.!?]$/)) {
              rewrittenText += ".";
            }
          }
          break;
        case "friendly":
          // Tornar mais amigável
          rewrittenText = messageText
            .replace(/^Olá/gi, "Oi")
            .replace(/^Bom dia/gi, "Bom dia")
            .replace(/^Boa tarde/gi, "Boa tarde")
            .replace(/\bEntendido\b/gi, "Ok")
            .replace(/\bAgradeço\b/gi, "Obrigado")
            .replace(/\bAgradecemos\b/gi, "Obrigado")
            .replace(/\bvocê\b/gi, "vc")
            .replace(/\bpara\b/gi, "pra")
            .replace(/\bpara o\b/gi, "pro")
            .replace(/\bpara os\b/gi, "pros");
          // Remover pontuação muito formal
          rewrittenText = rewrittenText.replace(/\.$/, "");
          break;
        case "concise":
          // Tornar mais concisa (remover palavras desnecessárias)
          rewrittenText = messageText
            .replace(/\bpor favor\b/gi, "")
            .replace(/\bpor gentileza\b/gi, "")
            .replace(/\bse possível\b/gi, "")
            .replace(/\bse for possível\b/gi, "")
            .replace(/\bgostaria de\b/gi, "quero")
            .replace(/\bpoderia\b/gi, "pode")
            .replace(/\bpoderia me\b/gi, "pode me")
            .replace(/\bquero saber\b/gi, "quero")
            .replace(/\bquero que\b/gi, "quero")
            .replace(/\s+/g, " ")
            .trim();
          
          // Validação: se após tornar concisa a mensagem ficou vazia
          if (!rewrittenText || rewrittenText.trim().length === 0) {
            toast.error("Não foi possível tornar a mensagem mais concisa sem perder o conteúdo. Tente outra opção.", {
              duration: 4000,
              closeButton: true,
            });
            return;
          }
          break;
        case "clear":
          // Tornar mais clara (simplificar)
          rewrittenText = messageText
            .replace(/\bno entanto\b/gi, "mas")
            .replace(/\bcontudo\b/gi, "mas")
            .replace(/\bentretanto\b/gi, "mas")
            .replace(/\bportanto\b/gi, "então")
            .replace(/\bassim sendo\b/gi, "então")
            .replace(/\bconsequentemente\b/gi, "então")
            .replace(/\bademais\b/gi, "além disso")
            .replace(/\boutrossim\b/gi, "também")
            .replace(/\bmediante\b/gi, "com")
            .replace(/\batravés de\b/gi, "por")
            .replace(/\bno que se refere a\b/gi, "sobre")
            .replace(/\bno que concerne a\b/gi, "sobre");
          break;
      }
      
      // Validação: verificar se a mensagem realmente mudou
      if (rewrittenText.trim() === trimmedText) {
        toast.info("A mensagem já está no formato desejado. Nenhuma alteração foi necessária.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }
      
      // Validação: verificar se o resultado não ficou muito curto após processamento
      if (rewrittenText.trim().length < 2) {
        toast.error("A reescrita resultou em uma mensagem muito curta. Tente outra opção de reescrita.", {
          duration: 4000,
          closeButton: true,
        });
        return;
      }
      
      // Atualizar o texto
      setMessageText(rewrittenText);
      setIsRewritten(true);
      
      toast.success("Mensagem reescrita!", {
        duration: 2000,
        closeButton: true,
      });
    } catch (error) {
      // Tratamento de erro genérico para casos inesperados
      console.error("Erro ao reescrever mensagem:", error);
      toast.error("Ocorreu um erro ao reescrever a mensagem. Por favor, tente novamente.", {
        duration: 4000,
        closeButton: true,
      });
    }
  };

  const handleRevertRewrite = () => {
    if (originalMessageText) {
      setMessageText(originalMessageText);
      setOriginalMessageText("");
      setIsRewritten(false);
      toast.success("Mensagem original restaurada!", {
        duration: 2000,
        closeButton: true,
      });
    }
  };

  const generateConversationSummary = () => {
    return "A cliente Ana Costa chamou pedindo se o aplicativo estava fora do ar, porque não estava conseguindo fazer login. No entanto, June respondeu que está funcionando normalmente.";
  };

  const handleSummarizeConversation = () => {
    const summary = generateConversationSummary();
    
    // Verificar se já existe um resumo nas mensagens
    const existingSummaryIndex = messages.findIndex(msg => msg.isSummary);
    
    if (existingSummaryIndex !== -1) {
      // Atualizar o resumo existente
      const updatedMessages = [...messages];
      updatedMessages[existingSummaryIndex] = {
        ...updatedMessages[existingSummaryIndex],
        content: summary,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(updatedMessages);
      } else {
      // Adicionar novo resumo como mensagem no chat
      const summaryMessage: Message = {
        id: `summary-${Date.now()}`,
        sender: "Sistema",
        content: summary,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isUser: false,
        isSummary: true,
      };
      
      setMessages([...messages, summaryMessage]);
    }
    
    // Scroll para o final
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendTemplate = () => {
    if (!selectedTemplate || !conversationId) return;
    
    // Criar nova mensagem
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "Você",
      content: selectedTemplate.content,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
    };
    
    // Adicionar mensagem ao chat
    setMessages([...messages, newMessage]);
    
    // Limpar estado do popover
    setSelectedTemplate(null);
    setTemplateSearchQuery("");
    setIsMessageTemplatePopoverOpen(false);
  };

  const handleSelectQuickReply = (reply: typeof quickReplies[0]) => {
    setSelectedQuickReply(reply);
  };

  const handleSendQuickReply = () => {
    if (!selectedQuickReply || !conversationId) return;
    
    // Criar nova mensagem
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "Você",
      content: selectedQuickReply.content,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
      ...(selectedQuickReply.image && { image: selectedQuickReply.image }),
      ...(selectedQuickReply.attachment && { attachment: selectedQuickReply.attachment }),
    };
    
    // Adicionar mensagem ao chat
    setMessages([...messages, newMessage]);
    
    // Limpar estado do popover
    setSelectedQuickReply(null);
    setQuickReplySearchQuery("");
    setIsQuickReplyPopoverOpen(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar se é uma imagem
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione um arquivo de imagem.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }

      setNewQuickReplyImageFile(file);
      
      // Converter para data URL para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewQuickReplyImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("O arquivo deve ter no máximo 10MB.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }

      setNewQuickReplyAttachmentFile(file);
      setNewQuickReplyAttachmentName(file.name);
      
      // Detectar tipo automaticamente baseado no tipo MIME
      if (file.type.startsWith('image/')) {
        setNewQuickReplyAttachmentType("image");
      } else if (file.type.startsWith('video/')) {
        setNewQuickReplyAttachmentType("video");
      } else {
        setNewQuickReplyAttachmentType("file");
      }
      
      // Criar URL temporária para o arquivo
      const fileUrl = URL.createObjectURL(file);
      setNewQuickReplyAttachmentUrl(fileUrl);
    }
  };

  const handleMessageImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione um arquivo de imagem.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }
      setMessageAttachmentFile(file);
      setMessageAttachmentType("image");
      setIsAttachmentPopoverOpen(false);
    }
  };

  const handleMessageVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error("Por favor, selecione um arquivo de vídeo.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("O vídeo deve ter no máximo 10MB.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }
      setMessageAttachmentFile(file);
      setMessageAttachmentType("video");
      setIsAttachmentPopoverOpen(false);
    }
  };

  const handleMessageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("O arquivo deve ter no máximo 10MB.", {
          duration: 3000,
          closeButton: true,
        });
        return;
      }
      setMessageAttachmentFile(file);
      setMessageAttachmentType("file");
      setIsAttachmentPopoverOpen(false);
    }
  };

  const handleSelectContact = () => {
    setIsAttachmentPopoverOpen(false);
    setIsContactDialogOpen(true);
  };

  const handleToggleContact = (userId: string) => {
    setSelectedContacts(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleConfirmContact = () => {
    if (selectedContacts.length === 0) return;
    
    // Preparar dados dos contatos selecionados para preview
    const previewData = allUsers
      .filter(user => selectedContacts.includes(user.id))
      .map(user => ({
        id: user.id,
        name: user.name,
        phone: user.phone || "",
      }));
    
    setContactPreviewData(previewData);
    setIsContactDialogOpen(false);
    setIsContactConfirmDialogOpen(true);
  };


  const handleSendContacts = () => {
    if (contactPreviewData.length === 0) return;
    
    if (!conversationId) return;

    // Preparar contatos para envio
    const contactsToSend = contactPreviewData.map(contact => {
      const originalUser = allUsers.find(u => u.id === contact.id);
      return {
        id: contact.id,
        name: contact.name,
        avatar: originalUser?.avatar || "",
        phone: contact.phone,
      };
    });

    // Criar nova mensagem com os contatos
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "Você",
      content: `${contactsToSend.length} ${contactsToSend.length === 1 ? 'contato compartilhado' : 'contatos compartilhados'}`,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
      contacts: contactsToSend,
    };

    // Adicionar mensagem ao chat
    setMessages([...messages, newMessage]);

    // Limpar estado
    setMessageText("");
    setMessageAttachmentFile(null);
    setMessageAttachmentType(null);
    setSelectedContacts([]);
    setContactPreviewData([]);
    setIsContactConfirmDialogOpen(false);
    setIsAttachmentPopoverOpen(false);

    // Scroll para o final após enviar
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = () => {
    if (!conversationId) return;
    
    const trimmedText = messageText.trim();
    
    // Permitir enviar mesmo sem texto se houver anexo ou contato
    if (!trimmedText && !messageAttachmentFile && contactPreviewData.length === 0) {
      return;
    }

    // Preparar contatos se houver
    const contactsToSend = contactPreviewData.length > 0
      ? contactPreviewData.map(contact => {
          const originalUser = allUsers.find(u => u.id === contact.id);
          return {
            id: contact.id,
            name: contact.name,
            avatar: originalUser?.avatar || "",
            phone: contact.phone,
          };
        })
      : undefined;

    // Preparar imagem/vídeo/anexo
    let imageUrl: string | undefined;
    let attachmentData: Message["attachment"] | undefined;

    if (messageAttachmentFile) {
      const fileUrl = URL.createObjectURL(messageAttachmentFile);
      if (messageAttachmentType === "image") {
        imageUrl = fileUrl;
      } else {
        attachmentData = {
          name: messageAttachmentFile.name,
          url: fileUrl,
          type: messageAttachmentFile.type,
          size: messageAttachmentFile.size,
        };
      }
    }

    // Criar nova mensagem
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "Você",
      content: trimmedText || (contactsToSend && contactsToSend.length > 0 ? `${contactsToSend.length} ${contactsToSend.length === 1 ? 'contato compartilhado' : 'contatos compartilhados'}` : ""),
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
      ...(imageUrl && { image: imageUrl }),
      ...(attachmentData && { attachment: attachmentData }),
      ...(contactsToSend && contactsToSend.length > 0 && { contacts: contactsToSend }),
    };

    // Adicionar mensagem ao chat
    setMessages([...messages, newMessage]);

    // Limpar estado
    setMessageText("");
    setMessageAttachmentFile(null);
    setMessageAttachmentType(null);
    setSelectedContacts([]);
    setContactPreviewData([]);
    setIsRewritten(false);
    setOriginalMessageText("");
    if (messageImageInputRef.current) messageImageInputRef.current.value = '';
    if (messageVideoInputRef.current) messageVideoInputRef.current.value = '';
    if (messageFileInputRef.current) messageFileInputRef.current.value = '';
  };

  const handleSaveNewQuickReply = () => {
    if (!newQuickReplyTitle.trim() || !newQuickReplyContent.trim()) {
      toast.error("Por favor, preencha pelo menos o título e o conteúdo.", {
        duration: 3000,
        closeButton: true,
      });
      return;
    }

    // Usar URL da imagem (seja de arquivo ou URL manual)
    const imageUrl = newQuickReplyImageFile 
      ? newQuickReplyImage 
      : newQuickReplyImage.trim();

    // Usar arquivo baseado no tipo escolhido
    const attachmentUrl = newQuickReplyAttachmentFile
      ? newQuickReplyAttachmentUrl
      : null;

    const attachmentName = newQuickReplyAttachmentFile
      ? newQuickReplyAttachmentFile.name
      : null;

    const newReply: typeof quickReplies[0] = {
      id: `quick-user-${Date.now()}`,
      title: newQuickReplyTitle.trim(),
      content: newQuickReplyContent.trim(),
      // Se o tipo escolhido for "image", salvar como imagem
      ...(newQuickReplyAttachmentType === "image" && attachmentUrl && { image: attachmentUrl }),
      // Se o tipo escolhido for "file" ou "video", salvar como anexo
      ...(newQuickReplyAttachmentType !== "image" && attachmentName && attachmentUrl && {
        attachment: {
          name: attachmentName,
          url: attachmentUrl,
          type: newQuickReplyAttachmentFile?.type || (newQuickReplyAttachmentType === "video" ? "video/mp4" : "application/octet-stream"),
          size: newQuickReplyAttachmentFile?.size,
        },
      }),
      // Se não houver arquivo anexado, usar a URL de imagem manual se existir
      ...(!newQuickReplyAttachmentFile && imageUrl && { image: imageUrl }),
    };

    setUserQuickReplies([...userQuickReplies, newReply]);
    
    // Limpar formulário
    setNewQuickReplyTitle("");
    setNewQuickReplyContent("");
    setNewQuickReplyImage("");
    setNewQuickReplyImageFile(null);
    setNewQuickReplyAttachmentName("");
    setNewQuickReplyAttachmentUrl("");
    setNewQuickReplyAttachmentFile(null);
    setNewQuickReplyAttachmentType("file");
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (attachmentInputRef.current) attachmentInputRef.current.value = '';
    setIsCreatingQuickReply(false);
    
    toast.success("Resposta rápida criada com sucesso!", {
      duration: 3000,
      closeButton: true,
    });
  };

  const handleCancelNewQuickReply = () => {
    setIsCreatingQuickReply(false);
    setNewQuickReplyTitle("");
    setNewQuickReplyContent("");
    setNewQuickReplyImage("");
    setNewQuickReplyImageFile(null);
    setNewQuickReplyAttachmentName("");
    setNewQuickReplyAttachmentUrl("");
    setNewQuickReplyAttachmentFile(null);
    setNewQuickReplyAttachmentType("file");
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (attachmentInputRef.current) attachmentInputRef.current.value = '';
  };

  useEffect(() => {
    if (conversation) {
      setAutomationEnabled(conversation.automationEnabled ?? false);
    }
  }, [conversation]);

  // Limpar estado quando o popover de respostas rápidas fechar
  useEffect(() => {
    if (!isQuickReplyPopoverOpen) {
      setIsCreatingQuickReply(false);
      setSelectedQuickReply(null);
      setQuickReplySearchQuery("");
      setNewQuickReplyTitle("");
      setNewQuickReplyContent("");
      setNewQuickReplyImage("");
      setNewQuickReplyImageFile(null);
      setNewQuickReplyAttachmentName("");
      setNewQuickReplyAttachmentUrl("");
      setNewQuickReplyAttachmentFile(null);
      setNewQuickReplyAttachmentType("file");
    }
  }, [isQuickReplyPopoverOpen]);

  const handleAssignUser = (assignmentId: string) => {
    if (!conversation || !onConversationUpdate) return;
    
    let assignTo = undefined;
    if (assignmentId.startsWith("user_")) {
      const userId = assignmentId.replace("user_", "");
      assignTo = allUsers.find(u => u.id === userId);
    } else if (assignmentId.startsWith("group_")) {
      const groupId = assignmentId.replace("group_", "");
      assignTo = allGroups.find(g => g.id === groupId);
    }
    // Se assignmentId === "", assignTo será undefined (não atribuído)

      onConversationUpdate(conversation.id, {
        assignedTo: assignTo ? {
          id: assignTo.id,
          name: assignTo.name,
          avatar: assignTo.avatar,
        } : undefined,
      });
    
    setIsAssignPopoverOpen(false);
  };

  const handleChangeStatus = (status: "open" | "closed") => {
    if (!conversation || !onConversationUpdate) return;
    
    onConversationUpdate(conversation.id, {
      status: status,
    });
    
    setIsStatusPopoverOpen(false);
  };

  const handleToggleAutomation = (enabled: boolean) => {
    if (!conversation || !onConversationUpdate) return;
    
    setAutomationEnabled(enabled);
      onConversationUpdate(conversation.id, {
      automationEnabled: enabled,
    });
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "open":
        return "Aberta";
      case "closed":
        return "Fechada";
      default:
        return "Aberta";
    }
  };

  const getStatusVariant = (status?: string): "default" | "secondary" => {
    switch (status) {
      case "open":
        return "default";
      case "closed":
        return "secondary";
      default:
        return "default";
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-2xl shadow-md h-full">
        <p className="text-muted-foreground">Selecione uma conversa para iniciar</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden rounded-2xl shadow-md h-full min-w-0">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0 min-w-0">
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          {onBack && (
            <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 md:hidden flex-shrink-0"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hidden md:flex flex-shrink-0"
                onClick={onBack}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          )}
          {conversation && (
            <Avatar className="h-8 w-8 flex-shrink-0">
              {(conversation as any).avatarImage ? (
                <AvatarImage src={(conversation as any).avatarImage} alt={conversation.name} />
              ) : null}
              <AvatarFallback className="bg-slate-500 text-white font-medium text-sm">
                {conversation.avatar}
              </AvatarFallback>
            </Avatar>
          )}
          <h2 className="font-semibold text-lg truncate">{conversationName}</h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
          {/* Botão de Automação */}
          <Popover open={isAutomationPopoverOpen} onOpenChange={setIsAutomationPopoverOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 relative ${
                        automationEnabled 
                          ? 'text-primary hover:bg-primary/10' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Bot className="h-4 w-4" />
                      {automationEnabled && (
                        <div className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-primary ring-1 ring-background" />
                      )}
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  {automationEnabled ? "Automação ativada - Clique para desativar" : "Automação desativada - Clique para ativar"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-[240px] p-3" align="end">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Bot className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <h4 className="text-sm font-semibold whitespace-nowrap">Automação</h4>
                  </div>
                  <Switch
                    checked={automationEnabled}
                    onCheckedChange={handleToggleAutomation}
                    className="flex-shrink-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {automationEnabled 
                    ? "Automação ativada para esta conversa"
                    : "Ative para habilitar respostas automáticas"}
                </p>
              </div>
            </PopoverContent>
          </Popover>

          {/* Badge/Botão de Status */}
          <Popover open={isStatusPopoverOpen} onOpenChange={setIsStatusPopoverOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Badge 
                      variant={getStatusVariant(conversation?.status)}
                      className="h-7 px-3 text-xs cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {getStatusLabel(conversation?.status)}
                    </Badge>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  Clique para alterar o status da conversa
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-[200px] p-3" align="end">
              <h4 className="text-sm font-semibold mb-2">Alterar status</h4>
              <div className="space-y-1">
                <div
                  className={`group flex items-center justify-between gap-2 py-1.5 px-2 rounded-md hover:bg-muted cursor-pointer ${
                    conversation?.status === "open" ? "bg-muted" : ""
                  }`}
                  onClick={() => handleChangeStatus("open")}
                >
                  <span className="text-xs">Aberta</span>
                  {conversation?.status === "open" && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div
                  className={`group flex items-center justify-between gap-2 py-1.5 px-2 rounded-md hover:bg-muted cursor-pointer ${
                    conversation?.status === "closed" ? "bg-muted" : ""
                  }`}
                  onClick={() => handleChangeStatus("closed")}
                >
                  <span className="text-xs">Fechada</span>
                  {conversation?.status === "closed" && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
        </div>
            </PopoverContent>
          </Popover>

          {/* Avatar do usuário atribuído */}
          <Popover open={isAssignPopoverOpen} onOpenChange={setIsAssignPopoverOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                    {conversation?.assignedTo ? (
                      <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all">
                        <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                          {conversation.assignedTo.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all border-2 border-dashed border-slate-300">
                        <AvatarFallback className="bg-slate-100 text-slate-400 text-xs">
                          <Users className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  {conversation?.assignedTo 
                    ? `Atribuído a ${conversation.assignedTo.name} - Clique para alterar`
                    : "Não atribuído - Clique para atribuir"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-[320px] p-0 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col" align="end">
              <div className="p-3 flex flex-col">
                <h4 className="text-sm font-semibold mb-2">Atribuir conversa</h4>
                <div className="space-y-2.5">
                  {/* Seção de Usuários */}
                  <div>
                    <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Usuários</h5>
                    <ScrollArea className="h-[140px] border rounded-md p-1.5">
                      <div className="space-y-1">
                        {/* Opção "Não atribuído" */}
                        <div
                          className="group flex items-center justify-between gap-2 py-1 px-1.5 rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => {
                            handleAssignUser("");
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                              <Users className="h-3 w-3 text-slate-400" />
                            </div>
                            <span className="text-xs text-muted-foreground">Não atribuído</span>
                          </div>
                          {!conversation?.assignedTo && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        {allUsers.map((user) => (
                          <div
                            key={user.id}
                            className="group flex items-center justify-between gap-2 py-1 px-1.5 rounded-md hover:bg-muted cursor-pointer"
                            onClick={() => {
                              handleAssignUser(`user_${user.id}`);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-slate-200 text-slate-700 text-[10px]">
                                  {user.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{user.name}</span>
                            </div>
                            {conversation?.assignedTo?.id === user.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Seção de Grupos */}
                  <div>
                    <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Grupos</h5>
                    <ScrollArea className="h-[80px] border rounded-md p-1.5">
                      <div className="space-y-1">
                        {/* Opção "Não atribuído" */}
                        <div
                          className="group flex items-center justify-between gap-2 py-1 px-1.5 rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => {
                            handleAssignUser("");
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                              <Users className="h-3 w-3 text-slate-400" />
                            </div>
                            <span className="text-xs text-muted-foreground">Não atribuído</span>
                          </div>
                          {!conversation?.assignedTo && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        {allGroups.map((group) => (
                          <div
                            key={group.id}
                            className="group flex items-center justify-between gap-2 py-1 px-1.5 rounded-md hover:bg-muted cursor-pointer"
                            onClick={() => {
                              handleAssignUser(`group_${group.id}`);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-slate-200 text-slate-700 text-[10px]">
                                  {group.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{group.name}</span>
                            </div>
                            {conversation?.assignedTo?.id === group.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full px-6 pt-6 pb-0">
        <div className="space-y-4">
          {messages.map((message) => {
            if (message.isSummary) {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="max-w-[90%] lg:max-w-[80%] w-full">
                    <div className="flex items-center gap-2 mb-2 justify-center">
                      <span className="text-xs font-semibold">{message.sender}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg px-5 py-4 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Resumo da última conversa</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] lg:max-w-[60%]`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{message.sender}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.content && (
                      <p className={`text-sm ${message.image || message.attachment || (message.contacts && message.contacts.length > 0) ? 'mb-2' : ''}`}>{message.content}</p>
                    )}
                    
                    {/* Renderizar imagem se presente */}
                    {message.image && (
                      <div className={`rounded-md overflow-hidden ${message.attachment || (message.contacts && message.contacts.length > 0) ? 'mb-2' : ''}`}>
                        <img 
                          src={message.image} 
                          alt="Imagem da mensagem"
                          className="w-full h-auto max-h-[300px] object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Renderizar anexo se presente */}
                    {message.attachment && (
                      <div className={`${message.content || message.image ? 'mt-2' : ''} ${(message.contacts && message.contacts.length > 0) ? 'mb-2' : ''} p-2 rounded-md flex items-center gap-2 ${
                        message.isUser
                          ? 'bg-blue-600/50'
                          : 'bg-background/50'
                      }`}>
                        <Paperclip className={`h-4 w-4 flex-shrink-0 ${
                          message.isUser ? 'text-white' : 'text-muted-foreground'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            message.isUser ? 'text-white' : 'text-foreground'
                          }`}>
                            {message.attachment.name}
                          </p>
                          {message.attachment.size && (
                            <p className={`text-xs ${
                              message.isUser ? 'text-blue-100' : 'text-muted-foreground'
                            }`}>
                              {(message.attachment.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Renderizar contatos se presente - Estilo WhatsApp */}
                    {message.contacts && message.contacts.length > 0 && (
                      <div className={`${message.content || message.image || message.attachment ? 'mt-2' : ''}`}>
                        {message.contacts.length === 1 ? (
                          // Se houver apenas 1 contato, toda a área é clicável
                          <button
                            onClick={() => {
                              setSelectedContactDetail(message.contacts[0]);
                              setIsContactDetailOpen(true);
                            }}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              message.isUser
                                ? 'bg-white/10 dark:bg-white/5 hover:bg-white/15 dark:hover:bg-white/10'
                                : 'bg-muted/50 hover:bg-muted/70'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 flex-shrink-0">
                                <AvatarFallback className={`text-xs ${
                                  message.isUser
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {message.contacts[0].avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  message.isUser ? 'text-white' : 'text-foreground'
                                }`}>
                                  {message.contacts[0].name}
                                </p>
                              </div>
                            </div>
                          </button>
                        ) : (
                          // Se houver múltiplos contatos, mostrar avatares sobrepostos e "Ver todos"
                          <button
                            onClick={() => {
                              setViewAllContactsData(message.contacts || []);
                              setIsViewAllContactsOpen(true);
                            }}
                            className={`w-full p-2.5 rounded-lg text-left transition-colors ${
                              message.isUser
                                ? 'bg-muted hover:bg-muted/80'
                                : 'bg-muted/50 hover:bg-muted/70'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {/* Avatares empilhados horizontalmente */}
                              <div className="relative flex-shrink-0 flex items-center" style={{ width: `${32 + (Math.min(message.contacts.length, 3) - 1) * 8}px`, height: '32px' }}>
                                {message.contacts.slice(0, Math.min(message.contacts.length, 3)).map((contact, index) => (
                                  <Avatar
                                    key={contact.id}
                                    className="absolute rounded-full border-2 border-white dark:border-gray-800"
                                    style={{
                                      left: `${index * 8}px`,
                                      width: '32px',
                                      height: '32px',
                                      zIndex: Math.min(message.contacts.length, 3) - index,
                                    }}
                                  >
                                    <AvatarFallback className={`text-xs flex items-center justify-center ${
                                      message.isUser
                                        ? 'bg-slate-200 text-slate-700'
                                        : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {contact.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  message.isUser ? 'text-foreground' : 'text-foreground'
                                }`}>
                                  {message.contacts.length === 1
                                    ? message.contacts[0].name
                                    : `${message.contacts[0].name} e outros ${message.contacts.length - 1} ${message.contacts.length - 1 === 1 ? 'contato' : 'contatos'}`
                                  }
                                </p>
                                <p className={`text-xs mt-0.5 font-medium ${
                                  message.isUser
                                    ? 'text-primary'
                                    : 'text-primary'
                                }`}>
                                  Ver todos
                                </p>
                              </div>
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  </div>
                </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      </div>

      {/* Action Bar */}
      <div className="border-t flex-shrink-0 relative">
        {/* Botões de ação rápida */}
        <div className="px-4 py-2 flex items-center gap-2">
          {requiresMessageTemplate && (
            <Popover 
              open={isMessageTemplatePopoverOpen} 
              onOpenChange={(open) => {
                setIsMessageTemplatePopoverOpen(open);
                if (!open) {
                  setSelectedTemplate(null);
                  setTemplateSearchQuery("");
                }
              }}
            >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileTextIcon className="h-4 w-4" />
                  </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                  <TooltipContent>Modelo de Mensagem</TooltipContent>
              </Tooltip>
            </TooltipProvider>
              <PopoverContent 
                className="w-[400px] p-0 max-h-[444px] flex flex-col overflow-hidden" 
                align="start"
                side="top"
                sideOffset={12}
                collisionPadding={32}
                avoidCollisions={true}
              >
                <div className="p-4 border-b flex-shrink-0">
                  <h4 className="text-sm font-semibold mb-2">Modelos de Mensagem</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Clique em um modelo para visualizar e enviar
                  </p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar modelos..."
                      value={templateSearchQuery}
                      onChange={(e) => setTemplateSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
                <ScrollArea className="h-[calc(444px-140px)]">
                  <div className="p-2 pr-4">
                    {selectedTemplate ? (
                      <div className="space-y-3 p-1">
                        <div className="p-3 bg-muted rounded-md overflow-hidden">
                          <p className="text-sm font-medium mb-2 break-words">{selectedTemplate.title}</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words overflow-wrap-anywhere">{selectedTemplate.content}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedTemplate(null);
                              setTemplateSearchQuery("");
                            }}
                          >
                            Voltar
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={handleSendTemplate}
                          >
                            Enviar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filteredTemplates.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            Nenhum modelo encontrado
                          </div>
                        ) : (
                          filteredTemplates.map((template) => (
                            <div
                              key={template.id}
                              className="p-2 rounded-md hover:bg-muted cursor-pointer transition-colors overflow-hidden"
                              onClick={() => handleSelectTemplate(template)}
                            >
                              <p className="text-sm font-medium break-words">{template.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 break-words overflow-wrap-anywhere">
                                {template.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}

          {/* Dialog de preview do modelo */}
          <Dialog open={isTemplatePreviewOpen} onOpenChange={setIsTemplatePreviewOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedTemplate?.title}</DialogTitle>
                <DialogDescription>
                  Preview da mensagem que será enviada
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="p-4 bg-muted rounded-lg border">
                  <p className="text-sm whitespace-pre-wrap">{selectedTemplate?.content}</p>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsTemplatePreviewOpen(false)}
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedTemplate) {
                        handleSendTemplate();
                        setIsTemplatePreviewOpen(false);
                      }
                    }}
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Botão de IA - disponível em todas as conversas */}
          <DropdownMenu open={isAIDropdownOpen} onOpenChange={setIsAIDropdownOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button ref={aiButtonRef} variant="ghost" size="icon" className="h-8 w-8">
                      <Sparkles className="h-4 w-4" />
                </Button>
                  </DropdownMenuTrigger>
              </TooltipTrigger>
                <TooltipContent>IA</TooltipContent>
            </Tooltip>
          </TooltipProvider>
            <DropdownMenuContent align="start">
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  setIsAIDropdownOpen(false);
                  const trimmedText = messageText.trim();
                  
                  // Validação inicial antes de abrir o diálogo
                  if (!trimmedText) {
                    toast.error("Por favor, escreva uma mensagem na caixa de texto antes de reescrever.", {
                      duration: 4000,
                      closeButton: true,
                    });
                    return;
                  }
                  
                  if (trimmedText.length < 3) {
                    toast.error("A mensagem precisa ter pelo menos 3 caracteres para ser reescrita.", {
                      duration: 3000,
                      closeButton: true,
                    });
                    return;
                  }
                  
                  if (trimmedText.length > 5000) {
                    toast.error("A mensagem é muito longa. Por favor, reduza para no máximo 5000 caracteres.", {
                      duration: 4000,
                      closeButton: true,
                    });
                    return;
                  }
                  
                  const hasLetters = /[a-zA-ZÀ-ÿ]/.test(trimmedText);
                  if (!hasLetters) {
                    toast.error("A mensagem precisa conter pelo menos uma letra para ser reescrita.", {
                      duration: 3000,
                      closeButton: true,
                    });
                    return;
                  }
                  
                  setIsRewritePopoverOpen(true);
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Reescrever mensagem
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  setIsAIDropdownOpen(false);
                  handleSummarizeConversation();
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Resumir conversa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog de opções de reescrita */}
          <Dialog open={isRewritePopoverOpen} onOpenChange={setIsRewritePopoverOpen}>
            <DialogContent className="w-[320px] p-0">
              <DialogHeader className="p-4 pb-3">
                <DialogTitle className="text-base">Como deseja reescrever?</DialogTitle>
              </DialogHeader>
              <div className="px-4 pb-4 space-y-1">
                <div
                  className="p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => {
                    setIsRewritePopoverOpen(false);
                    setTimeout(() => handleRewrite("grammar"), 0);
                  }}
                >
                  <p className="text-sm font-medium">Corrigir gramática</p>
                  <p className="text-xs text-muted-foreground">Ajustar erros ortográficos e gramaticais</p>
                </div>
                <div
                  className="p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => {
                    setIsRewritePopoverOpen(false);
                    setTimeout(() => handleRewrite("formal"), 0);
                  }}
                >
                  <p className="text-sm font-medium">Mais formal</p>
                  <p className="text-xs text-muted-foreground">Tornar a mensagem mais profissional</p>
                </div>
                <div
                  className="p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => {
                    setIsRewritePopoverOpen(false);
                    setTimeout(() => handleRewrite("friendly"), 0);
                  }}
                >
                  <p className="text-sm font-medium">Mais amigável</p>
                  <p className="text-xs text-muted-foreground">Tornar a mensagem mais calorosa e próxima</p>
                </div>
                <div
                  className="p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => {
                    setIsRewritePopoverOpen(false);
                    setTimeout(() => handleRewrite("concise"), 0);
                  }}
                >
                  <p className="text-sm font-medium">Mais concisa</p>
                  <p className="text-xs text-muted-foreground">Reduzir o tamanho mantendo o sentido</p>
                </div>
                <div
                  className="p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => {
                    setIsRewritePopoverOpen(false);
                    setTimeout(() => handleRewrite("clear"), 0);
                  }}
                >
                  <p className="text-sm font-medium">Mais clara</p>
                  <p className="text-xs text-muted-foreground">Simplificar e melhorar a compreensão</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Botão de Respostas Rápidas - disponível em todas as conversas */}
          <Popover open={isQuickReplyPopoverOpen} onOpenChange={setIsQuickReplyPopoverOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Zap className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Respostas rápidas</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent 
              className="w-[400px] p-0 max-h-[444px] flex flex-col overflow-hidden" 
              align="start"
              side="top"
              sideOffset={12}
              collisionPadding={32}
              avoidCollisions={true}
            >
              <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Respostas Rápidas</h4>
                  {!isCreatingQuickReply && !selectedQuickReply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        setIsCreatingQuickReply(true);
                        setSelectedQuickReply(null);
                        setQuickReplySearchQuery("");
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </Button>
                  )}
                </div>
                {!isCreatingQuickReply && (
                  <>
                    <p className="text-xs text-muted-foreground mb-3">
                      Clique em uma resposta para visualizar e enviar
                    </p>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar respostas..."
                        value={quickReplySearchQuery}
                        onChange={(e) => setQuickReplySearchQuery(e.target.value)}
                        className="pl-9 h-9"
                      />
                    </div>
                  </>
                )}
              </div>
              <ScrollArea className="h-[calc(444px-140px)]">
                <div className="p-2 pr-4">
                  {isCreatingQuickReply ? (
                    <div className="space-y-3 p-1">
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs font-medium mb-1 block">Título *</label>
                          <Input
                            placeholder="Ex: Obrigado"
                            value={newQuickReplyTitle}
                            onChange={(e) => setNewQuickReplyTitle(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Conteúdo *</label>
                          <textarea
                            placeholder="Digite o conteúdo da resposta rápida..."
                            value={newQuickReplyContent}
                            onChange={(e) => setNewQuickReplyContent(e.target.value)}
                            className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-none"
                          />
                        </div>
                        <div className="-mt-1">
                          <label className="text-xs font-medium mb-1 block">Arquivo</label>
                          <input
                            type="file"
                            ref={attachmentInputRef}
                            onChange={handleAttachmentFileChange}
                            className="hidden"
                            id="quick-reply-attachment-input"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 w-full justify-start"
                            onClick={() => attachmentInputRef.current?.click()}
                          >
                            <Paperclip className="h-4 w-4 mr-2" />
                            <span className="truncate flex-1 text-left">
                              {newQuickReplyAttachmentFile ? newQuickReplyAttachmentFile.name : "Selecionar arquivo"}
                            </span>
                          </Button>
                          {newQuickReplyAttachmentFile && (
                            <div className="flex items-center justify-between mt-2 p-2 bg-muted rounded-md">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm text-muted-foreground truncate flex-1">
                                  {newQuickReplyAttachmentFile.name}
                                </span>
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  ({(newQuickReplyAttachmentFile.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                        </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-2 flex-shrink-0"
                                onClick={() => {
                                  setNewQuickReplyAttachmentFile(null);
                                  setNewQuickReplyAttachmentName("");
                                  setNewQuickReplyAttachmentUrl("");
                                  setNewQuickReplyAttachmentType("file");
                                  if (attachmentInputRef.current) {
                                    attachmentInputRef.current.value = '';
                                  }
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                        </div>
                          )}
                        </div>
                        {newQuickReplyAttachmentFile && (
                          <div>
                            <label className="text-xs font-medium mb-1 block">Enviar como</label>
                            <Select value={newQuickReplyAttachmentType} onValueChange={(value) => setNewQuickReplyAttachmentType(value as "file" | "image" | "video")}>
                              <SelectTrigger className="h-9 w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="file">Arquivo</SelectItem>
                                <SelectItem value="image">Imagem</SelectItem>
                                <SelectItem value="video">Vídeo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={handleCancelNewQuickReply}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={handleSaveNewQuickReply}
                        >
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ) : selectedQuickReply ? (
                    <div className="space-y-3 p-1">
                      <div className="p-3 bg-muted rounded-md overflow-hidden">
                        <p className="text-sm font-medium mb-2 break-words">{selectedQuickReply.title}</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words overflow-wrap-anywhere mb-2">{selectedQuickReply.content}</p>
                        
                        {/* Preview de imagem */}
                        {selectedQuickReply.image && (
                          <div className="mt-3 rounded-md overflow-hidden border">
                            <img 
                              src={selectedQuickReply.image} 
                              alt={selectedQuickReply.title}
                              className="w-full h-auto max-h-[200px] object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Preview de anexo */}
                        {selectedQuickReply.attachment && (
                          <div className="mt-3 p-2 bg-background border rounded-md flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{selectedQuickReply.attachment.name}</p>
                              {selectedQuickReply.attachment.size && (
                                <p className="text-xs text-muted-foreground">
                                  {(selectedQuickReply.attachment.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedQuickReply(null);
                            setQuickReplySearchQuery("");
                          }}
                        >
                          Voltar
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={handleSendQuickReply}
                        >
                          Enviar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredQuickReplies.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Nenhuma resposta encontrada
                        </div>
                      ) : (
                        filteredQuickReplies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-2 rounded-md hover:bg-muted cursor-pointer transition-colors overflow-hidden"
                            onClick={() => handleSelectQuickReply(reply)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium break-words">{reply.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 break-words overflow-wrap-anywhere">
                                  {reply.content}
                                </p>
                              </div>
                              {(reply.image || reply.attachment) && (
                                <div className="flex-shrink-0">
                                  {reply.image && (
                                    <div className="w-12 h-12 rounded-md overflow-hidden border">
                                      <img 
                                        src={reply.image} 
                                        alt={reply.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  )}
                                  {reply.attachment && (
                                    <div className="w-12 h-12 rounded-md border flex items-center justify-center bg-muted">
                                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Popover open={isAttachmentPopoverOpen} onOpenChange={setIsAttachmentPopoverOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                  </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Anexar arquivo</TooltipContent>
            </Tooltip>
          </TooltipProvider>
            <PopoverContent 
              className="w-[160px] p-1" 
              align="start"
              side="top"
              sideOffset={8}
            >
              <div className="flex flex-col gap-0.5">
                <input
                  type="file"
                  ref={messageImageInputRef}
                  onChange={handleMessageImageChange}
                  accept="image/*"
                  className="hidden"
                  id="message-image-input"
                />
                <input
                  type="file"
                  ref={messageVideoInputRef}
                  onChange={handleMessageVideoChange}
                  accept="video/*"
                  className="hidden"
                  id="message-video-input"
                />
                <input
                  type="file"
                  ref={messageFileInputRef}
                  onChange={handleMessageFileChange}
                  className="hidden"
                  id="message-file-input"
                  // Sem accept para aceitar todos os tipos de arquivo
                />
                
                <button
                  onClick={() => messageImageInputRef.current?.click()}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors w-full"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Image className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium">Fotos</span>
                </button>

                <button
                  onClick={() => messageVideoInputRef.current?.click()}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors w-full"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Video className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">Vídeo</span>
                </button>

                <button
                  onClick={() => messageFileInputRef.current?.click()}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors w-full"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">Documento</span>
                </button>

                <button
                  onClick={handleSelectContact}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors w-full"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-sm font-medium">Contato</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Dialog de Seleção de Contato */}
          <Dialog open={isContactDialogOpen} onOpenChange={(open) => {
            setIsContactDialogOpen(open);
            if (!open) {
              setSelectedContacts([]);
            }
          }}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Selecionar contato</DialogTitle>
                <DialogDescription>
                  Escolha um contato para enviar
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] border rounded-md">
                <div className="p-2">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 py-1.5 px-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <Checkbox
                        id={`contact-${user.id}`}
                        checked={selectedContacts.includes(user.id)}
                        onCheckedChange={() => handleToggleContact(user.id)}
                        className="cursor-pointer"
                      />
                      <label
                        htmlFor={`contact-${user.id}`}
                        className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">{user.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsContactDialogOpen(false);
                    setSelectedContacts([]);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmContact}
                  disabled={selectedContacts.length === 0}
                >
                  Enviar {selectedContacts.length > 0 && `(${selectedContacts.length})`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

           {/* Dialog de Confirmação de Contatos */}
           <Dialog open={isContactConfirmDialogOpen} onOpenChange={(open) => {
             setIsContactConfirmDialogOpen(open);
             if (!open) {
               setContactPreviewData([]);
               setSelectedContacts([]);
               setMessageAttachmentType(null);
             }
           }}>
             <DialogContent className={`sm:max-w-[500px] ${contactPreviewData.length <= 3 ? 'gap-2 pb-4' : ''}`}>
               <DialogHeader className={contactPreviewData.length <= 3 ? 'pb-2' : ''}>
                 <DialogTitle>Confirmar contatos</DialogTitle>
                 <DialogDescription>
                   Revise as informações dos contatos antes de enviar
                 </DialogDescription>
               </DialogHeader>
               {contactPreviewData.length <= 3 ? (
                 <div className="border rounded-md">
                   <div className="p-2 space-y-2">
                     {contactPreviewData.map((contact) => {
                       const originalUser = allUsers.find(u => u.id === contact.id);
                       return (
                         <div
                           key={contact.id}
                           className="p-3 border rounded-lg"
                         >
                           <div className="flex items-center gap-3">
                             <Avatar className="h-10 w-10 flex-shrink-0">
                               <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                                 {originalUser?.avatar || "?"}
                               </AvatarFallback>
                             </Avatar>
                             <div className="flex-1 min-w-0">
                               <p className="text-sm font-semibold text-foreground truncate">
                                 {contact.name}
                               </p>
                               <p className="text-xs text-muted-foreground mt-0.5">
                                 {contact.phone}
                               </p>
                             </div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </div>
               ) : (
                 <ScrollArea className="h-[400px] border rounded-md">
                   <div className="p-2 space-y-2">
                     {contactPreviewData.map((contact) => {
                       const originalUser = allUsers.find(u => u.id === contact.id);
                       return (
                         <div
                           key={contact.id}
                           className="p-3 border rounded-lg"
                         >
                           <div className="flex items-center gap-3">
                             <Avatar className="h-10 w-10 flex-shrink-0">
                               <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                                 {originalUser?.avatar || "?"}
                               </AvatarFallback>
                             </Avatar>
                             <div className="flex-1 min-w-0">
                               <p className="text-sm font-semibold text-foreground truncate">
                                 {contact.name}
                               </p>
                               <p className="text-xs text-muted-foreground mt-0.5">
                                 {contact.phone}
                               </p>
                             </div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </ScrollArea>
               )}
               <DialogFooter className={contactPreviewData.length <= 3 ? 'mt-2 pt-2' : ''}>
                 <Button
                   variant="outline"
                   onClick={() => {
                     setIsContactConfirmDialogOpen(false);
                     setIsContactDialogOpen(true);
                     // Manter os contatos selecionados para o usuário poder ajustar
                   }}
                 >
                   Voltar
                 </Button>
                 <Button
                   onClick={handleSendContacts}
                   disabled={contactPreviewData.length === 0}
                 >
                   Enviar
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>

          {/* Dialog Ver Todos os Contatos */}
          <Dialog open={isViewAllContactsOpen} onOpenChange={setIsViewAllContactsOpen}>
            <DialogContent className={`sm:max-w-[400px] ${viewAllContactsData.length <= 3 ? 'gap-2 pb-4' : ''}`}>
              <DialogHeader className={viewAllContactsData.length <= 3 ? 'pb-2' : ''}>
                <DialogTitle>Contatos compartilhados</DialogTitle>
                <DialogDescription>
                  Clique em um contato para ver os detalhes
                </DialogDescription>
              </DialogHeader>
               <ScrollArea className={`border rounded-md ${viewAllContactsData.length <= 3 ? 'h-auto max-h-[300px]' : 'h-[400px]'}`}>
                 <div className="p-2">
                   {viewAllContactsData.map((contact) => (
                     <button
                       key={contact.id}
                       onClick={() => {
                         setSelectedContactDetail(contact);
                         setIsViewAllContactsOpen(false);
                         setIsContactDetailOpen(true);
                       }}
                       className="w-full flex items-center gap-3 py-2 px-2 rounded-md hover:bg-muted transition-colors text-left"
                     >
                       <Avatar className="h-10 w-10 flex-shrink-0">
                         <AvatarFallback className="bg-slate-200 text-slate-700">
                           {contact.avatar}
                         </AvatarFallback>
                       </Avatar>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-medium truncate">{contact.name}</p>
                         <p className="text-xs text-muted-foreground truncate">{contact.phone}</p>
                       </div>
                     </button>
                   ))}
                 </div>
               </ScrollArea>
              <DialogFooter className={viewAllContactsData.length <= 3 ? 'mt-2 pt-2' : ''}>
                <Button onClick={() => setIsViewAllContactsOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog Detalhes do Contato */}
          <Dialog open={isContactDetailOpen} onOpenChange={setIsContactDetailOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Detalhes do contato</DialogTitle>
              </DialogHeader>
              {selectedContactDetail && (
                <div className="flex flex-col items-center gap-4 py-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-slate-200 text-slate-700 text-2xl">
                      {selectedContactDetail.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-1">
                    <p className="text-lg font-semibold">{selectedContactDetail.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedContactDetail.phone}</p>
                  </div>
                </div>
              )}
              <DialogFooter>
                {selectedContactDetail && (
                  <>
                    {savedContacts.includes(selectedContactDetail.id) ? (
                      <Button
                        onClick={() => {
                          if (onNavigateToConversation && selectedContactDetail.phone) {
                            onNavigateToConversation(selectedContactDetail.name, selectedContactDetail.phone);
                            setIsContactDetailOpen(false);
                          } else {
                            toast.info("Funcionalidade de conversar será implementada", {
                              duration: 2000,
                            });
                            setIsContactDetailOpen(false);
                          }
                        }}
                        className="w-full sm:w-auto"
                      >
                        Conversar
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setSavedContacts(prev => [...prev, selectedContactDetail.id]);
                          toast.success("Contato salvo!", {
                            duration: 2000,
                          });
                        }}
                        className="w-full sm:w-auto"
                      >
                        Salvar contato
                      </Button>
                    )}
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Popover open={isEmojiPopoverOpen} onOpenChange={setIsEmojiPopoverOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4" />
                </Button>
                  </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Escolher emoji</TooltipContent>
            </Tooltip>
          </TooltipProvider>
            <PopoverContent 
              className="w-auto p-0 border-0 shadow-lg" 
              align="start"
              side="top"
              sideOffset={8}
            >
              <EmojiPicker
                onEmojiSelect={(emoji) => {
                  setMessageText((prev) => prev + emoji);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Botão de Anotações */}
          <AnnotationsDrawer
            conversationId={conversationId}
            annotations={annotations}
            tooltip="Notas e Lembretes"
            onCreateAnnotation={(annotationData) => {
              const newAnnotation: Annotation = {
                id: `ann-${Date.now()}`,
                ...annotationData,
                createdAt: new Date().toISOString(),
                createdBy: {
                  id: "user1",
                  name: "June Jensen",
                  avatar: "JJ",
                },
              };
              setAnnotations((prev) => [...prev, newAnnotation]);
            }}
            onUpdateAnnotation={(id, updates) => {
              setAnnotations((prev) =>
                prev.map((ann) => (ann.id === id ? { ...ann, ...updates } : ann))
              );
            }}
            onDeleteAnnotation={(id) => {
              setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
            }}
          />
        </div>

        <Separator />

        {/* Input Area */}
        <div className="p-4 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            {isRewritten && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 flex-shrink-0"
                      onClick={handleRevertRewrite}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reverter para mensagem original</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Input
              placeholder="Digite sua mensagem..."
              className="flex-1 h-10 min-w-0"
              value={messageText}
              onChange={(e) => {
                if (requiresMessageTemplate) {
                  toast.info("Esta conversa requer o uso de um modelo de mensagem aprovado. Clique no botão de modelo de mensagem para selecionar um modelo.", {
                    duration: 4000,
                    closeButton: true,
                  });
                  return;
                }
                // Se o usuário editar manualmente após reescrita, resetar o estado
                if (isRewritten) {
                  setIsRewritten(false);
                  setOriginalMessageText("");
                }
                setMessageText(e.target.value);
              }}
              onFocus={(e) => {
                if (requiresMessageTemplate) {
                  e.target.blur();
                  toast.info("Esta conversa requer o uso de um modelo de mensagem aprovado. Clique no botão de modelo de mensagem para selecionar um modelo.", {
                    duration: 4000,
                    closeButton: true,
                  });
                }
              }}
              onKeyDown={(e) => {
                if (requiresMessageTemplate) {
                  e.preventDefault();
                  toast.info("Esta conversa requer o uso de um modelo de mensagem aprovado. Clique no botão de modelo de mensagem para selecionar um modelo.", {
                    duration: 4000,
                    closeButton: true,
                  });
                  return;
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!requiresMessageTemplate) {
                    handleSendMessage();
                  }
                }
              }}
            />

            {/* Botão de gravar áudio */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10"
                    onClick={() => {
                      if (requiresMessageTemplate) {
                        toast.info("Esta conversa requer o uso de um modelo de mensagem aprovado. Clique no botão de modelo de mensagem para selecionar um modelo.", {
                          duration: 4000,
                          closeButton: true,
                        });
                      }
                    }}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {requiresMessageTemplate ? "Use um modelo de mensagem primeiro" : "Gravar áudio"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Botão de enviar */}
            <Button 
              size="icon" 
              className="h-10 w-10 rounded-full flex-shrink-0"
              onClick={() => {
                if (requiresMessageTemplate) {
                  toast.info("Esta conversa requer o uso de um modelo de mensagem aprovado. Clique no botão de modelo de mensagem para selecionar um modelo.", {
                    duration: 4000,
                    closeButton: true,
                  });
                  return;
                }
                handleSendMessage();
              }}
              disabled={!messageText.trim() && !messageAttachmentFile && contactPreviewData.length === 0}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

