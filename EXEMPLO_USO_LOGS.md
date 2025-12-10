# 💡 Exemplos de Uso dos Logs de Atividade

## Exemplo 1: Usuário Convidado

```typescript
import { createUserInvitedLog } from "@/lib/user-activity-logs";

// Quando um usuário convida outro
const log = createUserInvitedLog(
  "Anna Bagatini", // Nome de quem convidou
  "189.6.148.77"  // IP de origem
);

// Resultado:
// {
//   activityType: "user_invited",
//   colleague: "Anna Bagatini",
//   details: "Anna Bagatini realizou a ação: user_invited no recurso: Invitation",
//   date: "04 de dezembro de 2025, 17:49",
//   ipAddress: "189.6.148.77"
// }
```

---

## Exemplo 2: Usuário Criado

```typescript
import { createUserCreatedLog } from "@/lib/user-activity-logs";

// Quando um novo usuário é criado no sistema
const log = createUserCreatedLog(
  "João Silva",   // Nome de quem criou (ou o próprio usuário se auto-cadastro)
  "192.168.1.100" // IP de origem
);

// Resultado:
// {
//   activityType: "user_created",
//   colleague: "João Silva",
//   details: "João Silva realizou a ação: user_created no recurso: User",
//   date: "05 de dezembro de 2025, 14:23",
//   ipAddress: "192.168.1.100"
// }
```

---

## Exemplo 3: Convite Expirado

```typescript
import { createInvitationExpiredLog } from "@/lib/user-activity-logs";

// Quando um convite expira (processo automático)
const log = createInvitationExpiredLog("Maria Oliveira");

// Resultado:
// {
//   activityType: "user_invitation_expired",
//   colleague: "Sistema",
//   details: "Convite para Maria Oliveira expirou. Ação: user_invitation_expired no recurso: Invitation",
//   date: "10 de dezembro de 2025, 00:00",
//   ipAddress: "Sistema"
// }

// OU sem nome do usuário:
const logSemNome = createInvitationExpiredLog();

// Resultado:
// {
//   activityType: "user_invitation_expired",
//   colleague: "Sistema",
//   details: "Sistema realizou a ação: user_invitation_expired no recurso: Invitation",
//   date: "10 de dezembro de 2025, 00:00",
//   ipAddress: "Sistema"
// }
```

---

## Exemplo 4: Usuário Deletado

```typescript
import { createUserDeletedLog } from "@/lib/user-activity-logs";

// Quando um usuário é deletado
const log = createUserDeletedLog(
  "Maria Santos", // Nome de quem deletou
  "10.0.0.50"    // IP de origem
);

// Resultado:
// {
//   activityType: "user_deleted",
//   colleague: "Maria Santos",
//   details: "Maria Santos realizou a ação: user_deleted no recurso: User",
//   date: "06 de dezembro de 2025, 09:15",
//   ipAddress: "10.0.0.50"
// }
```

---

## Exemplo Completo: Integração com API

```typescript
import {
  createUserInvitedLog,
  createUserCreatedLog,
  createInvitationExpiredLog,
  createUserDeletedLog,
  type UserActivityLog,
} from "@/lib/user-activity-logs";

// Função para obter IP do cliente (exemplo)
function getClientIP(request: Request): string {
  // Implementação depende do seu framework
  return request.headers.get("x-forwarded-for") || "0.0.0.0";
}

// Handler para convidar usuário
async function handleInviteUser(
  invitedBy: string,
  request: Request
) {
  // ... lógica de convite ...
  
  // Criar log
  const log = createUserInvitedLog(
    invitedBy,
    getClientIP(request)
  );
  
  // Salvar log no banco de dados
  await saveActivityLog(log);
}

// Handler para criar usuário
async function handleCreateUser(
  createdBy: string,
  request: Request
) {
  // ... lógica de criação ...
  
  const log = createUserCreatedLog(
    createdBy,
    getClientIP(request)
  );
  
  await saveActivityLog(log);
}

// Job agendado para verificar convites expirados
async function checkExpiredInvitations() {
  const expiredInvitations = await getExpiredInvitations();
  
  for (const invitation of expiredInvitations) {
    const log = createInvitationExpiredLog(invitation.userName);
    await saveActivityLog(log);
  }
}

// Handler para deletar usuário
async function handleDeleteUser(
  deletedBy: string,
  request: Request
) {
  // ... lógica de deleção ...
  
  const log = createUserDeletedLog(
    deletedBy,
    getClientIP(request)
  );
  
  await saveActivityLog(log);
}

// Função auxiliar para salvar no banco
async function saveActivityLog(log: UserActivityLog) {
  // Implementação depende do seu ORM/banco de dados
  // Exemplo com Prisma:
  // await prisma.activityLog.create({ data: log });
}
```

---

## Exemplo: Exibição na Tabela

```typescript
import { getActivityTypeLabel } from "@/lib/user-activity-logs";

// Componente React para exibir o log
function ActivityLogRow({ log }: { log: UserActivityLog }) {
  return (
    <tr>
      <td>{getActivityTypeLabel(log.activityType)}</td>
      <td>{log.colleague}</td>
      <td>{log.details}</td>
      <td>{log.date}</td>
      <td>{log.ipAddress}</td>
    </tr>
  );
}
```

