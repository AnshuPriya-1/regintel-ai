"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MessageSquareText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, timeAgo } from "@/lib/utils";
import type { ChatSessionSummary } from "@/types/chat";

export function ChatSidebar({
  sessions,
  activeChatId,
  loading,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: {
  sessions: ChatSessionSummary[];
  activeChatId: string | null;
  loading: boolean;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}) {
  const [search, setSearch] = React.useState("");

  const filtered = sessions.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <Button className="w-full" onClick={onNewChat}>
          <Plus className="h-4 w-4" /> New Chat
        </Button>
      </div>

      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-subtle" />
          <Input
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8 text-[13px]"
          />
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2 no-scrollbar">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
            <MessageSquareText className="h-8 w-8 text-foreground-subtle" />
            <p className="text-[13px] font-medium text-foreground">No conversations yet</p>
            <p className="text-[12px] text-foreground-muted">Start a new chat to ask about your SEBI documents.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((session) => {
              const active = session.chatId === activeChatId;
              return (
                <motion.div
                  key={session.chatId}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "group relative flex cursor-pointer flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors",
                    active ? "bg-primary-tint" : "hover:bg-surface-muted"
                  )}
                  onClick={() => onSelectChat(session.chatId)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("truncate text-[13px] font-medium", active ? "text-primary" : "text-foreground")}>
                      {session.title}
                    </p>
                    <button
                      className="shrink-0 rounded-md p-1 text-foreground-subtle opacity-0 transition-opacity hover:bg-danger-tint hover:text-danger group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(session.chatId);
                      }}
                      title="Delete conversation"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted">
                    <span>{timeAgo(session.updatedAt)}</span>
                    <span>·</span>
                    <span>{session.messageCount} message{session.messageCount === 1 ? "" : "s"}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
