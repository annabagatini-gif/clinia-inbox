"use client";

import { ActivityLogsTable } from "@/components/activity-logs/activity-logs-table-simple";
import {
  createUserInvitedLog,
  createUserCreatedLog,
  createInvitationExpiredLog,
  createUserDeletedLog,
  type UserActivityLog,
} from "@/lib/user-activity-logs";

// Dados mockados para demonstração
function generateMockActivities(): UserActivityLog[] {
  const now = new Date();
  const activities: UserActivityLog[] = [];

  // Criar atividades com datas variadas
  const dates = [
    new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 horas atrás
    new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 horas atrás
    new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 dia atrás
    new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
    new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
    new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
  ];

  // Usuários mockados
  const users = [
    "Anna Bagatini",
    "João Silva",
    "Maria Santos",
    "Pedro Oliveira",
    "Carla Ferreira",
    "Roberto Alves",
  ];

  const ips = [
    "189.6.148.77",
    "192.168.1.100",
    "10.0.0.50",
    "172.16.0.25",
    "203.0.113.42",
  ];

  // Adicionar atividades variadas
  activities.push(
    createUserInvitedLog(users[0], ips[0]),
    createUserCreatedLog(users[1], ips[1]),
    createUserInvitedLog(users[2], ips[2]),
    createInvitationExpiredLog(users[3]),
    createUserCreatedLog(users[4], ips[3]),
    createUserDeletedLog(users[5], ips[4]),
    createUserInvitedLog(users[0], ips[0]),
    createUserCreatedLog(users[1], ips[1]),
    createInvitationExpiredLog(users[2]),
    createUserInvitedLog(users[3], ips[2]),
    createUserCreatedLog(users[4], ips[3]),
    createUserDeletedLog(users[5], ips[4]),
  );

  // Ajustar datas das atividades
  activities.forEach((activity, index) => {
    if (index < dates.length) {
      const date = dates[index];
      activity.date = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  });

  return activities;
}

export default function ActivityLogsDemoPage() {
  const mockActivities = generateMockActivities();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold mb-2">📊 Histórico de Atividades</h1>
          <p className="text-muted-foreground">
            Visualize todas as ações realizadas no sistema. Este histórico mostra quem fez o quê e quando,
            facilitando o acompanhamento e a auditoria das atividades da equipe.
          </p>
        </div>

        {/* Componente de Histórico */}
        <ActivityLogsTable logs={mockActivities} />

        {/* Informações adicionais */}
        <div className="bg-muted/30 border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">ℹ️ Funcionalidades Demonstradas</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>✅ Métricas no topo (Total, Hoje, Esta Semana)</li>
            <li>✅ Busca por texto em usuário, detalhes ou endereço IP</li>
            <li>✅ Filtro por tipo de atividade</li>
            <li>✅ Filtro por período (Hoje, Esta semana, Este mês)</li>
            <li>✅ Exportação para CSV</li>
            <li>✅ Cores semânticas por tipo de atividade</li>
            <li>✅ Layout responsivo</li>
            <li>✅ Contador de atividades filtradas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

