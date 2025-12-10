# 📋 Logs de Atividade de Usuários

## Estrutura dos Logs

Cada log de atividade segue o padrão:
- **TIPO DE ATIVIDADE**: Código da ação (ex: `user_invited`)
- **COLEGA**: Nome do usuário que realizou a ação
- **DETALHES**: Descrição completa da ação no formato: "{Nome} realizou a ação: {ação} no recurso: {recurso}"
- **DATA**: Data e hora formatada (ex: "04 de dez. de 2025, 17:49")
- **ENDEREÇO IP**: IP de origem da ação

---

## 1. Usuário Convidado

### TIPO DE ATIVIDADE
```
user_invited
```

### DETALHES
```
{Nome do usuário que convidou} realizou a ação: user_invited no recurso: Invitation
```

### Exemplo Completo
- **TIPO DE ATIVIDADE**: `user_invited`
- **COLEGA**: Anna Bagatini
- **DETALHES**: Anna Bagatini realizou a ação: user_invited no recurso: Invitation
- **DATA**: 04 de dez. de 2025, 17:49
- **ENDEREÇO IP**: 189.6.148.77

---

## 2. Usuário Criado

### TIPO DE ATIVIDADE
```
user_created
```

### DETALHES
```
{Nome do usuário criado} realizou a ação: user_created no recurso: User
```

**OU** (se criado por outro usuário):

```
{Nome do usuário que criou} realizou a ação: user_created no recurso: User
```

### Exemplo Completo
- **TIPO DE ATIVIDADE**: `user_created`
- **COLEGA**: João Silva
- **DETALHES**: João Silva realizou a ação: user_created no recurso: User
- **DATA**: 05 de dez. de 2025, 14:23
- **ENDEREÇO IP**: 192.168.1.100

---

## 3. Usuário com Convite Expirado

### TIPO DE ATIVIDADE
```
user_invitation_expired
```

### DETALHES
```
Sistema realizou a ação: user_invitation_expired no recurso: Invitation
```

**OU** (se quiser incluir o nome do usuário convidado):

```
Convite para {Nome do usuário convidado} expirou. Ação: user_invitation_expired no recurso: Invitation
```

### Exemplo Completo
- **TIPO DE ATIVIDADE**: `user_invitation_expired`
- **COLEGA**: Sistema
- **DETALHES**: Sistema realizou a ação: user_invitation_expired no recurso: Invitation
- **DATA**: 10 de dez. de 2025, 00:00
- **ENDEREÇO IP**: Sistema

---

## 4. Usuário Deletado

### TIPO DE ATIVIDADE
```
user_deleted
```

### DETALHES
```
{Nome do usuário que deletou} realizou a ação: user_deleted no recurso: User
```

### Exemplo Completo
- **TIPO DE ATIVIDADE**: `user_deleted`
- **COLEGA**: Maria Santos
- **DETALHES**: Maria Santos realizou a ação: user_deleted no recurso: User
- **DATA**: 06 de dez. de 2025, 09:15
- **ENDEREÇO IP**: 10.0.0.50

---

## 📝 Notas de Implementação

### Variáveis Dinâmicas
- `{Nome do usuário}`: Nome completo do usuário que realizou a ação
- `{Nome do usuário criado/deletado}`: Nome do usuário afetado pela ação
- `{Data formatada}`: Data no formato "DD de mês de AAAA, HH:MM"
- `{IP}`: Endereço IP de origem da requisição

### Formato de Data
Use `toLocaleDateString` e `toLocaleTimeString` com locale `pt-BR`:
```typescript
const formattedDate = new Date().toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});
// Resultado: "04 de dezembro de 2025, 17:49"
```

### Recursos (Resources)
- `Invitation`: Para ações relacionadas a convites
- `User`: Para ações relacionadas a usuários (criação, deleção)

### Ações (Actions)
- `user_invited`: Convite enviado
- `user_created`: Usuário criado
- `user_invitation_expired`: Convite expirado
- `user_deleted`: Usuário deletado

