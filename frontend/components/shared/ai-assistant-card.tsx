"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Msg = { role: "assistant" | "user"; text: string };

const quickPrompts = ["Explain clause 4.2.1", "Show high risk obligations", "Generate compliance report", "Compare with previous circular"];

const canned: Record<string, string> = {
  "explain clause 4.2.1": "Clause 4.2.1 requires Investment Advisers to conduct an annual Vulnerability Assessment and Penetration Test through a CERT-In empanelled agency, and to retain the certification as audit evidence.",
  "show high risk obligations": "You currently have 5 high risk obligations. 3 sit with IT Security, 2 with Client Servicing. The oldest has been open for 34 days.",
  "generate compliance report": "Compliance report drafted. It covers all 8 departments and includes your 92% overall score, 17 pending tasks and the audit evidence log for this quarter.",
  "compare with previous circular": "Comparing against the May 2024 circular: 1 clause added, 1 modified, 1 removed. The added clause tightens the VAPT vendor empanelment requirement.",
};

export function AIAssistantCard({ className }: { className?: string }) {
  const [messages, setMessages] = React.useState<Msg[]>([
    { role: "assistant", text: "Hello Aarohi! 👋 How can I help you today?" },
  ]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = canned[text.trim().toLowerCase()] ?? "Based on your current compliance data, I'd recommend reviewing the flagged obligations first, then generating an updated risk summary for the department owner.";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
      setTyping(false);
    }, 900);
  }

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  return (
    <Card className={cn("flex flex-col overflow-hidden", className)}>
      <div className="flex items-center gap-2.5 border-b border-border bg-gradient-to-r from-primary to-[#16296b] px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <p className="font-display text-sm font-semibold text-white">AI Assistant</p>
        <Badge className="bg-white/15 text-white border-0">BETA</Badge>
      </div>

      <div ref={scrollRef} className="flex max-h-72 min-h-[180px] flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
              m.role === "assistant" ? "self-start bg-surface-muted text-foreground" : "self-end bg-primary text-white")}
          >
            {m.text}
          </motion.div>
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1 self-start rounded-2xl bg-surface-muted px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-foreground-subtle"
                  animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-border-soft px-5 py-3">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-[11.5px] font-medium text-foreground-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 rounded-full border border-border bg-surface-muted px-4 py-2 text-sm outline-none placeholder:text-foreground-subtle focus:border-primary/40"
        />
        <button type="submit" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform active:scale-95">
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </Card>
  );
}
