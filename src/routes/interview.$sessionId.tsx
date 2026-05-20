import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useVoice } from "@/hooks/useVoice";
import { InterviewChat, type ChatTurn } from "@/components/InterviewChat";
import { ScoreCard, type Evaluation } from "@/components/ScoreCard";
import { getSessionDetail, submitAnswer } from "@/lib/interview.functions";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { scoreColor } from "@/lib/score-utils";

export const Route = createFileRoute("/interview/$sessionId")({
  head: () => ({ meta: [{ title: "Interview in progress — InterviewAI" }] }),
  component: InterviewPage,
});

function InterviewPage() {
  const { sessionId } = useParams({ from: "/interview/$sessionId" });
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [loading, user, navigate]);

  const detailFn = useServerFn(getSessionDetail);
  const submitFn = useServerFn(submitAnswer);

  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [answer, setAnswer] = useState("");
  const [thinking, setThinking] = useState(false);
  const [done, setDone] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [topic, setTopic] = useState("");
  const [maxQ, setMaxQ] = useState(5);
  const [askedCount, setAskedCount] = useState(0);
  const [startTs, setStartTs] = useState<number>(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const initRef = useRef(false);

  const voice = useVoice();

  // Timer
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTs) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startTs, done]);

  // Sync voice transcript -> textarea
  useEffect(() => { if (voice.transcript) setAnswer(voice.transcript); }, [voice.transcript]);

  // Load session
  useEffect(() => {
    if (!user || initRef.current) return;
    initRef.current = true;
    (async () => {
      try {
        const { session, pairs } = await detailFn({ data: { sessionId } });
        setTopic(`${session.topic} · ${session.difficulty}`);
        setMaxQ(session.max_questions);
        const t: ChatTurn[] = [];
        for (const p of pairs) {
          t.push({ role: "ai", text: p.question });
          if (p.user_answer) t.push({ role: "user", text: p.user_answer });
        }
        setTurns(t);
        setAskedCount(pairs.length);
        if (session.status === "completed") setDone(true);
        setStartTs(Date.now());
      } catch (e: any) {
        toast.error(e?.message ?? "Failed to load session");
      }
    })();
  }, [user, sessionId, detailFn]);

  const send = async () => {
    if (!answer.trim() || thinking) return;
    if (voice.isListening) voice.stop();
    const a = answer.trim();
    setTurns((p) => [...p, { role: "user", text: a }]);
    setAnswer("");
    setThinking(true);
    const timeTaken = Math.floor((Date.now() - startTs) / 1000);
    try {
      const res = await submitFn({ data: { sessionId, answer: a, timeTaken } });
      setEvaluation(res.evaluation as Evaluation);
      if (res.nextQuestion) {
        setTurns((p) => [...p, { role: "ai", text: res.nextQuestion! }]);
        setAskedCount((c) => c + 1);
        setStartTs(Date.now());
      }
      if (res.isComplete) {
        setDone(true);
        setSummary(res.summary);
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to submit answer");
      setTurns((p) => p.slice(0, -1));
      setAnswer(a);
    } finally {
      setThinking(false);
    }
  };

  if (loading || !user) return <div className="min-h-screen" />;

  const progress = Math.min(100, (askedCount === 0 ? 0 : ((askedCount - (done ? 0 : 0)) / maxQ) * 100));
  const currentQ = Math.min(askedCount, maxQ);

  return (
    <div className="min-h-screen">
      <Header authed />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{topic}</div>
            <div className="text-lg font-semibold text-foreground">Question {currentQ}/{maxQ}</div>
          </div>
          {!done && <div className="rounded-md border border-border bg-card px-3 py-1 text-sm font-mono text-muted-foreground">⏱ {elapsed}s</div>}
        </div>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex h-[70vh] flex-col rounded-xl border border-border bg-background">
            <div className="flex-1 overflow-y-auto">
              <InterviewChat turns={turns} thinking={thinking} />
            </div>
            {!done && (
              <div className="border-t border-border p-3">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer or click the mic…"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}
                />
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => (voice.isListening ? voice.stop() : voice.start())}
                    disabled={!voice.supported}
                    title={voice.supported ? "Voice input" : "Voice not supported in this browser"}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${voice.isListening ? "animate-pulse border-red-500 text-red-300" : "border-border text-muted-foreground hover:text-foreground"} disabled:opacity-50`}
                  >
                    {voice.isListening ? <MicOff size={14} /> : <Mic size={14} />}
                    {voice.isListening ? "Stop" : "Voice"}
                  </button>
                  <button onClick={send} disabled={!answer.trim() || thinking}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                    {thinking ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Submit (⌘+Enter)
                  </button>
                </div>
                {voice.error && <div className="mt-1 text-xs text-red-400">{voice.error}</div>}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live feedback</div>
            {evaluation ? <ScoreCard ev={evaluation} /> : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Submit your first answer to see scoring & feedback here.
              </div>
            )}
          </aside>
        </div>

        {done && summary && <SummaryModal summary={summary} sessionId={sessionId} />}
      </main>
    </div>
  );
}

function SummaryModal({ summary, sessionId }: { summary: any; sessionId: string }) {
  const overall = Number(summary.overall_score) || 0;
  const color = scoreColor(overall);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-glow)]">
        <h2 className="text-2xl font-bold text-foreground">Interview complete</h2>
        <div className="mt-6 flex items-center gap-6">
          <div className="flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white" style={{ backgroundColor: color }}>
            {overall}
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Overall score</div>
            <div className="text-lg font-semibold text-foreground">{summary.total_questions} questions</div>
          </div>
        </div>
        <div className="mt-6 max-h-64 overflow-y-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-3 py-2">#</th><th className="px-3 py-2">Score</th><th className="px-3 py-2">Verdict</th></tr>
            </thead>
            <tbody>
              {summary.breakdown.map((b: any) => (
                <tr key={b.index} className="border-t border-border">
                  <td className="px-3 py-2 text-muted-foreground">Q{b.index}</td>
                  <td className="px-3 py-2 font-semibold" style={{ color: scoreColor(b.score) }}>{b.score}</td>
                  <td className="px-3 py-2 text-foreground">{b.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex gap-3">
          <Link to="/dashboard" className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90">Try again</Link>
          <Link to="/history/$sessionId" params={{ sessionId }} className="rounded-lg border border-border px-5 py-2.5 font-medium text-foreground hover:bg-secondary">View details</Link>
        </div>
      </div>
    </div>
  );
}
