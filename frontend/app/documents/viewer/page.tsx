"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Maximize2,
  Sparkles, Building2, ShieldAlert, FileCheck2, Calendar, Repeat, Lightbulb, Link2, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, riskVariant } from "@/components/ui/badge";
import { clauses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function DocumentViewerPage() {
  const [selected, setSelected] = React.useState(clauses[1]);
  const [page, setPage] = React.useState(23);
  const [zoom, setZoom] = React.useState(125);

  return (
    <div className="flex h-[calc(100dvh-8.5rem)] flex-col gap-4 lg:h-[calc(100dvh-7.5rem)]">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Interactive Document Viewer</h1>
        <p className="mt-1 text-sm text-foreground-muted">Master Circular — Investment Advisers. Select any clause to see the AI&apos;s analysis.</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
        {/* Document pane */}
        <div className="flex min-h-0 flex-col rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-1 rounded-lg bg-surface-muted px-2 py-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded p-1 hover:bg-border-soft"><ChevronLeft className="h-3.5 w-3.5" /></button>
              <span className="px-1 text-xs tabular-nums text-foreground-muted">Page {page} / 120</span>
              <button onClick={() => setPage((p) => Math.min(120, p + 1))} className="rounded p-1 hover:bg-border-soft"><ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button onClick={() => setZoom((z) => Math.max(75, z - 25))} className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-muted"><ZoomOut className="h-4 w-4" /></button>
              <span className="w-10 text-center text-xs tabular-nums text-foreground-muted">{zoom}%</span>
              <button onClick={() => setZoom((z) => Math.min(200, z + 25))} className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-muted"><ZoomIn className="h-4 w-4" /></button>
              <button className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-muted"><RotateCw className="h-4 w-4" /></button>
              <button className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-muted"><Download className="h-4 w-4" /></button>
              <button className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-muted"><Maximize2 className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-surface-muted p-6">
            <div
              style={{ fontSize: `${zoom / 100}rem` }}
              className="mx-auto max-w-2xl rounded-sm bg-surface p-10 shadow-[var(--shadow-card)] transition-[font-size]"
            >
              <p className="text-center text-xs font-semibold uppercase tracking-widest text-foreground-subtle">Master Circular</p>
              <h2 className="mt-2 text-center font-display text-lg font-bold text-foreground">Investment Advisers</h2>
              <p className="mt-1 text-center text-[11px] text-foreground-subtle">SEBI/HO/IMD/DF3/CIR/P/2024/45</p>

              <div className="mt-8 space-y-5 text-[13px] leading-[1.9] text-foreground/90">
                {clauses.map((c) => (
                  <p
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={cn(
                      "cursor-pointer rounded-md px-1.5 py-0.5 transition-colors",
                      selected.id === c.id ? "bg-warning/25 ring-1 ring-warning/50" : "hover:bg-primary-tint"
                    )}
                  >
                    <span className="font-semibold">{c.clause}</span> {c.text}
                  </p>
                ))}
                <p className="text-foreground-subtle">
                  Regulatory obligations set out herein shall be read in conjunction with the SEBI (Investment Advisers) Regulations, 2013, as amended from time to time, and are binding on all registered intermediaries with effect from the date of this circular.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis pane */}
        <div className="flex min-h-0 flex-col rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint text-primary"><Sparkles className="h-4 w-4" /></div>
            <p className="font-display text-sm font-semibold text-foreground">AI Extracted Obligation</p>
            <Badge variant={riskVariant(selected.risk)} className="ml-auto">{selected.risk} Risk</Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-subtle">Clause {selected.clause}</p>
                  <p className="mt-1 text-sm font-medium leading-snug text-foreground">{selected.title}</p>
                </div>

                <InfoRow icon={FileCheck2} label="Obligation" value={selected.obligation} />
                <InfoRow icon={Building2} label="Department" value={selected.department} />
                <InfoRow icon={Link2} label="Evidence Required" value={selected.evidence} />
                <InfoRow icon={Calendar} label="Deadline" value={selected.deadline} />
                <InfoRow icon={Repeat} label="Frequency" value={selected.frequency} />

                <div className="rounded-xl bg-accent-tint p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-accent"><Lightbulb className="h-3.5 w-3.5" /> RECOMMENDED ACTION</div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">{selected.action}</p>
                </div>

                <p className="text-[11px] text-foreground-subtle">Reference: Clause {selected.clause}, Master Circular</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-border p-4">
            <Button className="w-full"><Plus className="h-4 w-4" /> Add to Obligations</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-muted text-foreground-muted">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-foreground-subtle">{label}</p>
        <p className="text-[13px] leading-snug text-foreground">{value}</p>
      </div>
    </div>
  );
}
