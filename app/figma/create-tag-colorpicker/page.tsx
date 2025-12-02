"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Cores pré-definidas com nomes semânticos (16 cores)
const PRESET_COLORS = [
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

export default function CreateTagColorPickerPage() {
  const [newTagName, setNewTagName] = useState("Nome da etiqueta");
  const [selectedColor, setSelectedColor] = useState("#EF4444"); // Vermelho "Urgente" selecionado
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [customColor, setCustomColor] = useState("#3B82F6");

  const getColorLabel = (color: string) => {
    return PRESET_COLORS.find(c => c.value === color)?.label || "Personalizado";
  };

  const currentColor = useCustomColor ? customColor : selectedColor;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Dialog open={true}>
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
                  <div className="grid grid-cols-8 gap-2">
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
                      <PopoverContent className="w-auto p-3" align="start">
                        <div className="space-y-3">
                          <HexColorPicker color={customColor} onChange={setCustomColor} />
                          <div className="flex items-center gap-2">
                            <Input
                              value={customColor}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                                  setCustomColor(value);
                                }
                              }}
                              placeholder="#3B82F6"
                              className="font-mono text-sm"
                              maxLength={7}
                            />
                            <div
                              className="h-10 w-10 rounded border border-gray-300 flex-shrink-0"
                              style={{ backgroundColor: customColor }}
                            />
                          </div>
                        </div>
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
                  backgroundColor: currentColor,
                  color: "white",
                }}
              >
                {newTagName || "Nome da etiqueta"}
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline">Cancelar</Button>
            <Button>Criar etiqueta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

