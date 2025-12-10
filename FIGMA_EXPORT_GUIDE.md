# Guia: Como levar o protótipo para o Figma

## Opção 1: Plugin HTML.to.Design (Recomendado)

1. **No Figma Desktop App ou Web:**
   - Clique em `Plugins` → `Browse all plugins`
   - Busque por "HTML.to.Design" ou "html.to.design"
   - Instale o plugin

2. **Execute seu protótipo:**
   ```bash
   npm run dev
   ```
   - Acesse `http://localhost:3000` no navegador
   - Ou use a URL do Vercel se já estiver deployado

3. **No Figma:**
   - Abra o plugin HTML.to.Design
   - Cole a URL do protótipo
   - O plugin irá converter os elementos HTML/CSS em componentes do Figma

## Opção 2: Screenshots e Reconstrução Manual

1. **Tire screenshots das telas principais:**
   - Lista de conversas
   - Área de chat
   - Sidebar
   - Modais e popovers

2. **No Figma:**
   - Crie um novo arquivo
   - Importe as imagens (drag & drop)
   - Use como referência para reconstruir os componentes

3. **Vantagens:**
   - Você cria um design system limpo
   - Componentes reutilizáveis
   - Melhor organização

## Opção 3: Exportar Componentes Específicos

1. **No navegador (Chrome DevTools):**
   - Abra DevTools (F12)
   - Selecione um elemento
   - Clique com botão direito → "Capture node screenshot"
   - Salve a imagem

2. **Importe no Figma:**
   - Arraste as imagens para o Figma
   - Use como base para criar componentes

## Opção 4: Usar Figma Dev Mode (Visualização)

1. **Crie frames no Figma** com os designs
2. **Use o Dev Mode** para comparar com o protótipo funcional
3. **Útil para:** Validação e documentação

## Dicas Importantes

- **Cores e Tipografia:** Anote as cores e fontes usadas no código para manter consistência
- **Espaçamentos:** Use o DevTools para medir espaçamentos exatos
- **Componentes:** Identifique componentes reutilizáveis (botões, inputs, cards)
- **Estados:** Capture diferentes estados (hover, active, disabled, error)

## Informações do Projeto

- **Framework:** Next.js 16
- **Styling:** Tailwind CSS
- **Componentes UI:** Shadcn UI (Radix UI)
- **URL Local:** http://localhost:3000
- **URL Produção:** (sua URL do Vercel)

## Plugins Úteis do Figma

- **HTML.to.Design** - Importa HTML/CSS
- **Figma to Code** - (caminho inverso, mas útil para referência)
- **Content Reel** - Para dados mockados
- **Autoflow** - Para fluxos de usuário






