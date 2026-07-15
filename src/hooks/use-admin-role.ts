import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminRoles } from "@/lib/api/db.functions";

export type AdminRole = "super_admin" | "admin" | "user";

export function useAdminRole() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        let curUserId = "";
        let curEmail = "";

        // 1. Check local session
        const localUserStr = typeof window !== "undefined" ? localStorage.getItem("kebunin_user") : null;
        if (localUserStr) {
          try {
            const localUser = JSON.parse(localUserStr);
            if (localUser && localUser.id) {
              curUserId = localUser.id;
              curEmail = localUser.email || "";
            }
          } catch (e) {}
        }

        // 2. Fallback to Supabase Google Session
        if (!curUserId) {
          const { data: userData } = await supabase.auth.getUser();
          const user = userData.user;
          if (user) {
            curUserId = user.id;
            curEmail = user.email ?? "";
          }
        }

        if (!curUserId) {
          if (mounted) setLoading(false);
          return;
        }

        const list = await getAdminRoles({
          data: { userId: curUserId }
        });
        if (mounted) {
          setUserId(curUserId);
          setEmail(curEmail || null);
          setRoles(list as AdminRole[]);
          setLoading(false);
        }
      } catch (err) {
        console.error("Gagal memuat role admin dari MySQL:", err);
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = isSuperAdmin || roles.includes("admin");

  return { roles, isAdmin, isSuperAdmin, userId, email, loading };
}
