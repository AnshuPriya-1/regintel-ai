"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { FileBarChart, Download, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reports } from "@/lib/mock-data";

export default function ReportsPage() {
  const [generating, setGenerating] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<Set<string>>(new Set());

  function generate(id: string) {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setDone((d) => new Set(d).add(id));
    }, 1600);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Reports</h1>
          <p className="mt-1 text-sm text-foreground-muted">Board-ready reports, generated on demand from your live compliance data.</p>
        </div>
        <Button><Sparkles className="h-4 w-4" /> Generate AI Summary</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="flex h-full flex-col p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-tint text-primary"><FileBarChart className="h-5 w-5" /></div>
              <p className="mt-3 font-display text-[15px] font-semibold text-foreground">{r.name}</p>
              <p className="mt-1 flex-1 text-[13px] text-foreground-muted">{r.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.formats.map((f) => (
                  <Button key={f} variant="outline" size="sm" onClick={() => generate(`${r.id}-${f}`)} disabled={generating === `${r.id}-${f}`}>
                    {generating === `${r.id}-${f}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : done.has(`${r.id}-${f}`) ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Download className="h-3.5 w-3.5" />}
                    {done.has(`${r.id}-${f}`) ? "Downloaded" : `Download ${f}`}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
