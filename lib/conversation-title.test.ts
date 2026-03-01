import { describe, expect, it } from "bun:test";
import type { UIMessage } from "ai";
import {
  compactTitle,
  extractThreadTitle,
  FALLBACK_THREAD_TITLE,
} from "@/lib/conversation-title";

describe("compactTitle", () => {
  it("returns trimmed compact title", () => {
    expect(compactTitle("   hello    world   ")).toBe("hello world");
  });

  it("returns fallback when title is empty", () => {
    expect(compactTitle("    ")).toBe(FALLBACK_THREAD_TITLE);
  });
});

describe("extractThreadTitle", () => {
  it("uses first user text part", () => {
    const messages: UIMessage[] = [
      {
        id: "m1",
        role: "user",
        parts: [{ type: "text", text: "How to optimize postgres indexes?" }],
      } as UIMessage,
    ];

    expect(extractThreadTitle(messages)).toBe(
      "How to optimize postgres indexes?",
    );
  });

  it("falls back to New Chat when no user text part exists", () => {
    const messages: UIMessage[] = [
      {
        id: "m1",
        role: "assistant",
        parts: [{ type: "text", text: "Hello" }],
      } as UIMessage,
    ];

    expect(extractThreadTitle(messages)).toBe(FALLBACK_THREAD_TITLE);
  });
});
