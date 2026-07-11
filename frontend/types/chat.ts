export type ChatRisk = "High" | "Medium" | "Low" | "Not Applicable";

export interface ChatSource {
  document: string;
  page: number | null;
  clause: string | null;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  sources: ChatSource[];
  confidence: number | null;
  risk: ChatRisk | null;
  departments: string[];
  clauses: string[];
}

export interface ChatSessionSummary {
  chatId: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}