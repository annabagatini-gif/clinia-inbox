"use client";

import { useState } from "react";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { ConversationListNew } from "@/components/inbox/conversation-list-new";
import { ChatArea } from "@/components/inbox/chat-area";
import { mockConversations } from "@/lib/mock-data";
import { Conversation } from "@/types/inbox";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [activeTab, setActiveTab] = useState("my");
  const [conversationCounts, setConversationCounts] = useState({
    all: 13,
    my: 8,
    unread: 0,
    unassigned: 3,
  });

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  const handleConversationUpdate = (conversationId: string, updates: Partial<Conversation>) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      )
    );
  };

  const handleNavigateToConversation = (contactName: string, phone: string) => {
    // Procurar uma conversa existente pelo nome do contato
    let foundConversation = conversations.find(conv => 
      conv.name.toLowerCase() === contactName.toLowerCase()
    );
    
    if (!foundConversation) {
      // Criar nova conversa com o nome do contato
      const initials = contactName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || phone.slice(-2);
      
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        name: contactName,
        avatar: initials,
        lastMessage: "",
        timestamp: "Agora",
        unread: false,
        unreadCount: 0,
        channel: "whatsapp",
        tags: [],
        isPinned: false,
        isImportant: false,
        status: "open",
      };
      
      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversationId(newConversation.id);
    } else {
      setSelectedConversationId(foundConversation.id);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F3F4] p-2 gap-2">
      {/* Sidebar - oculta em mobile */}
      <div className="hidden lg:flex">
        <InboxSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          counts={conversationCounts}
        />
      </div>
      
      {/* Lista de conversas - oculta quando conversa está selecionada em mobile */}
      <div className={`${selectedConversationId ? 'hidden md:block' : 'block'}`}>
        <ConversationListNew
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
          activeTab={activeTab}
          onCountsChange={setConversationCounts}
          conversations={conversations}
          onConversationUpdate={handleConversationUpdate}
        />
      </div>
      
      {/* Chat - oculta quando nenhuma conversa está selecionada em mobile */}
      <div className={`flex-1 min-w-0 ${selectedConversationId ? 'block' : 'hidden md:block'}`}>
        <ChatArea
          conversationId={selectedConversationId}
          conversationName={selectedConversation?.name}
          conversation={selectedConversation}
          onBack={() => setSelectedConversationId(undefined)}
          onConversationUpdate={handleConversationUpdate}
          onNavigateToConversation={handleNavigateToConversation}
        />
      </div>
    </div>
  );
}
