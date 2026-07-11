"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock-data";
import { Markdown } from "@/components/assistant/markdown";
import { ResponseMeta } from "@/components/assistant/response-meta";
import type { ChatMessage } from "@/types/chat";

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function ChatMessageBubble({
  message,
  onRegenerate,
  isLast,
}: {
  message: ChatMessage;
  onRegenerate?: () => void;
  isLast?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<"up" | "down" | null>(null);
  const isUser = message.role === "user";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
          <ShieldCheck className="h-4 w-4" />
        </div>
      )}

      <div className={cn("min-w-0 max-w-[85%] sm:max-w-[75%]", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-[13.5px] shadow-sm",
            isUser ? "bg-primary text-primary-foreground" : "border border-border bg-surface"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <>
              <Markdown content={message.content} />
              <ResponseMeta
                sources={message.sources}
                confidence={message.confidence}
                risk={message.risk}
                departments={message.departments}
                clauses={message.clauses}
              />
            </>
          )}
        </div>

        <div className={cn("mt-1.5 flex items-center gap-1 text-[11px] text-foreground-subtle", isUser && "flex-row-reverse")}>
          <span>{formatTime(message.createdAt)}</span>
          {!isUser && (
            <>
              <span className="mx-1">·</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy} title="Copy response">
                {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
              </Button>
              {isLast && onRegenerate && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRegenerate} title="Regenerate response">
                  <RotateCcw className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-6 w-6", feedback === "up" && "text-success")}
                onClick={() => setFeedback((f) => (f === "up" ? null : "up"))}
                title="Good response"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-6 w-6", feedback === "down" && "text-danger")}
                onClick={() => setFeedback((f) => (f === "down" ? null : "down"))}
                title="Poor response"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback>{currentUser.initials}</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex w-full justify-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
        <ShieldCheck className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-surface px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-foreground-subtle"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
