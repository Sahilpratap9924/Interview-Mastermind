import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { listHistory, deleteSession } from "@/lib/interview.functions";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { scoreColor } from "@/lib/score-utils";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — InterviewAI" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [loading, user, navigate]);

  const fn = useServerFn(listHistory);
  const q = useQuery({ queryKey: ["history"], queryFn: () => fn(), enabled: !!user });
  const queryClient = useQueryClient();
  const deleteFn = useServerFn(deleteSession);

  const chartData = useMemo(() => {
    if (!q.data?.sessions) return [];
    return [...q.data.sessions]
      .filter((s: any) => s.overall_score != null)
      .reverse()
      .map((s: any, i: number) => ({ name: `#${i + 1}`, score: Number(s.overall_score), topic: s.topic }));
  }, [q.data]);

  if (loading || !user) return <div className="min-h-screen" />;

  return (
    <div className="min-h-screen">
      <Header authed />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-foreground">Your history</h1>
        <p className="mt-1 text-muted-foreground">Track your performance over time.</p>

        {chartData.length > 1 && (
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Score trend</div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="oklch(0.32 0.03 260)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="oklch(0.72 0.03 255)" />
                <YAxis domain={[0, 10]} stroke="oklch(0.72 0.03 255)" />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.035 260)", border: "1px solid oklch(0.32 0.03 260)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="oklch(0.62 0.19 275)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          {q.isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading…</div>
          ) : !q.data?.sessions.length ? (
            <div className="p-8 text-center text-muted-foreground">No interviews yet. <Link to="/dashboard" className="text-primary hover:underline">Start one</Link>.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2.5">Date</th><th className="px-4 py-2.5">Topic</th><th className="px-4 py-2.5">Difficulty</th><th className="px-4 py-2.5">Questions</th><th className="px-4 py-2.5">Score</th><th></th></tr>
              </thead>
              <tbody>
                {q.data.sessions.map((s: any) => (
                  <tr key={s.id} className="border-t border-border bg-background/50 hover:bg-card/50">
                    <td className="px-4 py-3 text-muted-foreground">{new Date(s.started_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-foreground">{s.topic}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.difficulty}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.total_questions}/{s.max_questions}</td>
                    <td className="px-4 py-3">
                      {s.overall_score != null ? (
                        <span className="font-semibold" style={{ color: scoreColor(Number(s.overall_score)) }}>{s.overall_score}</span>
                      ) : <span className="text-xs text-muted-foreground">incomplete</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link to="/history/$sessionId" params={{ sessionId: s.id }} className="text-primary hover:underline">View</Link>
                        <button
                          onClick={async () => {
                            if (!confirm("Delete this session? This cannot be undone.")) return;
                            try {
                              await deleteFn({ data: { sessionId: s.id } });
                              queryClient.invalidateQueries(["history"]);
                            } catch (err) {
                              // eslint-disable-next-line no-console
                              console.error(err);
                              alert("Failed to delete session.");
                            }
                          }}
                          className="text-destructive hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
