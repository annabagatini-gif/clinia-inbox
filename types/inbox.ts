export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  unreadCount: number;
  channel: "whatsapp" | "instagram";
  tags: string[];
  isPinned: boolean;
  isImportant: boolean;
  assignedTo?: {
    id: string;
    name: string;
    avatar: string;
  };
  status: "open" | "closed" | "blocked";
  automationEnabled?: boolean;
  activeAutomations?: string[]; // IDs das automações ativas nesta conversa
  isConverted?: boolean;
  phone?: string;
  observations?: string; // Observações sobre o contato
  callHistory?: Array<{
    id: string;
    type: "incoming" | "outgoing" | "missed";
    date: string;
    duration?: number;
  }>;
  appointments?: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    status: "scheduled" | "completed" | "cancelled";
  }>;
}

export type MessageStatus = 
  | "sent"           // Enviada (check simples)
  | "delivered"      // Entregue (dois checks)
  | "read"           // Lida (dois checks azuis)
  | "error_internet" // Erro de internet (check simples)
  | "error_credits"  // Falta de créditos Gupshup (bubble vermelha)
  | "error_app_down" // App Clinia fora do ar (check simples)
  | "error_24h_window"; // Fora da janela de 24h (check simples)

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isUser: boolean;
  isSummary?: boolean;
  isFavorite?: boolean;
  status?: MessageStatus; // Status de entrega/erro da mensagem
  replyTo?: {
    id: string;
    content: string;
    sender: string;
  };
  reactions?: Array<{
    emoji: string;
    userId: string;
  }>;
  image?: string;
  attachment?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  };
  audio?: {
    url: string;
    duration: number;
    transcription?: string;
  };
  contacts?: Array<{
    id: string;
    name: string;
    avatar: string;
    phone: string;
  }>;
  deletedForEveryone?: boolean;
  tagChanges?: {
    added: string[];
    removed: string[];
    changedBy?: string; // Nome do usuário que fez a mudança
  };
}

export interface Annotation {
  id: string;
  conversationId: string;
  content: string;
  type: "note" | "reminder";
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
  reminderDate?: string;
  reminderTime?: string;
  isCompleted?: boolean;
}

