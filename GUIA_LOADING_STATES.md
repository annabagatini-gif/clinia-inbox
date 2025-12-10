# 🎨 Guia: Estados de Loading

## 📋 Tipos de Loading States

### 1. **Skeleton Screen (Recomendado) ✅**
**O que é:** Um "wireframe" do componente real que mostra a estrutura enquanto carrega.

**Quando usar:**
- ✅ Carregamento de listas/tabelas
- ✅ Carregamento de conteúdo estruturado
- ✅ Quando você sabe o formato do conteúdo final
- ✅ Carregamentos que demoram mais de 300ms

**Vantagens:**
- ✅ Usuário vê imediatamente o que está vindo
- ✅ Reduz percepção de espera
- ✅ Mantém layout estável (sem "jump" de conteúdo)
- ✅ Mais profissional e moderno

**Exemplo:**
```
┌─────────────────────────────────┐
│ ████████████                     │ ← Título (skeleton)
│ ████ ████ ████                  │ ← Badge (skeleton)
│ ████████████████████            │ ← Nome (skeleton)
│ ██ ██                            │ ← Avatar (skeleton)
│ ████ ████                        │ ← Data (skeleton)
└─────────────────────────────────┘
```

---

### 2. **Spinner/Loader** ⏳
**O que é:** Um ícone animado girando no centro ou em um botão.

**Quando usar:**
- ✅ Ações rápidas (< 300ms)
- ✅ Botões de submit
- ✅ Carregamentos pequenos/inline
- ✅ Quando não sabemos o formato do conteúdo

**Vantagens:**
- ✅ Simples e direto
- ✅ Funciona para qualquer tipo de conteúdo
- ✅ Não precisa criar estrutura específica

**Desvantagens:**
- ❌ Não mostra o que está vindo
- ❌ Pode parecer mais lento
- ❌ Layout pode "pular" quando carrega

---

### 3. **Progress Bar** 📊
**O que é:** Barra de progresso mostrando porcentagem ou tempo estimado.

**Quando usar:**
- ✅ Uploads/downloads
- ✅ Processos longos conhecidos
- ✅ Quando há progresso mensurável

---

## 🎯 Regra de Ouro

> **"O loading deve ser um wireframe do componente real"**

Isso significa que o skeleton deve:
1. ✅ Ter a mesma estrutura visual do componente final
2. ✅ Manter as mesmas proporções (largura, altura)
3. ✅ Usar os mesmos espaçamentos
4. ✅ Mostrar elementos no mesmo lugar

---

## 📐 Como Criar um Skeleton Perfeito

### Passo 1: Analise o Componente Real
```tsx
// Componente Real
<div className="flex items-center gap-3 p-4 bg-card border rounded-lg">
  <Checkbox />                    // Checkbox
  <div className="h-5 w-5" />    // Círculo de cor
  <Badge />                       // Badge com nome
  <span className="flex-1" />    // Nome da etiqueta
  <Avatar />                      // Avatar do criador
  <div>Data</div>                 // Data
  <Button />                      // Botões de ação
</div>
```

### Passo 2: Crie o Skeleton Correspondente
```tsx
// Skeleton - mesma estrutura!
<div className="flex items-center gap-3 p-4 bg-card border rounded-lg animate-pulse">
  <div className="h-4 w-4 rounded border bg-muted" />      // Checkbox skeleton
  <div className="h-5 w-5 rounded-full bg-muted" />      // Círculo skeleton
  <div className="h-6 w-20 rounded bg-muted" />          // Badge skeleton
  <div className="flex-1 h-4 bg-muted rounded" />        // Nome skeleton
  <div className="h-6 w-6 rounded-full bg-muted" />      // Avatar skeleton
  <div className="h-3 w-16 bg-muted rounded" />          // Data skeleton
  <div className="h-8 w-8 rounded bg-muted" />          // Botão skeleton
</div>
```

### Passo 3: Use as Mesmas Classes CSS
- ✅ Mesmas classes de layout (`flex`, `gap`, `p-4`)
- ✅ Mesmas dimensões (`h-5 w-5`, `flex-1`)
- ✅ Mesmas bordas e espaçamentos
- ✅ Apenas substitua conteúdo por `bg-muted` com `animate-pulse`

---

## 🎨 Padrões Visuais

### Cores do Skeleton
```css
/* Padrão recomendado */
background: bg-muted (cor neutra)
border: border (opcional, se o componente real tem)
animation: animate-pulse (Tailwind) ou shimmer effect
```

### Animação
```css
/* Tailwind */
animate-pulse

/* Ou shimmer effect (mais moderno) */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

---

## 📱 Exemplos de Empresas

### Facebook/LinkedIn
- ✅ Usam skeleton screens extensivamente
- ✅ Skeletons têm exatamente a mesma estrutura
- ✅ Mantêm layout estável

### Medium
- ✅ Skeleton para artigos
- ✅ Mostra linhas de texto no formato final
- ✅ Reduz ansiedade de espera

### GitHub
- ✅ Skeleton para listas de repositórios
- ✅ Mantém cards no mesmo formato
- ✅ Transição suave

---

## ✅ Checklist para Criar Skeleton

- [ ] Skeleton tem a mesma estrutura HTML do componente real?
- [ ] Mesmas classes de layout (flex, grid, gap, padding)?
- [ ] Mesmas dimensões aproximadas?
- [ ] Mesmos espaçamentos?
- [ ] Animação suave (pulse ou shimmer)?
- [ ] Cor neutra (bg-muted)?
- [ ] Quantidade de skeletons igual ao esperado (ou pelo menos 3-4)?

---

## 🚫 Erros Comuns

### ❌ Skeleton muito diferente do componente
```tsx
// ERRADO - estrutura completamente diferente
<div className="flex flex-col">
  <div className="h-10 w-full" />
</div>
```

### ✅ Skeleton fiel ao componente
```tsx
// CORRETO - mesma estrutura
<div className="flex items-center gap-3 p-4">
  <div className="h-4 w-4" />
  <div className="flex-1 h-4" />
</div>
```

### ❌ Skeleton sem animação
```tsx
// ERRADO - estático demais
<div className="bg-gray-200" />
```

### ✅ Skeleton com animação
```tsx
// CORRETO - animado
<div className="bg-muted animate-pulse" />
```

---

## 💡 Dica Final

**Copie e cole a estrutura do componente real, substitua apenas o conteúdo por divs com `bg-muted` e `animate-pulse`.**

Isso garante que o skeleton seja um verdadeiro "wireframe" do componente final! 🎯

