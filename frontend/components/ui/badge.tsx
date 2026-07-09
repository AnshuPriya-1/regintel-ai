import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary-tint text-primary border-transparent",
        success: "bg-success-tint text-success border-transparent",
        warning: "bg-warning-tint text-warning border-transparent",
        danger: "bg-danger-tint text-danger border-transparent",
        accent: "bg-accent-tint text-accent border-transparent",
        outline: "bg-transparent text-foreground-muted border-border",
        muted: "bg-surface-muted text-foreground-muted border-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </div>
  );
}

export function riskVariant(risk: string): BadgeProps["variant"] {
  if (risk === "High" || risk === "Critical" || risk === "Overdue") return "danger";
  if (risk === "Medium") return "warning";
  return "success";
}

export function statusVariant(status: string): BadgeProps["variant"] {
  if (["Processed", "Compliant", "Completed", "Verified"].includes(status)) return "success";
  if (["Processing", "In Progress", "Pending Review", "Review"].includes(status)) return "accent";
  if (["Queued", "To Do", "Pending"].includes(status)) return "muted";
  if (["Failed", "Overdue"].includes(status)) return "danger";
  return "default";
}

export { Badge, badgeVariants };
