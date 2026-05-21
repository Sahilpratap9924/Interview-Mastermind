import { U as jsxRuntimeExports } from "./server-Pe6FDPZq.js";
import { s as scoreColor } from "./score-utils-CeP67kcp.js";
import { b as createLucideIcon, C as Check } from "./Header-CaPTonEp.js";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
function ScoreCard({ ev }) {
  const color = scoreColor(ev.score);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white",
          style: { backgroundColor: color },
          children: ev.score
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Verdict" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", style: { color }, children: ev.verdict })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90", children: ev.feedback }),
    ev.ideal_answer_summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 font-semibold uppercase tracking-wider text-foreground/80", children: "Ideal answer" }),
      ev.ideal_answer_summary
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      !!ev.keywords_matched?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ev.keywords_matched.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }),
        " ",
        k
      ] }, k)) }),
      !!ev.keywords_missed?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ev.keywords_missed.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 }),
        " ",
        k
      ] }, k)) })
    ] }),
    ev.improvement_tip && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { size: 16, className: "mt-0.5 shrink-0 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/90", children: ev.improvement_tip })
    ] })
  ] });
}
export {
  ScoreCard as S
};
