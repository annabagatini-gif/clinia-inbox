"use client";

import { MoreHorizontal, Moon, X, Smile, Paperclip, ArrowUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockMessages } from "@/lib/mock-data";

interface ChatAreaProps {
  conversationId?: string;
  conversationName?: string;
}

export function ChatArea({ conversationId, conversationName }: ChatAreaProps) {
  const messages = conversationId ? mockMessages[conversationId] || [] : [];

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <p className="text-muted-foreground">Select a conversation to start</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">{conversationName}</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Moon className="h-4 w-4" />
            <span className="ml-2 text-sm">Snooze</span>
          </Button>
          <Button variant="default" size="sm" className="ml-2">
            <X className="h-4 w-4 mr-1" />
            Close
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 max-w-3xl">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{message.isUser ? 'JJ' : message.sender}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-muted text-foreground'
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
      <div className="border-t">
        <div className="p-3 flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" className="h-8 text-sm">
            <Zap className="h-4 w-4 mr-1" />
            Use macro
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-sm">
            <Smile className="h-4 w-4 mr-1" />
            Insert emoji
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-sm">
            Write a note
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-sm">
            <X className="h-4 w-4 mr-1" />
            Close
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-sm">
            Snooze
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-sm">
            <Paperclip className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>

        <Separator />

        {/* Input Area */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Y</span>
            <Input
              placeholder="Search actions"
              className="flex-1 h-9 text-sm"
            />
          </div>
          <div className="flex items-end gap-2">
            <Input
              placeholder="Type your message..."
              className="flex-1 h-10"
            />
            <Button size="icon" className="h-10 w-10 rounded-full flex-shrink-0">
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span>↑ ↓ to navigate</span>
            <span>⏎ to select</span>
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

