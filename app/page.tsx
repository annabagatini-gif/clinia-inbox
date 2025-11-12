"use client";

import { useState } from "react";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { ConversationListNew } from "@/components/inbox/conversation-list-new";
import { ChatArea } from "@/components/inbox/chat-area";
import { mockConversations } from "@/lib/mock-data";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [activeTab, setActiveTab] = useState("my");

  const selectedConversation = mockConversations.find(
    (c) => c.id === selectedConversationId
  );

  return (
    <div className="flex h-screen bg-[#F1F3F4] p-2 gap-2">
      {/* Sidebar - oculta em mobile */}
      <div className="hidden lg:flex overflow-hidden">
        <InboxSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Lista de conversas - oculta quando conversa está selecionada em mobile */}
      <div className={`${selectedConversationId ? 'hidden md:block' : 'block'} overflow-visible`}>
        <ConversationListNew
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
          activeTab={activeTab}
        />
      </div>
      
      {/* Chat - oculta quando nenhuma conversa está selecionada em mobile */}
      <div className={`flex-1 overflow-hidden ${selectedConversationId ? 'block' : 'hidden md:block'}`}>
        <ChatArea
          conversationId={selectedConversationId}
          conversationName={selectedConversation?.name}
          onBack={() => setSelectedConversationId(undefined)}
        />
      </div>
    </div>
  );
}
