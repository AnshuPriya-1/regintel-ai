export interface Kpi {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  trend: number;
  trendLabel: string;
  type: "ring" | "sparkline" | "static";
}

export interface ComplianceTrendPoint {
  month: string;
  score: number;
  risk: number;
}

export interface RiskDistributionSlice {
  name: string;
  value: number;
  color: string;
}

export interface AiInsight {
  id: string;
  type: "detection" | "alert" | "gap" | "trend" | "risk" | "recommendation";
  title: string;
  detail: string;
  severity: "High" | "Medium" | "Low";
}

export interface DashboardData {
  kpis: Kpi[];
  complianceTrend: ComplianceTrendPoint[];
  riskDistribution: RiskDistributionSlice[];
  aiInsights: AiInsight[];
}
