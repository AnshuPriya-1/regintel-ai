"use client";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { Badge, statusVariant } from "@/components/ui/badge";
import { complianceTimeline } from "@/lib/mock-data";

export default function ComplianceTimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Compliance Timeline</h1>
        <p className="mt-1 text-sm text-foreground-muted">Every regulation RegIntel-AI has ingested, in chronological order.</p>
      </div>

      <div className="relative mx-auto max-w-2xl">
        <div className="absolute left-5 top-2 bottom-2 w-px bg-border sm:left-1/2" />
        <div className="space-y-8">
          {complianceTimeline.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex gap-4 sm:justify-center"
            >
              <div className="absolute left-5 top-1.5 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-surface sm:left-1/2" />
              <div className="ml-10 w-full rounded-2xl border border-border bg-surface p-4 sm:ml-0 sm:w-[calc(50%-2rem)] sm:odd:mr-auto sm:even:ml-auto">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary"><FileText className="h-4 w-4" /></div>
                  <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                </div>
                <p className="mt-2 font-display text-sm font-semibold text-foreground">{t.title}</p>
                <p className="mt-1 text-xs text-foreground-muted">{t.date} · {t.obligations} obligations · {t.departments} departments</p>
              </div>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="relative flex justify-center">
            <div className="ml-10 flex items-center gap-2 rounded-full border border-dashed border-primary/40 bg-primary-tint px-4 py-2 text-xs font-medium text-primary sm:ml-0">
              <Sparkles className="h-3.5 w-3.5" /> Future updates will appear here automatically
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
