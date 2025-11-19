"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  minDate?: Date
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  minDate,
  placeholder = "Selecione uma data",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  const selectedDate = value ? new Date(value + "T00:00:00") : undefined

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      onChange(formattedDate)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-0.5 h-4 w-4 shrink-0" />
          <span className="truncate">
            {value ? (
              format(new Date(value + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })
            ) : (
              placeholder
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={minDate ? (date) => date < minDate : undefined}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

