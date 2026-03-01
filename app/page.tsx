import { Assistant } from "./assistant";
import { requireServerSession } from "@/lib/auth-session";

export default async function Home() {
  await requireServerSession();
  return <Assistant />;
}
