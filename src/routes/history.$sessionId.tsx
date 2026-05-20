import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { getSessionDetail } from "@/lib/interview.functions";
import { ScoreCard } from "@/components/ScoreCard";
import { scoreColor } from "@/lib/score-utils";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/history/$sessionId")({
  head: () => ({ meta: [{ title: "Session detail — InterviewAI" }] }),
  component: SessionDetailPage,
});

function SessionDetailPage() {
  const { sessionId } = useParams({ from: "/history/$sessionId" });
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [loading, user, navigate]);

  const fn = useServerFn(getSessionDetail);
  const q = useQuery({ queryKey: ["session", sessionId], queryFn: () => fn({ data: { sessionId } }), enabled: !!user });

  if (loading || !user) return <div className="min-h-screen" />;

  const s = q.data?.session;
  const pairs = q.data?.pairs ?? [];

  return (
    <div className="min-h-screen">
      <Header authed />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/history" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to history
        </Link>
        {q.isLoading || !s ? (
          <div className="mt-8 text-center text-muted-foreground">Loading…</div>
        ) : (
          <>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.topic} · {s.difficulty}</div>
                <h1 className="text-2xl font-bold text-foreground">{new Date(s.started_at).toLocaleString()}</h1>
              </div>
              {s.overall_score != null && (
                <div className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white" style={{ backgroundColor: scoreColor(Number(s.overall_score)) }}>
                  {s.overall_score}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-6">
              {pairs.map((p: any, i: number) => (
                <div key={p.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Question {i + 1}</div>
                  <p className="mt-1 font-semibold text-foreground">{p.question}</p>
                  {p.user_answer && (
                    <div className="mt-3 rounded-lg bg-muted/40 p-3 text-sm text-foreground/90">
                      <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Your answer</div>
                      {p.user_answer}
                    </div>
                  )}
                  {p.score != null && (
                    <div className="mt-4">
                      <ScoreCard ev={{
                        score: p.score, verdict: p.verdict, feedback: p.feedback,
                        ideal_answer_summary: p.ideal_answer_summary,
                        keywords_matched: p.keywords_matched ?? [],
                        keywords_missed: p.keywords_missed ?? [],
                        improvement_tip: p.improvement_tip,
                      }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
