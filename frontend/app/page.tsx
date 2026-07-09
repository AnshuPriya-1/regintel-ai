"use client";
import * as React from "react";
import { Upload, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ComplianceTrendChart } from "@/components/dashboard/compliance-trend-chart";
import { DonutCard } from "@/components/dashboard/donut-card";
import { RecentDocumentsPanel, UpcomingTasksPanel, RecentActivityPanel } from "@/components/dashboard/panels";
import { AIInsightsStrip } from "@/components/dashboard/ai-insights-strip";
import { AIAssistantCard } from "@/components/shared/ai-assistant-card";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { kpis, obligationsByDept, riskDistribution, currentUser } from "@/lib/mock-data";

export default function DashboardPage() {
  // Simulates the initial data fetch. Replace this with your real loading
  // state once the dashboard reads from an API instead of mock-data.ts.
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardSkeleton />;

  // Real empty-state condition: a brand new workspace with zero obligations.
  // Mock data always has 128, so this won't trigger today — but the check is
  // real, not decorative. Set kpis[1].value to 0 in lib/mock-data.ts to see it.
  const totalObligations = kpis.find((k) => k.label === "Total Obligations")?.value ?? 0;
  const hasData = totalObligations > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome back, {currentUser.name.split(" ")[0]}! 👋</h1>
          <p className="mt-1 text-sm text-foreground-muted">Here&apos;s your compliance overview for today.</p>
        </div>
        <Button size="lg"><Upload className="h-4 w-4" /> Upload Circular</Button>
      </div>

      {!hasData ? (
        <EmptyState
          icon={FileWarning}
          title="No compliance data yet"
          description="Upload your first SEBI circular and RegIntel-AI will extract obligations, risks and department tasks automatically."
          actionLabel="Upload Circular"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {kpis.slice(0, 5).map((kpi, i) => (
              <KpiCard key={kpi.id} kpi={kpi} index={i} />
            ))}
          </div>

          <AIInsightsStrip />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ComplianceTrendChart />
            <DonutCard title="Obligations by Department" data={obligationsByDept} total={128} />
            <DonutCard title="Risk Distribution" data={riskDistribution} total={128} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <RecentDocumentsPanel />
            <UpcomingTasksPanel />
            <RecentActivityPanel />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <AIAssistantCard className="xl:col-span-1" />
          </div>
        </>
      )}
    </div>
  );
}