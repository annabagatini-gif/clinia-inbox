/**
 * Logs de Atividade de Usuários
 * 
 * Define os tipos de atividade e funções auxiliares para criar logs
 * seguindo o padrão do sistema de auditoria.
 */

export type UserActivityType =
  | "user_invited"
  | "user_created"
  | "user_invitation_expired"
  | "user_deleted";

export interface UserActivityLog {
  activityType: UserActivityType;
  colleague: string; // Nome do usuário que realizou a ação
  details: string; // Descrição completa da ação
  date: string; // Data formatada: "DD de mês de AAAA, HH:MM"
  ipAddress: string; // Endereço IP de origem
}

/**
 * Formata a data no padrão brasileiro usado nos logs
 */
export function formatActivityDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Cria log de atividade: Usuário Convidado
 */
export function createUserInvitedLog(
  invitedBy: string,
  ipAddress: string
): UserActivityLog {
  return {
    activityType: "user_invited",
    colleague: invitedBy,
    details: `${invitedBy} realizou a ação: user_invited no recurso: Invitation`,
    date: formatActivityDate(new Date()),
    ipAddress,
  };
}

/**
 * Cria log de atividade: Usuário Criado
 */
export function createUserCreatedLog(
  createdBy: string,
  ipAddress: string
): UserActivityLog {
  return {
    activityType: "user_created",
    colleague: createdBy,
    details: `${createdBy} realizou a ação: user_created no recurso: User`,
    date: formatActivityDate(new Date()),
    ipAddress,
  };
}

/**
 * Cria log de atividade: Convite Expirado
 */
export function createInvitationExpiredLog(
  invitedUserName?: string
): UserActivityLog {
  const details = invitedUserName
    ? `Convite para ${invitedUserName} expirou. Ação: user_invitation_expired no recurso: Invitation`
    : `Sistema realizou a ação: user_invitation_expired no recurso: Invitation`;

  return {
    activityType: "user_invitation_expired",
    colleague: "Sistema",
    details,
    date: formatActivityDate(new Date()),
    ipAddress: "Sistema",
  };
}

/**
 * Cria log de atividade: Usuário Deletado
 */
export function createUserDeletedLog(
  deletedBy: string,
  ipAddress: string
): UserActivityLog {
  return {
    activityType: "user_deleted",
    colleague: deletedBy,
    details: `${deletedBy} realizou a ação: user_deleted no recurso: User`,
    date: formatActivityDate(new Date()),
    ipAddress,
  };
}

/**
 * Mapeia o tipo de atividade para um label legível em português
 */
export function getActivityTypeLabel(type: UserActivityType): string {
  const labels: Record<UserActivityType, string> = {
    user_invited: "Usuário Convidado",
    user_created: "Usuário Criado",
    user_invitation_expired: "Convite Expirado",
    user_deleted: "Usuário Deletado",
  };

  return labels[type];
}

