"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, ShieldCheck, ListChecks, Clock, AlertTriangle, Building2, FileText, Sparkles } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  "Compliance Score": ShieldCheck, "Total Obligations": ListChecks, "Pending Tasks": Clock,
  "High Risk Issues": AlertTriangle, "Departments": Building2, "Documents Processed": FileText, "AI Accuracy": Sparkles,
};

const sparkData = [4, 7, 5, 9, 7, 11, 9, 14];

export function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const Icon = iconMap[kpi.label] ?? ShieldCheck;
  const positive = kpi.trend >= 0;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const [ringProgress, setRingProgress] = React.useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setRingProgress(kpi.value), 150 + index * 60);
    return () => clearTimeout(t);
  }, [kpi.value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
    >
      <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-[var(--shadow-elevated)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12.5px] font-medium text-foreground-muted">{kpi.label}</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-display text-[26px] font-bold tabular-nums text-foreground">
                <AnimatedCounter value={kpi.value} suffix={kpi.suffix ?? ""} />
              </span>
            </div>
            {kpi.trend !== 0 ? (
              <div className={cn("mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-medium", positive ? "text-success" : "text-danger")}>
                {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(kpi.trend)}{kpi.suffix === "%" ? "%" : ""} <span className="font-normal text-foreground-subtle">{kpi.trendLabel}</span>
              </div>
            ) : (
              <p className="mt-1.5 text-[11.5px] text-foreground-subtle">{kpi.trendLabel}</p>
            )}
          </div>

          {kpi.type === "ring" ? (
            <svg width="56" height="56" className="shrink-0 -rotate-90">
              <circle cx="28" cy="28" r={radius} stroke="var(--border)" strokeWidth="5" fill="none" />
              <motion.circle
                cx="28" cy="28" r={radius} stroke="var(--primary)" strokeWidth="5" fill="none" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (ringProgress / 100) * circumference }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary transition-transform group-hover:scale-110">
              <Icon className="h-[18px] w-[18px]" />
            </div>
          )}
        </div>

        {kpi.type === "sparkline" && (
          <div className="mt-3 h-8 w-full opacity-70">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData.map((v, i) => ({ i, v }))}>
                <Line type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
