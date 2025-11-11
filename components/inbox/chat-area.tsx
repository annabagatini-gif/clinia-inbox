"use client";

import { MoreHorizontal, Moon, X, Smile, Paperclip, ArrowUp, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockMessages } from "@/lib/mock-data";

interface ChatAreaProps {
  conversationId?: string;
  conversationName?: string;
  onBack?: () => void;
}

export function ChatArea({ conversationId, conversationName, onBack }: ChatAreaProps) {
  const messages = conversationId ? mockMessages[conversationId] || [] : [];

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-2xl shadow-md h-full">
        <p className="text-muted-foreground">Selecione uma conversa para iniciar</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden rounded-2xl shadow-md h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 md:hidden flex-shrink-0"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="font-semibold text-lg truncate">{conversationName}</h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            <Moon className="h-4 w-4 mr-2" />
            <span className="text-sm">Adiar</span>
          </Button>
          <Button variant="default" size="sm" className="h-8">
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[70%] lg:max-w-[60%]`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{message.sender}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.isUser
                      ? 'bg-muted text-foreground'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Action Bar */}
      <div className="border-t flex-shrink-0">
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto">
          <Button variant="ghost" size="sm" className="h-8 text-xs whitespace-nowrap">
            <Zap className="h-3 w-3 mr-1" />
            Resposta rápida
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs whitespace-nowrap">
            <Smile className="h-3 w-3 mr-1" />
            Emoji
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs whitespace-nowrap">
            Escrever nota
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs whitespace-nowrap">
            <Paperclip className="h-3 w-3 mr-1" />
            Anexar
          </Button>
        </div>

        <Separator />

        {/* Input Area */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              className="flex-1 h-10"
            />
            <Button size="icon" className="h-10 w-10 rounded-full flex-shrink-0">
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

