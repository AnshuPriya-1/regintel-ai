import * as React from "react";
import { motion } from "framer-motion";
import {
  FileStack, ListChecks, BookMarked, ShieldAlert, CalendarClock, GitCompareArrows, ClipboardCheck,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  { label: "Summarize latest SEBI circular", icon: FileStack },
  { label: "List Finance obligations", icon: ListChecks },
  { label: "Explain Clause 4.2", icon: BookMarked },
  { label: "Show high-risk obligations", icon: ShieldAlert },
  { label: "Upcoming compliance deadlines", icon: CalendarClock },
  { label: "Compare latest circular with previous", icon: GitCompareArrows },
  { label: "Generate compliance checklist", icon: ClipboardCheck },
];

export function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SUGGESTED_PROMPTS.map((p, i) => (
        <motion.button
          key={p.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          onClick={() => onSelect(p.label)}
          className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-[12.5px] font-medium text-foreground-muted transition-colors hover:border-primary/30 hover:bg-primary-tint hover:text-primary"
        >
          <p.icon className="h-3.5 w-3.5" />
          {p.label}
        </motion.button>
      ))}
    </div>
  );
}
