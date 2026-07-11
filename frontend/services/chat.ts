import { apiFetch } from "./api";
import type { ChatMessage, ChatSessionSummary } from "@/types/chat";

interface RawChatSource {
  document: string;
  page: number | null;
  clause: string | null;
  excerpt: string;
}

interface RawChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  sources: RawChatSource[];
  confidence: number | null;
  risk: ChatMessage["risk"];
  departments: string[];
  clauses: string[];
}

interface RawChatResponse {
  chat_id: string;
  message_id: string;
  answer: string;
  sources: RawChatSource[];
  confidence: number;
  risk: NonNullable<ChatMessage["risk"]>;
  departments: string[];
  clauses: string[];
  created_at: string;
}

interface RawChatSessionSummary {
  chat_id: string;
  title: string;
  updated_at: string;
  message_count: number;
}

interface RawChatHistoryResponse {
  chats: RawChatSessionSummary[];
}

interface RawChatDetailResponse {
  chat_id: string;
  title: string;
  messages: RawChatMessage[];
}

function toSession(raw: RawChatSessionSummary): ChatSessionSummary {
  return {
    chatId: raw.chat_id,
    title: raw.title,
    updatedAt: raw.updated_at,
    messageCount: raw.message_count,
  };
}

function toMessage(raw: RawChatMessage): ChatMessage {
  return {
    id: raw.id,
    role: raw.role,
    content: raw.content,
    createdAt: raw.created_at,
    sources: raw.sources,
    confidence: raw.confidence,
    risk: raw.risk,
    departments: raw.departments,
    clauses: raw.clauses,
  };
}

export async function getChatHistory(): Promise<ChatSessionSummary[]> {
  const raw = await apiFetch<RawChatHistoryResponse>("/chat/history");
  return raw.chats.map(toSession);
}

export async function getChatDetail(chatId: string): Promise<{ chatId: string; title: string; messages: ChatMessage[] }> {
  const raw = await apiFetch<RawChatDetailResponse>(`/chat/${chatId}`);
  return {
    chatId: raw.chat_id,
    title: raw.title,
    messages: raw.messages.map(toMessage),
  };
}

export async function deleteChat(chatId: string): Promise<void> {
  await apiFetch(`/chat/${chatId}`, { method: "DELETE" });
}

export async function askAssistant(
  question: string,
  chatId: string | null
): Promise<{
  chatId: string;
  messageId: string;
  answer: string;
  sources: ChatMessage["sources"];
  confidence: number;
  risk: NonNullable<ChatMessage["risk"]>;
  departments: string[];
  clauses: string[];
  createdAt: string;
}> {
  const raw = await apiFetch<RawChatResponse>("/chat", {
    method: "POST",
    body: { question, chat_id: chatId },
  });

  return {
    chatId: raw.chat_id,
    messageId: raw.message_id,
    answer: raw.answer,
    sources: raw.sources,
    confidence: raw.confidence,
    risk: raw.risk,
    departments: raw.departments,
    clauses: raw.clauses,
    createdAt: raw.created_at,
  };
}