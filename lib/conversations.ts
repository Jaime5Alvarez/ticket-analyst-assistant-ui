import { and, desc, eq, sql, type InferSelectModel } from "drizzle-orm";
import type { UIMessage } from "ai";
import { db } from "@/lib/db";
import {
  extractThreadTitle,
  FALLBACK_THREAD_TITLE,
} from "@/lib/conversation-title";
import { conversationThreads } from "@/lib/db/schema";

export type ConversationRecord = InferSelectModel<typeof conversationThreads>;
export type ConversationSummary = Pick<
  ConversationRecord,
  "threadId" | "title" | "model" | "createdAt" | "updatedAt"
>;

export const upsertConversationSnapshot = async ({
  threadId,
  userId,
  model,
  messages,
}: {
  threadId: string;
  userId: string;
  model: string;
  messages: UIMessage[];
}): Promise<void> => {
  const title = extractThreadTitle(messages);

  await db
    .insert(conversationThreads)
    .values({
      threadId,
      userId,
      model,
      title,
      messages,
    })
    .onConflictDoUpdate({
      target: [conversationThreads.threadId, conversationThreads.userId],
      set: {
        model,
        title:
          title === FALLBACK_THREAD_TITLE
            ? conversationThreads.title
            : sql`${title}`,
        messages,
        updatedAt: sql`now()`,
      },
    });
};

export const listUserConversations = async (
  userId: string,
): Promise<ConversationSummary[]> => {
  return db
    .select({
      threadId: conversationThreads.threadId,
      title: conversationThreads.title,
      model: conversationThreads.model,
      createdAt: conversationThreads.createdAt,
      updatedAt: conversationThreads.updatedAt,
    })
    .from(conversationThreads)
    .where(eq(conversationThreads.userId, userId))
    .orderBy(desc(conversationThreads.updatedAt));
};

export const getUserConversation = async ({
  userId,
  threadId,
}: {
  userId: string;
  threadId: string;
}): Promise<ConversationRecord | null> => {
  const [conversation] = await db
    .select()
    .from(conversationThreads)
    .where(
      and(
        eq(conversationThreads.userId, userId),
        eq(conversationThreads.threadId, threadId),
      ),
    )
    .limit(1);

  return conversation ?? null;
};
