"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerFormat,
  ColorPickerEyeDropper,
} from "@/components/ui/shadcn-io/color-picker";
import { Button } from "@/components/ui/button";
import Color from "color";

export default function ColorPickerPage() {
  const [selectedColor, setSelectedColor] = useState("#3B82F6");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Seletor de cor</h2>
        
        <div className="space-y-4">
          {/* Color Picker Trigger */}
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="h-12 w-24 rounded border-2 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary/20 transition-all shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <ColorPicker
                  value={selectedColor}
                  onChange={(rgba) => {
                    if (Array.isArray(rgba) && rgba.length >= 3) {
                      const [r, g, b] = rgba;
                      const hex = Color.rgb(r, g, b).hex();
                      setSelectedColor(hex);
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
            
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">Cor selecionada</div>
              <div className="text-xs text-muted-foreground font-mono">
                {selectedColor}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t">
            <div className="text-sm font-medium mb-2">Preview</div>
            <div
              className="h-12 rounded-md flex items-center justify-center text-white font-medium shadow-sm"
              style={{ backgroundColor: selectedColor }}
            >
              Exemplo de uso
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



