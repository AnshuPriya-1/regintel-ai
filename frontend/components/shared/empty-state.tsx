import * as React from "react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "No compliance data yet",
  description = "Upload your first SEBI circular and RegIntel-AI will extract obligations automatically.",
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}: {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-foreground-subtle">
        <Icon className="h-7 w-7" />
      </div>
      <p className="font-display text-base font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-foreground-muted">{description}</p>
      {actionLabel && (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}