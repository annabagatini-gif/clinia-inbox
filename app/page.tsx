"use client";

import { useState, useEffect } from "react";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { ConversationListNew } from "@/components/inbox/conversation-list-new";
import { ChatArea } from "@/components/inbox/chat-area";
import { OnboardingTour } from "@/components/inbox/onboarding-tour";
import { loadConversations, saveConversations, deleteConversation, restoreMariaSilva } from "@/lib/storage";
import { Conversation } from "@/types/inbox";
import { CURRENT_USER } from "@/lib/user-config";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [activeTab, setActiveTab] = useState("my");
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [conversationCounts, setConversationCounts] = useState({
    all: 13,
    my: 8,
    unread: 0,
    unassigned: 3,
  });

  const handleConversationUpdate = (conversationId: string, updates: Partial<Conversation>) => {
    setConversations((prev) => {
      const updated = prev.map((conv) =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      );
      return updated;
    });
  };

  // Carregar conversas do localStorage na inicialização
  useEffect(() => {
    // Garantir que a Maria Silva sempre esteja presente
    restoreMariaSilva();
    const loadedConversations = loadConversations();
    setConversations(loadedConversations);
    
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Se houver ?conversation=ID na URL, seleciona essa conversa
      const conversationId = urlParams.get("conversation");
      if (conversationId) {
        const foundConversation = loadedConversations.find(conv => conv.id === conversationId);
        if (foundConversation) {
          setSelectedConversationId(foundConversation.id);
          
          // Se houver ?assigned=true, atribui a conversa ao usuário atual
          if (urlParams.get("assigned") === "true") {
            const updated = loadedConversations.map((conv) =>
              conv.id === conversationId ? {
                ...conv,
                assignedTo: {
                  id: "user2",
                  name: "Anna B",
                  avatar: "AB",
                },
              } : conv
            );
            setConversations(updated);
          }
          return;
        }
      }
      
      // Se houver ?drawer=true na URL, seleciona a primeira conversa automaticamente
      if (urlParams.get("drawer") === "true" && loadedConversations.length > 0) {
        const firstConv = loadedConversations[0];
        setSelectedConversationId(firstConv.id);
        
        // Se também houver ?assigned=true, atribui
        if (urlParams.get("assigned") === "true") {
          const updated = loadedConversations.map((conv) =>
            conv.id === firstConv.id ? {
              ...conv,
              assignedTo: {
                id: "user2",
                name: "Anna B",
                avatar: "AB",
              },
            } : conv
          );
          setConversations(updated);
        }
        return;
      }
      
      // Se houver ?assigned=true, busca Maria Silva e atribui
      if (urlParams.get("assigned") === "true") {
        const mariaConversation = loadedConversations.find(
          conv => conv.name.toLowerCase().includes("maria") && conv.name.toLowerCase().includes("silva")
        );
        if (mariaConversation) {
          setSelectedConversationId(mariaConversation.id);
          const updated = loadedConversations.map((conv) =>
            conv.id === mariaConversation.id ? {
              ...conv,
              assignedTo: {
                id: "user2",
                name: "Anna B",
                avatar: "AB",
              },
            } : conv
          );
          setConversations(updated);
          return;
        }
      }
      
      // Se houver ?maria=true ou nenhum parâmetro, seleciona Maria Silva por padrão
      const mariaConversation = loadedConversations.find(
        conv => conv.name.toLowerCase().includes("maria") && conv.name.toLowerCase().includes("silva")
      );
      if (mariaConversation) {
        setSelectedConversationId(mariaConversation.id);
      } else if (loadedConversations.length > 0) {
        // Se não encontrar Maria Silva, seleciona a primeira conversa
        setSelectedConversationId(loadedConversations[0].id);
      }
    }
  }, []);

  // Garantir que a Maria Silva sempre esteja presente após carregar
  useEffect(() => {
    if (conversations.length > 0) {
      const hasMariaSilva = conversations.some(c => c.id === "1");
      if (!hasMariaSilva) {
        restoreMariaSilva();
        const reloaded = loadConversations();
        setConversations(reloaded);
      }
    }
  }, [conversations.length]);

  // Salvar conversas no localStorage sempre que houver mudanças
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations]);

  // Marcar conversa como lida quando for selecionada
  useEffect(() => {
    if (selectedConversationId) {
      const selectedConv = conversations.find(c => c.id === selectedConversationId);
      if (selectedConv && (selectedConv.unread || selectedConv.unreadCount > 0)) {
        handleConversationUpdate(selectedConversationId, {
          unread: false,
          unreadCount: 0,
        });
      }
    }
  }, [selectedConversationId]);

  // Garantir que a Maria Silva sempre esteja presente antes de usar as conversas
  const conversationsWithMaria = (() => {
    const hasMariaSilva = conversations.some(c => c.id === "1");
    if (!hasMariaSilva) {
      restoreMariaSilva();
      const reloaded = loadConversations();
      // Atualizar o estado também
      if (reloaded.length !== conversations.length || !conversations.some(c => c.id === "1")) {
        setConversations(reloaded);
      }
      return reloaded;
    }
    // Garantir que a Maria Silva tenha status "open" para aparecer na aba "all"
    const mariaIndex = conversations.findIndex(c => c.id === "1");
    if (mariaIndex !== -1 && conversations[mariaIndex].status !== "open") {
      const updated = conversations.map((conv, idx) => 
        idx === mariaIndex ? { ...conv, status: "open" as const } : conv
      );
      setConversations(updated);
      return updated;
    }
    return conversations;
  })();

  const selectedConversation = conversationsWithMaria.find(
    (c) => c.id === selectedConversationId
  );

  const handleConversationDelete = (conversationIds: string[]) => {
    // Não permitir deletar a Maria Silva (ID "1")
    const filteredIds = conversationIds.filter(id => id !== "1");
    if (filteredIds.length === 0) return;
    
    // Deletar do localStorage também
    filteredIds.forEach(id => {
      deleteConversation(id);
    });
    
    setConversations((prev) => {
      const updated = prev.filter((conv) => !filteredIds.includes(conv.id));
      // Garantir que a Maria Silva sempre esteja presente
      const hasMariaSilva = updated.some(c => c.id === "1");
      if (!hasMariaSilva) {
        restoreMariaSilva();
        const reloaded = loadConversations();
        return reloaded;
      }
      // Se a conversa selecionada foi deletada, limpar seleção
      if (filteredIds.includes(selectedConversationId || "")) {
        setSelectedConversationId(undefined);
      }
      return updated;
    });
  };

  const handleConversationAdd = (conversation: Conversation) => {
    setConversations((prev) => [conversation, ...prev]);
    setSelectedConversationId(conversation.id);
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
      
      setConversations((prev) => {
        const updated = [newConversation, ...prev];
        return updated;
      });
      setSelectedConversationId(newConversation.id);
    } else {
      setSelectedConversationId(foundConversation.id);
    }
  };

  // Verificar se deve iniciar o tour via URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("tour") === "true") {
        setIsTourOpen(true);
      }
    }
  }, []);

  return (
    <>
      <OnboardingTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
      
      {/* Botão flutuante para iniciar o tour */}
      {!isTourOpen && (
        <Button
          onClick={() => setIsTourOpen(true)}
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
          size="icon"
          variant="default"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      )}
      
      <div className="flex h-screen overflow-hidden bg-sidebar p-2 gap-2">
        {/* Sidebar - oculta em mobile */}
        <div className="hidden lg:flex" data-tour="sidebar">
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
          conversations={conversationsWithMaria}
          onConversationUpdate={handleConversationUpdate}
          onConversationDelete={handleConversationDelete}
          onConversationAdd={handleConversationAdd}
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
    </>
  );
}
