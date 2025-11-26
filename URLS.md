# URLs da Clinia Inbox

## URLs Disponíveis

### 1. URL Padrão (Maria Silva selecionada)
```
https://sua-url.vercel.app
```
- Abre automaticamente com a conversa da Maria Silva selecionada
- Mostra o chat da Maria Silva (sem empty state)

### 2. URL com Drawer Aberta (para Figma)
```
https://sua-url.vercel.app?drawer=true
```
- Abre com a primeira conversa selecionada
- Drawer já aberta automaticamente
- Ideal para importar no Figma

### 3. URL com Conversa Específica (Maria Silva)
```
https://sua-url.vercel.app?conversation=1
```
- Abre diretamente a conversa com ID "1" (Maria Silva)
- Útil para links diretos

### 4. URL com Drawer + Conversa Específica
```
https://sua-url.vercel.app?conversation=1&drawer=true
```
- Abre a conversa da Maria Silva (ID: 1)
- Drawer já aberta
- Perfeito para importar no Figma com conversa específica

### 5. URL com Conversa Atribuída (botões de microfone e enviar aparecem)
```
https://sua-url.vercel.app?conversation=1&assigned=true
```
- Abre a conversa da Maria Silva (ID: 1)
- Conversa já atribuída ao usuário atual (Anna B)
- Botões de microfone e enviar mensagem aparecem automaticamente
- Ideal para testar funcionalidades de envio de mensagens

### 6. URL Completa (Maria Silva + Atribuída + Drawer)
```
https://sua-url.vercel.app?conversation=1&assigned=true&drawer=true
```
- Abre a conversa da Maria Silva (ID: 1)
- Conversa já atribuída ao usuário atual
- Drawer já aberta
- Botões de microfone e enviar aparecem
- Perfeito para importar no Figma com tudo configurado

## IDs das Conversas

- **Maria Silva**: `id: "1"`
- Outras conversas: verificar IDs no `lib/mock-data.ts`

## Exemplos de Uso

### Para desenvolvimento/teste:
```
http://localhost:3000
http://localhost:3000?drawer=true
http://localhost:3000?conversation=1
```

### Para produção (Vercel):
```
https://clinia-inbox.vercel.app
https://clinia-inbox.vercel.app?drawer=true
https://clinia-inbox.vercel.app?conversation=1&drawer=true
```

## Notas

- Substitua `sua-url.vercel.app` pela URL real do seu projeto no Vercel
- O ID da conversa da Maria Silva é `"1"` (definido em `lib/mock-data.ts`)
- A URL padrão sempre seleciona Maria Silva automaticamente

