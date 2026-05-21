import { r as reactExports, U as jsxRuntimeExports } from "./server-Pe6FDPZq.js";
import { u as useNavigate, L as Link, t as toast } from "./router-CtroGWBM.js";
import { u as useServerFn } from "./createSsrRpc-BtM581fZ.js";
import { u as useQuery } from "./useQuery-KqhF9Yc4.js";
import { u as useAuth, H as Header } from "./Header-CaPTonEp.js";
import { T as TOPICS, D as DIFFICULTIES } from "./interview-prompts-CtMgmc30.js";
import { s as startSession, l as listHistory } from "./interview.functions-Drs3qsPL.js";
import { L as LoaderCircle } from "./loader-circle-BX1VB47J.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./auth-client-nNZcxKNv.js";
import "./auth-middleware-BuPT9MPp.js";
import "node:fs";
import "node:path";
import "node:url";
import "timers/promises";
import "timers";
import "fs";
import "http";
import "./worker-entry-CVE5LoHb.js";
import "node:events";
import "stream";
import "events";
import "util";
import "dns";
import "url";
import "zlib";
import "net";
import "fs/promises";
import "tls";
import "buffer";
import "crypto";
import "./createMiddleware-BvN2ghIY.js";
function Dashboard() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/login"
    });
  }, [loading, user, navigate]);
  const [topic, setTopic] = reactExports.useState("DSA");
  const [difficulty, setDifficulty] = reactExports.useState("Medium");
  const [count, setCount] = reactExports.useState(5);
  const [starting, setStarting] = reactExports.useState(false);
  const startFn = useServerFn(startSession);
  const historyFn = useServerFn(listHistory);
  const history = useQuery({
    queryKey: ["history"],
    queryFn: () => historyFn(),
    enabled: !!user
  });
  const begin = async () => {
    setStarting(true);
    try {
      const res = await startFn({
        data: {
          topic,
          difficulty,
          maxQuestions: count
        }
      });
      navigate({
        to: "/interview/$sessionId",
        params: {
          sessionId: res.sessionId
        }
      });
    } catch (e) {
      toast.error(e?.message ?? "Failed to start interview");
      setStarting(false);
    }
  };
  if (loading || !user) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { authed: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-6xl px-6 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground", children: "New mock interview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Pick a topic, set the difficulty, and go." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Topic" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-4", children: TOPICS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTopic(t.id), className: `rounded-xl border p-4 text-left transition ${topic === t.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: t.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t.label })
        ] }, t.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8 grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Difficulty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 inline-flex rounded-lg border border-border bg-card p-1", children: DIFFICULTIES.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDifficulty(d), className: `rounded-md px-4 py-1.5 text-sm font-medium ${difficulty === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`, children: d }, d)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: [
            "Questions: ",
            count
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 3, max: 10, value: count, onChange: (e) => setCount(Number(e.target.value)), className: "mt-4 w-full accent-[var(--primary)]" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: begin, disabled: starting, className: "mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90 disabled:opacity-50", children: [
        starting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }),
        starting ? "Preparing…" : "Start interview"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Recent sessions" }),
        history.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-sm text-muted-foreground", children: "Loading…" }) : !history.data?.sessions.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-sm text-muted-foreground", children: "No sessions yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 overflow-hidden rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-card text-left text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Topic" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Difficulty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Score" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: history.data.sessions.slice(0, 5).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border bg-background/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-muted-foreground", children: new Date(s.started_at).toLocaleDateString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-foreground", children: s.topic }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-muted-foreground", children: s.difficulty }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-semibold text-foreground", children: s.overall_score ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/history/$sessionId", params: {
              sessionId: s.id
            }, className: "text-primary hover:underline", children: "View" }) })
          ] }, s.id)) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
