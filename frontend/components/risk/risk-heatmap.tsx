"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const matrix = [
  [2, 6, 10],
  [3, 5, 5],
  [1, 2, 4],
];
const impactLabels = ["Low", "Medium", "High"];

function cellColor(value: number) {
  if (value >= 8) return "bg-danger text-white";
  if (value >= 5) return "bg-warning text-white";
  if (value >= 3) return "bg-warning/40 text-foreground";
  return "bg-success/30 text-foreground";
}

export function RiskHeatmap() {
  return (
    <Card>
      <CardHeader><CardTitle>Risk Heatmap</CardTitle></CardHeader>
      <div className="flex gap-3 px-5 pb-5">
        <div className="flex flex-col justify-between py-2 text-[11px] font-medium text-foreground-muted">
          {["High", "Medium", "Low"].map((l) => <span key={l} className="flex h-16 items-center">{l}</span>)}
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-2">
            {matrix.map((row, rIdx) =>
              row.map((val, cIdx) => (
                <motion.div
                  key={`${rIdx}-${cIdx}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (rIdx * 3 + cIdx) * 0.03 }}
                  className={cn("flex h-16 items-center justify-center rounded-lg text-lg font-bold", cellColor(val))}
                >
                  {val}
                </motion.div>
              ))
            )}
          </div>
          <div className="mt-2 flex justify-between text-[11px] font-medium text-foreground-muted">
            {impactLabels.map((l) => <span key={l}>{l}</span>)}
          </div>
          <p className="mt-1 text-center text-[11px] text-foreground-subtle">Likelihood (rows) vs Impact (columns)</p>
        </div>
      </div>
    </Card>
  );
}
