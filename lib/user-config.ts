/**
 * Configuração do usuário atual
 */
export const CURRENT_USER = {
  id: "user2",
  name: "Anna B",
  avatar: "AB",
};

/**
 * Verifica se uma conversa está atribuída ao usuário atual
 */
export function isConversationAssignedToMe(conversation?: { assignedTo?: { id: string } }): boolean {
  if (!conversation) return false;
  return conversation.assignedTo?.id === CURRENT_USER.id;
}

/**
 * Verifica se uma conversa é um grupo (para implementação futura)
 */
export function isGroupConversation(conversation?: { channel?: string }): boolean {
  // Por enquanto, grupos não estão implementados
  // Quando implementar, verificar se conversation.type === "group" ou similar
  return false;
}

/**
 * Verifica se o usuário pode responder na conversa
 */
export function canUserRespond(conversation?: { assignedTo?: { id: string } }): boolean {
  if (!conversation) return false;
  // Pode responder se estiver atribuída a ele OU se for um grupo que ele pertence
  return isConversationAssignedToMe(conversation) || isGroupConversation(conversation);
}

