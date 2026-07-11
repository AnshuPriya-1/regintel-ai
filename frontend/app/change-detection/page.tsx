"use client";

import * as React from "react";
import {
  ArrowDown,
  Plus,
  Pencil,
  Minus,
  GitCompareArrows,
} from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { complianceTimeline } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { getChangeDetection } from "@/services/changes";
import type { ChangeDetection } from "@/types/change";

export default function ChangeDetectionPage() {
  const [changeDetection, setChangeDetection] =
    React.useState<ChangeDetection | null>(null);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadChanges() {
      try {
        const data = await getChangeDetection();
        setChangeDetection(data);
      } catch (err) {
        console.warn("Could not load change detection:", err);
      } finally {
        setLoading(false);
      }
    }

    loadChanges();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading change detection...
      </div>
    );
  }

  if (!changeDetection) {
    return (
      <div className="p-6">
        Unable to load change detection.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Change Detection
          </h1>

          <p className="mt-1 text-sm text-foreground-muted">
            Automatic comparison between regulation versions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="old">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="old">
                {changeDetection.oldTitle}
              </SelectItem>
            </SelectContent>
          </Select>

          <GitCompareArrows className="h-4 w-4 shrink-0 text-foreground-muted" />

          <Select defaultValue="new">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="new">
                {changeDetection.newTitle}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center sm:flex-row sm:justify-center sm:gap-6">
        <Card className="w-full max-w-xs p-4 text-left sm:w-64">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-subtle">
            Old Regulation
          </p>

          <p className="mt-1 font-display text-sm font-semibold text-foreground">
            {changeDetection.oldTitle}
          </p>
        </Card>

        <ArrowDown className="h-5 w-5 shrink-0 rotate-0 text-foreground-subtle sm:-rotate-90" />

        <Card className="w-full max-w-xs border-primary/30 bg-primary-tint p-4 text-left sm:w-64">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            New Regulation
          </p>

          <p className="mt-1 font-display text-sm font-semibold text-foreground">
            {changeDetection.newTitle}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChangeColumn
          icon={Plus}
          label="Added"
          color="success"
          items={changeDetection.added.map(
            (a) => `Clause ${a.clause}: ${a.text}`
          )}
        />

        <ChangeColumn
          icon={Pencil}
          label="Modified"
          color="warning"
          items={changeDetection.modified.map(
            (a) => `Clause ${a.clause}: ${a.old} → ${a.new}`
          )}
        />

        <ChangeColumn
          icon={Minus}
          label="Removed"
          color="danger"
          items={changeDetection.removed.map(
            (a) => `Clause ${a.clause}: ${a.text}`
          )}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regulation Timeline</CardTitle>
        </CardHeader>

        <div className="space-y-0 px-5 pb-5">
          {complianceTimeline.map((t, i) => (
            <div
              key={t.id}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full border-2 border-primary bg-surface" />

                {i < complianceTimeline.length - 1 && (
                  <div className="w-px flex-1 bg-border" />
                )}
              </div>

              <div className="pb-6">
                <p className="text-sm font-medium text-foreground">
                  {t.title}
                </p>

                <p className="text-xs text-foreground-muted">
                  {t.date} · {t.obligations} obligations
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const colorClasses = {
  success: {
    icon: "bg-success-tint text-success",
    box: "border-success/20 bg-success-tint",
  },

  warning: {
    icon: "bg-warning-tint text-warning",
    box: "border-warning/20 bg-warning-tint",
  },

  danger: {
    icon: "bg-danger-tint text-danger",
    box: "border-danger/20 bg-danger-tint",
  },
};

function ChangeColumn({
  icon: Icon,
  label,
  color,
  items,
}: {
  icon: React.ElementType;
  label: string;
  color: "success" | "warning" | "danger";
  items: string[];
}) {
  const c = colorClasses[color];

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            c.icon
          )}
        >
          <Icon className="h-4 w-4" />
        </div>

        <CardTitle>{label}</CardTitle>

        <Badge
          variant={color}
          className="ml-auto"
        >
          {items.length}
        </Badge>
      </CardHeader>

      <div className="space-y-2.5 px-5 pb-5">
        {items.length === 0 && (
          <p className="text-xs text-foreground-subtle">
            Nothing to show.
          </p>
        )}

        {items.map((text, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg border p-3 text-[13px] leading-relaxed",
              c.box
            )}
          >
            {text}
          </div>
        ))}
      </div>
    </Card>
  );
}