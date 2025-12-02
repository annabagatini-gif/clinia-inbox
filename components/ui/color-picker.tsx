"use client";

import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !color && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 w-full">
            <div
              className="h-4 w-4 rounded border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span className="flex-1 font-mono text-sm">{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-3">
          <HexColorPicker color={color} onChange={onChange} />
          <div className="flex items-center gap-2">
            <Input
              value={color}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                  onChange(value);
                }
              }}
              placeholder="#000000"
              className="font-mono text-sm"
              maxLength={7}
            />
            <div
              className="h-10 w-10 rounded border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

