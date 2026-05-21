import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { TOPICS, DIFFICULTIES } from "@/lib/interview-prompts";
import { startSession, listHistory } from "@/lib/interview.functions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — InterviewAI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [loading, user, navigate]);

  const [topic, setTopic] = useState<string>("DSA");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [count, setCount] = useState(5);
  const [starting, setStarting] = useState(false);

  const startFn = useServerFn(startSession);
  const historyFn = useServerFn(listHistory);
  const history = useQuery({ queryKey: ["history"], queryFn: () => historyFn(), enabled: !!user });

  const begin = async () => {
    setStarting(true);
    try {
      const res = await startFn({ data: { topic, difficulty, maxQuestions: count } });
      navigate({ to: "/interview/$sessionId", params: { sessionId: res.sessionId } });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to start interview");
      setStarting(false);
    }
  };

  if (loading || !user) return <div className="min-h-screen" />;

  return (
    <div className="min-h-screen">
      <Header authed />
      <main className="mx-auto max-w-screen-2xl px-6 py-10">
        <h1 className="text-3xl font-bold text-foreground">New mock interview</h1>
        <p className="mt-1 text-muted-foreground">Pick a topic, set the difficulty, and go.</p>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Topic</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {TOPICS.map((t) => (
              <button key={t.id} onClick={() => setTopic(t.id)}
                className={`rounded-xl border p-4 text-left transition ${topic === t.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"}`}>
                <div className="font-semibold text-foreground">{t.id}</div>
                <div className="text-xs text-muted-foreground">{t.label}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Difficulty</h2>
            <div className="mt-3 inline-flex rounded-lg border border-border bg-card p-1">
              {DIFFICULTIES.map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium ${difficulty === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Questions: {count}</h2>
            <input type="range" min={3} max={10} value={count} onChange={(e) => setCount(Number(e.target.value))}
              className="mt-4 w-full accent-[var(--primary)]" />
          </div>
        </section>

        <button onClick={begin} disabled={starting}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90 disabled:opacity-50">
          {starting && <Loader2 size={16} className="animate-spin" />}
          {starting ? "Preparing…" : "Start interview"}
        </button>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent sessions</h2>
          {history.isLoading ? (
            <div className="mt-4 text-sm text-muted-foreground">Loading…</div>
          ) : !history.data?.sessions.length ? (
            <div className="mt-4 text-sm text-muted-foreground">No sessions yet.</div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-2">Date</th><th className="px-4 py-2">Topic</th><th className="px-4 py-2">Difficulty</th><th className="px-4 py-2">Score</th><th className="px-4 py-2"></th></tr>
                </thead>
                <tbody>
                  {history.data.sessions.slice(0, 5).map((s: any) => (
                    <tr key={s.id} className="border-t border-border bg-background/50">
                      <td className="px-4 py-2 text-muted-foreground">{new Date(s.started_at).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-foreground">{s.topic}</td>
                      <td className="px-4 py-2 text-muted-foreground">{s.difficulty}</td>
                      <td className="px-4 py-2 font-semibold text-foreground">{s.overall_score ?? "—"}</td>
                      <td className="px-4 py-2 text-right">
                        <Link to="/history/$sessionId" params={{ sessionId: s.id }} className="text-primary hover:underline">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
