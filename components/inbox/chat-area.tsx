"use client";

import { useState, useEffect, useRef } from "react";
import { Smile, Paperclip, ArrowUp, Zap, ArrowLeft, Users, Check, CheckCheck, ChevronLeft, Bot, Sparkles, Mic, FileText, MessageSquare, FileText as FileTextIcon, Search, RotateCcw, Plus, X, Image, Video, User, Pause, Play, ExternalLink, MoreVertical, Star, Forward, Trash2, Reply, Copy, CheckSquare, AlertTriangle, WifiOff, AlertCircle, Square, Languages } from "lucide-react";
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
import { loadMessages, saveMessages } from "@/lib/storage";
import { Conversation, Message, Annotation, MessageStatus } from "@/types/inbox";
import { toast } from "sonner";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { AnnotationsDrawer } from "@/components/inbox/annotations-drawer";
import { canUserRespond, CURRENT_USER, isConversationAssignedToMe } from "@/lib/user-config";

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

// Componente de preview de áudio gravado - estilo WhatsApp
function RecordedAudioPreview({ 
  audioUrl, 
  duration, 
  onCancel, 
  onSend 
}: { 
  audioUrl: string; 
  duration: number; 
  onCancel: () => void; 
  onSend: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Criar elemento de áudio quando o componente montar
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mb-2 p-3 bg-muted rounded-lg border flex items-center gap-3">
      <button
        type="button"
        className="h-10 w-10 rounded-full flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-sm"
        onClick={togglePlay}
        style={{ backgroundColor: '#3b82f6' }}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="relative h-1 bg-muted-foreground/20 rounded-full overflow-hidden mb-1">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatTime(currentTime || 0)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="h-8 w-8 rounded-full flex-shrink-0"
          onClick={onSend}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Componente para exibir status da mensagem com tooltip
function MessageStatusIndicator({ status, isUser }: { status?: MessageStatus; isUser: boolean }) {
  if (!status || !isUser) return null;

  const getStatusConfig = () => {
    switch (status) {
      case "sent":
        return {
          icon: Check,
          color: "text-muted-foreground",
          tooltip: "Mensagem enviada",
        };
      case "delivered":
        return {
          icon: CheckCheck,
          color: "text-muted-foreground",
          tooltip: "Mensagem entregue",
        };
      case "read":
        return {
          icon: CheckCheck,
          color: "text-blue-500",
          tooltip: "Mensagem lida",
        };
      case "error_internet":
        return {
          icon: Check,
          color: "text-muted-foreground",
          tooltip: "Erro de conexão: A mensagem não chegou ao destino. Verifique sua conexão com a internet e tente novamente.",
        };
      case "error_credits":
        return {
          icon: AlertCircle,
          color: "text-red-500",
          tooltip: "Falta de créditos: Não há créditos suficientes na Gupshup. Entre em contato com o administrador para recarregar os créditos.",
        };
      case "error_app_down":
        return {
          icon: Check,
          color: "text-muted-foreground",
          tooltip: "App Clinia fora do ar: O serviço está temporariamente indisponível. Tente novamente em alguns instantes.",
        };
      case "error_24h_window":
        return {
          icon: Check,
          color: "text-muted-foreground",
          tooltip: "Fora da janela de 24h: Esta conversa não está mais ativa. Você precisa enviar um modelo de mensagem aprovado primeiro e aguardar a resposta do cliente antes de poder escrever livremente.",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-pointer">
            <Icon className={`h-3 w-3 ${config.color}`} />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center"
          className="max-w-[250px] w-max px-3 py-2 text-xs leading-relaxed"
          sideOffset={4}
        >
          <p className="whitespace-normal break-words text-left">{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Componente de player de áudio estilo WhatsApp
function AudioPlayer({ 
  src, 
  duration, 
  isUser, 
  transcription
}: { 
  src: string; 
  duration: number; 
  isUser: boolean;
  transcription?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const speedOptions = [1, 1.5, 2];

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error("Erro ao reproduzir áudio:", error);
        toast.error("Não foi possível reproduzir o áudio. Verifique se o arquivo está disponível.");
      }
    }
  };

  const toggleSpeed = () => {
    if (audioRef.current) {
      // Encontrar o índice atual e ir para o próximo
      const currentIndex = speedOptions.indexOf(playbackRate);
      const nextIndex = (currentIndex + 1) % speedOptions.length;
      const nextSpeed = speedOptions[nextIndex];
      
      audioRef.current.playbackRate = nextSpeed;
      setPlaybackRate(nextSpeed);
    }
  };

  // Função para atualizar posição do áudio ao clicar na barra
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || !duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Efeito para configurar o elemento de áudio quando o src muda
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    // Resetar estado quando o src muda
    setIsPlaying(false);
    setCurrentTime(0);

    // Definir o src e carregar
    const setAudioSrc = async () => {
      try {
        if (audio.src !== src) {
          audio.src = src;
          await audio.load();
        }
        // Definir velocidade inicial
        audio.playbackRate = playbackRate;
      } catch (error) {
        console.error("Erro ao carregar áudio:", error);
      }
    };

    setAudioSrc();
  }, [src, playbackRate]);

  // Efeito para configurar event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handlePlay = () => {
      setIsPlaying(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
    };
    const handleError = (e: Event) => {
      console.error("Erro no elemento de áudio:", e);
      setIsPlaying(false);
      const error = (e.target as HTMLAudioElement).error;
      if (error) {
        console.error("Código de erro:", error.code, "Mensagem:", error.message);
      }
    };
    const handleLoadedMetadata = () => {
      // Garantir que a velocidade está definida quando os metadados carregam
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
      }
    };
    const handleCanPlay = () => {
      // Áudio está pronto para reproduzir
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [playbackRate, isDragging]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-2 min-w-[200px] max-w-[300px] relative">
      <div className="flex items-center gap-2">
      <button
        onClick={togglePlay}
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-primary/10 hover:bg-primary/20 text-primary'
        } transition-colors`}
      >
        {isPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ transform: 'translateX(1px)' }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        {/* Barra de progresso clicável */}
        <div 
          ref={progressBarRef}
          className="relative h-2 bg-white/20 dark:bg-black/20 rounded-full overflow-hidden cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div
            className={`absolute top-0 left-0 h-full ${
              isUser ? 'bg-white' : 'bg-primary'
            } transition-all duration-100`}
            style={{ width: `${progress}%` }}
          />
          {/* Indicador de posição (aparece no hover) */}
          <div
            className={`absolute top-0 h-full w-1 ${
              isUser ? 'bg-white' : 'bg-primary'
            } opacity-0 group-hover:opacity-100 transition-opacity`}
            style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
          />
        </div>
        <div className={`flex items-center justify-between mt-1 text-xs ${
          isUser ? 'text-white/80' : 'text-muted-foreground'
        }`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      {/* Botão de velocidade */}
      <button
        onClick={toggleSpeed}
        className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 w-[36px] text-center ${
          isUser
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-primary/10 hover:bg-primary/20 text-primary'
        } transition-colors`}
        style={{ width: '36px' }}
      >
        {playbackRate}x
      </button>
      <audio 
        ref={audioRef} 
        src={src} 
        preload="auto"
      />
      </div>
      {/* Transcrição - aparece quando disponível */}
      {transcription && (
        <div className={`text-xs px-2 py-1.5 rounded ${
          isUser 
            ? 'bg-white/10 text-white/90' 
            : 'bg-muted text-muted-foreground'
        }`}>
          <p className="leading-relaxed">{transcription}</p>
        </div>
      )}
    </div>
  );
}

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
  const [isQuickReplySlashOpen, setIsQuickReplySlashOpen] = useState(false);
  const [quickReplySearchQuery, setQuickReplySearchQuery] = useState("");
  const [selectedQuickReply, setSelectedQuickReply] = useState<typeof quickReplies[0] | null>(null);
  const [slashQuery, setSlashQuery] = useState("");
  const messageInputRef = useRef<HTMLInputElement>(null);
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
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiButtonRef = useRef<HTMLButtonElement>(null);
  const notifiedRemindersRef = useRef<Set<string>>(new Set());
  const testErrorCounterRef = useRef<number>(0); // Contador para testar erros diferentes
  
  // Estados para gravação de áudio
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isMicPermissionDeniedOpen, setIsMicPermissionDeniedOpen] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{ blob: Blob; url: string; duration: number } | null>(null);
  const [isRecordedAudioPlaying, setIsRecordedAudioPlaying] = useState(false);
  const [recordedAudioTime, setRecordedAudioTime] = useState(0);
  const recordedAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingPausedRecording, setIsPlayingPausedRecording] = useState(false);
  const [hasPausedRecordingPreview, setHasPausedRecordingPreview] = useState(false);
  const pausedRecordingAudioRef = useRef<HTMLAudioElement | null>(null);
  const pausedRecordingUrlRef = useRef<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);
  
  // Estados para ações de mensagens
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [isDeleteForEveryoneConfirmOpen, setIsDeleteForEveryoneConfirmOpen] = useState(false);
  const [deletedMessageBackup, setDeletedMessageBackup] = useState<{ message: Message; originalIndex: number } | null>(null);
  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
  const [isAssignToMeDialogOpen, setIsAssignToMeDialogOpen] = useState(false);
  const [forwardingMessageIds, setForwardingMessageIds] = useState<Set<string>>(new Set());
  const [forwardContactSearchQuery, setForwardContactSearchQuery] = useState("");
  const [selectedForwardContacts, setSelectedForwardContacts] = useState<string[]>([]);
  const [showForwardTooltip, setShowForwardTooltip] = useState(false);
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
  const [isReactingToMessage, setIsReactingToMessage] = useState<string | null>(null);
  const [openKebabMenuId, setOpenKebabMenuId] = useState<string | null>(null);
  const [showFullEmojiPicker, setShowFullEmojiPicker] = useState(false);
  const reactButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  
  // Emojis rápidos para reações (padrão WhatsApp)
  const quickReactionEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  
  // Atualizar mensagens quando a conversa mudar
  useEffect(() => {
    if (conversationId) {
      const allMessages = loadMessages();
      setMessages(allMessages[conversationId] || []);
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

  // Salvar mensagens no localStorage sempre que houver mudanças
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      saveMessages(conversationId, messages);
    }
  }, [messages, conversationId]);

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
  
  // Filtrar respostas rápidas para o atalho "/"
  const filteredSlashQuickReplies = allQuickReplies.filter((reply) =>
    reply.title.toLowerCase().includes(slashQuery.toLowerCase()) ||
    reply.content.toLowerCase().includes(slashQuery.toLowerCase())
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
    
    // Determinar status inicial da mensagem (template sempre envia com sucesso)
    let initialStatus: MessageStatus = "delivered"; // Double check por padrão
    
    // Simular erros aleatórios para demonstração (em produção viria da API)
    const randomError = Math.random();
    if (randomError < 0.1) {
      initialStatus = "error_internet";
    } else if (randomError < 0.15) {
      initialStatus = "error_credits";
    } else if (randomError < 0.2) {
      initialStatus = "error_app_down";
    }
    
    // Criar nova mensagem
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "Você",
      content: selectedTemplate.content,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
      status: initialStatus,
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
      status: "delivered", // Double check por padrão
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
    
    // Verificar se o usuário pode responder nesta conversa
    if (!canUserRespond(conversation)) {
      toast.error("Você precisa atribuir esta conversa a você antes de responder.", {
        duration: 4000,
        closeButton: true,
      });
      return;
    }
    
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

    // Determinar status inicial da mensagem
    // Em produção, isso viria da resposta da API
    let initialStatus: MessageStatus = "delivered"; // Double check por padrão
    
    // Verificar se está fora da janela de 24h (requer modelo de mensagem)
    // Se requiresMessageTemplate é true e não foi usado um template, é erro de janela de 24h
    if (requiresMessageTemplate && !selectedTemplate) {
      initialStatus = "error_24h_window";
    } else {
      // TESTE: As próximas 4 mensagens terão erros diferentes para testar os tooltips
      const testErrors: MessageStatus[] = [
        "error_internet",
        "error_credits", 
        "error_app_down",
        "error_24h_window"
      ];
      
      if (testErrorCounterRef.current < 4) {
        initialStatus = testErrors[testErrorCounterRef.current];
        testErrorCounterRef.current++;
      }
      // Após as 4 mensagens de teste, usa "delivered" (já definido acima)
    }

    // Criar nova mensagem
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "Você",
      content: trimmedText || (contactsToSend && contactsToSend.length > 0 ? `${contactsToSend.length} ${contactsToSend.length === 1 ? 'contato compartilhado' : 'contatos compartilhados'}` : ""),
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
      status: initialStatus,
      ...(imageUrl && { image: imageUrl }),
      ...(attachmentData && { attachment: attachmentData }),
      ...(contactsToSend && contactsToSend.length > 0 && { contacts: contactsToSend }),
      ...(replyingTo && {
        replyTo: {
          id: replyingTo.id,
          content: replyingTo.content,
          sender: replyingTo.sender,
        },
      }),
    };

    // Adicionar mensagem ao chat
    setMessages([...messages, newMessage]);

    // Atualizar última mensagem da conversa
    if (conversationId && onConversationUpdate) {
      const lastMessageText = trimmedText || 
        (contactsToSend && contactsToSend.length > 0 
          ? `${contactsToSend.length} ${contactsToSend.length === 1 ? 'contato compartilhado' : 'contatos compartilhados'}`
          : imageUrl 
            ? "Imagem" 
            : attachmentData 
              ? attachmentData.name 
              : "");
      
      onConversationUpdate(conversationId, {
        lastMessage: lastMessageText,
        timestamp: "agora",
        unread: false,
        unreadCount: 0,
      });
    }

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
    
    // Limpar resposta se houver
    if (replyingTo) {
      setReplyingTo(null);
    }
  };

  // Handlers para ações de mensagens
  const handleFavoriteMessage = (messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, isFavorite: !msg.isFavorite } : msg
      )
    );
  };

  const handleCopyMessage = (message: Message) => {
    const textToCopy = message.content || 
      (message.attachment ? message.attachment.name : '') ||
      (message.audio ? 'Áudio' : '') ||
      (message.contacts ? `${message.contacts.length} contato(s)` : '');
    
    navigator.clipboard.writeText(textToCopy);
    toast.success("Mensagem copiada!", {
      duration: 2000,
      closeButton: false,
    });
  };

  const handleReplyMessage = (message: Message) => {
    setReplyingTo(message);
    messageInputRef.current?.focus();
  };

  const handleReactMessage = (messageId: string) => {
    setIsReactingToMessage(messageId);
    setShowFullEmojiPicker(false);
    // Fechar o dropdown do kebab menu
    setOpenKebabMenuId(null);
  };

  const handleQuickReaction = (emoji: string) => {
    if (isReactingToMessage) {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === isReactingToMessage
            ? {
                ...msg,
                reactions: [
                  ...(msg.reactions || []),
                  { emoji, userId: CURRENT_USER.id }
                ]
              }
            : msg
        )
      );
      setIsReactingToMessage(null);
      setShowFullEmojiPicker(false);
      toast.success("Reação adicionada!", {
        duration: 2000,
        closeButton: false,
      });
    }
  };

  const handleRemoveReaction = (messageId: string, emoji: string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: (msg.reactions || []).filter(r => r.emoji !== emoji || r.userId !== CURRENT_USER.id)
            }
          : msg
      )
    );
    toast.success("Reação removida!", {
      duration: 2000,
      closeButton: false,
    });
  };

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessageIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleDeleteMessage = (message: Message) => {
    setIsSelectionMode(true);
    setSelectedMessageIds(new Set([message.id]));
    setShowDeleteTooltip(true);
    setTimeout(() => {
      setShowDeleteTooltip(false);
    }, 1500);
  };

  const handleConfirmDelete = (deleteForEveryone: boolean) => {
    if (!messageToDelete) return;
    
    setIsDeleteDialogOpen(false);
    
    if (deleteForEveryone) {
      // Para "apagar para todos": mostrar modal de confirmação
      setIsDeleteForEveryoneConfirmOpen(true);
    } else {
      // Para "apagar para mim": remover completamente e mostrar toast com desfazer
      const originalIndex = messages.findIndex(msg => msg.id === messageToDelete.id);
      const messageBackup = { message: { ...messageToDelete }, originalIndex };
      setDeletedMessageBackup(messageBackup);
      
      const count = selectedMessageIds.size || 1;
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== messageToDelete.id)
      );
      
      setMessageToDelete(null);
      if (isSelectionMode) {
        handleCancelSelectionMode();
      }
      
      toast.success(
        count === 1 ? "Mensagem excluída" : `${count} mensagens excluídas`,
        {
          duration: 5000,
          action: {
            label: "Desfazer",
            onClick: () => {
              if (messageBackup) {
                setMessages(prevMessages => {
                  const newMessages = [...prevMessages];
                  // Inserir a mensagem de volta na posição original
                  newMessages.splice(messageBackup.originalIndex, 0, messageBackup.message);
                  return newMessages;
                });
                setDeletedMessageBackup(null);
              }
            },
          },
        }
      );
    }
  };

  const handleConfirmDeleteForEveryone = () => {
    if (!messageToDelete) return;
    
    const count = selectedMessageIds.size || 1;
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageToDelete.id
          ? { ...msg, deletedForEveryone: true, content: "Mensagem apagada" }
          : msg
      )
    );
    
    setIsDeleteForEveryoneConfirmOpen(false);
    setMessageToDelete(null);
    if (isSelectionMode) {
      handleCancelSelectionMode();
    }
    
    toast.success(
      count === 1 
        ? "Mensagem excluída para todos" 
        : `${count} mensagens excluídas para todos`,
      {
        duration: 2000,
        closeButton: false,
      }
    );
  };

  const handleForwardMessage = (messageId: string) => {
    setIsSelectionMode(true);
    setSelectedMessageIds(new Set([messageId]));
    setShowForwardTooltip(true);
    setTimeout(() => {
      setShowForwardTooltip(false);
    }, 1500);
  };

  const handleStartSelectionMode = (messageId?: string) => {
    setIsSelectionMode(true);
    setShowForwardTooltip(false);
    setShowDeleteTooltip(false);
    if (messageId) {
      setSelectedMessageIds(new Set([messageId]));
    } else {
      setSelectedMessageIds(new Set());
    }
  };

  const handleCancelSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedMessageIds(new Set());
    setShowForwardTooltip(false);
    setShowDeleteTooltip(false);
  };

  const handleSelectAllMessages = () => {
    setSelectedMessageIds(new Set(messages.map(msg => msg.id)));
  };

  const handleBulkFavorite = () => {
    const count = selectedMessageIds.size;
    // Verificar se todas as mensagens selecionadas estão favoritadas
    const selectedMessages = messages.filter(msg => selectedMessageIds.has(msg.id));
    const allFavorited = selectedMessages.length > 0 && selectedMessages.every(msg => msg.isFavorite);
    
    if (allFavorited) {
      // Desfavoritar todas
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          selectedMessageIds.has(msg.id) ? { ...msg, isFavorite: false } : msg
        )
      );
      handleCancelSelectionMode();
      toast.success(
        count === 1 
          ? "1 mensagem desfavoritada" 
          : `${count} mensagens desfavoritadas`,
        {
          duration: 2000,
          closeButton: false,
        }
      );
    } else {
      // Favoritar todas
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          selectedMessageIds.has(msg.id) ? { ...msg, isFavorite: true } : msg
        )
      );
      handleCancelSelectionMode();
      toast.success(
        count === 1 
          ? "1 mensagem favoritada" 
          : `${count} mensagens favoritadas`,
        {
          duration: 2000,
          closeButton: false,
        }
      );
    }
  };

  const handleBulkDelete = () => {
    const selectedMessages = messages.filter(msg => selectedMessageIds.has(msg.id));
    if (selectedMessages.length === 0) return;
    
    // Se houver apenas uma mensagem e ela for do usuário, mostrar modal com opções
    if (selectedMessages.length === 1 && selectedMessages[0].isUser) {
      setMessageToDelete(selectedMessages[0]);
      setIsDeleteDialogOpen(true);
    } else {
      // Para múltiplas mensagens ou mensagem do cliente, excluir diretamente
      const count = selectedMessageIds.size;
      setMessages(prevMessages =>
        prevMessages.filter(msg => !selectedMessageIds.has(msg.id))
      );
      handleCancelSelectionMode();
      toast.success(
        count === 1 
          ? "1 mensagem excluída" 
          : `${count} mensagens excluídas`,
        {
          duration: 2000,
          closeButton: false,
        }
      );
    }
  };

  const handleBulkForward = () => {
    setForwardingMessageIds(selectedMessageIds);
    setSelectedForwardContacts([]);
    setForwardContactSearchQuery("");
    setIsForwardDialogOpen(true);
  };

  const handleToggleForwardContact = (userId: string) => {
    setSelectedForwardContacts(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleConfirmForward = () => {
    if (selectedForwardContacts.length === 0) return;
    
    const count = forwardingMessageIds.size;
    const contactNames = allUsers
      .filter(user => selectedForwardContacts.includes(user.id))
      .map(user => user.name)
      .join(", ");
    
    toast.success(
      count === 1 
        ? `1 mensagem encaminhada para ${contactNames}` 
        : `${count} mensagens encaminhadas para ${contactNames}`,
      {
        duration: 2000,
        closeButton: false,
      }
    );
    
    setIsForwardDialogOpen(false);
    setForwardingMessageIds(new Set());
    setSelectedForwardContacts([]);
    setForwardContactSearchQuery("");
    if (isSelectionMode) {
      handleCancelSelectionMode();
    }
  };

  // Funções para gravação de áudio
  const startRecording = async () => {
    // Limpar preview anterior se houver
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio.url);
      setRecordedAudio(null);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Detectar o melhor tipo MIME disponível
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // O handler onstop será definido no stopRecording para processar o áudio
      // Por enquanto, apenas parar as tracks quando a gravação parar
      const originalOnStop = () => {
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Guardar referência ao stream para usar depois
      (mediaRecorder as any)._stream = stream;
      (mediaRecorder as any)._originalOnStop = originalOnStop;

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingDuration(0);

      // Timer para duração
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao iniciar gravação:", error);
      
      // Verificar se é erro de permissão negada
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setIsMicPermissionDeniedOpen(true);
      } else {
        toast.error("Não foi possível acessar o microfone. Verifique as permissões.", {
          duration: 3000,
          closeButton: true,
        });
      }
    }
  };

  const stopRecording = (cancel: boolean = false) => {
    if (!mediaRecorderRef.current || !isRecording) return;

    // Limpar timer
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    setIsRecording(false);
    setIsPaused(false);

    if (cancel) {
      audioChunksRef.current = [];
      setRecordingDuration(0);
      setRecordedAudio(null);
      mediaRecorderRef.current.stop();
      return;
    }

    // Validar duração mínima (0.5 segundos, similar ao WhatsApp)
    const MIN_DURATION = 0.5;
    if (recordingDuration < MIN_DURATION) {
      toast.error("O áudio é muito curto", {
        duration: 3000,
        closeButton: true,
      });
      audioChunksRef.current = [];
      setRecordingDuration(0);
      setRecordedAudio(null);
      mediaRecorderRef.current.stop();
      return;
    }

    // Configurar handler para quando a gravação parar
    const mediaRecorder = mediaRecorderRef.current;
    const stream = (mediaRecorder as any)._stream;
    const originalOnStop = (mediaRecorder as any)._originalOnStop;
    
    mediaRecorder.onstop = () => {
      // Parar as tracks do stream
      if (originalOnStop) {
        originalOnStop();
      } else if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      
      // Criar blob de áudio com o tipo MIME correto
      const mimeType = mediaRecorder.mimeType || 'audio/webm';
      const audioChunks = [...audioChunksRef.current]; // Copiar chunks
      
      console.log("onstop disparado:", {
        chunksCount: audioChunks.length,
        mimeType: mimeType,
        recordingDuration: recordingDuration
      });
      
      if (audioChunks.length === 0) {
        console.warn("Nenhum chunk de áudio disponível");
        audioChunksRef.current = [];
        setRecordingDuration(0);
        return;
      }
      
      const audioBlob = new Blob(audioChunks, { type: mimeType });
    const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log("Áudio criado:", {
        blobSize: audioBlob.size,
        mimeType: mimeType,
        chunksCount: audioChunks.length,
        recordingDuration: recordingDuration
      });
      
      if (!conversationId) {
        console.warn("Sem conversationId, não adicionando mensagem");
        URL.revokeObjectURL(audioUrl);
        audioChunksRef.current = [];
        setRecordingDuration(0);
        return;
      }
    
    // Criar elemento de áudio temporário para obter duração
    const audio = new Audio(audioUrl);
      let messageAdded = false; // Flag para evitar duplicação
      
      // Função para mostrar preview do áudio (não enviar ainda)
      const showAudioPreview = (duration: number) => {
        if (messageAdded) {
          console.log("Preview já foi criado, ignorando chamada duplicada");
          return;
        }
        
        messageAdded = true;
        console.log("Criando preview de áudio com duração:", duration);
        
        // Armazenar o áudio gravado para preview
        setRecordedAudio({
          blob: audioBlob,
          url: audioUrl,
          duration: duration,
        });
        
        // Limpar estado de gravação
        setIsRecording(false);
        setIsPaused(false);
        audioChunksRef.current = [];
        setRecordingDuration(0);
      };
      
      // Aguardar metadata carregar
      audio.onloadedmetadata = () => {
        if (messageAdded) return;
        const duration = audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0
          ? Math.round(audio.duration)
          : recordingDuration;
        console.log("Duração obtida do metadata:", duration);
        showAudioPreview(duration);
      };
      
      audio.onerror = (e) => {
        if (messageAdded) return;
        console.error("Erro ao carregar áudio temporário:", e);
        // Usar duração da gravação como fallback
        showAudioPreview(recordingDuration);
      };
      
      // Tentar obter duração imediatamente
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        console.log("Duração disponível imediatamente:", audio.duration);
        showAudioPreview(Math.round(audio.duration));
      } else {
        // Se não conseguir imediatamente, aguardar metadata ou usar fallback
        // Fallback: usar duração da gravação se metadata não carregar em 1 segundo
        setTimeout(() => {
          if (messageAdded) return;
          if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
            showAudioPreview(Math.round(audio.duration));
          } else {
            console.log("Usando duração da gravação como fallback:", recordingDuration);
            showAudioPreview(recordingDuration);
          }
        }, 1000);
      }
    };
    
    // Parar a gravação (isso vai disparar o evento onstop)
    mediaRecorder.stop();
  };

  const handleMicClick = () => {
    if (!canUserRespond(conversation)) {
      toast.error("Você precisa atribuir esta conversa a você antes de responder.", {
        duration: 3000,
      });
      return;
    }
    if (requiresMessageTemplate) {
      toast.info("Esta conversa requer o uso de um modelo de mensagem aprovado. Clique no botão de modelo de mensagem para selecionar um modelo.", {
        duration: 4000,
        closeButton: true,
      });
      return;
    }
    
    if (isRecording) {
      // Se já está gravando, parar e enviar
      stopRecording(false);
    } else {
      // Se não está gravando, iniciar gravação
      startRecording();
    }
  };

  const handleCancelRecording = () => {
    // Limpar preview de gravação pausada se existir
    if (pausedRecordingAudioRef.current) {
      pausedRecordingAudioRef.current.pause();
      pausedRecordingAudioRef.current = null;
      setIsPlayingPausedRecording(false);
    }
    if (pausedRecordingUrlRef.current) {
      URL.revokeObjectURL(pausedRecordingUrlRef.current);
      pausedRecordingUrlRef.current = null;
    }
    setHasPausedRecordingPreview(false);

    if (isRecording) {
      stopRecording(true);
    }
  };

  const handleSendRecordedAudio = () => {
    if (!recordedAudio || !conversationId) return;

    // Parar o player se estiver tocando
    if (recordedAudioPlayerRef.current) {
      recordedAudioPlayerRef.current.pause();
      recordedAudioPlayerRef.current = null;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "Você",
      content: "",
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
      status: "delivered",
      audio: {
        url: recordedAudio.url,
        duration: recordedAudio.duration,
      },
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // Atualizar última mensagem da conversa
    if (conversationId && onConversationUpdate) {
      onConversationUpdate(conversationId, {
        lastMessage: "Áudio",
        timestamp: "agora",
        unread: false,
        unreadCount: 0,
      });
    }

    // Scroll para o final
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // Limpar preview
    setRecordedAudio(null);
    setIsRecordedAudioPlaying(false);
    setRecordedAudioTime(0);
  };

  const handleCancelRecordedAudio = () => {
    if (recordedAudio) {
      if (recordedAudioPlayerRef.current) {
        recordedAudioPlayerRef.current.pause();
        recordedAudioPlayerRef.current = null;
      }
      URL.revokeObjectURL(recordedAudio.url);
      setRecordedAudio(null);
      setIsRecordedAudioPlaying(false);
      setRecordedAudioTime(0);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      try {
        // Verificar se o navegador suporta pause/resume
        if (typeof mediaRecorderRef.current.pause === 'function') {
          mediaRecorderRef.current.pause();
          setIsPaused(true);
          
          // Pausar o timer
          if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
          }

          // Criar preview do áudio gravado até agora (se houver chunks)
          if (audioChunksRef.current.length > 0) {
            const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
            const audioChunks = [...audioChunksRef.current];
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Limpar URL anterior se existir
            if (pausedRecordingUrlRef.current) {
              URL.revokeObjectURL(pausedRecordingUrlRef.current);
            }
            pausedRecordingUrlRef.current = audioUrl;
            setHasPausedRecordingPreview(true);
          } else {
            setHasPausedRecordingPreview(false);
          }
        } else {
          toast.info("Seu navegador não suporta pausar gravações", {
            duration: 2000,
            closeButton: true,
          });
        }
      } catch (error) {
        console.error("Erro ao pausar gravação:", error);
        toast.error("Não foi possível pausar a gravação", {
          duration: 2000,
          closeButton: true,
        });
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      try {
        // Parar o preview se estiver tocando
        if (pausedRecordingAudioRef.current) {
          pausedRecordingAudioRef.current.pause();
          pausedRecordingAudioRef.current = null;
          setIsPlayingPausedRecording(false);
        }
        if (pausedRecordingUrlRef.current) {
          URL.revokeObjectURL(pausedRecordingUrlRef.current);
          pausedRecordingUrlRef.current = null;
        }
        setHasPausedRecordingPreview(false);

        // Verificar se o navegador suporta pause/resume
        if (typeof mediaRecorderRef.current.resume === 'function') {
          mediaRecorderRef.current.resume();
          setIsPaused(false);
          
          // Retomar o timer
          recordingIntervalRef.current = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
          }, 1000);
        } else {
          toast.info("Seu navegador não suporta retomar gravações", {
            duration: 2000,
            closeButton: true,
          });
        }
      } catch (error) {
        console.error("Erro ao retomar gravação:", error);
        toast.error("Não foi possível retomar a gravação", {
          duration: 2000,
          closeButton: true,
        });
      }
    }
  };

  const playPausedRecording = () => {
    if (!pausedRecordingUrlRef.current) return;

    if (!pausedRecordingAudioRef.current) {
      const audio = new Audio(pausedRecordingUrlRef.current);
      pausedRecordingAudioRef.current = audio;
      
      audio.addEventListener('ended', () => {
        setIsPlayingPausedRecording(false);
        pausedRecordingAudioRef.current = null;
      });
    }

    if (isPlayingPausedRecording) {
      pausedRecordingAudioRef.current.pause();
      setIsPlayingPausedRecording(false);
    } else {
      pausedRecordingAudioRef.current.play();
      setIsPlayingPausedRecording(true);
    }
  };


  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

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

    let newReply: typeof quickReplies[number];
    
    if (newQuickReplyAttachmentType === "image" && attachmentUrl) {
      newReply = {
      id: `quick-user-${Date.now()}`,
      title: newQuickReplyTitle.trim(),
      content: newQuickReplyContent.trim(),
        image: attachmentUrl,
      };
    } else if (newQuickReplyAttachmentType !== "image" && attachmentName && attachmentUrl) {
      newReply = {
        id: `quick-user-${Date.now()}`,
        title: newQuickReplyTitle.trim(),
        content: newQuickReplyContent.trim(),
        attachment: {
          name: attachmentName,
          url: attachmentUrl,
          type: newQuickReplyAttachmentFile?.type || (newQuickReplyAttachmentType === "video" ? "video/mp4" : "application/octet-stream"),
          size: newQuickReplyAttachmentFile?.size || 0,
        },
      };
    } else if (!newQuickReplyAttachmentFile && imageUrl) {
      newReply = {
        id: `quick-user-${Date.now()}`,
        title: newQuickReplyTitle.trim(),
        content: newQuickReplyContent.trim(),
        image: imageUrl,
      };
    } else {
      newReply = {
        id: `quick-user-${Date.now()}`,
        title: newQuickReplyTitle.trim(),
        content: newQuickReplyContent.trim(),
      };
    }

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
      {!isSelectionMode && (
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
      )}

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
              <div key={message.id} data-message-id={message.id} className={`flex items-center gap-1 ${message.isUser ? 'justify-end' : 'justify-start'} group relative`}>
                {/* Checkbox para modo seleção - sempre no lado esquerdo absoluto, alinhado ao centro */}
                {isSelectionMode && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex-shrink-0 z-10">
                    <Checkbox
                      checked={selectedMessageIds.has(message.id)}
                      onCheckedChange={() => handleSelectMessage(message.id)}
                      className="h-5 w-5"
                    />
                  </div>
                )}
                {/* Menu Kebab - aparece no hover, fora da bubble */}
                {!isSelectionMode && !message.deletedForEveryone && (
                  <>
                    {message.isUser ? (
                      // Para mensagens azuis: do lado esquerdo da bubble (onde começa)
                      <div className={`${openKebabMenuId === message.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity flex-shrink-0 self-start pt-5`}>
                        <DropdownMenu open={openKebabMenuId === message.id} onOpenChange={(open) => setOpenKebabMenuId(open ? message.id : null)}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleFavoriteMessage(message.id)}>
                              <Star className={`h-4 w-4 mr-2 ${message.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                              {message.isFavorite ? 'Desfavoritar' : 'Favoritar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleForwardMessage(message.id)}>
                              <Forward className="h-4 w-4 mr-2" />
                              Encaminhar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMessage(message)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReplyMessage(message)}>
                              <Reply className="h-4 w-4 mr-2" />
                              Responder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyMessage(message)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReactMessage(message.id)}>
                              <Smile className="h-4 w-4 mr-2" />
                              Reagir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStartSelectionMode(message.id)}>
                              <CheckSquare className="h-4 w-4 mr-2" />
                              Selecionar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      // Para mensagens cinzas: do lado direito da bubble, alinhado para cima
                      <div className={`${openKebabMenuId === message.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity flex-shrink-0 self-start pt-5 order-3`}>
                        <DropdownMenu open={openKebabMenuId === message.id} onOpenChange={(open) => setOpenKebabMenuId(open ? message.id : null)}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleFavoriteMessage(message.id)}>
                              <Star className={`h-4 w-4 mr-2 ${message.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                              {message.isFavorite ? 'Desfavoritar' : 'Favoritar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleForwardMessage(message.id)}>
                              <Forward className="h-4 w-4 mr-2" />
                              Encaminhar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMessage(message)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReplyMessage(message)}>
                              <Reply className="h-4 w-4 mr-2" />
                              Responder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyMessage(message)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar
                            </DropdownMenuItem>
                            {message.audio && (
                              <DropdownMenuItem 
                                onClick={async () => {
                                  // Se já tem transcrição, apenas mostrar toast informativo
                                  if (message.audio?.transcription) {
                                    toast.info("A transcrição já está disponível abaixo do áudio", {
                                      duration: 2000,
                                    });
                                    return;
                                  }
                                  
                                  const mockTranscriptions: Record<string, string> = {
                                    "msg-1": "Olá, tudo bem? Preciso de ajuda com meu pedido.",
                                    "msg-2": "Bom dia! Gostaria de saber sobre o status da minha entrega.",
                                    "msg-3": "Obrigado pelo atendimento, foi muito útil!",
                                  };
                                  
                                  toast.info("Transcrevendo áudio...", { duration: 1500 });
                                  
                                  await new Promise(resolve => setTimeout(resolve, 1500));
                                  
                                  const transcription = mockTranscriptions[message.id] || 
                                    "Esta é uma transcrição de exemplo do áudio. Em produção, isso viria de uma API de reconhecimento de voz.";
                                  
                                  setMessages(prevMessages => 
                                    prevMessages.map(msg => 
                                      msg.id === message.id && msg.audio
                                        ? { ...msg, audio: { ...msg.audio, transcription } }
                                        : msg
                                    )
                                  );
                                  
                                  // Salvar no localStorage
                                  if (conversationId) {
                                    const updatedMessages = messages.map(msg => 
                                      msg.id === message.id && msg.audio
                                        ? { ...msg, audio: { ...msg.audio, transcription } }
                                        : msg
                                    );
                                    saveMessages(conversationId, updatedMessages);
                                  }
                                  
                                  toast.success("Transcrição concluída!", { duration: 2000 });
                                }}
                              >
                                <Languages className="h-4 w-4 mr-2" />
                                {message.audio.transcription ? 'Ver transcrição' : 'Transcrever áudio'}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleReactMessage(message.id)}>
                              <Smile className="h-4 w-4 mr-2" />
                              Reagir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStartSelectionMode(message.id)}>
                              <CheckSquare className="h-4 w-4 mr-2" />
                              Selecionar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </>
                )}
                <div className={`max-w-[70%] lg:max-w-[60%] ${message.isUser ? '' : 'order-2'} relative ${isSelectionMode ? 'ml-8' : ''}`}>
                {!message.isUser && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    {message.isFavorite && (
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                )}
                  {/* Preview de resposta */}
                  {message.replyTo && (
                    <div className={`mb-2 p-2 rounded-lg border-l-4 ${
                      message.isUser 
                        ? 'bg-blue-400/20 border-blue-300' 
                        : 'bg-muted/50 border-muted-foreground'
                    }`}>
                      <p className="text-xs font-medium opacity-70">{message.replyTo.sender}</p>
                      <p className="text-xs opacity-60 line-clamp-1">{message.replyTo.content}</p>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 relative ${
                      message.isUser
                        ? message.status === "error_credits"
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.deletedForEveryone ? (
                      <p className={`text-sm italic ${message.isUser ? 'text-blue-100' : 'text-muted-foreground'}`}>Mensagem apagada</p>
                    ) : (
                      message.content && (
                      <p className={`text-sm ${message.image || message.attachment || message.audio || (message.contacts && message.contacts.length > 0) ? 'mb-2' : ''}`}>{message.content}</p>
                      )
                    )}
                    
                    {/* Renderizar áudio se presente */}
                    {!message.deletedForEveryone && message.audio && (
                      <div className={`${message.content ? 'mt-2' : ''} ${message.image || message.attachment || (message.contacts && message.contacts.length > 0) ? 'mb-2' : ''}`}>
                        <AudioPlayer 
                          src={message.audio.url} 
                          duration={message.audio.duration}
                          isUser={message.isUser}
                          transcription={message.audio.transcription}
                        />
                      </div>
                    )}
                    
                    {/* Renderizar imagem se presente */}
                    {!message.deletedForEveryone && message.image && (
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
                    {!message.deletedForEveryone && message.attachment && (
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
                    {!message.deletedForEveryone && message.contacts && message.contacts.length > 0 && (
                      <div className={`${message.content || message.image || message.attachment ? 'mt-2' : ''}`}>
                        {message.contacts.length === 1 ? (
                          // Se houver apenas 1 contato, toda a área é clicável
                          <button
                            onClick={() => {
                              if (message.contacts && message.contacts[0]) {
                                setSelectedContactDetail(message.contacts[0]);
                                setIsContactDetailOpen(true);
                              }
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
                              <div className="relative flex-shrink-0 flex items-center" style={{ width: `${32 + (Math.min(message.contacts?.length || 0, 3) - 1) * 8}px`, height: '32px' }}>
                                {message.contacts?.slice(0, Math.min(message.contacts.length, 3)).map((contact, index) => (
                                  <Avatar
                                    key={contact.id}
                                    className="absolute rounded-full border-2 border-white dark:border-gray-800"
                                    style={{
                                      left: `${index * 8}px`,
                                      width: '32px',
                                      height: '32px',
                                      zIndex: Math.min(message.contacts?.length || 0, 3) - index,
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
                                  {message.contacts && message.contacts.length === 1
                                    ? message.contacts[0].name
                                    : message.contacts && `${message.contacts[0].name} e outros ${message.contacts.length - 1} ${message.contacts.length - 1 === 1 ? 'contato' : 'contatos'}`
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
                    
                    {/* Reações como badges na borda da bubble */}
                    {!message.deletedForEveryone && message.reactions && message.reactions.length > 0 && (
                      <div className={`absolute bottom-0 flex items-center gap-0.5 ${message.isUser ? 'right-2' : 'left-2'}`} style={{ transform: 'translateY(50%)' }}>
                        {Array.from(new Set(message.reactions.map(r => r.emoji))).map((emoji, idx) => {
                          const hasUserReaction = message.reactions?.some(r => r.emoji === emoji && r.userId === CURRENT_USER.id);
                          return (
                            <DropdownMenu key={idx}>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="text-[10px] px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm flex items-center justify-center min-w-[20px] h-5 z-10 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                >
                                  {emoji}
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align={message.isUser ? "end" : "start"} side="top">
                                {hasUserReaction && (
                                  <DropdownMenuItem
                                    onClick={() => handleRemoveReaction(message.id, emoji)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remover reação
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleReactMessage(message.id)}>
                                  <Smile className="h-4 w-4 mr-2" />
                                  Adicionar reação
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* Status da mensagem - apenas para mensagens do usuário */}
                  {message.isUser && (
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <span className={`text-xs ${message.status === "error_credits" ? "text-white/80" : "text-muted-foreground"}`}>
                        {message.timestamp}
                      </span>
                      <MessageStatusIndicator status={message.status} isUser={message.isUser} />
                    </div>
                  )}
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
            <DropdownMenuContent align="start" side="top" sideOffset={12}>
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
                    <p className="text-xs text-muted-foreground mb-2">
                      Clique em uma resposta para visualizar e enviar
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Ou digite <span className="font-mono font-semibold">/</span> no campo de mensagem para buscar respostas rápidas
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

          {/* Modal de permissão de microfone negada */}
          <Dialog open={isMicPermissionDeniedOpen} onOpenChange={setIsMicPermissionDeniedOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Microfone não encontrado ou sem permissão</DialogTitle>
                <DialogDescription>
                  Por favor, verifique se o microfone está conectado e se o navegador tem permissão para acessá-lo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Para ajuda, acesse os links de suporte do seu navegador:
                </p>
                <div className="space-y-2">
                  {/* Chrome */}
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4"
                    asChild
                  >
                    <a
                      href="https://support.google.com/chrome/answer/2693767?hl=pt-BR"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full" viewBox="0 0 32 32">
                          <path d="M4.7434,22.505A12.9769,12.9769,0,0,0,14.88,28.949l5.8848-10.1927L16,16.0058,11.2385,18.755l-1.5875-2.75L8.4885,13.9919,5.3553,8.5649A12.9894,12.9894,0,0,0,4.7434,22.505Z" fill="#00ac47"/>
                          <path d="M16,3.0072A12.9769,12.9769,0,0,0,5.3507,8.5636l5.8848,10.1927L16,16.0057V10.5072H27.766A12.99,12.99,0,0,0,16,3.0072Z" fill="#ea4435"/>
                          <path d="M27.2557,22.505a12.9772,12.9772,0,0,0,.5124-12H15.9986v5.5011l4.7619,2.7492-1.5875,2.75-1.1625,2.0135-3.1333,5.4269A12.99,12.99,0,0,0,27.2557,22.505Z" fill="#ffba00"/>
                          <circle cx="15.9995" cy="16.0072" fill="#ffffff" r="5.5"/>
                          <circle cx="15.9995" cy="16.0072" fill="#4285f4" r="4.25"/>
                        </svg>
                      </div>
                      <span className="flex-1 text-left font-normal">Google Chrome</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  </Button>
                  
                  {/* Edge */}
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4"
                    asChild
                  >
                    <a
                      href="https://support.microsoft.com/pt-br/windows/c%C3%A2mara-do-windows-microfone-e-privacidade-a83257bc-e990-d54a-d212-b5e41beba857#ID0EDDBF"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full" viewBox="-38.4024 -64.00725 332.8208 384.0435" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <radialGradient gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -.95 -4.61 243.92)" r="95.38" cy="68.91" cx="161.83" id="edge-b-modal">
                              <stop stopOpacity="0" offset=".72"/>
                              <stop stopOpacity=".53" offset=".95"/>
                              <stop offset="1"/>
                            </radialGradient>
                            <radialGradient gradientUnits="userSpaceOnUse" gradientTransform="matrix(.15 -.99 -.8 -.12 172.03 -130.32)" r="143.24" cy="62.99" cx="-340.29" id="edge-d-modal">
                              <stop stopOpacity="0" offset=".76"/>
                              <stop stopOpacity=".5" offset=".95"/>
                              <stop offset="1"/>
                            </radialGradient>
                            <radialGradient gradientUnits="userSpaceOnUse" gradientTransform="matrix(-.04 1 2.13 .08 -1184.15 -111.61)" r="202.43" cy="570.21" cx="113.37" id="edge-e-modal">
                              <stop stopColor="#35c1f1" offset="0"/>
                              <stop stopColor="#34c1ed" offset=".11"/>
                              <stop stopColor="#2fc2df" offset=".23"/>
                              <stop stopColor="#2bc3d2" offset=".31"/>
                              <stop stopColor="#36c752" offset=".67"/>
                            </radialGradient>
                            <radialGradient gradientUnits="userSpaceOnUse" gradientTransform="matrix(.28 .96 .78 -.23 -308.37 -153.42)" r="97.34" cy="567.97" cx="376.52" id="edge-f-modal">
                              <stop stopColor="#66eb6e" offset="0"/>
                              <stop stopOpacity="0" stopColor="#66eb6e" offset="1"/>
                            </radialGradient>
                            <linearGradient gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 -4.61 261.08)" y2="84.03" x2="241.67" y1="84.03" x1="63.33" id="edge-a-modal">
                              <stop stopColor="#0c59a4" offset="0"/>
                              <stop stopColor="#114a8b" offset="1"/>
                            </linearGradient>
                            <linearGradient gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 -4.61 261.08)" y2="40.06" x2="45.96" y1="161.39" x1="157.35" id="edge-c-modal">
                              <stop stopColor="#1b9de2" offset="0"/>
                              <stop stopColor="#1595df" offset=".16"/>
                              <stop stopColor="#0680d7" offset=".67"/>
                              <stop stopColor="#0078d4" offset="1"/>
                            </linearGradient>
                          </defs>
                          <path d="M231.07 190.54a93.73 93.73 0 01-10.54 4.71 101.87 101.87 0 01-35.9 6.46c-47.32 0-88.54-32.55-88.54-74.32a31.48 31.48 0 0116.43-27.31c-42.8 1.8-53.8 46.4-53.8 72.53 0 73.88 68.09 81.37 82.76 81.37 7.91 0 19.84-2.3 27-4.56l1.31-.44a128.34 128.34 0 0066.6-52.8 4 4 0 00-5.32-5.64z" fill="url(#edge-a-modal)"/>
                          <path style={{isolation: 'isolate'}} d="M231.07 190.54a93.73 93.73 0 01-10.54 4.71 101.87 101.87 0 01-35.9 6.46c-47.32 0-88.54-32.55-88.54-74.32a31.48 31.48 0 0116.43-27.31c-42.8 1.8-53.8 46.4-53.8 72.53 0 73.88 68.09 81.37 82.76 81.37 7.91 0 19.84-2.3 27-4.56l1.31-.44a128.34 128.34 0 0066.6-52.8 4 4 0 00-5.32-5.64z" fill="url(#edge-b-modal)" opacity=".35"/>
                          <path d="M105.73 241.42a79.2 79.2 0 01-22.74-21.34 80.72 80.72 0 0129.53-120c3.12-1.47 8.45-4.13 15.54-4a32.35 32.35 0 0125.69 13 31.88 31.88 0 016.36 18.66c0-.21 24.46-79.6-80-79.6-43.9 0-80 41.66-80 78.21a130.15 130.15 0 0012.11 56 128 128 0 00156.38 67.11 75.55 75.55 0 01-62.78-8z" fill="url(#edge-c-modal)"/>
                          <path style={{isolation: 'isolate'}} d="M105.73 241.42a79.2 79.2 0 01-22.74-21.34 80.72 80.72 0 0129.53-120c3.12-1.47 8.45-4.13 15.54-4a32.35 32.35 0 0125.69 13 31.88 31.88 0 016.36 18.66c0-.21 24.46-79.6-80-79.6-43.9 0-80 41.66-80 78.21a130.15 130.15 0 0012.11 56 128 128 0 00156.38 67.11 75.55 75.55 0 01-62.78-8z" fill="url(#edge-d-modal)" opacity=".41"/>
                          <path d="M152.33 148.86c-.81 1.05-3.3 2.5-3.3 5.66 0 2.61 1.7 5.12 4.72 7.23 14.38 10 41.49 8.68 41.56 8.68a59.56 59.56 0 0030.27-8.35 61.38 61.38 0 0030.43-52.88c.26-22.41-8-37.31-11.34-43.91C223.48 23.84 177.74 0 128 0A128 128 0 000 126.2c.48-36.54 36.8-66.05 80-66.05 3.5 0 23.46.34 42 10.07 16.34 8.58 24.9 18.94 30.85 29.21 6.18 10.67 7.28 24.15 7.28 29.52 0 5.37-2.74 13.33-7.8 19.91z" fill="url(#edge-e-modal)"/>
                          <path d="M152.33 148.86c-.81 1.05-3.3 2.5-3.3 5.66 0 2.61 1.7 5.12 4.72 7.23 14.38 10 41.49 8.68 41.56 8.68a59.56 59.56 0 0030.27-8.35 61.38 61.38 0 0030.43-52.88c.26-22.41-8-37.31-11.34-43.91C223.48 23.84 177.74 0 128 0A128 128 0 000 126.2c.48-36.54 36.8-66.05 80-66.05 3.5 0 23.46.34 42 10.07 16.34 8.58 24.9 18.94 30.85 29.21 6.18 10.67 7.28 24.15 7.28 29.52 0 5.37-2.74 13.33-7.8 19.91z" fill="url(#edge-f-modal)"/>
                        </svg>
                      </div>
                      <span className="flex-1 text-left font-normal">Microsoft Edge</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  </Button>
                  
                  {/* Firefox */}
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4"
                    asChild
                  >
                    <a
                      href="https://support.mozilla.org/pt-BR/kb/como-gerenciar-permissoes-camera-microfone-firefox"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full" viewBox="-11.61279 -19.99175 100.64418 119.9505" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <radialGradient id="firefox-b-modal" cx="-7907.187" cy="-8515.1211" r="80.797" gradientTransform="translate(7973.7 8523.9959)" gradientUnits="userSpaceOnUse">
                              <stop offset=".129" stopColor="#ffbd4f"/>
                              <stop offset=".186" stopColor="#ffac31"/>
                              <stop offset=".247" stopColor="#ff9d17"/>
                              <stop offset=".283" stopColor="#ff980e"/>
                              <stop offset=".403" stopColor="#ff563b"/>
                              <stop offset=".467" stopColor="#ff3750"/>
                              <stop offset=".71" stopColor="#f5156c"/>
                              <stop offset=".782" stopColor="#eb0878"/>
                              <stop offset=".86" stopColor="#e50080"/>
                            </radialGradient>
                            <radialGradient id="firefox-c-modal" cx="-7936.7109" cy="-8482.0889" r="80.797" gradientTransform="translate(7973.7 8523.9959)" gradientUnits="userSpaceOnUse">
                              <stop offset=".3" stopColor="#960e18"/>
                              <stop offset=".351" stopColor="#b11927" stopOpacity=".74"/>
                              <stop offset=".435" stopColor="#db293d" stopOpacity=".343"/>
                              <stop offset=".497" stopColor="#f5334b" stopOpacity=".094"/>
                              <stop offset=".53" stopColor="#ff3750" stopOpacity="0"/>
                            </radialGradient>
                            <radialGradient id="firefox-d-modal" cx="-7926.9702" cy="-8533.457" r="58.534" gradientTransform="translate(7973.7 8523.9959)" gradientUnits="userSpaceOnUse">
                              <stop offset=".132" stopColor="#fff44f"/>
                              <stop offset=".252" stopColor="#ffdc3e"/>
                              <stop offset=".506" stopColor="#ff9d12"/>
                              <stop offset=".526" stopColor="#ff980e"/>
                            </radialGradient>
                            <radialGradient id="firefox-e-modal" cx="-7945.6479" cy="-8460.9844" r="38.471" gradientTransform="translate(7973.7 8523.9959)" gradientUnits="userSpaceOnUse">
                              <stop offset=".353" stopColor="#3a8ee6"/>
                              <stop offset=".472" stopColor="#5c79f0"/>
                              <stop offset=".669" stopColor="#9059ff"/>
                              <stop offset="1" stopColor="#c139e6"/>
                            </radialGradient>
                            <radialGradient id="firefox-f-modal" cx="-7935.6201" cy="-8491.5459" r="20.397" gradientTransform="matrix(.972 -.235 .275 1.138 10090.002 7833.7939)" gradientUnits="userSpaceOnUse">
                              <stop offset=".206" stopColor="#9059ff" stopOpacity="0"/>
                              <stop offset=".278" stopColor="#8c4ff3" stopOpacity=".064"/>
                              <stop offset=".747" stopColor="#7716a8" stopOpacity=".45"/>
                              <stop offset=".975" stopColor="#6e008b" stopOpacity=".6"/>
                            </radialGradient>
                            <radialGradient id="firefox-g-modal" cx="-7937.731" cy="-8518.4268" r="27.676" gradientTransform="translate(7973.7 8523.9959)" gradientUnits="userSpaceOnUse">
                              <stop offset="0" stopColor="#ffe226"/>
                              <stop offset=".121" stopColor="#ffdb27"/>
                              <stop offset=".295" stopColor="#ffc82a"/>
                              <stop offset=".502" stopColor="#ffa930"/>
                              <stop offset=".732" stopColor="#ff7e37"/>
                              <stop offset=".792" stopColor="#ff7139"/>
                            </radialGradient>
                            <radialGradient id="firefox-h-modal" cx="-7915.9771" cy="-8535.9814" r="118.081" gradientTransform="translate(7973.7 8523.9959)" gradientUnits="userSpaceOnUse">
                              <stop offset=".113" stopColor="#fff44f"/>
                              <stop offset=".456" stopColor="#ff980e"/>
                              <stop offset=".622" stopColor="#ff5634"/>
                              <stop offset=".716" stopColor="#ff3647"/>
                              <stop offset=".904" stopColor="#e31587"/>
                            </radialGradient>
                            <radialGradient id="firefox-i-modal" cx="-7927.165" cy="-8522.8594" r="86.499" gradientTransform="matrix(.105 .995 -.653 .069 -4685.304 8470.1869)" gradientUnits="userSpaceOnUse">
                              <stop offset="0" stopColor="#fff44f"/>
                              <stop offset=".06" stopColor="#ffe847"/>
                              <stop offset=".168" stopColor="#ffc830"/>
                              <stop offset=".304" stopColor="#ff980e"/>
                              <stop offset=".356" stopColor="#ff8b16"/>
                              <stop offset=".455" stopColor="#ff672a"/>
                              <stop offset=".57" stopColor="#ff3647"/>
                              <stop offset=".737" stopColor="#e31587"/>
                            </radialGradient>
                            <radialGradient id="firefox-j-modal" cx="-7938.3828" cy="-8508.1758" r="73.72" gradientTransform="translate(7973.7 8523.9959)" gradientUnits="userSpaceOnUse">
                              <stop offset=".137" stopColor="#fff44f"/>
                              <stop offset=".48" stopColor="#ff980e"/>
                              <stop offset=".592" stopColor="#ff5634"/>
                              <stop offset=".655" stopColor="#ff3647"/>
                              <stop offset=".904" stopColor="#e31587"/>
                            </radialGradient>
                            <radialGradient id="firefox-k-modal" cx="-7918.9229" cy="-8503.8613" r="80.686" gradientTransform="translate(7973.7 8523.9959)" gradientUnits="userSpaceOnUse">
                              <stop offset=".094" stopColor="#fff44f"/>
                              <stop offset=".231" stopColor="#ffe141"/>
                              <stop offset=".509" stopColor="#ffaf1e"/>
                              <stop offset=".626" stopColor="#ff980e"/>
                            </radialGradient>
                            <linearGradient id="firefox-a-modal" x1="70.786" y1="12.393" x2="6.447" y2="74.468" gradientUnits="userSpaceOnUse" gradientTransform="translate(-1.3 -.004)">
                              <stop offset=".048" stopColor="#fff44f"/>
                              <stop offset=".111" stopColor="#ffe847"/>
                              <stop offset=".225" stopColor="#ffc830"/>
                              <stop offset=".368" stopColor="#ff980e"/>
                              <stop offset=".401" stopColor="#ff8b16"/>
                              <stop offset=".462" stopColor="#ff672a"/>
                              <stop offset=".534" stopColor="#ff3647"/>
                              <stop offset=".705" stopColor="#e31587"/>
                            </linearGradient>
                            <linearGradient id="firefox-l-modal" x1="70.013" y1="12.061" x2="15.267" y2="66.806" gradientUnits="userSpaceOnUse" gradientTransform="translate(-1.3 -.004)">
                              <stop offset=".167" stopColor="#fff44f" stopOpacity=".8"/>
                              <stop offset=".266" stopColor="#fff44f" stopOpacity=".634"/>
                              <stop offset=".489" stopColor="#fff44f" stopOpacity=".217"/>
                              <stop offset=".6" stopColor="#fff44f" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <path d="M74.616 26.827c-1.684-4.052-5.1-8.427-7.775-9.81a40.266 40.266 0 013.925 11.764l.007.065C66.391 17.921 58.96 13.516 52.891 3.924c-.307-.485-.614-.971-.913-1.484-.171-.293-.308-.557-.427-.8a7.053 7.053 0 01-.578-1.535.1.1 0 00-.088-.1.138.138 0 00-.073 0c-.005 0-.013.009-.019.011s-.019.011-.028.015l.015-.026c-9.735 5.7-13.038 16.252-13.342 21.53a19.387 19.387 0 00-10.666 4.111 11.587 11.587 0 00-1-.758 17.968 17.968 0 01-.109-9.473 28.705 28.705 0 00-9.329 7.21h-.018c-1.536-1.947-1.428-8.367-1.34-9.708a6.928 6.928 0 00-1.294.687 28.225 28.225 0 00-3.788 3.245 33.845 33.845 0 00-3.623 4.347v.006-.007a32.733 32.733 0 00-5.2 11.743l-.052.256c-.073.341-.336 2.049-.381 2.42 0 .029-.006.056-.009.085A36.937 36.937 0 000 41.042v.2a38.759 38.759 0 0076.954 6.554c.065-.5.118-.995.176-1.5a39.857 39.857 0 00-2.514-19.469zm-44.67 30.338c.181.087.351.181.537.264l.027.017q-.282-.135-.564-.281zm8.878-23.376zm31.952-4.934v-.037l.007.041z" fill="url(#firefox-a-modal)"/>
                          <path d="M74.616 26.827c-1.684-4.052-5.1-8.427-7.775-9.81a40.266 40.266 0 013.925 11.764v.037l.007.041a35.1 35.1 0 01-1.206 26.158c-4.442 9.531-15.194 19.3-32.024 18.825-18.185-.515-34.2-14.009-37.194-31.683-.545-2.787 0-4.2.274-6.465A28.876 28.876 0 000 41.042v.2a38.759 38.759 0 0076.954 6.554c.065-.5.118-.995.176-1.5a39.857 39.857 0 00-2.514-19.469z" fill="url(#firefox-b-modal)"/>
                          <path d="M74.616 26.827c-1.684-4.052-5.1-8.427-7.775-9.81a40.266 40.266 0 013.925 11.764v.037l.007.041a35.1 35.1 0 01-1.206 26.158c-4.442 9.531-15.194 19.3-32.024 18.825-18.185-.515-34.2-14.009-37.194-31.683-.545-2.787 0-4.2.274-6.465A28.876 28.876 0 000 41.042v.2a38.759 38.759 0 0076.954 6.554c.065-.5.118-.995.176-1.5a39.857 39.857 0 00-2.514-19.469z" fill="url(#firefox-c-modal)"/>
                          <path d="M55.782 31.383c.084.059.162.118.241.177a21.1 21.1 0 00-3.6-4.695C40.377 14.817 49.266.742 50.765.027l.015-.022c-9.735 5.7-13.038 16.252-13.342 21.53.452-.031.9-.069 1.362-.069a19.56 19.56 0 0116.982 9.917z" fill="url(#firefox-d-modal)"/>
                          <path d="M38.825 33.789c-.064.964-3.47 4.289-4.661 4.289-11.021 0-12.81 6.667-12.81 6.667.488 5.614 4.4 10.238 9.129 12.684.216.112.435.213.654.312q.569.252 1.138.466a17.235 17.235 0 005.043.973c19.317.906 23.059-23.1 9.119-30.066a13.38 13.38 0 019.345 2.269A19.56 19.56 0 0038.8 21.466c-.46 0-.91.038-1.362.069a19.387 19.387 0 00-10.666 4.111c.591.5 1.258 1.168 2.663 2.553 2.63 2.591 9.375 5.275 9.39 5.59z" fill="url(#firefox-e-modal)"/>
                          <path d="M38.825 33.789c-.064.964-3.47 4.289-4.661 4.289-11.021 0-12.81 6.667-12.81 6.667.488 5.614 4.4 10.238 9.129 12.684.216.112.435.213.654.312q.569.252 1.138.466a17.235 17.235 0 005.043.973c19.317.906 23.059-23.1 9.119-30.066a13.38 13.38 0 019.345 2.269A19.56 19.56 0 0038.8 21.466c-.46 0-.91.038-1.362.069a19.387 19.387 0 00-10.666 4.111c.591.5 1.258 1.168 2.663 2.553 2.63 2.591 9.375 5.275 9.39 5.59z" fill="url(#firefox-f-modal)"/>
                          <path d="M24.965 24.357c.314.2.573.374.8.531a17.968 17.968 0 01-.109-9.473 28.705 28.705 0 00-9.329 7.21c.189-.005 5.811-.106 8.638 1.732z" fill="url(#firefox-g-modal)"/>
                          <path d="M.354 42.159c2.991 17.674 19.009 31.168 37.194 31.683 16.83.476 27.582-9.294 32.024-18.825a35.1 35.1 0 001.206-26.158v-.037c0-.029-.006-.046 0-.037l.007.065c1.375 8.977-3.191 17.674-10.329 23.555l-.022.05c-13.908 11.327-27.218 6.834-29.912 5q-.282-.135-.564-.281c-8.109-3.876-11.459-11.264-10.741-17.6a9.953 9.953 0 01-9.181-5.775 14.618 14.618 0 0114.249-.572 19.3 19.3 0 0014.552.572c-.015-.315-6.76-3-9.39-5.59-1.405-1.385-2.072-2.052-2.663-2.553a11.587 11.587 0 00-1-.758c-.23-.157-.489-.327-.8-.531-2.827-1.838-8.449-1.737-8.635-1.732h-.018c-1.536-1.947-1.428-8.367-1.34-9.708a6.928 6.928 0 00-1.294.687 28.225 28.225 0 00-3.788 3.245 33.845 33.845 0 00-3.638 4.337v.006-.007a32.733 32.733 0 00-5.2 11.743c-.019.079-1.396 6.099-.717 9.221z" fill="url(#firefox-h-modal)"/>
                          <path d="M52.425 26.865a21.1 21.1 0 013.6 4.7c.213.161.412.321.581.476 8.787 8.1 4.183 19.55 3.84 20.365 7.138-5.881 11.7-14.578 10.329-23.555-4.384-10.93-11.815-15.335-17.884-24.927-.307-.485-.614-.971-.913-1.484-.171-.293-.308-.557-.427-.8a7.053 7.053 0 01-.578-1.535.1.1 0 00-.088-.1.138.138 0 00-.073 0c-.005 0-.013.009-.019.011s-.019.011-.028.015c-1.499.711-10.388 14.786 1.66 26.834z" fill="url(#firefox-i-modal)"/>
                          <path d="M56.6 32.036c-.169-.155-.368-.315-.581-.476-.079-.059-.157-.118-.241-.177a13.38 13.38 0 00-9.345-2.269c13.94 6.97 10.2 30.972-9.119 30.066a17.235 17.235 0 01-5.043-.973q-.569-.213-1.138-.466c-.219-.1-.438-.2-.654-.312l.027.017c2.694 1.839 16 6.332 29.912-5l.022-.05c.347-.81 4.951-12.263-3.84-20.36z" fill="url(#firefox-j-modal)"/>
                          <path d="M21.354 44.745s1.789-6.667 12.81-6.667c1.191 0 4.6-3.325 4.661-4.289a19.3 19.3 0 01-14.552-.572 14.618 14.618 0 00-14.249.572 9.953 9.953 0 009.181 5.775c-.718 6.337 2.632 13.725 10.741 17.6.181.087.351.181.537.264-4.733-2.445-8.641-7.069-9.129-12.683z" fill="url(#firefox-k-modal)"/>
                          <path d="M74.616 26.827c-1.684-4.052-5.1-8.427-7.775-9.81a40.266 40.266 0 013.925 11.764l.007.065C66.391 17.921 58.96 13.516 52.891 3.924c-.307-.485-.614-.971-.913-1.484-.171-.293-.308-.557-.427-.8a7.053 7.053 0 01-.578-1.535.1.1 0 00-.088-.1.138.138 0 00-.073 0c-.005 0-.013.009-.019.011s-.019.011-.028.015l.015-.026c-9.735 5.7-13.038 16.252-13.342 21.53.452-.031.9-.069 1.362-.069a19.56 19.56 0 0116.982 9.917 13.38 13.38 0 00-9.345-2.269c13.94 6.97 10.2 30.972-9.119 30.066a17.235 17.235 0 01-5.043-.973q-.569-.213-1.138-.466c-.219-.1-.438-.2-.654-.312l.027.017q-.282-.135-.564-.281c.181.087.351.181.537.264-4.733-2.446-8.641-7.07-9.129-12.684 0 0 1.789-6.667 12.81-6.667 1.191 0 4.6-3.325 4.661-4.289-.015-.315-6.76-3-9.39-5.59-1.405-1.385-2.072-2.052-2.663-2.553a11.587 11.587 0 00-1-.758 17.968 17.968 0 01-.109-9.473 28.705 28.705 0 00-9.329 7.21h-.018c-1.536-1.947-1.428-8.367-1.34-9.708a6.928 6.928 0 00-1.294.687 28.225 28.225 0 00-3.788 3.245 33.845 33.845 0 00-3.623 4.347v.006-.007a32.733 32.733 0 00-5.2 11.743l-.052.256c-.073.341-.4 2.073-.447 2.445 0 .028 0-.029 0 0A45.094 45.094 0 000 41.042v.2a38.759 38.759 0 0076.954 6.554c.065-.5.118-.995.176-1.5a39.857 39.857 0 00-2.514-19.469zm-3.845 1.991l.007.041z" fill="url(#firefox-l-modal)"/>
                        </svg>
                      </div>
                      <span className="flex-1 text-left font-normal">Mozilla Firefox</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsMicPermissionDeniedOpen(false)}>
                  Entendi
                </Button>
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
                  id: CURRENT_USER.id,
                  name: CURRENT_USER.name,
                  avatar: CURRENT_USER.avatar,
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
      </div>

        {/* Input Area */}
        {!isSelectionMode && (
        <div className="p-4 min-w-0">
              {/* Preview de resposta */}
              {replyingTo && (
                <div className="mb-2 p-2 bg-muted rounded-lg border-l-4 border-primary flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Respondendo a {replyingTo.sender}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{replyingTo.content}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={() => setReplyingTo(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Preview de áudio gravado - estilo WhatsApp */}
              {recordedAudio && (
                <div className="mb-2 p-3 bg-muted rounded-lg border flex items-center gap-3">
                  <button
                    type="button"
                    className="h-10 w-10 rounded-full flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-sm"
                    onClick={() => {
                      if (!recordedAudioPlayerRef.current) {
                        const audio = new Audio(recordedAudio.url);
                        recordedAudioPlayerRef.current = audio;
                        
                        audio.addEventListener('timeupdate', () => {
                          setRecordedAudioTime(audio.currentTime);
                        });
                        
                        audio.addEventListener('ended', () => {
                          setIsRecordedAudioPlaying(false);
                          setRecordedAudioTime(0);
                        });
                      }

                      if (isRecordedAudioPlaying) {
                        recordedAudioPlayerRef.current.pause();
                        setIsRecordedAudioPlaying(false);
                      } else {
                        recordedAudioPlayerRef.current.play();
                        setIsRecordedAudioPlaying(true);
                      }
                    }}
                    style={{ backgroundColor: '#3b82f6' }}
                  >
                    {isRecordedAudioPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="relative h-1 bg-muted-foreground/20 rounded-full overflow-hidden mb-1">
                      <div 
                        className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-100"
                        style={{ width: `${recordedAudio.duration > 0 ? (recordedAudioTime / recordedAudio.duration) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(recordedAudioTime / 60)}:{(Math.floor(recordedAudioTime % 60)).toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(recordedAudio.duration / 60)}:{(Math.floor(recordedAudio.duration % 60)).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={handleCancelRecordedAudio}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-full flex-shrink-0"
                      onClick={handleSendRecordedAudio}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Preview de arquivo/anexo - estilo WhatsApp */}
              {messageAttachmentFile && (
                <div className="mb-2 relative rounded-lg overflow-hidden border border-border/50 bg-background">
                  {messageAttachmentType === "image" ? (
                    <>
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(messageAttachmentFile)}
                          alt="Preview"
                          className="w-full max-h-[300px] object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
                          onClick={() => {
                            setMessageAttachmentFile(null);
                            setMessageAttachmentType(null);
                            if (messageImageInputRef.current) messageImageInputRef.current.value = '';
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : messageAttachmentType === "video" ? (
                    <>
                      <div className="relative bg-black/5 aspect-video flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-16 w-16 rounded-full bg-black/10 flex items-center justify-center">
                            <Video className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">
                            {messageAttachmentFile.name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
                          onClick={() => {
                            setMessageAttachmentFile(null);
                            setMessageAttachmentType(null);
                            if (messageVideoInputRef.current) messageVideoInputRef.current.value = '';
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="px-3 py-2 border-t bg-muted/30">
                        <p className="text-xs text-muted-foreground">
                          {(messageAttachmentFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 flex items-center gap-3">
                      <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{messageAttachmentFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {(messageAttachmentFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0 hover:bg-muted"
                        onClick={() => {
                          setMessageAttachmentFile(null);
                          setMessageAttachmentType(null);
                          if (messageFileInputRef.current) messageFileInputRef.current.value = '';
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
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
            <div className="relative flex-1 min-w-0">
            <Input
                ref={messageInputRef}
              placeholder={!canUserRespond(conversation) ? "Atribua esta conversa para si para responder..." : "Digite sua mensagem..."}
              className="flex-1 h-10 min-w-0"
              value={messageText}
              disabled={!canUserRespond(conversation)}
              onChange={(e) => {
                if (!canUserRespond(conversation)) {
                  toast.error("Você precisa atribuir esta conversa a você antes de responder.", {
                    duration: 3000,
                  });
                  return;
                }
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
                  
                  const value = e.target.value;
                  setMessageText(value);
                  
                  // Detectar "/" para abrir respostas rápidas
                  if (value.endsWith("/") && !isQuickReplySlashOpen) {
                    setIsQuickReplySlashOpen(true);
                    setSlashQuery("");
                  } else if (isQuickReplySlashOpen) {
                    // Se já está aberto, verificar se ainda começa com "/"
                    const slashIndex = value.lastIndexOf("/");
                    if (slashIndex !== -1 && slashIndex === value.length - 1) {
                      // Ainda está digitando após "/"
                      setSlashQuery("");
                    } else if (slashIndex !== -1) {
                      // Tem "/" e texto após
                      const query = value.substring(slashIndex + 1);
                      setSlashQuery(query);
                    } else {
                      // Não tem mais "/", fechar popover
                      setIsQuickReplySlashOpen(false);
                      setSlashQuery("");
                    }
                  }
              }}
              onFocus={(e) => {
                if (!canUserRespond(conversation)) {
                  e.target.blur();
                  toast.error("Você precisa atribuir esta conversa a você antes de responder.", {
                    duration: 3000,
                  });
                  return;
                }
                if (requiresMessageTemplate) {
                  e.target.blur();
                  toast.info("Esta conversa requer o uso de um modelo de mensagem aprovado. Clique no botão de modelo de mensagem para selecionar um modelo.", {
                    duration: 4000,
                    closeButton: true,
                  });
                }
              }}
              onKeyDown={(e) => {
                if (!canUserRespond(conversation)) {
                  e.preventDefault();
                  toast.error("Você precisa atribuir esta conversa a você antes de responder.", {
                    duration: 3000,
                  });
                  return;
                }
                if (requiresMessageTemplate) {
                  e.preventDefault();
                  toast.info("Esta conversa requer o uso de um modelo de mensagem aprovado. Clique no botão de modelo de mensagem para selecionar um modelo.", {
                    duration: 4000,
                    closeButton: true,
                  });
                  return;
                }
                  
                  // Se o popover de "/" estiver aberto
                  if (isQuickReplySlashOpen) {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      // Navegar para baixo na lista (implementar se necessário)
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      // Navegar para cima na lista (implementar se necessário)
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setIsQuickReplySlashOpen(false);
                      setSlashQuery("");
                    } else if (e.key === "Enter" && filteredSlashQuickReplies.length > 0) {
                      e.preventDefault();
                      // Selecionar primeira resposta rápida
                      const firstReply = filteredSlashQuickReplies[0];
                      const slashIndex = messageText.lastIndexOf("/");
                      const beforeSlash = slashIndex > 0 ? messageText.substring(0, slashIndex) : "";
                      setMessageText(beforeSlash + firstReply.content);
                      setIsQuickReplySlashOpen(false);
                      setSlashQuery("");
                    }
                  }
                  
                  if (e.key === "Enter" && !e.shiftKey && !isQuickReplySlashOpen) {
                  e.preventDefault();
                  if (!requiresMessageTemplate) {
                    handleSendMessage();
                  }
                }
              }}
            />
              
              {/* Dropdown customizado de respostas rápidas via "/" */}
              {isQuickReplySlashOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-[400px] bg-popover border rounded-md shadow-lg z-50 max-h-[300px] flex flex-col overflow-hidden">
                  <div className="p-3 border-b flex-shrink-0">
                    <h4 className="text-sm font-semibold mb-2">Respostas Rápidas</h4>
                    {slashQuery && (
                      <p className="text-xs text-muted-foreground">
                        Pesquisando por: "{slashQuery}"
                      </p>
                    )}
                  </div>
                  <ScrollArea className="flex-1 max-h-[250px]">
                    <div className="p-2">
                      {filteredSlashQuickReplies.length > 0 ? (
                        filteredSlashQuickReplies.map((reply) => (
                          <button
                            key={reply.id}
                            onClick={() => {
                              const slashIndex = messageText.lastIndexOf("/");
                              const beforeSlash = slashIndex > 0 ? messageText.substring(0, slashIndex) : "";
                              setMessageText(beforeSlash + reply.content);
                              setIsQuickReplySlashOpen(false);
                              setSlashQuery("");
                              messageInputRef.current?.focus();
                            }}
                            className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors mb-1"
                          >
                            <div className="font-medium text-sm">{reply.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{reply.content}</div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Nenhuma resposta rápida encontrada
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Botão de gravar áudio - só aparece se a conversa estiver atribuída */}
            {canUserRespond(conversation) && (
              !isRecording ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        ref={micButtonRef}
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10"
                        onClick={handleMicClick}
                        disabled={requiresMessageTemplate}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {requiresMessageTemplate 
                        ? "Use um modelo de mensagem primeiro" 
                        : "Gravar áudio"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500 text-white rounded-lg flex-1">
                <div className="flex items-center gap-1.5 flex-1">
                  {isPaused ? (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  ) : (
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  )}
                  <span className="text-xs font-medium">
                    {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                  </span>
                  {isPaused && (
                    <span className="text-[10px] text-white/80">(Pausado)</span>
                  )}
                </div>
                {isPaused ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:bg-white/20 flex-shrink-0"
                      onClick={resumeRecording}
                      title="Continuar gravação"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </Button>
                    {hasPausedRecordingPreview && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white hover:bg-white/20 flex-shrink-0"
                        onClick={playPausedRecording}
                        title="Escutar o que foi gravado"
                      >
                        {isPlayingPausedRecording ? (
                          <Pause className="h-3.5 w-3.5" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20 flex-shrink-0"
                    onClick={pauseRecording}
                    title="Pausar gravação"
                  >
                    <Pause className="h-3.5 w-3.5" />
                  </Button>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white hover:bg-white/20 hover:outline-none focus:outline-none flex-shrink-0"
                        onClick={() => stopRecording(false)}
                      >
                        <div className="h-3.5 w-3.5 bg-white rounded-none" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Finalizar gravação e ver preview</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20 flex-shrink-0"
                  onClick={handleCancelRecording}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              )
            )}

            {/* Botão de atribuir ou enviar */}
            {!isRecording && (
              conversation && !canUserRespond(conversation) ? (
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-10 px-3 flex-shrink-0 text-xs"
                  onClick={() => {
                    setIsAssignToMeDialogOpen(true);
                  }}
                >
                  Atribuir a mim
                </Button>
              ) : (
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
              )
            )}
          </div>
        </div>
        )}

      {/* Barra inferior de ações quando em modo seleção */}
      {isSelectionMode && (
        <div className="flex items-center justify-between gap-4 p-4 border-t bg-muted flex-shrink-0">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancelSelectionMode}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cancelar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-sm font-medium text-foreground min-w-[100px]">
              {selectedMessageIds.size} selecionada(s)
            </span>
      </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBulkFavorite}
                    disabled={selectedMessageIds.size === 0}
                    className="h-8 w-8"
                  >
                    {(() => {
                      const selectedMessages = messages.filter(msg => selectedMessageIds.has(msg.id));
                      const allFavorited = selectedMessages.length > 0 && selectedMessages.every(msg => msg.isFavorite);
                      return (
                        <Star className={`h-4 w-4 ${allFavorited ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      );
                    })()}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {(() => {
                    const selectedMessages = messages.filter(msg => selectedMessageIds.has(msg.id));
                    const allFavorited = selectedMessages.length > 0 && selectedMessages.every(msg => msg.isFavorite);
                    return allFavorited ? 'Desfavoritar' : 'Favoritar';
                  })()}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip open={showForwardTooltip}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBulkForward}
                    disabled={selectedMessageIds.size === 0}
                    className="h-8 w-8"
                  >
                    <Forward className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Encaminhar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip open={showDeleteTooltip}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBulkDelete}
                    disabled={selectedMessageIds.size === 0}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Excluir</TooltipContent>
              </Tooltip>
            </TooltipProvider>
    </div>
        </div>
      )}

      {/* Modal de Excluir */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Excluir mensagem?</DialogTitle>
            <DialogDescription>
              {messageToDelete?.isUser
                ? "Escolha uma opção de exclusão"
                : "Esta ação não pode ser desfeita."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {messageToDelete?.isUser ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleConfirmDelete(false)}
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Excluir para mim
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleConfirmDelete(true)}
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Excluir para todos
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={() => handleConfirmDelete(false)}
                className="w-full"
              >
                Excluir
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setMessageToDelete(null);
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação - Excluir para todos */}
      <Dialog open={isDeleteForEveryoneConfirmOpen} onOpenChange={setIsDeleteForEveryoneConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Excluir para todos?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Esta ação não pode ser desfeita. A mensagem será excluída para todos os participantes desta conversa e não poderá mais ser visualizada.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteForEveryoneConfirmOpen(false);
                setMessageToDelete(null);
                if (isSelectionMode) {
                  handleCancelSelectionMode();
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleConfirmDeleteForEveryone();
              }}
            >
              Excluir para todos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Encaminhar */}
      <Dialog open={isForwardDialogOpen} onOpenChange={(open) => {
        setIsForwardDialogOpen(open);
        if (!open) {
          setSelectedForwardContacts([]);
          setForwardContactSearchQuery("");
        }
      }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Encaminhar mensagem{forwardingMessageIds.size > 1 ? 's' : ''}</DialogTitle>
            <DialogDescription>
              Selecione os contatos para encaminhar
            </DialogDescription>
          </DialogHeader>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contatos..."
              value={forwardContactSearchQuery}
              onChange={(e) => setForwardContactSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <ScrollArea className="h-[300px] border rounded-md">
            <div className="p-2">
              {allUsers
                .filter(user => 
                  forwardContactSearchQuery === "" ||
                  user.name.toLowerCase().includes(forwardContactSearchQuery.toLowerCase()) ||
                  user.phone?.toLowerCase().includes(forwardContactSearchQuery.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 py-1.5 px-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <Checkbox
                      id={`forward-contact-${user.id}`}
                      checked={selectedForwardContacts.includes(user.id)}
                      onCheckedChange={() => handleToggleForwardContact(user.id)}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={`forward-contact-${user.id}`}
                      className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.phone}</p>
                      </div>
                    </label>
                  </div>
                ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsForwardDialogOpen(false);
                setForwardingMessageIds(new Set());
                setSelectedForwardContacts([]);
                setForwardContactSearchQuery("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmForward}
              disabled={selectedForwardContacts.length === 0}
            >
              Encaminhar {selectedForwardContacts.length > 0 && `(${selectedForwardContacts.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Popover de Reagir */}
      {isReactingToMessage && (
        <Popover 
          open={true} 
          modal={false}
          onOpenChange={(open) => {
            // Só fechar se explicitamente solicitado (não fechar automaticamente)
            if (!open) {
              setIsReactingToMessage(null);
              setShowFullEmojiPicker(false);
            }
          }}
        >
          <PopoverTrigger asChild>
            <button
              ref={(el) => {
                if (el && isReactingToMessage) {
                  // Usar requestAnimationFrame para garantir que o DOM está atualizado
                  requestAnimationFrame(() => {
                    const messageElement = document.querySelector(`[data-message-id="${isReactingToMessage}"]`);
                    if (messageElement) {
                      // Encontrar a bubble da mensagem dentro do elemento
                      const bubble = messageElement.querySelector('.rounded-2xl') as HTMLElement;
                      const targetElement = bubble || messageElement;
                      const rect = targetElement.getBoundingClientRect();
                      const scrollY = window.scrollY || window.pageYOffset;
                      // Posicionar acima da mensagem, centralizado horizontalmente com a bubble
                      if (el) {
                        el.style.position = 'fixed';
                        el.style.left = `${rect.left + rect.width / 2}px`;
                        el.style.top = `${rect.top + scrollY - 8}px`; // 8px acima da mensagem
                        el.style.width = '1px';
                        el.style.height = '1px';
                        el.style.opacity = '0';
                        el.style.pointerEvents = 'none';
                        el.style.zIndex = '-1';
                      }
                    }
                  });
                }
              }}
              style={{ position: 'fixed', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px', zIndex: -1 }}
              aria-hidden="true"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => e.preventDefault()}
            />
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 border-0 shadow-lg" 
            align="center"
            side="top"
            sideOffset={4}
            alignOffset={0}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              // Prevenir fechamento ao clicar dentro do popover ou nos botões
              const target = e.target as HTMLElement;
              const popoverContent = target.closest('[data-radix-popper-content-wrapper]');
              const isButton = target.tagName === 'BUTTON' || target.closest('button');
              
              // Sempre prevenir o fechamento padrão e controlar manualmente
              e.preventDefault();
              
              // Só fechar se clicar realmente fora (não em botões ou dentro do popover)
              if (!popoverContent && !isButton) {
                setIsReactingToMessage(null);
                setShowFullEmojiPicker(false);
              }
            }}
            onEscapeKeyDown={(e) => {
              setIsReactingToMessage(null);
              setShowFullEmojiPicker(false);
            }}
          >
          {showFullEmojiPicker ? (
            <EmojiPicker
              onEmojiSelect={(emoji) => {
                if (isReactingToMessage) {
                  setMessages(prevMessages =>
                    prevMessages.map(msg =>
                      msg.id === isReactingToMessage
                        ? {
                            ...msg,
                            reactions: [
                              ...(msg.reactions || []),
                              { emoji, userId: CURRENT_USER.id }
                            ]
                          }
                        : msg
                    )
                  );
                  setIsReactingToMessage(null);
                  setShowFullEmojiPicker(false);
                  toast.success("Reação adicionada!", {
                    duration: 2000,
                    closeButton: false,
                  });
                }
              }}
            />
          ) : (
            <div 
              className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-lg"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {quickReactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickReaction(emoji);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-9 h-9 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full transition-colors"
                >
                  {emoji}
                </button>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullEmojiPicker(true);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-9 h-9 flex items-center justify-center text-sm hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      )}

      {/* Modal de confirmação para atribuir conversa a si */}
      <Dialog open={isAssignToMeDialogOpen} onOpenChange={setIsAssignToMeDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Tem certeza?</DialogTitle>
            <DialogDescription>
              {conversation?.assignedTo ? (
                <>
                  Esta conversa está atualmente atribuída a <strong>{conversation.assignedTo.name}</strong>.
                  <br /><br />
                  Ao atribuir esta conversa para você, ela não estará mais atribuída a {conversation.assignedTo.name}.
                </>
              ) : (
                <>
                  Esta conversa não está atribuída a ninguém.
                  <br /><br />
                  Ao atribuir esta conversa para você, você será responsável por respondê-la.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignToMeDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (conversation && onConversationUpdate) {
                  onConversationUpdate(conversation.id, {
                    assignedTo: {
                      id: CURRENT_USER.id,
                      name: CURRENT_USER.name,
                      avatar: CURRENT_USER.avatar,
                    },
                  });
                  toast.success("Conversa atribuída a você!", {
                    duration: 2000,
                  });
                  setIsAssignToMeDialogOpen(false);
                }
              }}
            >
              Sim, atribuir a mim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

