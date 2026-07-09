"use client";
import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/workflow/kanban-board";
import { TasksTable } from "@/components/workflow/tasks-table";
import { CalendarView } from "@/components/workflow/calendar-view";

export default function WorkflowTasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Workflow Tasks</h1>
          <p className="mt-1 text-sm text-foreground-muted">Drag cards between columns to update status.</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Create Task</Button>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban"><KanbanBoard /></TabsContent>
        <TabsContent value="table"><TasksTable /></TabsContent>
        <TabsContent value="calendar"><CalendarView /></TabsContent>
      </Tabs>
    </div>
  );
}
