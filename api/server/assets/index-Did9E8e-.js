import { U as jsxRuntimeExports } from "./server-Pe6FDPZq.js";
import { L as Link } from "./router-CtroGWBM.js";
import { b as createLucideIcon, u as useAuth, H as Header, B as Brain } from "./Header-CaPTonEp.js";
import { M as Mic } from "./mic-CQy_P2lJ.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./auth-client-nNZcxKNv.js";
const __iconNode$1 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ]
];
const MessageSquare = createLucideIcon("message-square", __iconNode);
function Landing() {
  const {
    user
  } = useAuth();
  const features = [{
    icon: Brain,
    title: "AI Interviewer",
    desc: "Adaptive questions across DSA, OS, ML, System Design and more."
  }, {
    icon: Mic,
    title: "Voice Input",
    desc: "Answer naturally — speak or type, your choice."
  }, {
    icon: MessageSquare,
    title: "Smart Feedback",
    desc: "Per-answer scoring with keywords, tips, and ideal answers."
  }, {
    icon: ChartColumn,
    title: "Analytics",
    desc: "Track progress over time across topics."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { authed: !!user }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden px-6 py-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,oklch(0.62_0.19_275/0.25),transparent_50%),radial-gradient(circle_at_70%_60%,oklch(0.55_0.22_320/0.2),transparent_50%)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl font-bold tracking-tight text-foreground sm:text-6xl", children: [
            "Ace Your Next ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-[var(--gradient-hero)] bg-clip-text text-transparent", children: "Interview" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-muted-foreground", children: "Practice with an AI interviewer that adapts, evaluates, and coaches you through every answer." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: user ? "/dashboard" : "/register", className: "rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90", children: user ? "Go to dashboard" : "Get started free" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: user ? "/history" : "/login", className: "rounded-lg border border-border px-6 py-3 font-medium text-foreground hover:bg-secondary", children: user ? "View history" : "Sign in" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-6xl px-6 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "text-primary", size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-semibold text-foreground", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: f.desc })
      ] }, f.title)) }) })
    ] })
  ] });
}
export {
  Landing as component
};
