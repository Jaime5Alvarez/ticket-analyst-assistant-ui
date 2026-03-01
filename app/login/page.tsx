import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { getServerSession } from "@/lib/auth-session";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <section className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xs">
        <h1 className="font-semibold text-2xl">Ticket Analyst Assistant</h1>
        <p className="mt-1 mb-6 text-muted-foreground text-sm">
          Sign in to access the application.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
