"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, FileWarning, TrendingUp, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { aiInsights } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconFor: Record<string, { icon: React.ElementType; color: string }> = {
  detection: { icon: Sparkles, color: "text-primary bg-primary-tint" },
  alert: { icon: AlertTriangle, color: "text-danger bg-danger-tint" },
  gap: { icon: FileWarning, color: "text-warning bg-warning-tint" },
  trend: { icon: TrendingUp, color: "text-success bg-success-tint" },
  risk: { icon: ShieldAlert, color: "text-danger bg-danger-tint" },
  recommendation: { icon: Sparkles, color: "text-accent bg-accent-tint" },
};

export function AIInsightsStrip() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>AI Insights</CardTitle>
        <Link href="/ai-insights"><Button variant="link" size="sm" className="h-auto p-0 text-xs">View all</Button></Link>
      </CardHeader>
      <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2 lg:grid-cols-5">
        {aiInsights.slice(0, 5).map((insight, i) => {
          const cfg = iconFor[insight.type] ?? iconFor.detection;
          return (
            <motion.div
              key={insight.id}
              whileHover={{ y: -2 }}
              className="flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-4"
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", cfg.color)}>
                <cfg.icon className="h-4 w-4" />
              </div>
              <p className="text-[13px] font-semibold leading-snug text-foreground">{insight.title}</p>
              <Button variant="link" size="sm" className="h-auto justify-start p-0 text-xs">View</Button>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
