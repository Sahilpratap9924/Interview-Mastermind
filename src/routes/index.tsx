import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Mic, BarChart3, MessageSquare } from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InterviewAI — Ace Your Next Interview" },
      { name: "description", content: "AI-powered mock interviews with real-time feedback, voice input, and performance analytics across DSA, OS, DBMS, ML and more." },
      { property: "og:title", content: "InterviewAI — Ace Your Next Interview" },
      { property: "og:description", content: "AI-powered mock interviews with real-time feedback and analytics." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  const features = [
    { icon: Brain, title: "AI Interviewer", desc: "Adaptive questions across DSA, OS, ML, System Design and more." },
    { icon: Mic, title: "Voice Input", desc: "Answer naturally — speak or type, your choice." },
    { icon: MessageSquare, title: "Smart Feedback", desc: "Per-answer scoring with keywords, tips, and ideal answers." },
    { icon: BarChart3, title: "Analytics", desc: "Track progress over time across topics." },
  ];
  return (
    <div className="min-h-screen">
      <Header authed={!!user} />
      <main>
        <section className="relative overflow-hidden px-6 py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,oklch(0.62_0.19_275/0.25),transparent_50%),radial-gradient(circle_at_70%_60%,oklch(0.55_0.22_320/0.2),transparent_50%)]" />
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Ace Your Next <span className="bg-[var(--gradient-hero)] bg-clip-text text-transparent">Interview</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Practice with an AI interviewer that adapts, evaluates, and coaches you through every answer.
            </p>
            <div className="mt-10 flex justify-center gap-3">
              <Link to={user ? "/dashboard" : "/register"} className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90">
                {user ? "Go to dashboard" : "Get started free"}
              </Link>
              <Link to={user ? "/history" : "/login"} className="rounded-lg border border-border px-6 py-3 font-medium text-foreground hover:bg-secondary">
                {user ? "View history" : "Sign in"}
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-screen-2xl px-6 pb-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                <f.icon className="text-primary" size={24} />
                <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
