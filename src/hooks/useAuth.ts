import { useEffect, useState } from "react";
import { getStoredUser, onAuthChange, type AuthUser } from "@/integrations/mongo/auth-client";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setLoading(false);
    const unsub = onAuthChange((u) => setUser(u));
    return () => { unsub(); };
  }, []);

  return { user, loading, session: user ? { user } : null };
}
