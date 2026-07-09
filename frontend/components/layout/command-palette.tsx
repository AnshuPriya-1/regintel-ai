"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, ArrowRight } from "lucide-react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const router = useRouter();

  const results = navItems.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!open) { setQuery(""); setActiveIndex(0); }
  }, [open]);

  function go(href: string) {
    router.push(href);
    onOpenChange(false);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] animate-in fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-24 z-50 w-[90vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-elevated)] animate-in fade-in-0 zoom-in-95"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
            if (e.key === "Enter" && results[activeIndex]) go(results[activeIndex].href);
          }}
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
            <Search className="h-4 w-4 text-foreground-subtle" />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
              placeholder="Search pages, obligations, documents..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-subtle"
            />
            <kbd className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground-muted">ESC</kbd>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-subtle">Pages</p>
            {results.length === 0 && <p className="px-2.5 py-4 text-sm text-foreground-muted">No results found.</p>}
            {results.map((item, idx) => (
              <button
                key={item.href}
                onClick={() => go(item.href)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors",
                  idx === activeIndex ? "bg-primary-tint text-primary" : "text-foreground hover:bg-surface-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-50" />
              </button>
            ))}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
