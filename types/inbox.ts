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
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isUser: boolean;
  isSummary?: boolean;
  image?: string;
  attachment?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  };
  contacts?: Array<{
    id: string;
    name: string;
    avatar: string;
    phone: string;
  }>;
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

