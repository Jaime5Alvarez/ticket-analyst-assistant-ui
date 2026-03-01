import type { UIMessage } from "ai";

export const FALLBACK_THREAD_TITLE = "New Chat";

export const compactTitle = (value: string | null | undefined): string => {
  const compact = (value ?? "").replace(/\s+/g, " ").trim();
  return compact ? compact.slice(0, 80) : FALLBACK_THREAD_TITLE;
};

type MessageTitleInput = Pick<UIMessage, "role" | "parts">;

export const extractThreadTitle = (
  messages: readonly MessageTitleInput[],
): string => {
  const firstUserMessage = messages.find((message) => message.role === "user");
  if (!firstUserMessage) return FALLBACK_THREAD_TITLE;

  const textPart = firstUserMessage.parts.find(
    (part): part is { type: "text"; text: string } =>
      part.type === "text" && typeof part.text === "string",
  );

  return compactTitle(textPart?.text);
};
