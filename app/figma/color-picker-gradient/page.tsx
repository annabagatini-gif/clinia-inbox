"use client";

import { useState, useEffect } from "react";
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerFormat,
} from "@/components/ui/shadcn-io/color-picker";
import Color from "color";

export default function ColorPickerGradientPage() {
  const [selectedColor, setSelectedColor] = useState("#EF4444");
  
  // Garantir que a cor inicial seja aplicada
  useEffect(() => {
    // Força uma atualização inicial
    setSelectedColor("#EF4444");
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg p-6 shadow-lg">
        <ColorPicker
          value={selectedColor}
          onChange={(rgba) => {
            if (Array.isArray(rgba) && rgba.length >= 3) {
              const [r, g, b] = rgba;
              const hex = Color.rgb(r, g, b).hex();
              setSelectedColor(hex);
            }
          }}
          className="w-[280px]"
        >
          <div className="space-y-3">
            {/* Gradiente principal */}
            <ColorPickerSelection className="h-[180px] w-full" />
            
            {/* Barrinha de matiz (hue slider) */}
            <ColorPickerHue />
            
            {/* Código hexadecimal */}
            <ColorPickerFormat className="flex-1" />
          </div>
        </ColorPicker>
      </div>
    </div>
  );
}

