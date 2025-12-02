"use client";

import { useState } from "react";
import { HexColorPicker, RgbColorPicker, HslColorPicker, RgbaColorPicker } from "react-colorful";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ColorPickerDemoPage() {
  const [hexColor, setHexColor] = useState("#aabbcc");
  const [rgbColor, setRgbColor] = useState({ r: 170, g: 187, b: 204 });
  const [hslColor, setHslColor] = useState({ h: 210, s: 30, l: 73 });
  const [rgbaColor, setRgbaColor] = useState({ r: 170, g: 187, b: 204, a: 1 });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">react-colorful - Demonstração</h1>
          <p className="text-muted-foreground">
            Esta é a biblioteca <strong>react-colorful</strong> que estamos usando. 
            Ela oferece diferentes tipos de color pickers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HexColorPicker - O que estamos usando */}
          <Card>
            <CardHeader>
              <CardTitle>HexColorPicker</CardTitle>
              <CardDescription>
                O que estamos usando atualmente - Seleciona cores em formato HEX
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <HexColorPicker color={hexColor} onChange={setHexColor} />
                <div className="space-y-2">
                  <div
                    className="w-32 h-32 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: hexColor }}
                  />
                  <div>
                    <Label className="text-sm font-mono">{hexColor}</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RgbColorPicker */}
          <Card>
            <CardHeader>
              <CardTitle>RgbColorPicker</CardTitle>
              <CardDescription>
                Seleciona cores em formato RGB (Red, Green, Blue)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <RgbColorPicker color={rgbColor} onChange={setRgbColor} />
                <div className="space-y-2">
                  <div
                    className="w-32 h-32 rounded-lg border-2 border-gray-300"
                    style={{ 
                      backgroundColor: `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})` 
                    }}
                  />
                  <div>
                    <Label className="text-sm font-mono">
                      rgb({rgbColor.r}, {rgbColor.g}, {rgbColor.b})
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HslColorPicker */}
          <Card>
            <CardHeader>
              <CardTitle>HslColorPicker</CardTitle>
              <CardDescription>
                Seleciona cores em formato HSL (Hue, Saturation, Lightness)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <HslColorPicker color={hslColor} onChange={setHslColor} />
                <div className="space-y-2">
                  <div
                    className="w-32 h-32 rounded-lg border-2 border-gray-300"
                    style={{ 
                      backgroundColor: `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)` 
                    }}
                  />
                  <div>
                    <Label className="text-sm font-mono">
                      hsl({hslColor.h}, {hslColor.s}%, {hslColor.l}%)
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RgbaColorPicker */}
          <Card>
            <CardHeader>
              <CardTitle>RgbaColorPicker</CardTitle>
              <CardDescription>
                Seleciona cores em formato RGBA (com transparência/alpha)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <RgbaColorPicker color={rgbaColor} onChange={setRgbaColor} />
                <div className="space-y-2">
                  <div
                    className="w-32 h-32 rounded-lg border-2 border-gray-300"
                    style={{ 
                      backgroundColor: `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${rgbaColor.a})` 
                    }}
                  />
                  <div>
                    <Label className="text-sm font-mono">
                      rgba({rgbaColor.r}, {rgbaColor.g}, {rgbaColor.b}, {rgbaColor.a.toFixed(2)})
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Biblioteca:</strong> react-colorful (não é shadcn-color-picker)
            </p>
            <p>
              <strong>Documentação:</strong>{" "}
              <a 
                href="https://react-colorful.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://react-colorful.netlify.app
              </a>
            </p>
            <p>
              <strong>O que estamos usando:</strong> HexColorPicker (primeiro exemplo acima)
            </p>
            <p className="text-muted-foreground">
              O react-colorful é uma biblioteca leve e simples. O HexColorPicker é bem básico - 
              apenas um seletor de cor com gradiente. Se você quiser algo mais avançado, podemos 
              usar outras bibliotecas como react-color que tem mais opções visuais.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

