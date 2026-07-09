"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView() {
  const [cursor, setCursor] = React.useState(new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tasksByDay = new Map<number, typeof tasks>();
  tasks.forEach((t) => {
    const d = new Date(t.dueDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      tasksByDay.set(day, [...(tasksByDay.get(day) ?? []), t]);
    }
  });

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-sm font-semibold text-foreground">
          {cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-foreground-subtle">
        {weekDays.map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => (
          <div
            key={i}
            className={cn(
              "min-h-[84px] rounded-xl border border-border-soft p-1.5 text-left",
              !day && "border-transparent"
            )}
          >
            {day && (
              <>
                <p className="px-0.5 text-[11px] font-medium text-foreground-muted">{day}</p>
                <div className="mt-1 space-y-1">
                  {(tasksByDay.get(day) ?? []).slice(0, 2).map((t) => (
                    <div key={t.id} className="truncate rounded-md bg-primary-tint px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      {t.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
