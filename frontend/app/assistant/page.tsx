"use client";
import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { PanelLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { ChatSidebar } from "@/components/assistant/chat-sidebar";
import { SuggestedPrompts } from "@/components/assistant/suggested-prompts";
import { ChatMessageBubble, TypingIndicator } from "@/components/assistant/chat-message";
import { ChatInput } from "@/components/assistant/chat-input";
import { askAssistant, deleteChat, getChatDetail, getChatHistory } from "@/services/chat";
import { ApiError } from "@/services/api";
import type { ChatMessage, ChatSessionSummary } from "@/types/chat";

export default function AssistantPage() {
  const [sessions, setSessions] = React.useState<ChatSessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [sending, setSending] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const loadSessions = React.useCallback(async () => {
    try {
      const data = await getChatHistory();
      setSessions(data);
    } catch (err) {
      // Backend may not be reachable yet (e.g. no documents uploaded) — fail quietly,
      // the welcome screen still works for starting a brand new conversation.
      console.warn("Could not load chat history:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSessions();
  }, [loadSessions]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function handleSelectChat(chatId: string) {
    setMobileSidebarOpen(false);
    setActiveChatId(chatId);
    try {
      const detail = await getChatDetail(chatId);
      setMessages(detail.messages);
    } catch (err) {
      toast({ variant: "error", title: "Couldn't load conversation", description: err instanceof ApiError ? err.message : "The backend may be unreachable." });
    }
  }

  function handleNewChat() {
    setActiveChatId(null);
    setMessages([]);
    setMobileSidebarOpen(false);
  }

  async function handleDeleteChat(chatId: string) {
    try {
      await deleteChat(chatId);
      setSessions((prev) => prev.filter((s) => s.chatId !== chatId));
      if (chatId === activeChatId) {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (err) {
      toast({ variant: "error", title: "Couldn't delete conversation", description: err instanceof ApiError ? err.message : "The backend may be unreachable." });
    }
  }

  async function sendQuestion(question: string) {
    const optimisticUserMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
      sources: [],
      confidence: null,
      risk: null,
      departments: [],
      clauses: [],
    };
    setMessages((prev) => [...prev, optimisticUserMessage]);
    setSending(true);

    try {
      const result = await askAssistant(question, activeChatId);
      setActiveChatId(result.chatId);
      setMessages((prev) => [
        ...prev,
        {
          id: result.messageId,
          role: "assistant",
          content: result.answer,
          createdAt: result.createdAt,
          sources: result.sources,
          confidence: result.confidence,
          risk: result.risk,
          departments: result.departments,
          clauses: result.clauses,
        },
      ]);
      loadSessions();
    } catch (err) {
      toast({
        variant: "error",
        title: "The assistant couldn't respond",
        description: err instanceof ApiError ? err.message : "Check that the backend is running and try again.",
      });
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMessage.id));
    } finally {
      setSending(false);
    }
  }

  function handleRegenerate() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser || sending) return;
    setMessages((prev) => {
      const idx = prev.map((m) => m.role).lastIndexOf("assistant");
      return idx === -1 ? prev : prev.slice(0, idx);
    });
    sendQuestion(lastUser.content);
  }

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  const sidebarProps = {
    sessions,
    activeChatId,
    loading: sessionsLoading,
    onNewChat: handleNewChat,
    onSelectChat: handleSelectChat,
    onDeleteChat: handleDeleteChat,
  };

  return (
    <div className="flex h-[calc(100dvh-6.5rem)] gap-4 sm:h-[calc(100dvh-8rem)] lg:h-[calc(100dvh-7.5rem)]">
      {/* LEFT PANEL — 25% on desktop, drawer on mobile/tablet */}
      <aside className="hidden w-[25%] min-w-[260px] max-w-[320px] shrink-0 rounded-2xl border border-border bg-surface lg:block">
        <ChatSidebar {...sidebarProps} />
      </aside>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <ChatSidebar {...sidebarProps} />
        </SheetContent>
      </Sheet>

      {/* RIGHT PANEL — 75% on desktop, full width on mobile */}
      <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 lg:hidden">
          <Button variant="outline" size="sm" onClick={() => setMobileSidebarOpen(true)}>
            <PanelLeft className="h-4 w-4" /> Chats
          </Button>
          <p className="font-display text-sm font-semibold text-foreground">AI Assistant</p>
          <div className="w-[72px]" />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-tint text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h1 className="font-display text-xl font-bold text-foreground">AI Compliance Assistant</h1>
                <p className="max-w-md text-sm text-foreground-muted">
                  Ask anything about your uploaded SEBI compliance documents.
                </p>
              </div>
              <SuggestedPrompts onSelect={sendQuestion} />
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <ChatMessageBubble
                    key={message.id}
                    message={message}
                    isLast={message.id === lastAssistantId}
                    onRegenerate={handleRegenerate}
                  />
                ))}
              </AnimatePresence>
              {sending && <TypingIndicator />}
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput disabled={sending} onSend={sendQuestion} />
            <p className="mt-2 text-center text-[11px] text-foreground-subtle">
              Answers are grounded strictly in your uploaded SEBI circulars and may be incomplete or wrong — verify before acting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
