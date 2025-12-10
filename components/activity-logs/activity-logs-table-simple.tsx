"use client";

import { useState } from "react";
import { formatActivityDate, getActivityTypeLabel, type UserActivityLog, type UserActivityType } from "@/lib/user-activity-logs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, User, Calendar, Activity } from "lucide-react";

interface ActivityLogsTableProps {
  logs: UserActivityLog[];
}

// Ícones e cores por tipo de atividade
const activityConfig: Record<UserActivityType, { icon: string; color: string; bgColor: string }> = {
  user_invited: {
    icon: "👤",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  user_created: {
    icon: "✅",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  user_invitation_expired: {
    icon: "⚠️",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  user_deleted: {
    icon: "❌",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

export function ActivityLogsTable({ logs }: ActivityLogsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<UserActivityType | "all">("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

  // Filtrar atividades
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.colleague.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || log.activityType === selectedType;

    // Filtro de período (simplificado - você pode implementar lógica mais complexa)
    const matchesPeriod = selectedPeriod === "all" || true; // Implementar lógica de data

    return matchesSearch && matchesType && matchesPeriod;
  });

  // Estatísticas
  const stats = {
    total: logs.length,
    today: logs.filter((log) => {
      const today = new Date().toDateString();
      const logDate = new Date(log.date).toDateString();
      return logDate === today;
    }).length,
    thisWeek: logs.filter((log) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(log.date) >= weekAgo;
    }).length,
  };

  const handleExportCSV = () => {
    const headers = ["Tipo de Atividade", "Colega", "Detalhes", "Data", "Endereço IP"];
    const rows = filteredLogs.map((log) => [
      getActivityTypeLabel(log.activityType),
      log.colleague,
      log.details,
      log.date,
      log.ipAddress,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `historico-atividades-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total de Atividades</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Hoje</div>
          <div className="text-2xl font-bold">{stats.today}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Esta Semana</div>
          <div className="text-2xl font-bold">{stats.thisWeek}</div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-card border rounded-lg p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por usuário ou detalhes da atividade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro por Tipo */}
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as UserActivityType | "all")}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Activity className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Tipo de atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="user_invited">Usuário Convidado</SelectItem>
              <SelectItem value="user_created">Usuário Criado</SelectItem>
              <SelectItem value="user_invitation_expired">Convite Expirado</SelectItem>
              <SelectItem value="user_deleted">Usuário Deletado</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro por Período */}
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo o período</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Exportar */}
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Tabela usando divs */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b font-medium text-sm">
            <div className="col-span-2">Tipo de Atividade</div>
            <div className="col-span-2">Colega</div>
            <div className="col-span-4">Detalhes</div>
            <div className="col-span-2">Data</div>
            <div className="col-span-2">Endereço IP</div>
          </div>

          {/* Corpo da tabela */}
          <div className="divide-y">
            {filteredLogs.length === 0 ? (
              <div className="px-6 py-12 text-center text-muted-foreground">
                Nenhuma atividade encontrada
              </div>
            ) : (
              filteredLogs.map((log, index) => {
                const config = activityConfig[log.activityType];
                return (
                  <div key={index} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config.icon}</span>
                        <span className={`font-medium text-sm ${config.color}`}>
                          {getActivityTypeLabel(log.activityType)}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{log.colleague}</span>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div className="text-sm truncate" title={log.details}>
                        {log.details}
                      </div>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {log.date}
                    </div>
                    <div className="col-span-2 font-mono text-xs text-muted-foreground">
                      {log.ipAddress}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Rodapé com contador */}
          {filteredLogs.length > 0 && (
            <div className="border-t px-6 py-3 flex items-center justify-between bg-muted/30">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredLogs.length} de {logs.length} registros
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

