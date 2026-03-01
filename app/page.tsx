import { redirect } from "next/navigation";
import { requireServerSession } from "@/lib/auth-session";
import { listUserConversations } from "@/lib/conversations";

export default async function Home() {
  const session = await requireServerSession();
  const conversations = await listUserConversations(session.user.id);
  const threadId = conversations[0]?.threadId ?? crypto.randomUUID();

  redirect(`/thread/${threadId}`);
}
