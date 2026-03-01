import { auth } from "@/lib/auth";
import { listUserConversations } from "@/lib/conversations";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await listUserConversations(session.user.id);
  return Response.json({ conversations });
}
