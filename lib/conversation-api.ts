import type { UIMessage } from "ai";

export const conversationQueryKeys = {
  all: ["conversations"] as const,
  byThread: (threadId: string) =>
    [...conversationQueryKeys.all, threadId] as const,
};

export type ConversationSummary = {
  threadId: string;
  title: string;
  model: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConversationRecord = {
  threadId: string;
  userId: string;
  title: string;
  model: string | null;
  messages: UIMessage[];
  createdAt: string;
  updatedAt: string;
};

type ConversationsResponse = {
  conversations: ConversationSummary[];
};

type ConversationResponse = {
  conversation: ConversationRecord;
};

export const fetchConversations = async (): Promise<ConversationSummary[]> => {
  const response = await fetch("/api/conversations", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  const payload = (await response.json()) as ConversationsResponse;
  return payload.conversations;
};

export const fetchConversationByThreadId = async (
  threadId: string,
): Promise<ConversationRecord> => {
  const response = await fetch(`/api/conversations/${threadId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch conversation");
  }

  const payload = (await response.json()) as ConversationResponse;
  return payload.conversation;
};
