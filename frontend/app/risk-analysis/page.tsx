import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskHeatmap } from "@/components/risk/risk-heatmap";
import { DonutCard } from "@/components/dashboard/donut-card";
import { ComplianceTrendChart } from "@/components/dashboard/compliance-trend-chart";
import { riskDistribution, departments } from "@/lib/mock-data";

const criticalAlerts = [
  { id: 1, title: "IT Security cybersecurity gap", detail: "Incident reporting SLA not yet automated ahead of the new 6-hour deadline.", dept: "IT Security" },
  { id: 2, title: "Client Servicing grievance backlog", detail: "4 grievances are past the 21-day redressal window.", dept: "Client Servicing" },
  { id: 3, title: "Risk Management overdue review", detail: "Quarterly risk policy review is 6 days overdue.", dept: "Risk Management" },
];

export default function RiskAnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Risk Analysis</h1>
        <p className="mt-1 text-sm text-foreground-muted">A consolidated view of exposure across every department.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RiskHeatmap />
        <DonutCard title="Risk Distribution" data={riskDistribution} />
      </div>

      <ComplianceTrendChart />

      <Card>
        <CardHeader><CardTitle>Critical Alerts</CardTitle></CardHeader>
        <div className="space-y-3 px-5 pb-5">
          {criticalAlerts.map((a) => (
            <div key={a.id} className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger-tint p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger text-white"><AlertTriangle className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-foreground">{a.title}</p>
                <p className="mt-0.5 text-[12.5px] text-foreground-muted">{a.detail}</p>
              </div>
              <Badge variant="danger" className="shrink-0">{a.dept}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Risk by Department</CardTitle></CardHeader>
        <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((d) => (
            <div key={d.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <ShieldAlert className="h-4 w-4 text-foreground-muted" />
                <Badge variant={d.risk === "High" ? "danger" : d.risk === "Medium" ? "warning" : "success"}>{d.risk}</Badge>
              </div>
              <p className="mt-2 text-[13px] font-medium text-foreground">{d.name}</p>
              <p className="text-[11.5px] text-foreground-muted">{d.pending} pending · {d.obligations} obligations</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
