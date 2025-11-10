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
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

