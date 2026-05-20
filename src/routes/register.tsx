import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { registerUser } from "@/lib/auth.functions";
import { setSession } from "@/integrations/mongo/auth-client";
import { toast } from "sonner";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — InterviewAI" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const registerFn = useServerFn(registerUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await registerFn({ data: { name, email, password } });
      setSession(token, user);
      toast.success("Account created.");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header authed={false} />
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-3xl font-bold text-foreground">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Start practicing in 30 seconds.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={80}
              className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Password (min 6 chars)</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have one? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
