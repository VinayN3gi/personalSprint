import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";

export function useAuth() {
  const [user, setUser] = useState<null | Awaited<ReturnType<typeof account.get>>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const current = await account.get();
        setUser(current);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  return { user, loading, logout };
}
