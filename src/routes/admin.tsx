import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { DesktopOnlyGate } from "@/components/DesktopOnlyGate";
import { getAdminRoles } from "@/lib/api/db.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    
    let curUser: { id: string; email?: string | null; display_name?: string | null } | null = null;

    // 1. Check local session
    const localUserStr = typeof window !== "undefined" ? localStorage.getItem("kebunin_user") : null;
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        if (localUser && localUser.id) {
          curUser = localUser;
        }
      } catch (e) {}
    }

    // 2. Fallback to Supabase
    if (!curUser) {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        curUser = {
          id: data.user.id,
          email: data.user.email ?? null,
          display_name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("kebunin_user", JSON.stringify(curUser));
        }
      }
    }

    if (!curUser) {
      throw redirect({ to: "/admin/login" });
    }
    
    let list: string[] = [];
    try {
      list = await getAdminRoles({
        data: { userId: curUser.id }
      });
    } catch (err) {
      console.error("Gagal memeriksa role admin dari MySQL:", err);
      throw redirect({ to: "/admin/login", search: { unauthorized: "1" } as never });
    }

    if (!list.includes("admin") && !list.includes("super_admin")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("kebunin_user");
      }
      await supabase.auth.signOut();
      throw redirect({ to: "/admin/login", search: { unauthorized: "1" } as never });
    }
  },
  component: () => (
    <DesktopOnlyGate>
      <Outlet />
    </DesktopOnlyGate>
  ),
});
