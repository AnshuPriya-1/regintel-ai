"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import { Building2, ArrowRight, ListChecks, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, riskVariant } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { departments, complianceTrend } from "@/lib/mock-data";

export default function DepartmentImpactPage() {
  const [selected, setSelected] = React.useState<typeof departments[number] | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Department Impact</h1>
        <p className="mt-1 text-sm text-foreground-muted">Click a department to see its detailed compliance breakdown.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {departments.map((d, i) => (
          <motion.button
            key={d.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            onClick={() => setSelected(d)}
            className="text-left"
          >
            <Card className="flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-[var(--shadow-elevated)]">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-tint text-primary"><Building2 className="h-[18px] w-[18px]" /></div>
                <Badge variant={riskVariant(d.risk)}>{d.risk} Risk</Badge>
              </div>
              <p className="font-display text-[15px] font-semibold text-foreground">{d.name}</p>
              <div>
                <div className="mb-1 flex justify-between text-[12px] text-foreground-muted"><span>Compliance</span><span className="font-medium text-foreground">{d.compliance}%</span></div>
                <Progress value={d.compliance} />
              </div>
              <div className="flex items-center justify-between text-[12px] text-foreground-muted">
                <span>{d.pending} pending</span>
                <span>{d.obligations} obligations</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-primary">View details <ArrowRight className="h-3 w-3" /></div>
            </Card>
          </motion.button>
        ))}
      </div>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>{selected?.name}</SheetTitle></SheetHeader>
          {selected && (
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Compliance" value={`${selected.compliance}%`} />
                <Metric label="Risk Level" value={selected.risk} />
                <Metric label="Pending Tasks" value={String(selected.pending)} />
                <Metric label="Assigned Obligations" value={String(selected.obligations)} />
              </div>

              <div>
                <p className="mb-2 text-[13px] font-semibold text-foreground">Department Head</p>
                <p className="text-sm text-foreground-muted">{selected.head}</p>
              </div>

              <Card>
                <CardHeader><CardTitle>Performance Trend</CardTitle></CardHeader>
                <div className="h-48 px-2 pb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceTrend}>
                      <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--foreground-subtle)" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--foreground-subtle)" }} axisLine={false} tickLine={false} width={28} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12, background: "var(--surface)" }} />
                      <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted p-3.5">
      <p className="text-[11px] text-foreground-subtle">{label}</p>
      <p className="mt-0.5 font-display text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
