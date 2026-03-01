import type { UIMessage } from "ai";
import { Assistant } from "@/app/assistant";
import { requireServerSession } from "@/lib/auth-session";
import { getUserConversation } from "@/lib/conversations";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const session = await requireServerSession();
  const { threadId } = await params;
  const conversation = await getUserConversation({
    userId: session.user.id,
    threadId,
  });
  const initialMessages = (conversation?.messages ?? []) as UIMessage[];
  const currentUser = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };

  return (
    <Assistant
      initialThreadId={threadId}
      initialMessages={initialMessages}
      currentUser={currentUser}
    />
  );
}
