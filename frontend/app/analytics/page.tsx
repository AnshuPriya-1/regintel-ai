"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceTrendChart } from "@/components/dashboard/compliance-trend-chart";
import { departments, documents, complianceTrend } from "@/lib/mock-data";

const stats = [
  { label: "Obligations Processed", value: "128" },
  { label: "AI Extraction Accuracy", value: "96%" },
  { label: "Documents This Month", value: "12" },
  { label: "Tasks Completed", value: "42" },
];

const docAnalytics = documents.map((d) => ({ name: d.name.split(" ").slice(0, 2).join(" "), obligations: d.obligations }));

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-foreground-muted">Monthly statistics across departments, documents and AI performance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="font-display text-2xl font-bold tabular-nums text-foreground">{s.value}</p>
            <p className="mt-1 text-[12px] text-foreground-muted">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Department Performance</CardTitle></CardHeader>
          <div className="h-72 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--foreground-subtle)" }} axisLine={false} tickLine={false} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--foreground-subtle)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12, background: "var(--surface)" }} />
                <Bar dataKey="compliance" radius={[6, 6, 0, 0]}>
                  {departments.map((d, i) => (
                    <Cell key={i} fill={d.risk === "High" ? "var(--danger)" : d.risk === "Medium" ? "var(--warning)" : "var(--success)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Document Analytics</CardTitle></CardHeader>
          <div className="h-72 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={docAnalytics} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--foreground-subtle)" }} axisLine={false} tickLine={false} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "var(--foreground-subtle)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12, background: "var(--surface)" }} />
                <Bar dataKey="obligations" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <ComplianceTrendChart />
    </div>
  );
}
