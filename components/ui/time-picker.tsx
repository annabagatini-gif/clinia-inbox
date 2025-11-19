"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface TimePickerProps {
  value?: string
  onChange: (time: string) => void
  placeholder?: string
  className?: string
}

export function TimePicker({
  value,
  onChange,
  placeholder = "HH:MM",
  className,
}: TimePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Remove tudo que não é número ou dois pontos
    let cleaned = inputValue.replace(/[^\d:]/g, "")
    
    // Limita a 5 caracteres (HH:MM)
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5)
    }
    
    // Adiciona dois pontos automaticamente após 2 dígitos
    if (cleaned.length === 2 && !cleaned.includes(":")) {
      cleaned = cleaned + ":"
    }
    
    // Valida formato HH:MM
    if (cleaned.length <= 5) {
      const parts = cleaned.split(":")
      if (parts.length === 2) {
        const hours = parts[0]
        const minutes = parts[1]
        
        // Valida horas (00-23)
        if (hours.length <= 2 && (hours === "" || (parseInt(hours) >= 0 && parseInt(hours) <= 23))) {
          // Valida minutos (00-59)
          if (minutes.length <= 2 && (minutes === "" || (parseInt(minutes) >= 0 && parseInt(minutes) <= 59))) {
            onChange(cleaned)
          }
        }
      } else if (parts.length === 1 && cleaned.length <= 2) {
        // Ainda digitando as horas
        onChange(cleaned)
      }
    }
  }

  const handleBlur = () => {
    if (value) {
      const parts = value.split(":")
      if (parts.length === 2) {
        const hours = parts[0].padStart(2, "0")
        const minutes = parts[1].padStart(2, "0")
        onChange(`${hours}:${minutes}`)
      }
    }
  }

  return (
    <div className="relative">
      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={value || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn("pl-9", className)}
        maxLength={5}
      />
    </div>
  )
}

