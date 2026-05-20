import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { getMe } from "@/lib/auth.functions";
import { listHistory } from "@/lib/interview.functions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — InterviewAI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading } = useAuth();
  const meFn = useServerFn(getMe);
  const historyFn = useServerFn(listHistory);
  const meQ = useQuery({ queryKey: ["me"], queryFn: () => meFn(), enabled: !!user });
  const histQ = useQuery({ queryKey: ["history"], queryFn: () => historyFn(), enabled: !!user });

  const stats = useMemo(() => {
    const sessions = histQ.data?.sessions ?? [];
    const completed = sessions.filter((s: any) => s.overall_score != null);
    const total = sessions.length;
    const avg = completed.length ? Math.round((completed.reduce((a: number, b: any) => a + Number(b.overall_score || 0), 0) / completed.length) * 10) / 10 : 0;
    const best = completed.length ? Math.max(...completed.map((s: any) => Number(s.overall_score || 0))) : null;
    return { total, completed: completed.length, avg, best };
  }, [histQ.data]);

  if (loading || !user) return <div className="min-h-screen" />;

  const initials = user?.name ? user.name.split(" ").map(s => s[0]).slice(0,2).join("") : (user?.email ? user.email[0].toUpperCase() : "?");

  return (
    <div className="min-h-screen">
      <Header authed />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center gap-6">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Account</div>
            <h1 className="text-2xl font-bold text-foreground">{user?.name ?? user?.email}</h1>
            <div className="mt-2 text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Sessions</div>
            <div className="mt-2 text-lg font-semibold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total interviews</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Completed</div>
            <div className="mt-2 text-lg font-semibold">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Finished interviews</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Average</div>
            <div className="mt-2 text-lg font-semibold">{stats.avg ?? 0}</div>
            <div className="text-sm text-muted-foreground">Average score</div>
          </div>
        </div>

        <div className="mt-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-sm font-semibold">Progress</div>
            <div className="mt-4 text-sm text-muted-foreground">Best score: {stats.best ?? "—"}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
