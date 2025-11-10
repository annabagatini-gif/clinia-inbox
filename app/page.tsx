"use client";

import { useState } from "react";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { ConversationListNew } from "@/components/inbox/conversation-list-new";
import { ChatArea } from "@/components/inbox/chat-area";
import { mockConversations } from "@/lib/mock-data";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();

  const selectedConversation = mockConversations.find(
    (c) => c.id === selectedConversationId
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background p-2 gap-2">
      <InboxSidebar />
      <ConversationListNew
        selectedId={selectedConversationId}
        onSelect={setSelectedConversationId}
      />
      <ChatArea
        conversationId={selectedConversationId}
        conversationName={selectedConversation?.name}
      />
    </div>
  );
}
