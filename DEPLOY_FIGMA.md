# 🚀 Deploy para Figma - Componentes

## 📍 URLs dos Componentes

Após o deploy, os componentes estarão disponíveis em:

### 1. Atribuir Conversa
```
https://seu-projeto.vercel.app/figma/assign-conversation
```

### 2. Criar Etiqueta - Cor Personalizada
```
https://seu-projeto.vercel.app/figma/create-tag-custom
```

### 3. Criar Etiqueta - Cores Pré-definidas
```
https://seu-projeto.vercel.app/figma/create-tag-preset
```

## 🛠️ Passos para Deploy no Vercel

### Opção 1: Deploy via CLI (Recomendado)

1. **Instale o Vercel CLI** (se ainda não tiver):
```bash
npm i -g vercel
```

2. **Faça login no Vercel**:
```bash
vercel login
```

3. **Deploy do projeto**:
```bash
vercel
```

4. **Siga as instruções**:
   - Link to existing project? **N** (primeira vez)
   - Project name: `clinia-inbox` (ou o nome que preferir)
   - Directory: `./` (raiz do projeto)
   - Override settings? **N**

5. **Após o deploy**, você receberá uma URL como:
   ```
   https://clinia-inbox-xxxxx.vercel.app
   ```

6. **Acesse os componentes**:
   ```
   https://clinia-inbox-xxxxx.vercel.app/figma/assign-conversation
   https://clinia-inbox-xxxxx.vercel.app/figma/create-tag-custom
   https://clinia-inbox-xxxxx.vercel.app/figma/create-tag-preset
   ```

### Opção 2: Deploy via GitHub + Vercel (Recomendado para produção)

1. **Crie um repositório no GitHub** (se ainda não tiver)

2. **Faça commit e push**:
```bash
git add .
git commit -m "Add Figma component page"
git push origin main
```

3. **Acesse [vercel.com](https://vercel.com)** e faça login

4. **Clique em "Add New Project"**

5. **Importe seu repositório do GitHub**

6. **Configure o projeto**:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `next build` (já vem predefinido)
   - Output Directory: `.next` (já vem predefinido)

7. **Clique em "Deploy"**

8. **Após o deploy**, acesse:
   ```
   https://seu-projeto.vercel.app/figma/assign-conversation
   https://seu-projeto.vercel.app/figma/create-tag-custom
   https://seu-projeto.vercel.app/figma/create-tag-preset
   ```

## 🎨 Usando no Plugin do Figma

1. **Abra o Figma** e crie/abra um arquivo

2. **Instale o plugin "HTML to Design"** ou similar:
   - Vá em Plugins → Browse plugins
   - Procure por "HTML to Design" ou "Figma to Code"

3. **Cole a URL do componente desejado**:
   - Atribuir Conversa: `https://seu-projeto.vercel.app/figma/assign-conversation`
   - Criar Etiqueta (Cor Personalizada): `https://seu-projeto.vercel.app/figma/create-tag-custom`
   - Criar Etiqueta (Cores Pré-definidas): `https://seu-projeto.vercel.app/figma/create-tag-preset`

4. **O plugin irá importar o componente** para o Figma

## 📝 Notas Importantes

### Componente "Atribuir Conversa"
- ✅ Isolado em `/app/figma/assign-conversation/page.tsx`
- ✅ Modal sempre aberto
- ✅ "Anna B" selecionada por padrão
- ✅ Seções de Usuários e Grupos

### Componente "Criar Etiqueta - Cor Personalizada"
- ✅ Isolado em `/app/figma/create-tag-custom/page.tsx`
- ✅ Modal sempre aberto
- ✅ Color picker personalizado ativo
- ✅ Cor azul (#3B82F6) selecionada por padrão
- ✅ Preview da etiqueta

### Componente "Criar Etiqueta - Cores Pré-definidas"
- ✅ Isolado em `/app/figma/create-tag-preset/page.tsx`
- ✅ Modal sempre aberto
- ✅ Cores pré-definidas visíveis
- ✅ Cor vermelha "Urgente" (#EF4444) selecionada por padrão
- ✅ Preview da etiqueta

Todos os componentes têm estilos e interações incluídos.

## 🔧 Troubleshooting

### Erro de Build
- Certifique-se de que todas as dependências estão instaladas: `npm install`
- Verifique se não há erros de lint: `npm run lint`

### Componente não aparece
- Verifique se a URL está correta
- Certifique-se de que o deploy foi concluído com sucesso
- Verifique os logs do Vercel para erros

### Estilos não carregam
- Verifique se o Tailwind CSS está configurado corretamente
- Certifique-se de que `app/globals.css` está sendo importado

## 📞 Suporte

Se precisar de ajuda, verifique:
- [Documentação do Vercel](https://vercel.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)

