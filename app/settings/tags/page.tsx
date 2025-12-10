"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, Plus, X, Tag as TagIcon, Folder, MessageSquare, Settings, Users, Hash, Link, Key, Clock, FileText, 
  Search, Filter, ArrowUpDown, Edit2, Palette, MoreVertical, Check, Loader2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerFormat,
  ColorPickerEyeDropper,
} from "@/components/ui/shadcn-io/color-picker";
import { loadTags, saveTags, addTag, deleteTag, Tag } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/lib/user-config";
import Color from "color";
import { toast } from "sonner";

// Cores pré-definidas com nomes semânticos para facilitar escolha
const PRESET_COLORS = [
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
];

const TAG_COLORS = PRESET_COLORS.map(c => c.value);

const SETTINGS_MENU_ITEMS = [
  { id: "backoffice", label: "Backoffice", icon: Folder },
  { id: "data", label: "Dados", icon: MessageSquare },
  { id: "integrations", label: "Integrações", icon: Link },
  { id: "webhooks", label: "Webhooks", icon: Link },
  { id: "custom-fields", label: "Campos Personalizados", icon: Settings },
  { id: "tags", label: "Etiquetas", icon: TagIcon, active: true },
  { id: "users", label: "Usuários e grupos", icon: Users },
  { id: "connection", label: "Conexão", icon: Link },
  { id: "preferences", label: "Preferências", icon: Settings },
  { id: "api-keys", label: "Chaves de API", icon: Key },
  { id: "hours", label: "Horários de funcionamento", icon: Clock },
  { id: "templates", label: "Modelos de mensagem", icon: FileText },
];

// Lista de usuários disponíveis (pode vir de uma API ou contexto no futuro)
const ALL_USERS = [
  { id: "user1", name: "June Jensen", avatar: "JJ" },
  { id: "user2", name: "Anna B", avatar: "AB" },
  { id: "user3", name: "Carlos Silva", avatar: "CS" },
  { id: "user4", name: "Maria Santos", avatar: "MS" },
  { id: "user5", name: "Pedro Costa", avatar: "PC" },
  { id: "user6", name: "Ana Oliveira", avatar: "AO" },
  { id: "user7", name: "Lucas Alves", avatar: "LA" },
  { id: "user8", name: "Julia Pereira", avatar: "JP" },
  { id: "user9", name: "Rafael Lima", avatar: "RL" },
  { id: "user10", name: "Camila Souza", avatar: "CS" },
];

type SortOption = "name" | "date" | "color";
type FilterUserOption = "all" | string; // "all" ou nome do usuário

// Lista de usuários para obter avatares
const USER_AVATARS: Record<string, string> = {
  "Anna B": "AB",
  "June Jensen": "JJ",
  "Carlos Silva": "CS",
  "Maria Santos": "MS",
  "Pedro Costa": "PC",
  "Ana Oliveira": "AO",
  "Lucas Alves": "LA",
  "Julia Pereira": "JP",
  "Rafael Lima": "RL",
  "Camila Souza": "CS",
};

// Função para obter avatar do usuário
const getUserAvatar = (userName: string): string => {
  return USER_AVATARS[userName] || userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [customColor, setCustomColor] = useState("#3B82F6");
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tagsToDelete, setTagsToDelete] = useState<Set<string>>(new Set());
  const [justDeletedAll, setJustDeletedAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterByUser, setFilterByUser] = useState<FilterUserOption>("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTags(loadTags());
  }, []);

  // Simular loading durante busca/filtro
  useEffect(() => {
    const hasActiveFilters = searchQuery.trim() || filterByUser !== "all";
    
    if (hasActiveFilters) {
      setIsLoading(true);
      // Simular delay de busca (300-800ms)
      const delay = Math.random() * 500 + 300;
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [searchQuery, filterByUser]);

  // Obter lista única de usuários que criaram etiquetas
  const usersWhoCreatedTags = useMemo(() => {
    const userSet = new Set<string>();
    tags.forEach(tag => {
      if (tag.createdBy) {
        userSet.add(tag.createdBy);
      }
    });
    return Array.from(userSet).sort();
  }, [tags]);

  // Filtrar e ordenar etiquetas
  const filteredAndSortedTags = useMemo(() => {
    let filtered = tags;

    // Busca por nome
    if (searchQuery.trim()) {
      filtered = filtered.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por usuário criador
    if (filterByUser !== "all") {
      filtered = filtered.filter(tag => tag.createdBy === filterByUser);
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
        case "date":
          // Mais recentes primeiro
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "color":
          return a.color.localeCompare(b.color);
        default:
          return 0;
      }
    });

    return sorted;
  }, [tags, searchQuery, sortBy, filterByUser]);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    const colorToUse = useCustomColor ? customColor : selectedColor;

    const newTag = addTag({
      name: newTagName.trim(),
      color: colorToUse,
      createdBy: CURRENT_USER.name,
    });

    setTags(loadTags());
    setNewTagName("");
    setSelectedColor(TAG_COLORS[0]);
    setCustomColor("#3B82F6");
    setUseCustomColor(false);
    setIsDialogOpen(false);
  };

  const handleEditTag = () => {
    if (!editingTag || !newTagName.trim()) return;

    const colorToUse = useCustomColor ? customColor : selectedColor;
    const updatedTags = tags.map(tag =>
      tag.id === editingTag.id
        ? { ...tag, name: newTagName.trim(), color: colorToUse }
        : tag
    );
    saveTags(updatedTags);
    setTags(updatedTags);
    setIsEditDialogOpen(false);
    setEditingTag(null);
    setNewTagName("");
    setSelectedColor(TAG_COLORS[0]);
    setCustomColor("#3B82F6");
    setUseCustomColor(false);
  };

  const handleDeleteTag = (tagId: string) => {
    const wasLastTag = tags.length === 1;
    
    deleteTag(tagId);
    const updatedTags = loadTags();
    setTags(updatedTags);
    setTagToDelete(null);
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      newSet.delete(tagId);
      return newSet;
    });
    
    // Se deletou a última, marcar flag para mostrar empty state específico
    if (wasLastTag && updatedTags.length === 0) {
      setJustDeletedAll(true);
      setTimeout(() => setJustDeletedAll(false), 5000); // Reset após 5 segundos
    }
    
    // Feedback de sucesso
    toast.success("Etiqueta excluída");
  };

  const handleDeleteSelected = () => {
    setTagsToDelete(selectedTags);
  };

  const confirmDeleteSelected = () => {
    const count = tagsToDelete.size;
    const wasAllTags = tags.length === count;
    
    tagsToDelete.forEach(tagId => {
      deleteTag(tagId);
    });
    const updatedTags = loadTags();
    setTags(updatedTags);
    setSelectedTags(new Set());
    setTagsToDelete(new Set());
    
    // Se deletou todas, marcar flag para mostrar empty state específico
    if (wasAllTags && updatedTags.length === 0) {
      setJustDeletedAll(true);
      setTimeout(() => setJustDeletedAll(false), 5000); // Reset após 5 segundos
    }
    
    // Feedback de sucesso
    if (count === 1) {
      toast.success("Etiqueta excluída");
    } else {
      toast.success(`${count} etiquetas excluídas`);
    }
  };

  const handleToggleSelect = (tagId: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tagId)) {
        newSet.delete(tagId);
      } else {
        newSet.add(tagId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedTags.size === filteredAndSortedTags.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(filteredAndSortedTags.map(t => t.id)));
    }
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    const isPresetColor = PRESET_COLORS.some(c => c.value === tag.color);
    if (isPresetColor) {
      setSelectedColor(tag.color);
      setUseCustomColor(false);
    } else {
      setCustomColor(tag.color);
      setUseCustomColor(true);
    }
    setIsEditDialogOpen(true);
  };

  const getColorLabel = (color: string) => {
    return PRESET_COLORS.find(c => c.value === color)?.label || "Personalizado";
  };

  // Função para determinar a ação do empty state baseado no contexto
  const getEmptyStateAction = () => {
    const hasFilters = searchQuery || filterByUser !== "all";
    
    // Se há filtros ativos, oferece limpar filtros
    if (hasFilters) {
      return {
        label: "Limpar filtros",
        onClick: () => {
          setSearchQuery("");
          setFilterByUser("all");
        },
        variant: "outline" as const,
      };
    }
    
    // Caso contrário, oferece criar etiqueta
    return {
      label: "Criar etiqueta",
      onClick: () => setIsDialogOpen(true),
      variant: "default" as const,
    };
  };

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar p-2 gap-2">
      {/* Sidebar principal - mesma da inbox */}
      <div className="hidden lg:flex">
        <InboxSidebar 
          activeTab="settings"
          onTabChange={() => {}}
          counts={{
            all: 13,
            my: 8,
            unread: 0,
            unassigned: 3,
          }}
          showSettings={true}
          onSettingsClick={() => {}}
          onInboxClick={() => router.push("/")}
        />
      </div>

      {/* Container principal */}
      <div className="flex-1 flex overflow-hidden bg-background rounded-lg">
        {/* Sidebar de navegação de Settings */}
        <SettingsSidebar />

        {/* Área de conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">Etiquetas</h1>
              <p className="text-muted-foreground mt-1">
                Crie etiquetas para classificar suas conversas
              </p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar etiqueta
            </Button>
          </div>

          {/* Barra de Busca e Filtros */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Busca */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                {isLoading ? (
                  <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                  placeholder="Buscar etiquetas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn("pl-9", isLoading && "opacity-70")}
                  disabled={isLoading}
                />
              </div>

              {/* Filtro por Usuário Criador */}
              <Select value={filterByUser} onValueChange={setFilterByUser}>
                <SelectTrigger className="w-[200px]">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por criador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os criadores</SelectItem>
                  {usersWhoCreatedTags.length > 0 ? (
                    usersWhoCreatedTags.map((userName) => (
                      <SelectItem key={userName} value={userName}>
                        {userName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="all" disabled>
                      Nenhum criador encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              {/* Ordenação */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome (A-Z)</SelectItem>
                  <SelectItem value="date">Data de criação</SelectItem>
                  <SelectItem value="color">Cor</SelectItem>
                </SelectContent>
              </Select>

              {/* Botão Limpar Filtros - Aparece apenas quando há filtros ativos */}
              {(() => {
                const activeFiltersCount = [
                  searchQuery.trim() && 1,
                  filterByUser !== "all" && 1,
                ].filter(Boolean).length;
                
                if (activeFiltersCount === 0) return null;
                
                return (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterByUser("all");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar filtros
                    {activeFiltersCount > 1 && (
                      <span className="ml-1 text-xs">({activeFiltersCount})</span>
                    )}
                  </Button>
                );
              })()}

              {/* Ações em massa */}
              {selectedTags.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir {selectedTags.size} {selectedTags.size === 1 ? 'etiqueta' : 'etiquetas'}
                </Button>
              )}
            </div>

            {/* Indicador de filtros ativos */}
            {(searchQuery || filterByUser !== "all") && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Filter className="h-3 w-3" />
                )}
                <span>
                  {isLoading ? (
                    "Buscando..."
                  ) : (
                    <>
                      {filteredAndSortedTags.length} de {tags.length} etiqueta{tags.length !== 1 ? 's' : ''}
                      {searchQuery && ` encontrada${filteredAndSortedTags.length !== 1 ? 's' : ''}`}
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Etiquetas */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                {/* Skeleton Loaders - Estrutura idêntica ao componente real */}
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-card border rounded-lg animate-pulse"
                  >
                    {/* Checkbox skeleton */}
                    <div className="h-4 w-4 rounded border border-border bg-muted" />
                    
                    {/* Círculo de cor skeleton - mesma dimensão do real (h-5 w-5) */}
                    <div className="h-5 w-5 rounded-full flex-shrink-0 border border-gray-200 bg-muted" />
                    
                    {/* Badge skeleton - mesma altura do Badge real */}
                    <div className="h-6 w-20 rounded-md bg-muted" />
                    
                    {/* Nome da etiqueta skeleton - flex-1 como no real */}
                    <span className="flex-1 h-4 bg-muted rounded" />
                    
                    {/* Avatar skeleton - mesma dimensão do real (h-6 w-6) */}
                    <div className="h-6 w-6 rounded-full bg-muted" />
                    
                    {/* Informações adicionais skeleton - mesma estrutura flex-col */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="h-3 w-16 bg-muted rounded" />
                      <div className="h-3 w-20 bg-muted rounded" />
                    </div>
                    
                    {/* Botões de ação skeleton - mesma estrutura gap-1 */}
                    <div className="flex items-center gap-1">
                      <div className="h-8 w-8 rounded bg-muted" />
                      <div className="h-8 w-8 rounded bg-muted" />
                    </div>
                  </div>
                ))}
                {/* Indicador de loading */}
                <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Buscando etiquetas...</span>
                </div>
              </div>
            ) : filteredAndSortedTags.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                    <TagIcon className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma etiqueta encontrada
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md text-center">
                  Crie etiquetas para organizar e categorizar suas conversas.
                </p>
                {(() => {
                  const action = getEmptyStateAction();
                  return (
                    <Button
                      variant={action.variant}
                      size={action.variant === "outline" ? "sm" : "default"}
                      onClick={action.onClick}
                    >
                      {action.variant === "default" && (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {action.label}
                    </Button>
                  );
                })()}
              </div>
            ) : (
              <div className="space-y-2">
                {/* Checkbox "Selecionar todas" */}
                {tags.length > 1 && (
                  <div className="flex items-center gap-2 p-2 border-b pb-3 mb-2">
                    <Checkbox
                      checked={selectedTags.size === filteredAndSortedTags.length && filteredAndSortedTags.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label className="text-sm text-muted-foreground cursor-pointer">
                      Selecionar todas ({selectedTags.size}/{filteredAndSortedTags.length})
                    </Label>
                  </div>
                )}

                {filteredAndSortedTags.map((tag) => {
                  const isSelected = selectedTags.has(tag.id);
                  return (
                    <div
                      key={tag.id}
                      className={cn(
                        "flex items-center gap-3 p-4 bg-card border rounded-lg transition-colors",
                        isSelected && "bg-accent border-primary",
                        !isSelected && "hover:bg-accent/50"
                      )}
                    >
                      {/* Checkbox para seleção múltipla */}
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleSelect(tag.id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      {/* Círculo de Cor */}
                      <div
                        className="h-5 w-5 rounded-full flex-shrink-0 border border-gray-200"
                        style={{ backgroundColor: tag.color }}
                        title={getColorLabel(tag.color)}
                      />
                      
                      {/* Preview da Etiqueta */}
                      <Badge
                        className="text-xs"
                        style={{
                          backgroundColor: tag.color,
                          color: "white",
                        }}
                      >
                        {tag.name}
                      </Badge>
                      
                      {/* Nome da Etiqueta */}
                      <span className="flex-1 font-medium">{tag.name}</span>

                      {/* Avatar do Criador */}
                      {tag.createdBy && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-slate-200 text-slate-700 text-[10px]">
                            {getUserAvatar(tag.createdBy)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {/* Informações adicionais */}
                      <div className="flex flex-col items-end gap-1">
                        {tag.createdBy && (
                          <span className="text-xs text-muted-foreground">
                            {tag.createdBy}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(tag.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      
                      {/* Botões de Ação */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEditDialog(tag)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setTagToDelete(tag.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
        </div>

        {/* Dialog para Adicionar Etiqueta */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar etiqueta</DialogTitle>
            <DialogDescription>
              Crie uma nova etiqueta para organizar suas conversas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Nome da etiqueta</Label>
              <Input
                id="tag-name"
                placeholder="Ex: Urgente, Pagamento, Suporte..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTagName.trim()) {
                    handleAddTag();
                  }
                }}
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Cor</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setUseCustomColor(!useCustomColor)}
                  className="text-xs"
                >
                  {useCustomColor ? (
                    <>
                      <Palette className="h-3 w-3 mr-1" />
                      Usar cores pré-definidas
                    </>
                  ) : (
                    <>
                      <Palette className="h-3 w-3 mr-1" />
                      Cor personalizada
                    </>
                  )}
                </Button>
              </div>

              {!useCustomColor ? (
                <>
                  {/* Cores pré-definidas com nomes */}
                  <div className="grid grid-cols-7 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={cn(
                          "h-10 w-10 rounded-md border-2 transition-all relative group",
                          selectedColor === color.value
                            ? "border-foreground scale-110 ring-2 ring-offset-2 ring-foreground/20"
                            : "border-transparent hover:scale-105"
                        )}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setSelectedColor(color.value)}
                        title={color.label}
                      >
                        {selectedColor === color.value && (
                          <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selecionado: <strong>{getColorLabel(selectedColor)}</strong>
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="h-10 w-20 rounded border cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary/20 transition-all"
                          style={{ backgroundColor: customColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" align="start">
                        <ColorPicker
                          value={customColor}
                          onChange={(rgba) => {
                            if (Array.isArray(rgba) && rgba.length >= 3) {
                              const [r, g, b] = rgba;
                              const hex = Color.rgb(r, g, b).hex();
                              setCustomColor(hex);
                            }
                          }}
                          className="w-[200px]"
                        >
                          <div className="space-y-3">
                            <ColorPickerSelection className="h-32 w-full" />
                            <ColorPickerHue />
                            <div className="flex items-center gap-2">
                              <ColorPickerFormat className="flex-1" />
                              <ColorPickerEyeDropper />
                            </div>
                          </div>
                        </ColorPicker>
                      </PopoverContent>
                    </Popover>
                    <Input
                      value={customColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                          setCustomColor(value);
                        }
                      }}
                      placeholder="#3B82F6"
                      className="flex-1 font-mono text-sm"
                      maxLength={7}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Escolha uma cor personalizada usando o seletor ou digite o código hexadecimal
                  </p>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="pt-2 border-t">
              <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
              <Badge
                className="text-sm"
                style={{
                  backgroundColor: useCustomColor ? customColor : selectedColor,
                  color: "white",
                }}
              >
                {newTagName || "Nome da etiqueta"}
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
              Criar etiqueta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Etiqueta */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar etiqueta</DialogTitle>
            <DialogDescription>
              Atualize o nome ou a cor da etiqueta
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Nome da etiqueta</Label>
              <Input
                id="edit-tag-name"
                placeholder="Ex: Urgente, Pagamento, Suporte..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTagName.trim()) {
                    handleEditTag();
                  }
                }}
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Cor</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setUseCustomColor(!useCustomColor)}
                  className="text-xs"
                >
                  {useCustomColor ? (
                    <>
                      <Palette className="h-3 w-3 mr-1" />
                      Usar cores pré-definidas
                    </>
                  ) : (
                    <>
                      <Palette className="h-3 w-3 mr-1" />
                      Cor personalizada
                    </>
                  )}
                </Button>
              </div>

              {!useCustomColor ? (
                <>
                  <div className="grid grid-cols-7 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={cn(
                          "h-10 w-10 rounded-md border-2 transition-all relative group",
                          selectedColor === color.value
                            ? "border-foreground scale-110 ring-2 ring-offset-2 ring-foreground/20"
                            : "border-transparent hover:scale-105"
                        )}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setSelectedColor(color.value)}
                        title={color.label}
                      >
                        {selectedColor === color.value && (
                          <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selecionado: <strong>{getColorLabel(selectedColor)}</strong>
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="h-10 w-20 rounded border cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary/20 transition-all"
                          style={{ backgroundColor: customColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" align="start">
                        <ColorPicker
                          value={customColor}
                          onChange={(rgba) => {
                            if (Array.isArray(rgba) && rgba.length >= 3) {
                              const [r, g, b] = rgba;
                              const hex = Color.rgb(r, g, b).hex();
                              setCustomColor(hex);
                            }
                          }}
                          className="w-[200px]"
                        >
                          <div className="space-y-3">
                            <ColorPickerSelection className="h-32 w-full" />
                            <ColorPickerHue />
                            <div className="flex items-center gap-2">
                              <ColorPickerFormat className="flex-1" />
                              <ColorPickerEyeDropper />
                            </div>
                          </div>
                        </ColorPicker>
                      </PopoverContent>
                    </Popover>
                    <Input
                      value={customColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                          setCustomColor(value);
                        }
                      }}
                      placeholder="#3B82F6"
                      className="flex-1 font-mono text-sm"
                      maxLength={7}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="pt-2 border-t">
              <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
              <Badge
                className="text-sm"
                style={{
                  backgroundColor: useCustomColor ? customColor : selectedColor,
                  color: "white",
                }}
              >
                {newTagName || "Nome da etiqueta"}
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditTag} disabled={!newTagName.trim()}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação para Deletar (Individual) */}
      <Dialog open={tagToDelete !== null} onOpenChange={(open) => !open && setTagToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir etiqueta</DialogTitle>
            <DialogDescription>
              Esta etiqueta será removida permanentemente. As conversas que a utilizam não serão afetadas.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (tagToDelete) {
                  handleDeleteTag(tagToDelete);
                }
              }}
            >
              Excluir etiqueta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação para Deletar (Múltiplas) */}
      <Dialog open={tagsToDelete.size > 0} onOpenChange={(open) => !open && setTagsToDelete(new Set())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Excluir {tagsToDelete.size} {tagsToDelete.size === 1 ? 'etiqueta' : 'etiquetas'}?
            </DialogTitle>
            <DialogDescription>
              {tagsToDelete.size === 1 
                ? 'Esta etiqueta será removida permanentemente. As conversas que a utilizam não serão afetadas.'
                : `Estas ${tagsToDelete.size} etiquetas serão removidas permanentemente. As conversas que as utilizam não serão afetadas.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagsToDelete(new Set())}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteSelected}
            >
              Excluir {tagsToDelete.size} {tagsToDelete.size === 1 ? 'etiqueta' : 'etiquetas'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
