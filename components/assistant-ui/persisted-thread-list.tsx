"use client";

import { useEffect, useRef } from "react";
import { PlusIcon } from "lucide-react";
import { useAuiState } from "@assistant-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  conversationQueryKeys,
  fetchConversations,
} from "@/lib/conversation-api";

type PersistedThreadListProps = {
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
  onCreateThread: () => void;
};

export function PersistedThreadList({
  activeThreadId,
  onSelectThread,
  onCreateThread,
}: PersistedThreadListProps) {
  const queryClient = useQueryClient();
  const conversationsQuery = useQuery({
    queryKey: conversationQueryKeys.all,
    queryFn: fetchConversations,
  });
  const isRunning = useAuiState((s) => s.thread.isRunning);
  const wasRunningRef = useRef(isRunning);

  useEffect(() => {
    if (wasRunningRef.current && !isRunning) {
      void queryClient.invalidateQueries({
        queryKey: conversationQueryKeys.all,
      });
    }
    wasRunningRef.current = isRunning;
  }, [isRunning, queryClient]);

  const items = conversationsQuery.data ?? [];
  const error = conversationsQuery.error
    ? "Could not load conversations"
    : null;
  const isLoading = conversationsQuery.isLoading;

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="outline"
        className="h-9 justify-start gap-2 rounded-lg px-3 text-sm hover:bg-muted"
        onClick={onCreateThread}
      >
        <PlusIcon className="size-4" />
        New Thread
      </Button>

      {isLoading ? (
        <div className="px-3 py-2 text-muted-foreground text-xs">
          Loading...
        </div>
      ) : null}
      {!isLoading && error ? (
        <div className="px-3 py-2 text-destructive text-xs">{error}</div>
      ) : null}
      {!isLoading && !error && items.length === 0 ? (
        <div className="px-3 py-2 text-muted-foreground text-xs">
          No conversations yet
        </div>
      ) : null}

      {!isLoading && !error
        ? items.map((conversation) => {
            const isActive = conversation.threadId === activeThreadId;
            return (
              <button
                key={conversation.threadId}
                type="button"
                className={`flex h-9 items-center rounded-lg px-3 text-left text-sm transition-colors ${
                  isActive ? "bg-muted" : "hover:bg-muted"
                }`}
                onClick={() => onSelectThread(conversation.threadId)}
              >
                <span className="truncate">
                  {conversation.title || "New Chat"}
                </span>
              </button>
            );
          })
        : null}
    </div>
  );
}
