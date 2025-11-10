import { Conversation, Message } from "@/types/inbox";

export const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Hailey Garza",
    avatar: "HG",
    lastMessage: "Hi Hailey. Let me...",
    timestamp: "about 2h",
    unread: true,
    priority: "3min",
  },
  {
    id: "2",
    name: "Ivan Deen",
    avatar: "ID",
    lastMessage: "Hi, I have a quest...",
    timestamp: "about 2h",
    unread: false,
  },
  {
    id: "3",
    name: "Jason Shaw",
    avatar: "JS",
    lastMessage: "Is the app down?",
    timestamp: "about 2h",
    unread: false,
  },
  {
    id: "4",
    name: "Robin Benson",
    avatar: "RB",
    lastMessage: "Could you point m...",
    timestamp: "about 2h",
    unread: false,
  },
  {
    id: "5",
    name: "Carla Fité",
    avatar: "CF",
    lastMessage: "I created a new page...",
    timestamp: "about 2h",
    unread: false,
  },
  {
    id: "6",
    name: "Lucy Yoon",
    avatar: "LY",
    lastMessage: "This started happ...",
    timestamp: "about 2h",
    unread: false,
  },
];

export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      sender: "June Jensen",
      content: "Let me take a look on how to solve this issue for you.",
      timestamp: "Nov 9, 8:03 AM",
      isUser: false,
    },
    {
      id: "2",
      sender: "Hailey Garza",
      content: "Hi, my credit card isn't working.",
      timestamp: "Nov 10, 10:00 AM",
      isUser: true,
    },
  ],
};

