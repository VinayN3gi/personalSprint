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
  try {
    await account.deleteSession({ sessionId: 'current' }); 
    setUser(null);
  } catch (err) {
    console.error("Logout failed:", err);
  }
};


  return { user, loading, logout };
}
