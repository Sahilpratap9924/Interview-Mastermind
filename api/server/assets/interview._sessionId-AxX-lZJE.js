import { r as reactExports, U as jsxRuntimeExports } from "./server-Pe6FDPZq.js";
import { b as useParams, u as useNavigate, t as toast, L as Link } from "./router-CtroGWBM.js";
import { u as useServerFn } from "./createSsrRpc-BtM581fZ.js";
import { b as createLucideIcon, U as User, u as useAuth, H as Header } from "./Header-CaPTonEp.js";
import { S as ScoreCard } from "./ScoreCard-DKpQWbMW.js";
import { g as getSessionDetail, a as submitAnswer } from "./interview.functions-Drs3qsPL.js";
import { s as scoreColor } from "./score-utils-CeP67kcp.js";
import { M as Mic } from "./mic-CQy_P2lJ.js";
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
const __iconNode$2 = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
];
const Bot = createLucideIcon("bot", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33", key: "1gzdoj" }],
  ["path", { d: "M16.95 16.95A7 7 0 0 1 5 12v-2", key: "cqa7eg" }],
  ["path", { d: "M18.89 13.23A7 7 0 0 0 19 12v-2", key: "16hl24" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12", key: "r2i35w" }]
];
const MicOff = createLucideIcon("mic-off", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
function useVoice() {
  const [isListening, setIsListening] = reactExports.useState(false);
  const [transcript, setTranscript] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [supported, setSupported] = reactExports.useState(true);
  const recognitionRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const w = typeof window !== "undefined" ? window : {};
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };
    r.onerror = (e) => {
      setError(e?.error === "not-allowed" ? "Microphone permission denied" : `Voice error: ${e?.error || "unknown"}`);
      setIsListening(false);
    };
    r.onend = () => setIsListening(false);
    recognitionRef.current = r;
    return () => {
      try {
        r.stop();
      } catch {
      }
    };
  }, []);
  const start = () => {
    setError(null);
    setTranscript("");
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (e) {
      setError(e?.message ?? "Could not start recognition");
    }
  };
  const stop = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
    }
    setIsListening(false);
  };
  return { isListening, transcript, error, supported, start, stop, setTranscript };
}
function InterviewChat({ turns, thinking }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 overflow-y-auto p-4", children: [
    turns.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-3 ${t.role === "user" ? "flex-row-reverse" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${t.role === "ai" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`, children: t.role === "ai" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 16 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${t.role === "ai" ? "bg-card text-card-foreground border border-border" : "bg-primary text-primary-foreground"}`, children: t.text })
    ] }, i)),
    thinking && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { size: 16 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-muted-foreground", style: { animationDelay: "0ms" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-muted-foreground", style: { animationDelay: "150ms" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-muted-foreground", style: { animationDelay: "300ms" } })
      ] }) })
    ] })
  ] });
}
function InterviewPage() {
  const {
    sessionId
  } = useParams({
    from: "/interview/$sessionId"
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
  const detailFn = useServerFn(getSessionDetail);
  const submitFn = useServerFn(submitAnswer);
  const [turns, setTurns] = reactExports.useState([]);
  const [evaluation, setEvaluation] = reactExports.useState(null);
  const [answer, setAnswer] = reactExports.useState("");
  const [thinking, setThinking] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  const [summary, setSummary] = reactExports.useState(null);
  const [topic, setTopic] = reactExports.useState("");
  const [maxQ, setMaxQ] = reactExports.useState(5);
  const [askedCount, setAskedCount] = reactExports.useState(0);
  const [startTs, setStartTs] = reactExports.useState(Date.now());
  const [elapsed, setElapsed] = reactExports.useState(0);
  const initRef = reactExports.useRef(false);
  const voice = useVoice();
  reactExports.useEffect(() => {
    if (done) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTs) / 1e3)), 1e3);
    return () => clearInterval(id);
  }, [startTs, done]);
  reactExports.useEffect(() => {
    if (voice.transcript) setAnswer(voice.transcript);
  }, [voice.transcript]);
  reactExports.useEffect(() => {
    if (!user || initRef.current) return;
    initRef.current = true;
    (async () => {
      try {
        const {
          session,
          pairs
        } = await detailFn({
          data: {
            sessionId
          }
        });
        setTopic(`${session.topic} · ${session.difficulty}`);
        setMaxQ(session.max_questions);
        const t = [];
        for (const p of pairs) {
          t.push({
            role: "ai",
            text: p.question
          });
          if (p.user_answer) t.push({
            role: "user",
            text: p.user_answer
          });
        }
        setTurns(t);
        setAskedCount(pairs.length);
        if (session.status === "completed") setDone(true);
        setStartTs(Date.now());
      } catch (e) {
        toast.error(e?.message ?? "Failed to load session");
      }
    })();
  }, [user, sessionId, detailFn]);
  const send = async () => {
    if (!answer.trim() || thinking) return;
    if (voice.isListening) voice.stop();
    const a = answer.trim();
    setTurns((p) => [...p, {
      role: "user",
      text: a
    }]);
    setAnswer("");
    setThinking(true);
    const timeTaken = Math.floor((Date.now() - startTs) / 1e3);
    try {
      const res = await submitFn({
        data: {
          sessionId,
          answer: a,
          timeTaken
        }
      });
      setEvaluation(res.evaluation);
      if (res.nextQuestion) {
        setTurns((p) => [...p, {
          role: "ai",
          text: res.nextQuestion
        }]);
        setAskedCount((c) => c + 1);
        setStartTs(Date.now());
      }
      if (res.isComplete) {
        setDone(true);
        setSummary(res.summary);
      }
    } catch (e) {
      toast.error(e?.message ?? "Failed to submit answer");
      setTurns((p) => p.slice(0, -1));
      setAnswer(a);
    } finally {
      setThinking(false);
    }
  };
  if (loading || !user) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen" });
  const progress = Math.min(100, askedCount === 0 ? 0 : (askedCount - (done ? 0 : 0)) / maxQ * 100);
  const currentQ = Math.min(askedCount, maxQ);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { authed: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-6 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: topic }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-semibold text-foreground", children: [
            "Question ",
            currentQ,
            "/",
            maxQ
          ] })
        ] }),
        !done && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-card px-3 py-1 text-sm font-mono text-muted-foreground", children: [
          "⏱ ",
          elapsed,
          "s"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary transition-all", style: {
        width: `${progress}%`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[1.4fr_1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[70vh] flex-col rounded-xl border border-border bg-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InterviewChat, { turns, thinking }) }),
          !done && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: answer, onChange: (e) => setAnswer(e.target.value), placeholder: "Type your answer or click the mic…", rows: 3, className: "w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary", onKeyDown: (e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => voice.isListening ? voice.stop() : voice.start(), disabled: !voice.supported, title: voice.supported ? "Voice input" : "Voice not supported in this browser", className: `inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${voice.isListening ? "animate-pulse border-red-500 text-red-300" : "border-border text-muted-foreground hover:text-foreground"} disabled:opacity-50`, children: [
                voice.isListening ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { size: 14 }),
                voice.isListening ? "Stop" : "Voice"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: send, disabled: !answer.trim() || thinking, className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50", children: [
                thinking ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14 }),
                "Submit (⌘+Enter)"
              ] })
            ] }),
            voice.error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-red-400", children: voice.error })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Live feedback" }),
          evaluation ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreCard, { ev: evaluation }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground", children: "Submit your first answer to see scoring & feedback here." })
        ] })
      ] }),
      done && summary && /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryModal, { summary, sessionId })
    ] })
  ] });
}
function SummaryModal({
  summary,
  sessionId
}) {
  const overall = Number(summary.overall_score) || 0;
  const color = scoreColor(overall);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-glow)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Interview complete" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white", style: {
        backgroundColor: color
      }, children: overall }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Overall score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-semibold text-foreground", children: [
          summary.total_questions,
          " questions"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 max-h-64 overflow-y-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Verdict" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: summary.breakdown.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-muted-foreground", children: [
          "Q",
          b.index
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-semibold", style: {
          color: scoreColor(b.score)
        }, children: b.score }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground", children: b.verdict })
      ] }, b.index)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90", children: "Try again" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/history/$sessionId", params: {
        sessionId
      }, className: "rounded-lg border border-border px-5 py-2.5 font-medium text-foreground hover:bg-secondary", children: "View details" })
    ] })
  ] }) });
}
export {
  InterviewPage as component
};
