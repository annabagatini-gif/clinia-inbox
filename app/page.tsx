"use client";

import { useState } from "react";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { ConversationListNew } from "@/components/inbox/conversation-list-new";
import { ChatArea } from "@/components/inbox/chat-area";
import { mockConversations } from "@/lib/mock-data";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [activeTab, setActiveTab] = useState("my");
  const [conversationCounts, setConversationCounts] = useState({
    all: 13,
    my: 8,
    unread: 0,
    unassigned: 3,
  });

  const selectedConversation = mockConversations.find(
    (c) => c.id === selectedConversationId
  );

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
        />
      </div>
      
      {/* Chat - oculta quando nenhuma conversa está selecionada em mobile */}
      <div className={`flex-1 ${selectedConversationId ? 'block' : 'hidden md:block'}`}>
        <ChatArea
          conversationId={selectedConversationId}
          conversationName={selectedConversation?.name}
          onBack={() => setSelectedConversationId(undefined)}
        />
      </div>
    </div>
  );
}
