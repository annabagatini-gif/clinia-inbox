# 🎨 Padrões de UI/UX para Logs de Atividade

## Como Empresas Mostram Logs de Atividade aos Usuários

---

## 📊 1. Tabela com Filtros e Busca (Padrão Mais Comum)

### Características:
- **Tabela responsiva** com colunas: Tipo, Usuário, Detalhes, Data, IP
- **Filtros avançados** no topo (tipo de atividade, período, usuário)
- **Busca por texto** nos detalhes
- **Paginação** ou scroll infinito
- **Exportação** para CSV/Excel

### Exemplos:
- **Microsoft Azure AD**: Tabela com filtros de data, usuário, tipo de atividade
- **Google Workspace Admin**: Tabela com busca e filtros múltiplos
- **Slack Audit Logs**: Tabela com filtros por ação, usuário, data

### Vantagens:
✅ Fácil de escanear visualmente  
✅ Permite comparação entre registros  
✅ Suporta muitos dados  
✅ Filtros poderosos para análise

---

## 📅 2. Timeline/Feed de Atividades

### Características:
- **Linha do tempo vertical** com eventos ordenados por data
- **Agrupamento por data** ("Hoje", "Ontem", "Última semana")
- **Ícones visuais** para cada tipo de ação
- **Cards compactos** com informações essenciais
- **Expandir para ver detalhes** completos

### Exemplos:
- **GitHub Activity Feed**: Timeline com commits, PRs, issues
- **Notion Activity Log**: Feed cronológico de mudanças
- **Linear Activity Timeline**: Histórico de mudanças em issues

### Vantagens:
✅ Narrativa clara do que aconteceu  
✅ Fácil de entender o fluxo temporal  
✅ Visualmente atraente  
✅ Bom para poucos registros

---

## 🎯 3. Dashboard com Métricas e Gráficos

### Características:
- **Cards de métricas** no topo (total de ações, usuários ativos, etc.)
- **Gráficos** de atividade ao longo do tempo
- **Tabela resumida** abaixo com últimas atividades
- **Filtros de período** (hoje, semana, mês, customizado)

### Exemplos:
- **Oracle Activity Reports**: Dashboard com KPIs e gráficos
- **AWS CloudTrail Dashboard**: Métricas e visualizações
- **Datadog Audit Logs**: Dashboard com gráficos e métricas

### Vantagens:
✅ Visão geral rápida  
✅ Identifica padrões e tendências  
✅ Bom para gestores e admins  
✅ Dados agregados úteis

---

## 🔍 4. Vista Detalhada com Modal/Sidebar

### Características:
- **Lista compacta** na esquerda (últimas atividades)
- **Modal ou sidebar** abre ao clicar em um item
- **Detalhes completos** no modal (JSON, metadados, etc.)
- **Navegação** entre registros no modal

### Exemplos:
- **Stripe Dashboard**: Lista de eventos com modal de detalhes
- **Auth0 Logs**: Lista com expand para ver detalhes
- **Segment Event Stream**: Lista com drawer lateral

### Vantagens:
✅ Interface limpa  
✅ Foco em um registro por vez  
✅ Detalhes completos sem poluir  
✅ Bom para análise profunda

---

## 📱 5. Cards Agrupados por Tipo

### Características:
- **Cards coloridos** por tipo de atividade
- **Agrupamento visual** por categoria
- **Contadores** em cada card
- **Filtro por tipo** clicando no card

### Exemplos:
- **Jira Activity Stream**: Cards agrupados por tipo de mudança
- **Trello Activity**: Cards por tipo de ação
- **Asana Activity Feed**: Agrupamento por tipo de evento

### Vantagens:
✅ Visualmente organizado  
✅ Fácil identificar tipos de atividade  
✅ Bom para categorização  
✅ Interface moderna

---

## 🎨 Padrões Visuais Comuns

### Cores e Ícones:
- ✅ **Verde**: Ações de criação/sucesso
- ❌ **Vermelho**: Ações de deleção/erro
- ⚠️ **Amarelo/Laranja**: Avisos/expirados
- 🔵 **Azul**: Ações neutras/informação
- 👤 **Ícone de usuário**: Ações de usuário
- 🔒 **Ícone de cadeado**: Ações de segurança
- ⚙️ **Ícone de engrenagem**: Ações de configuração

### Formatação de Data:
- **Relativa**: "há 2 horas", "ontem", "há 3 dias"
- **Absoluta**: "04 de dez. de 2025, 17:49"
- **Agrupamento**: "Hoje", "Ontem", "Última semana"

### Badges/Tags:
- Badges coloridos para tipos de atividade
- Tags para recursos afetados
- Status indicators (ativo, expirado, deletado)

---

## 🔧 Funcionalidades Essenciais

### 1. Filtros
- ✅ Por tipo de atividade
- ✅ Por usuário/colega
- ✅ Por período (hoje, semana, mês, customizado)
- ✅ Por recurso (User, Invitation, etc.)
- ✅ Por IP (para segurança)

### 2. Busca
- ✅ Busca por texto nos detalhes
- ✅ Busca por nome de usuário
- ✅ Busca por email (se aplicável)

### 3. Exportação
- ✅ Exportar para CSV
- ✅ Exportar para Excel
- ✅ Exportar para PDF (relatórios)

### 4. Paginação/Scroll
- ✅ Paginação tradicional (10, 25, 50, 100 por página)
- ✅ Scroll infinito (carregar mais)
- ✅ Virtual scrolling (para muitos registros)

### 5. Ordenação
- ✅ Por data (mais recente primeiro)
- ✅ Por usuário (alfabética)
- ✅ Por tipo de atividade

---

## 📋 Exemplo de Estrutura Completa

```
┌─────────────────────────────────────────────────────────┐
│  📊 Logs de Atividade                    [Exportar CSV] │
├─────────────────────────────────────────────────────────┤
│  Filtros:                                               │
│  [Tipo ▼] [Usuário ▼] [Período ▼] [Buscar...] [Aplicar]│
├─────────────────────────────────────────────────────────┤
│  Métricas:                                              │
│  [Total: 1.234] [Hoje: 45] [Esta semana: 320]         │
├─────────────────────────────────────────────────────────┤
│  Tipo          │ Usuário      │ Detalhes        │ Data │
│  ────────────────────────────────────────────────────── │
│  👤 Convidado  │ Anna B.      │ Anna Bagatini...│ 17:49│
│  ✅ Criado     │ João Silva   │ João Silva...   │ 14:23│
│  ⚠️ Expirado   │ Sistema      │ Convite para... │ 00:00│
│  ❌ Deletado   │ Maria S.     │ Maria Santos... │ 09:15│
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Recomendações para seu Projeto

### Para o contexto de saúde/clínica:

1. **Comece com Tabela + Filtros** (padrão mais comum e funcional)
2. **Adicione Timeline** como visualização alternativa
3. **Inclua métricas** no topo (total de convites, usuários criados hoje, etc.)
4. **Use cores semânticas** para tipos de atividade
5. **Permita exportação** para relatórios de auditoria
6. **Agrupe por data** quando houver muitos registros

### Prioridades:
1. ✅ Tabela responsiva com colunas principais
2. ✅ Filtros básicos (tipo, período, usuário)
3. ✅ Busca por texto
4. ✅ Paginação
5. ✅ Exportação CSV
6. ⭐ Timeline como alternativa (futuro)
7. ⭐ Dashboard com métricas (futuro)

---

## 📚 Referências de Design

- **Microsoft Azure AD Audit Logs**: Tabela com filtros avançados
- **GitHub Activity Feed**: Timeline visual e clara
- **Slack Audit Logs**: Tabela com busca e filtros
- **Notion Activity Log**: Feed cronológico elegante
- **Stripe Dashboard**: Lista compacta com modal de detalhes

