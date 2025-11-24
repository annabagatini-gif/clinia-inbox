"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

const TooltipContext = React.createContext<{
  onOpenChange?: (open: boolean) => void;
}>({});

function Tooltip({
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipContext.Provider value={{ onOpenChange }}>
        <TooltipPrimitive.Root 
          data-slot="tooltip" 
          open={open}
          onOpenChange={onOpenChange}
          {...props} 
        />
      </TooltipContext.Provider>
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  const context = React.useContext(TooltipContext);

  const handleClose = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (context.onOpenChange) {
      context.onOpenChange(false);
    }
  }, [context]);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance relative",
          showCloseButton && "pr-6",
          className
        )}
        onEscapeKeyDown={() => {
          if (context.onOpenChange) {
            context.onOpenChange(false);
          }
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-sm opacity-70 hover:opacity-100 text-background hover:bg-background/20 transition-opacity z-10"
            aria-label="Fechar"
            type="button"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
