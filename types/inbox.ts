export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  priority?: string; // "3min", "5min", etc.
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

