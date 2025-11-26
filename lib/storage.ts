import { Conversation, Message } from "@/types/inbox";
import { mockConversations, mockMessages } from "@/lib/mock-data";

const STORAGE_KEYS = {
  CONVERSATIONS: "clinia-inbox-conversations",
  MESSAGES: "clinia-inbox-messages",
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
      
      return [...merged, ...newMockConversations];
    }
  } catch (error) {
    console.error("Erro ao carregar conversas do localStorage:", error);
  }

  return mockConversations;
}

/**
 * Salva conversas no localStorage
 */
export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
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

