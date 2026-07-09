"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronsLeft, Plus, GitCompare, FileBarChart, ListPlus, Sparkles, ShieldCheck } from "lucide-react";
import { navItems } from "@/lib/nav";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const quickActions = [
  { label: "Upload Circular", icon: Plus },
  { label: "Compare Documents", icon: GitCompare },
  { label: "Generate Report", icon: FileBarChart },
  { label: "Create Task", icon: ListPlus },
  { label: "AI Assistant", icon: Sparkles },
];

export function SidebarContent({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-2.5 px-5 py-5", collapsed && "justify-center px-0")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display truncate text-[15px] font-bold leading-tight text-foreground">Regintel-AI</p>
            <p className="truncate text-[11px] leading-tight text-foreground-muted">AI Powered Regulatory Intelligence</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 no-scrollbar">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                active ? "text-primary" : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-[10px] bg-primary-tint"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {active && !collapsed && (
                <span className="absolute left-0 top-1/2 h-4 -translate-y-1/2 w-[3px] rounded-r-full bg-primary" />
              )}
              <item.icon className="relative z-10 h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-3 pb-2 pt-3">
          <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-subtle">Quick Actions</p>
          <div className="space-y-0.5">
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                className="flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[13px] font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <qa.icon className="h-4 w-4" />
                {qa.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={cn("border-t border-border p-3", collapsed && "flex justify-center")}>
        {collapsed ? (
          <Avatar className="h-9 w-9">
            <AvatarFallback>{currentUser.initials}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="rounded-xl bg-secondary p-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9 ring-2 ring-white/10">
                <AvatarFallback className="bg-accent">{currentUser.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-white">{currentUser.name}</p>
                <p className="truncate text-[11px] text-slate-400">{currentUser.role}</p>
              </div>
            </div>
            <Button size="sm" variant="secondary" className="mt-3 w-full bg-white/10 text-white border-0 hover:bg-white/15">
              View Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 264 }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      className="relative hidden shrink-0 border-r border-border bg-surface lg:block"
    >
      <SidebarContent collapsed={collapsed} />
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-foreground-muted shadow-sm transition-transform hover:text-foreground"
        aria-label="Collapse sidebar"
      >
        <ChevronsLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
      </button>
    </motion.aside>
  );
}
