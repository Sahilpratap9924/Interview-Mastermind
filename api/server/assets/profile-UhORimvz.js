import { r as reactExports, U as jsxRuntimeExports } from "./server-Pe6FDPZq.js";
import { u as useServerFn } from "./createSsrRpc-BtM581fZ.js";
import { u as useQuery } from "./useQuery-KqhF9Yc4.js";
import { u as useAuth, H as Header, A as Avatar, a as AvatarFallback } from "./Header-CaPTonEp.js";
import { g as getMe } from "./auth.functions-BZ-9YJZ1.js";
import { l as listHistory } from "./interview.functions-Drs3qsPL.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-CtroGWBM.js";
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
function ProfilePage() {
  const {
    user,
    loading
  } = useAuth();
  const meFn = useServerFn(getMe);
  const historyFn = useServerFn(listHistory);
  useQuery({
    queryKey: ["me"],
    queryFn: () => meFn(),
    enabled: !!user
  });
  const histQ = useQuery({
    queryKey: ["history"],
    queryFn: () => historyFn(),
    enabled: !!user
  });
  const stats = reactExports.useMemo(() => {
    const sessions = histQ.data?.sessions ?? [];
    const completed = sessions.filter((s) => s.overall_score != null);
    const total = sessions.length;
    const avg = completed.length ? Math.round(completed.reduce((a, b) => a + Number(b.overall_score || 0), 0) / completed.length * 10) / 10 : 0;
    const best = completed.length ? Math.max(...completed.map((s) => Number(s.overall_score || 0))) : null;
    return {
      total,
      completed: completed.length,
      avg,
      best
    };
  }, [histQ.data]);
  if (loading || !user) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen" });
  const initials = user?.name ? user.name.split(" ").map((s) => s[0]).slice(0, 2).join("") : user?.email ? user.email[0].toUpperCase() : "?";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { authed: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-4xl px-6 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: initials }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: user?.name ?? user?.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-muted-foreground", children: user?.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Sessions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-semibold", children: stats.total }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Total interviews" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Completed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-semibold", children: stats.completed }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Finished interviews" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Average" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-semibold", children: stats.avg ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Average score" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-sm text-muted-foreground", children: [
          "Best score: ",
          stats.best ?? "—"
        ] })
      ] }) })
    ] })
  ] });
}
export {
  ProfilePage as component
};
