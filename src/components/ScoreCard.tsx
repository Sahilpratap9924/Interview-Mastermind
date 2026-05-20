import { scoreColor } from "@/lib/score-utils";
import { Check, X, Lightbulb } from "lucide-react";

export type Evaluation = {
  score: number;
  verdict: string;
  feedback: string;
  ideal_answer_summary?: string;
  keywords_matched?: string[];
  keywords_missed?: string[];
  improvement_tip?: string;
};

export function ScoreCard({ ev }: { ev: Evaluation }) {
  const color = scoreColor(ev.score);
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {ev.score}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Verdict</div>
          <div className="text-lg font-semibold" style={{ color }}>{ev.verdict}</div>
        </div>
      </div>
      <p className="text-sm text-foreground/90">{ev.feedback}</p>
      {ev.ideal_answer_summary && (
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <div className="mb-1 font-semibold uppercase tracking-wider text-foreground/80">Ideal answer</div>
          {ev.ideal_answer_summary}
        </div>
      )}
      <div className="space-y-2">
        {!!ev.keywords_matched?.length && (
          <div className="flex flex-wrap gap-1.5">
            {ev.keywords_matched.map((k) => (
              <span key={k} className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
                <Check size={11} /> {k}
              </span>
            ))}
          </div>
        )}
        {!!ev.keywords_missed?.length && (
          <div className="flex flex-wrap gap-1.5">
            {ev.keywords_missed.map((k) => (
              <span key={k} className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-300">
                <X size={11} /> {k}
              </span>
            ))}
          </div>
        )}
      </div>
      {ev.improvement_tip && (
        <div className="flex gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-primary" />
          <span className="text-foreground/90">{ev.improvement_tip}</span>
        </div>
      )}
    </div>
  );
}
