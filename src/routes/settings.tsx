import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { changePassword } from "@/lib/auth.functions";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — InterviewAI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const changeFn = useServerFn(changePassword);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading || !user) return <div className="min-h-screen" />;

  async function submit(e: any) {
    e.preventDefault();
    if (newPassword !== confirm) {
      alert("New password and confirmation do not match.");
      return;
    }
    setBusy(true);
    try {
      await changeFn({ data: { oldPassword, newPassword } });
      alert("Password changed successfully.");
      setOldPassword(""); setNewPassword(""); setConfirm("");
      navigate({ to: "/profile" });
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Failed to change password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header authed />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Change your account settings.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Current password</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full rounded-md border border-input px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">New password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-md border border-input px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Confirm new password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-md border border-input px-3 py-2" />
          </div>

          <div>
            <button disabled={busy} className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground">Change password</button>
          </div>
        </form>
      </main>
    </div>
  );
}
