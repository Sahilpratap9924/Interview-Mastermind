import { r as reactExports, U as jsxRuntimeExports } from "./server-Pe6FDPZq.js";
import { u as useNavigate } from "./router-CtroGWBM.js";
import { u as useServerFn } from "./createSsrRpc-BtM581fZ.js";
import { u as useAuth, H as Header } from "./Header-CaPTonEp.js";
import { c as changePassword } from "./auth.functions-BZ-9YJZ1.js";
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
function SettingsPage() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const changeFn = useServerFn(changePassword);
  const [oldPassword, setOldPassword] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  if (loading || !user) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen" });
  async function submit(e) {
    e.preventDefault();
    if (newPassword !== confirm) {
      alert("New password and confirmation do not match.");
      return;
    }
    setBusy(true);
    try {
      await changeFn({
        data: {
          oldPassword,
          newPassword
        }
      });
      alert("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
      navigate({
        to: "/profile"
      });
    } catch (err) {
      console.error(err);
      alert(err?.message ?? "Failed to change password.");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { authed: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-2xl px-6 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Change your account settings." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm font-medium text-muted-foreground", children: "Current password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: oldPassword, onChange: (e) => setOldPassword(e.target.value), className: "w-full rounded-md border border-input px-3 py-2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm font-medium text-muted-foreground", children: "New password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "w-full rounded-md border border-input px-3 py-2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm font-medium text-muted-foreground", children: "Confirm new password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: confirm, onChange: (e) => setConfirm(e.target.value), className: "w-full rounded-md border border-input px-3 py-2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, className: "rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground", children: "Change password" }) })
      ] })
    ] })
  ] });
}
export {
  SettingsPage as component
};
