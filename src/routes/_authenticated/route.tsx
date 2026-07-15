import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { MobileOnlyGate } from "@/components/MobileOnlyGate";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    let curUser: { id: string; email?: string | null } | null = null;

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

    if (!curUser) {
      throw redirect({ to: "/auth" });
    }
    return { user: curUser };
  },
  component: () => (
    <MobileOnlyGate>
      <Outlet />
    </MobileOnlyGate>
  ),
});
