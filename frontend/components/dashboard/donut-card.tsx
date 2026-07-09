"use client";
import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const palette = ["var(--primary)", "var(--accent)", "var(--success)", "var(--warning)", "var(--danger)", "#8B5CF6", "#EC4899", "#64748B"];

export function DonutCard({
  title, data, colorKey, total,
}: { title: string; data: { name: string; value: number; color?: string }[]; colorKey?: boolean; total?: number }) {
  const sum = total ?? data.reduce((a, b) => a + b.value, 0);
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <div className="flex items-center gap-4 px-5 pb-5">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={70} paddingAngle={2} strokeWidth={0}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color ?? palette[i % palette.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: unknown) => [`${v}`, "Obligations"]}
                contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12, background: "var(--surface)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-xl font-bold text-foreground">{sum}</span>
            <span className="text-[10px] text-foreground-muted">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5 min-w-0">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between gap-2 text-[13px]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color ?? palette[i % palette.length] }} />
                <span className="truncate text-foreground-muted">{d.name}</span>
              </div>
              <span className="shrink-0 font-medium text-foreground tabular-nums">{d.value} ({Math.round((d.value / sum) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
