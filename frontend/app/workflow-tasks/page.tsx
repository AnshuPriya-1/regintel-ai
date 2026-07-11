"use client";
import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/workflow/kanban-board";
import { TasksTable } from "@/components/workflow/tasks-table";
import { CalendarView } from "@/components/workflow/calendar-view";
import { getTasks, updateTask } from "@/services/tasks";
import { apiFetch } from "@/services/api";
import type { Task } from "@/types/task";

export default function WorkflowTasksPage() {
  const [tasks, setTasks] = React.useState<Task[] | undefined>(undefined);
  const [generating, setGenerating] = React.useState(false);

  const load = React.useCallback(() => {
    getTasks().then(setTasks);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      // Re-derives tasks from every extracted obligation (documents already
      // uploaded via /upload); idempotent, so it's safe to re-run.
      await apiFetch("/tasks/generate", { method: "POST" });
      load();
    } catch (err) {
      console.warn("Failed to generate tasks from obligations:", err);
    } finally {
      setGenerating(false);
    }
  }

  async function handleStatusChange(id: string, status: Task["status"]) {
    try {
      await updateTask(id, { status });
    } catch (err) {
      console.warn(`Failed to persist status change for task ${id}:`, err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Workflow Tasks</h1>
          <p className="mt-1 text-sm text-foreground-muted">Drag cards between columns to update status.</p>
        </div>
        <Button onClick={handleGenerate} disabled={generating}>
          <RefreshCw className={generating ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          {generating ? "Generating…" : "Generate from Obligations"}
        </Button>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <KanbanBoard initialTasks={tasks} onStatusChange={handleStatusChange} />
        </TabsContent>
        <TabsContent value="table">
          <TasksTable tasks={tasks} />
        </TabsContent>
        <TabsContent value="calendar">
          <CalendarView tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}