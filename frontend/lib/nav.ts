import {
  LayoutDashboard, FileText, ShieldCheck, Sparkles, GitCompareArrows, ListChecks,
  Building2, AlertTriangle, History, FileBarChart, LineChart, CalendarClock, Bell, Settings,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Compliance Obligations", href: "/compliance-obligations", icon: ShieldCheck },
  { label: "AI Insights", href: "/ai-insights", icon: Sparkles },
  { label: "Change Detection", href: "/change-detection", icon: GitCompareArrows },
  { label: "Workflow Tasks", href: "/workflow-tasks", icon: ListChecks },
  { label: "Department Impact", href: "/department-impact", icon: Building2 },
  { label: "Risk Analysis", href: "/risk-analysis", icon: AlertTriangle },
  { label: "Audit Trail", href: "/audit-trail", icon: History },
  { label: "Reports", href: "/reports", icon: FileBarChart },
  { label: "Analytics", href: "/analytics", icon: LineChart },
  { label: "Compliance Timeline", href: "/compliance-timeline", icon: CalendarClock },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];
