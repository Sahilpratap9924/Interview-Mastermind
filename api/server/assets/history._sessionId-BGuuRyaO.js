import { r as reactExports, U as jsxRuntimeExports } from "./server-Pe6FDPZq.js";
import { b as useParams, u as useNavigate, L as Link } from "./router-CtroGWBM.js";
import { u as useServerFn } from "./createSsrRpc-BtM581fZ.js";
import { u as useQuery } from "./useQuery-KqhF9Yc4.js";
import { b as createLucideIcon, u as useAuth, H as Header } from "./Header-CaPTonEp.js";
import { g as getSessionDetail } from "./interview.functions-Drs3qsPL.js";
import { S as ScoreCard } from "./ScoreCard-DKpQWbMW.js";
import { s as scoreColor } from "./score-utils-CeP67kcp.js";
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
const __iconNode = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode);
function SessionDetailPage() {
  const {
    sessionId
  } = useParams({
    from: "/history/$sessionId"
  });
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
  const fn = useServerFn(getSessionDetail);
  const q = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fn({
      data: {
        sessionId
      }
    }),
    enabled: !!user
  });
  if (loading || !user) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen" });
  const s = q.data?.session;
  const pairs = q.data?.pairs ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { authed: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-4xl px-6 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/history", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
        " Back to history"
      ] }),
      q.isLoading || !s ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center text-muted-foreground", children: "Loading…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-end justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
              s.topic,
              " · ",
              s.difficulty
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: new Date(s.started_at).toLocaleString() })
          ] }),
          s.overall_score != null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white", style: {
            backgroundColor: scoreColor(Number(s.overall_score))
          }, children: s.overall_score })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-6", children: pairs.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
            "Question ",
            i + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-semibold text-foreground", children: p.question }),
          p.user_answer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-lg bg-muted/40 p-3 text-sm text-foreground/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-xs uppercase tracking-wider text-muted-foreground", children: "Your answer" }),
            p.user_answer
          ] }),
          p.score != null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreCard, { ev: {
            score: p.score,
            verdict: p.verdict,
            feedback: p.feedback,
            ideal_answer_summary: p.ideal_answer_summary,
            keywords_matched: p.keywords_matched ?? [],
            keywords_missed: p.keywords_missed ?? [],
            improvement_tip: p.improvement_tip
          } }) })
        ] }, p.id)) })
      ] })
    ] })
  ] });
}
export {
  SessionDetailPage as component
};
