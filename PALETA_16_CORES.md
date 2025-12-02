# 🎨 Paleta de 16 Cores para Etiquetas

## Códigos Hexadecimais

```javascript
const PRESET_COLORS_16 = [
  { value: "#EF4444", label: "Urgente", description: "Vermelho" },
  { value: "#F97316", label: "Atenção", description: "Laranja" },
  { value: "#FCD34D", label: "Aviso", description: "Amarelo" },
  { value: "#84CC16", label: "Pendente", description: "Lima" },
  { value: "#10B981", label: "Resolvido", description: "Verde" },
  { value: "#14B8A6", label: "Em andamento", description: "Verde-água" },
  { value: "#06B6D4", label: "Informação", description: "Ciano" },
  { value: "#3B82F6", label: "Padrão", description: "Azul" },
  { value: "#6366F1", label: "Importante", description: "Índigo" },
  { value: "#8B5CF6", label: "Categoria", description: "Violeta" },
  { value: "#A855F7", label: "Personalizado", description: "Roxo" },
  { value: "#D946EF", label: "Destaque", description: "Fúcsia" },
  { value: "#EC4899", label: "Especial", description: "Rosa" },
  { value: "#F43F5E", label: "Crítico", description: "Rosa-escuro" },
  { value: "#F59E0B", label: "Prioridade", description: "Âmbar" },
  { value: "#8B5A2B", label: "Arquivo", description: "Marrom" },
];
```

## Lista Apenas com Códigos (para copiar rápido)

```
#EF4444 - Vermelho (Urgente)
#F97316 - Laranja (Atenção)
#FCD34D - Amarelo (Aviso)
#F59E0B - Âmbar (Prioridade)
#84CC16 - Lima (Pendente)
#10B981 - Verde (Resolvido)
#14B8A6 - Verde-água (Em andamento)
#06B6D4 - Ciano (Informação)
#3B82F6 - Azul (Padrão)
#6366F1 - Índigo (Importante)
#8B5CF6 - Violeta (Categoria)
#A855F7 - Roxo (Personalizado)
#D946EF - Fúcsia (Destaque)
#EC4899 - Rosa (Especial)
#F43F5E - Rosa-escuro (Crítico)
#8B5A2B - Marrom (Arquivo)
```

## Visualização da Paleta

| Cor | Código | Nome | Uso Sugerido |
|-----|--------|------|--------------|
| 🔴 | `#EF4444` | Urgente | Itens críticos que precisam atenção imediata |
| 🟠 | `#F97316` | Atenção | Requer atenção mas não urgente |
| 🟡 | `#FCD34D` | Aviso | Avisos e alertas |
| 🟠 | `#F59E0B` | Prioridade | Itens prioritários |
| 🟢 | `#84CC16` | Pendente | Aguardando ação |
| 🟢 | `#10B981` | Resolvido | Concluído/resolvido |
| 🔵 | `#14B8A6` | Em andamento | Em processo |
| 🔵 | `#06B6D4` | Informação | Informações gerais |
| 🔵 | `#3B82F6` | Padrão | Cor padrão/neutra |
| 🔵 | `#6366F1` | Importante | Destaque importante |
| 🟣 | `#8B5CF6` | Categoria | Agrupamento/categorização |
| 🟣 | `#A855F7` | Personalizado | Uso personalizado |
| 🟣 | `#D946EF` | Destaque | Destaque especial |
| 🌸 | `#EC4899` | Especial | Itens especiais |
| 🌸 | `#F43F5E` | Crítico | Crítico/urgente |
| 🟤 | `#8B5A2B` | Arquivo | Arquivado/documentado |

## Código Completo para Aplicar

```typescript
const PRESET_COLORS_16 = [
  { value: "#EF4444", label: "Urgente", description: "Vermelho" },
  { value: "#F97316", label: "Atenção", description: "Laranja" },
  { value: "#FCD34D", label: "Aviso", description: "Amarelo" },
  { value: "#F59E0B", label: "Prioridade", description: "Âmbar" },
  { value: "#84CC16", label: "Pendente", description: "Lima" },
  { value: "#10B981", label: "Resolvido", description: "Verde" },
  { value: "#14B8A6", label: "Em andamento", description: "Verde-água" },
  { value: "#06B6D4", label: "Informação", description: "Ciano" },
  { value: "#3B82F6", label: "Padrão", description: "Azul" },
  { value: "#6366F1", label: "Importante", description: "Índigo" },
  { value: "#8B5CF6", label: "Categoria", description: "Violeta" },
  { value: "#A855F7", label: "Personalizado", description: "Roxo" },
  { value: "#D946EF", label: "Destaque", description: "Fúcsia" },
  { value: "#EC4899", label: "Especial", description: "Rosa" },
  { value: "#F43F5E", label: "Crítico", description: "Rosa-escuro" },
  { value: "#8B5A2B", label: "Arquivo", description: "Marrom" },
];
```

## Grid Layout Sugerido (4x4)

```
[#EF4444] [#F97316] [#FCD34D] [#F59E0B]
[#84CC16] [#10B981] [#14B8A6] [#06B6D4]
[#3B82F6] [#6366F1] [#8B5CF6] [#A855F7]
[#D946EF] [#EC4899] [#F43F5E] [#8B5A2B]
```

