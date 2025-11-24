"use client";

import { useState, useMemo } from "react";
import { X, Plus, StickyNote, Bell, Calendar, Clock, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Annotation } from "@/types/inbox";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";

interface AnnotationsDrawerProps {
  conversationId?: string;
  annotations: Annotation[];
  onCreateAnnotation: (annotation: Omit<Annotation, "id" | "createdAt" | "createdBy">) => void;
  onUpdateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  onDeleteAnnotation: (id: string) => void;
  tooltip?: string;
}

export function AnnotationsDrawer({
  conversationId,
  annotations,
  onCreateAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  tooltip = "Notas e Lembretes",
}: AnnotationsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "notes" | "reminders">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [annotationToDelete, setAnnotationToDelete] = useState<Annotation | null>(null);
  
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState<"note" | "reminder">("note");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");

  const [editContent, setEditContent] = useState("");
  const [editReminderDate, setEditReminderDate] = useState("");
  const [editReminderTime, setEditReminderTime] = useState("");

  const conversationAnnotations = useMemo(
    () => annotations.filter(a => a.conversationId === conversationId),
    [annotations, conversationId]
  );

  const filteredAnnotations = useMemo(() => {
    let filtered = conversationAnnotations;

    if (filter === "notes") {
      filtered = filtered.filter(a => a.type === "note");
    } else if (filter === "reminders") {
      filtered = filtered.filter(a => a.type === "reminder");
    }

    return filtered.sort((a, b) => {
      if (a.type === "reminder" && b.type === "note") return -1;
      if (a.type === "note" && b.type === "reminder") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [conversationAnnotations, filter]);

  const activeRemindersCount = useMemo(
    () => conversationAnnotations.filter(a => a.type === "reminder" && !a.isCompleted).length,
    [conversationAnnotations]
  );

  const handleCreate = () => {
    if (!newContent.trim()) {
      toast.error("Digite o conteúdo da nota");
      return;
    }

    if (newType === "reminder" && (!newReminderDate || !newReminderTime)) {
      toast.error("Selecione data e hora para o lembrete");
      return;
    }

    onCreateAnnotation({
      conversationId: conversationId || "",
      content: newContent.trim(),
      type: newType,
      reminderDate: newType === "reminder" ? newReminderDate : undefined,
      reminderTime: newType === "reminder" ? newReminderTime : undefined,
      isCompleted: false,
    });

    setNewContent("");
    setNewType("note");
    setNewReminderDate("");
    setNewReminderTime("");
    setIsCreating(false);
    toast.success(newType === "reminder" ? "Lembrete criado!" : "Nota criada!");
  };

  const handleStartEdit = (annotation: Annotation) => {
    setEditingId(annotation.id);
    setEditContent(annotation.content);
    setEditReminderDate(annotation.reminderDate || "");
    setEditReminderTime(annotation.reminderTime || "");
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) {
      toast.error("Digite o conteúdo da nota");
      return;
    }

    const annotation = conversationAnnotations.find(a => a.id === editingId);
    if (annotation?.type === "reminder" && (!editReminderDate || !editReminderTime)) {
      toast.error("Selecione data e hora para o lembrete");
      return;
    }

    onUpdateAnnotation(editingId!, {
      content: editContent.trim(),
      reminderDate: annotation?.type === "reminder" ? editReminderDate : undefined,
      reminderTime: annotation?.type === "reminder" ? editReminderTime : undefined,
    });

    setEditingId(null);
    setEditContent("");
    setEditReminderDate("");
    setEditReminderTime("");
    toast.success("Nota atualizada!");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
    setEditReminderDate("");
    setEditReminderTime("");
  };

  const handleToggleComplete = (id: string, isCompleted: boolean) => {
    onUpdateAnnotation(id, { isCompleted: !isCompleted });
    toast.success(isCompleted ? "Lembrete reativado!" : "Lembrete concluído!");
  };

  const handleDeleteClick = (annotation: Annotation) => {
    setAnnotationToDelete(annotation);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (annotationToDelete) {
      onDeleteAnnotation(annotationToDelete.id);
      toast.success(annotationToDelete.type === "reminder" ? "Lembrete excluído!" : "Nota excluída!");
      setDeleteDialogOpen(false);
      setAnnotationToDelete(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <StickyNote 
                  className={`h-4 w-4 ${activeRemindersCount > 0 ? 'text-orange-500' : ''}`} 
                  strokeWidth={1.75} 
                />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent className="w-full sm:max-w-md" hideCloseButton>
        <SheetHeader className="pt-4 pb-2 px-4 sm:px-6">
          <SheetTitle>Notas e Lembretes</SheetTitle>
          <SheetDescription>
            Gerencie notas e lembretes para esta conversa
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 sm:px-6">
          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todas
            </Button>
            <Button
              variant={filter === "notes" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("notes")}
            >
              Notas
            </Button>
            <Button
              variant={filter === "reminders" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("reminders")}
            >
              Lembretes
            </Button>
          </div>

          {/* Form Criar */}
          {isCreating && (
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={newType === "note" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewType("note")}
                  className="flex-1"
                >
                  <StickyNote className="h-4 w-4 mr-2" />
                  Nota
                </Button>
                <Button
                  variant={newType === "reminder" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewType("reminder")}
                  className="flex-1"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Lembrete
                </Button>
              </div>

              <Textarea
                placeholder={newType === "reminder" ? "O que você quer ser lembrado?" : "Digite sua nota..."}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
              />

              {newType === "reminder" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Data</label>
                    <DatePicker
                      value={newReminderDate}
                      onChange={setNewReminderDate}
                      minDate={new Date()}
                      placeholder="Selecione a data"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Horário</label>
                    <TimePicker
                      value={newReminderTime}
                      onChange={setNewReminderTime}
                      placeholder="Insira um horário"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setNewContent("");
                    setNewType("note");
                    setNewReminderDate("");
                    setNewReminderTime("");
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreate}
                  className="flex-1"
                >
                  Criar
                </Button>
              </div>
            </div>
          )}

          {filteredAnnotations.length > 0 && <Separator />}

          {/* Lista de Anotações */}
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-3">
              {filteredAnnotations.length === 0 && !isCreating ? (
                <div className="text-center text-muted-foreground py-8 space-y-4">
                  <StickyNote className="h-12 w-12 mx-auto mb-2 opacity-50" strokeWidth={1.5} />
                  <p className="max-w-[220px] mx-auto">
                    {filter === "notes" 
                      ? "Nenhuma nota encontrada" 
                      : filter === "reminders"
                      ? "Nenhum lembrete encontrado"
                      : "Nenhuma nota e nenhum lembrete encontrados"}
                  </p>
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="w-auto mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar
                  </Button>
                </div>
              ) : (
                <>
                  {/* Botão Criar - no topo quando há itens */}
                  {!isCreating && (
                    <Button
                      onClick={() => setIsCreating(true)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar
                    </Button>
                  )}
                  {filteredAnnotations.map((annotation) => {
                  if (editingId === annotation.id) {
                    return (
                      <div key={annotation.id} className="p-4 border rounded-lg space-y-3 bg-yellow-50 dark:bg-yellow-950">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                        />
                        {annotation.type === "reminder" && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Data</label>
                              <DatePicker
                                value={editReminderDate}
                                onChange={setEditReminderDate}
                                placeholder="Selecione a data"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Horário</label>
                              <TimePicker
                                value={editReminderTime}
                                onChange={setEditReminderTime}
                                placeholder="Insira um horário"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="flex-1"
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={annotation.id}
                      className={`p-4 border rounded-lg space-y-2 ${
                        annotation.type === "note"
                          ? "bg-yellow-50 dark:bg-yellow-950"
                          : annotation.isCompleted
                          ? "bg-gray-50 dark:bg-gray-900 opacity-60"
                          : "bg-orange-50 dark:bg-orange-950"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {annotation.type === "note" ? (
                            <StickyNote className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <Bell className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {annotation.type === "note" ? "Nota" : "Lembrete"}
                          </Badge>
                          {annotation.isCompleted && (
                            <Badge variant="outline" className="text-xs">
                              Concluído
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {annotation.type === "reminder" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleToggleComplete(annotation.id, annotation.isCompleted || false)}
                            >
                              <CheckCircle2 className={`h-3 w-3 ${annotation.isCompleted ? "text-green-600" : ""}`} />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleStartEdit(annotation)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteClick(annotation)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm whitespace-pre-wrap">{annotation.content}</p>

                      {annotation.type === "reminder" && annotation.reminderDate && annotation.reminderTime && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {(() => {
                              // Formatar data diretamente da string para evitar problemas de timezone
                              const [year, month, day] = annotation.reminderDate.split("-");
                              return `${day}/${month}/${year}`;
                            })()} às {annotation.reminderTime}
                          </span>
                        </div>
                      )}

                      {annotation.type === "note" && (
                        <div className="text-xs text-muted-foreground">
                          Criado em {new Date(annotation.createdAt).toLocaleString("pt-BR")}
                        </div>
                      )}
                    </div>
                  );
                  })}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {annotationToDelete?.type === "reminder" ? "Excluir lembrete?" : "Excluir nota?"}
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {annotationToDelete?.type === "reminder" ? "este lembrete" : "esta nota"}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setAnnotationToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}

