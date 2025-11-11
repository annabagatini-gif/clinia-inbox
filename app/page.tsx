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
    <div className="flex h-screen overflow-hidden bg-[#F1F3F4] p-2 gap-2 items-center justify-center">
      <div className="flex h-full w-full max-w-[1800px] gap-2">
        <InboxSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <ConversationListNew
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
          activeTab={activeTab}
        />
        <ChatArea
          conversationId={selectedConversationId}
          conversationName={selectedConversation?.name}
        />
      </div>
    </div>
  );
}
