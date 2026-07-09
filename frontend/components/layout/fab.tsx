"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, Upload, ListPlus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AIAssistantCard } from "@/components/shared/ai-assistant-card";

export function Fab() {
  const [open, setOpen] = React.useState(false);
  const [assistantOpen, setAssistantOpen] = React.useState(false);
  const router = useRouter();

  const actions = [
    {
      label: "Upload Circular",
      icon: Upload,
      onSelect: () => {
        setOpen(false);
        // Documents page reads ?upload=1 and auto-opens the file picker on mount.
        router.push("/documents?upload=1");
      },
    },
    {
      label: "Create Task",
      icon: ListPlus,
      onSelect: () => {
        setOpen(false);
        router.push("/workflow-tasks");
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col items-end gap-2">
            {actions.map((a, i) => (
              <motion.button
                key={a.label}
                onClick={a.onSelect}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5 rounded-full border border-border bg-surface py-2 pl-4 pr-2.5 text-sm font-medium text-foreground shadow-[var(--shadow-elevated)]"
              >
                {a.label}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted">
                  <a.icon className="h-4 w-4" />
                </span>
              </motion.button>
            ))}
            <button
              onClick={() => { setAssistantOpen(true); setOpen(false); }}
              className="flex items-center gap-2.5 rounded-full border border-border bg-surface py-2 pl-4 pr-2.5 text-sm font-medium text-foreground shadow-[var(--shadow-elevated)]"
            >
              AI Assistant
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-tint text-accent">
                <Sparkles className="h-4 w-4" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[var(--shadow-elevated)]"
        aria-label="Quick actions"
      >
        <motion.span animate={{ rotate: open ? 135 : 0 }}>
          <Plus className="h-6 w-6" />
        </motion.span>
      </motion.button>

      <Sheet open={assistantOpen} onOpenChange={setAssistantOpen}>
        <SheetContent className="flex w-full max-w-md flex-col p-0">
          <SheetHeader className="sr-only"><SheetTitle>AI Assistant</SheetTitle></SheetHeader>
          <AIAssistantCard className="h-full flex-1 rounded-none border-0" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
