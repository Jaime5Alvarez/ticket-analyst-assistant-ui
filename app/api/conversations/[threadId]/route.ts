import { auth } from "@/lib/auth";
import { getUserConversation } from "@/lib/conversations";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await params;
  const conversation = await getUserConversation({
    userId: session.user.id,
    threadId,
  });

  if (!conversation) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ conversation });
}
