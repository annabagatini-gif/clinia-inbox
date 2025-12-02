import { Conversation, Message } from "@/types/inbox";
import { mockConversations, mockMessages } from "@/lib/mock-data";
import { CURRENT_USER } from "@/lib/user-config";

const STORAGE_KEYS = {
  CONVERSATIONS: "clinia-inbox-conversations",
  MESSAGES: "clinia-inbox-messages",
  TAGS: "clinia-inbox-tags",
};

/**
 * Carrega conversas do localStorage ou retorna dados mockados
 */
export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") {
    return mockConversations;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Criar um mapa das conversas mockadas por ID para facilitar a mesclagem
      const mockMap = new Map(mockConversations.map((c) => [c.id, c]));
      
      // Mesclar conversas salvas com mockadas, atualizando campos que podem ter sido adicionados
      const merged = parsed.map((saved: Conversation) => {
        const mock = mockMap.get(saved.id);
        if (mock) {
          // Mesclar dados salvos com mockados, garantindo que campos novos sejam atualizados dos mockados
          return {
            ...mock,
            ...saved,
            // Sempre usar campos novos dos mockados se existirem (para garantir atualizações)
            channel: mock.channel, // Sempre usar o channel dos mockados
            phone: mock.phone || saved.phone,
            callHistory: mock.callHistory || saved.callHistory,
            appointments: mock.appointments || saved.appointments,
          };
        }
        return saved;
      });
      
      // Adicionar novas conversas mockadas que não estão salvas
      const storedIds = new Set(parsed.map((c: Conversation) => c.id));
      const newMockConversations = mockConversations.filter(
        (c) => !storedIds.has(c.id)
      );
      
      const result = [...merged, ...newMockConversations];
      
      // Garantir que a conversa da Maria Silva (ID "1") sempre esteja presente e atribuída ao usuário atual
      const mariaSilvaIndex = result.findIndex(c => c.id === "1");
      if (mariaSilvaIndex === -1) {
        const mariaSilva = mockConversations.find(c => c.id === "1");
        if (mariaSilva) {
          result.unshift({
            ...mariaSilva,
            status: "open",
            assignedTo: {
              id: CURRENT_USER.id,
              name: CURRENT_USER.name,
              avatar: CURRENT_USER.avatar,
            },
          });
        }
      } else {
        // Garantir que está atribuída ao usuário atual e tem status "open"
        const mariaSilva = result[mariaSilvaIndex];
        if (mariaSilva.assignedTo?.id !== CURRENT_USER.id || mariaSilva.status !== "open") {
          result[mariaSilvaIndex] = {
            ...mariaSilva,
            status: "open",
            assignedTo: {
              id: CURRENT_USER.id,
              name: CURRENT_USER.name,
              avatar: CURRENT_USER.avatar,
            },
          };
        }
      }
      
      return result;
    }
  } catch (error) {
    console.error("Erro ao carregar conversas do localStorage:", error);
  }

  // Garantir que a Maria Silva sempre esteja presente mesmo quando não há localStorage
  const result = [...mockConversations];
  const mariaSilvaIndex = result.findIndex(c => c.id === "1");
  if (mariaSilvaIndex !== -1) {
    // Garantir que está atribuída ao usuário atual e tem status "open"
    const mariaSilva = result[mariaSilvaIndex];
    if (mariaSilva.assignedTo?.id !== CURRENT_USER.id || mariaSilva.status !== "open") {
      result[mariaSilvaIndex] = {
        ...mariaSilva,
        status: "open",
        assignedTo: {
          id: CURRENT_USER.id,
          name: CURRENT_USER.name,
          avatar: CURRENT_USER.avatar,
        },
      };
    }
  }
  
  return result;
}

/**
 * Salva conversas no localStorage
 */
export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;

  try {
    // Garantir que a Maria Silva sempre esteja presente ao salvar com status "open"
    const hasMariaSilva = conversations.some(c => c.id === "1");
    let conversationsToSave = conversations;
    
    if (!hasMariaSilva) {
      const mariaSilva = mockConversations.find(c => c.id === "1");
      if (mariaSilva) {
        conversationsToSave = [{
          ...mariaSilva,
          status: "open",
          assignedTo: {
            id: CURRENT_USER.id,
            name: CURRENT_USER.name,
            avatar: CURRENT_USER.avatar,
          },
        }, ...conversations];
      }
    } else {
      // Garantir que a Maria Silva tenha status "open" ao salvar
      conversationsToSave = conversations.map((conv) =>
        conv.id === "1"
          ? {
              ...conv,
              status: "open",
              assignedTo: {
                id: CURRENT_USER.id,
                name: CURRENT_USER.name,
                avatar: CURRENT_USER.avatar,
              },
            }
          : conv
      );
    }
    
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversationsToSave));
  } catch (error) {
    console.error("Erro ao salvar conversas no localStorage:", error);
  }
}

/**
 * Carrega mensagens do localStorage ou retorna dados mockados
 */
export function loadMessages(): Record<string, Message[]> {
  if (typeof window === "undefined") {
    return mockMessages;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Mesclar com mensagens mockadas para conversas que não têm mensagens salvas
      const merged = { ...mockMessages, ...parsed };
      return merged;
    }
  } catch (error) {
    console.error("Erro ao carregar mensagens do localStorage:", error);
  }

  return mockMessages;
}

/**
 * Salva mensagens de uma conversa específica no localStorage
 */
export function saveMessages(conversationId: string, messages: Message[]): void {
  if (typeof window === "undefined") return;

  try {
    const allMessages = loadMessages();
    allMessages[conversationId] = messages;
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));
  } catch (error) {
    console.error("Erro ao salvar mensagens no localStorage:", error);
  }
}

/**
 * Salva todas as mensagens no localStorage
 */
export function saveAllMessages(messages: Record<string, Message[]>): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (error) {
    console.error("Erro ao salvar todas as mensagens no localStorage:", error);
  }
}

/**
 * Remove uma conversa e suas mensagens do localStorage
 */
export function deleteConversation(conversationId: string): void {
  if (typeof window === "undefined") return;

  try {
    // Não permitir deletar a conversa da Maria Silva (ID "1")
    if (conversationId === "1") {
      console.warn("Não é possível deletar a conversa da Maria Silva (conversa de demonstração)");
      return;
    }

    // Remover conversa
    const conversations = loadConversations();
    const filtered = conversations.filter((c) => c.id !== conversationId);
    saveConversations(filtered);

    // Remover mensagens
    const allMessages = loadMessages();
    delete allMessages[conversationId];
    saveAllMessages(allMessages);
  } catch (error) {
    console.error("Erro ao deletar conversa do localStorage:", error);
  }
}

/**
 * Limpa todos os dados salvos (útil para reset)
 */
export function clearStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  } catch (error) {
    console.error("Erro ao limpar localStorage:", error);
  }
}

/**
 * Restaura a conversa da Maria Silva caso ela tenha sido deletada
 */
export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  createdBy?: string;
  category?: string;
  usageCount?: number; // Contador de uso (quantas conversas usam)
}

const DEFAULT_TAGS: Tag[] = [
  { id: "1", name: "Exemplo 3", color: "#FCD34D", createdAt: new Date().toISOString() },
  { id: "2", name: "Exemplo", color: "#EF4444", createdAt: new Date().toISOString() },
  { id: "3", name: "Carteira Bru", color: "#A855F7", createdAt: new Date().toISOString() },
  { id: "4", name: "Neutro", color: "#10B981", createdAt: new Date().toISOString() },
  { id: "5", name: "Aviso novo número", color: "#84CC16", createdAt: new Date().toISOString() },
];

/**
 * Carrega etiquetas do localStorage ou retorna tags padrão
 */
export function loadTags(): Tag[] {
  if (typeof window === "undefined") {
    return DEFAULT_TAGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar etiquetas do localStorage:", error);
  }

  return DEFAULT_TAGS;
}

/**
 * Salva etiquetas no localStorage
 */
export function saveTags(tags: Tag[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  } catch (error) {
    console.error("Erro ao salvar etiquetas no localStorage:", error);
  }
}

/**
 * Adiciona uma nova etiqueta
 */
export function addTag(tag: Omit<Tag, "id" | "createdAt">): Tag {
  const tags = loadTags();
  const newTag: Tag = {
    ...tag,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const updatedTags = [...tags, newTag];
  saveTags(updatedTags);
  return newTag;
}

/**
 * Remove uma etiqueta
 */
export function deleteTag(tagId: string): void {
  const tags = loadTags();
  const updatedTags = tags.filter(tag => tag.id !== tagId);
  saveTags(updatedTags);
}

export function restoreMariaSilva(): void {
  if (typeof window === "undefined") return;

  try {
    const conversations = loadConversations();
    const mariaSilvaIndex = conversations.findIndex(c => c.id === "1");
    
    if (mariaSilvaIndex === -1) {
      // Se não existe, adiciona atribuída ao usuário atual com status "open"
      const mariaSilva = mockConversations.find(c => c.id === "1");
      if (mariaSilva) {
        const mariaSilvaWithUser: Conversation = {
          ...mariaSilva,
          status: "open" as const,
          assignedTo: {
            id: CURRENT_USER.id,
            name: CURRENT_USER.name,
            avatar: CURRENT_USER.avatar,
          },
        };
        const updated = [mariaSilvaWithUser, ...conversations];
        saveConversations(updated);
      }
    } else {
      // Se existe, garante que está atribuída ao usuário atual e tem status "open"
      const mariaSilva = conversations[mariaSilvaIndex];
      if (mariaSilva.assignedTo?.id !== CURRENT_USER.id || mariaSilva.status !== "open") {
        const updated: Conversation[] = conversations.map((conv) =>
          conv.id === "1"
            ? {
                ...conv,
                status: "open" as const,
                assignedTo: {
                  id: CURRENT_USER.id,
                  name: CURRENT_USER.name,
                  avatar: CURRENT_USER.avatar,
                },
              }
            : conv
        );
        saveConversations(updated);
      }
    }
  } catch (error) {
    console.error("Erro ao restaurar Maria Silva:", error);
  }
}

