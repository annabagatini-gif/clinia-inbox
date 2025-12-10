"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxSidebar } from "@/components/inbox/inbox-sidebar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hash, Plus, Search, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomField {
  id: string;
  name: string;
  variable: string;
  type: "text" | "number" | "date" | "select";
  required: boolean;
  question?: string;
}

export default function CustomFieldsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [fields] = useState<CustomField[]>([
    { 
      id: "1", 
      name: "Nome", 
      variable: "{{Nome}}",
      type: "text", 
      required: true,
      question: "Qual é o seu nome completo?"
    },
    { 
      id: "2", 
      name: "Plano de saúde", 
      variable: "{{PlanoSaude}}",
      type: "text", 
      required: false,
      question: "Qual é o seu plano de saúde?"
    },
    { 
      id: "3", 
      name: "Data de nascimento", 
      variable: "{{DataNascimento}}",
      type: "date", 
      required: true,
      question: "Qual é a sua data de nascimento?"
    },
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar p-2 gap-2">
      <div className="hidden lg:flex">
        <InboxSidebar 
          activeTab="settings"
          onTabChange={() => {}}
          counts={{ all: 13, my: 8, unread: 0, unassigned: 3 }}
          showSettings={true}
          onSettingsClick={() => {}}
          onInboxClick={() => router.push("/")}
        />
      </div>

      <div className="flex-1 flex overflow-hidden bg-background rounded-lg">
        <SettingsSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Campos personalizados</h1>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar campo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure campos que coletam dados dos clientes durante os fluxos automatizados e substituem variáveis nas mensagens. Exemplo: ao perguntar o nome, use {"{{Nome}}"} nas mensagens e ele será substituído automaticamente.
            </p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar campos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Campo</TableHead>
                      <TableHead>Variável</TableHead>
                      <TableHead>Pergunta</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Obrigatório</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">{field.name}</TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                            {field.variable}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          <span className="text-sm text-muted-foreground">
                            {field.question || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {field.type === "text" ? "Texto" :
                           field.type === "number" ? "Número" :
                           field.type === "date" ? "Data" : "Seleção"}
                        </TableCell>
                        <TableCell>
                          {field.required ? (
                            <span className="text-green-600">Sim</span>
                          ) : (
                            <span className="text-gray-400">Não</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Exemplo de uso */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-medium mb-2">Como funciona nos workflows</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Nos fluxos automatizados, quando o sistema pergunta ao cliente e ele responde, o valor é salvo. Depois, ao usar a variável nas mensagens do workflow, ela é substituída automaticamente pelo valor real.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-background rounded border">
                    <p className="text-sm font-medium mb-2">1. No workflow, configure uma ação para perguntar:</p>
                    <p className="text-sm text-muted-foreground">
                      "Qual é o seu nome completo?"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">→ Campo: Nome ({"{{Nome}}"})</p>
                  </div>
                  <div className="p-3 bg-background rounded border">
                    <p className="text-sm font-medium mb-2">2. Cliente responde:</p>
                    <p className="text-sm text-muted-foreground">
                      "João Silva"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">→ Sistema salva: Nome = "João Silva"</p>
                  </div>
                  <div className="p-3 bg-background rounded border">
                    <p className="text-sm font-medium mb-2">3. Nas mensagens seguintes do workflow, use:</p>
                    <p className="text-sm">
                      Olá {"{{Nome}}"}, seu agendamento está confirmado para amanhã às 14h.
                    </p>
                  </div>
                  <div className="p-3 bg-background rounded border border-green-200 bg-green-50">
                    <p className="text-sm font-medium mb-2">4. Cliente recebe automaticamente:</p>
                    <p className="text-sm">
                      Olá João Silva, seu agendamento está confirmado para amanhã às 14h.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

