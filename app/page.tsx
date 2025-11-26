"use client";

import { useState, useEffect } from "react";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { ConversationListNew } from "@/components/inbox/conversation-list-new";
import { ChatArea } from "@/components/inbox/chat-area";
import { loadConversations, saveConversations, deleteConversation } from "@/lib/storage";
import { Conversation } from "@/types/inbox";
import { CURRENT_USER } from "@/lib/user-config";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [activeTab, setActiveTab] = useState("my");
  const [conversationCounts, setConversationCounts] = useState({
    all: 13,
    my: 8,
    unread: 0,
    unassigned: 3,
  });

  // Carregar conversas do localStorage na inicialização
  useEffect(() => {
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
          return;
        }
      }
      
      // Se houver ?drawer=true na URL, seleciona a primeira conversa automaticamente
      if (urlParams.get("drawer") === "true" && loadedConversations.length > 0) {
        setSelectedConversationId(loadedConversations[0].id);
        return;
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

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  const handleConversationUpdate = (conversationId: string, updates: Partial<Conversation>) => {
    setConversations((prev) => {
      const updated = prev.map((conv) =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      );
      return updated;
    });
  };

  const handleConversationDelete = (conversationIds: string[]) => {
    // Deletar do localStorage também
    conversationIds.forEach(id => {
      deleteConversation(id);
    });
    
    setConversations((prev) => {
      const updated = prev.filter((conv) => !conversationIds.includes(conv.id));
      // Se a conversa selecionada foi deletada, limpar seleção
      if (conversationIds.includes(selectedConversationId || "")) {
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
  );
}
