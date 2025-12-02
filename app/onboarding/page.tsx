"use client";

import { useEffect, useState } from "react";
import { OnboardingTour } from "@/components/inbox/onboarding-tour";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { ConversationListNew } from "@/components/inbox/conversation-list-new";
import { ChatArea } from "@/components/inbox/chat-area";
import { loadConversations, restoreMariaSilva } from "@/lib/storage";
import { Conversation } from "@/types/inbox";

export default function OnboardingPage() {
  const [tourOpen, setTourOpen] = useState(false);
  const [tourPaused, setTourPaused] = useState(false);
  const [goToStepId, setGoToStepId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [tab, setTab] = useState("my");
  const [counts, setCounts] = useState({ all: 13, my: 8, unread: 0, unassigned: 3 });

  useEffect(() => {
    restoreMariaSilva();
    const loaded = loadConversations();
    setConversations(loaded);
    const maria = loaded.find(c => c.name.toLowerCase().includes("maria"));
    if (maria) setSelectedId(maria.id);
    setTimeout(() => setTourOpen(true), 1000);
  }, []);

  const selected = conversations.find(c => c.id === selectedId);

  return (
    <>
      <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} isPaused={tourPaused} goToStepId={goToStepId} />
      <div className="flex h-screen overflow-hidden bg-sidebar p-2 gap-2">
        <div className="hidden lg:flex">
          <InboxSidebar 
            activeTab={tab} 
            onTabChange={setTab} 
            counts={counts}
            onNotificationDialogChange={(isOpen) => {
              // Pausar o tour quando o modal de notificações abrir
              if (isOpen && tourOpen) {
                setTourPaused(true);
              } else if (!isOpen && tourPaused) {
                // Retomar o tour quando o modal fechar
                setTourPaused(false);
              }
            }}
            onInternalChatDialogChange={(isOpen) => {
              // Pausar o tour quando o modal de chat interno abrir
              if (isOpen && tourOpen) {
                setTourPaused(true);
              } else if (!isOpen) {
                // Retomar o tour sempre que o modal fechar
                setTourPaused(false);
              }
            }}
            onInternalChatCreated={() => {
              // Quando um chat interno é criado, destacar a sidebar e a barra de ícones
              if (tourOpen) {
                setTourPaused(false);
                // Pequeno delay para garantir que o chat foi renderizado
                setTimeout(() => {
                  setGoToStepId("internal-chat-area");
                  // Resetar após um tempo para permitir mudanças futuras
                  setTimeout(() => setGoToStepId(null), 100);
                }, 100);
              }
            }}
          />
        </div>
        <div className={selectedId ? "hidden md:block" : "block"}>
          <ConversationListNew
            selectedId={selectedId}
            onSelect={setSelectedId}
            activeTab={tab}
            onCountsChange={setCounts}
            conversations={conversations}
            onConversationUpdate={() => {}}
            onConversationDelete={() => {}}
            onConversationAdd={() => {}}
          />
        </div>
        <div className={`flex-1 min-w-0 ${selectedId ? "block" : "hidden md:block"}`}>
          <ChatArea
            conversationId={selectedId}
            conversationName={selected?.name}
            conversation={selected}
            onBack={() => setSelectedId(undefined)}
            onConversationUpdate={() => {}}
            onNavigateToConversation={() => {}}
          />
        </div>
      </div>
    </>
  );
}

