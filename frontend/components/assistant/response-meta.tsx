import * as React from "react";
import { FileText, Gauge, Building2, BookMarked } from "lucide-react";
import { Badge, riskVariant } from "@/components/ui/badge";
import type { ChatSource, ChatRisk } from "@/types/chat";

function ConfidenceBadge({ confidence }: { confidence: number | null }) {
  if (confidence === null) return null;
  const variant = confidence >= 80 ? "success" : confidence >= 50 ? "warning" : "danger";
  return (
    <Badge variant={variant}>
      <Gauge className="h-3 w-3" /> {confidence}% confidence
    </Badge>
  );
}

export function ResponseMeta({
  sources,
  confidence,
  risk,
  departments,
  clauses,
}: {
  sources: ChatSource[];
  confidence: number | null;
  risk: ChatRisk | null;
  departments: string[];
  clauses: string[];
}) {
  const hasMeta = sources.length > 0 || confidence !== null || (risk && risk !== "Not Applicable") || departments.length > 0 || clauses.length > 0;
  if (!hasMeta) return null;

  return (
    <div className="mt-3 space-y-2.5 border-t border-border-soft pt-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <ConfidenceBadge confidence={confidence} />
        {risk && risk !== "Not Applicable" && <Badge variant={riskVariant(risk)}>{risk} risk</Badge>}
        {departments.map((d) => (
          <Badge key={d} variant="outline">
            <Building2 className="h-3 w-3" /> {d}
          </Badge>
        ))}
        {clauses.map((c) => (
          <Badge key={c} variant="muted">
            <BookMarked className="h-3 w-3" /> Clause {c}
          </Badge>
        ))}
      </div>

      {sources.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-subtle">Sources</p>
          <div className="space-y-1.5">
            {sources.map((s, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-surface-muted px-2.5 py-2 text-[12px]">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground-subtle" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {s.document}
                    {s.page ? ` · Page ${s.page}` : ""}
                    {s.clause ? ` · Clause ${s.clause}` : ""}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-foreground-muted">{s.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
