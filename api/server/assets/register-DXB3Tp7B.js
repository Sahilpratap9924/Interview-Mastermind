import { r as reactExports, U as jsxRuntimeExports } from "./server-Pe6FDPZq.js";
import { u as useNavigate, L as Link, t as toast } from "./router-CtroGWBM.js";
import { u as useServerFn } from "./createSsrRpc-BtM581fZ.js";
import { r as registerUser } from "./auth.functions-BZ-9YJZ1.js";
import { s as setSession } from "./auth-client-nNZcxKNv.js";
import { H as Header } from "./Header-CaPTonEp.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
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
function RegisterPage() {
  const navigate = useNavigate();
  const registerFn = useServerFn(registerUser);
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        token,
        user
      } = await registerFn({
        data: {
          name,
          email,
          password
        }
      });
      setSession(token, user);
      toast.success("Account created.");
      navigate({
        to: "/dashboard"
      });
    } catch (err) {
      toast.error(err?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { authed: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Create account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Start practicing in 30 seconds." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: name, onChange: (e) => setName(e.target.value), maxLength: 80, className: "mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground", children: "Password (min 6 chars)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full rounded-lg bg-primary py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50", children: loading ? "Creating…" : "Create account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
        "Already have one? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary hover:underline", children: "Sign in" })
      ] })
    ] })
  ] });
}
export {
  RegisterPage as component
};
