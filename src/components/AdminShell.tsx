import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Users, Shield, LogOut, Leaf, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminRole } from "@/hooks/use-admin-role";

type NavItem = { to: "/admin" | "/admin/pengguna" | "/admin/admin" | "/admin/toko" | "/admin/tanaman"; label: string; icon: typeof LayoutDashboard; superOnly?: boolean };

const items: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pengguna", label: "Pengguna", icon: Users, superOnly: true },
  { to: "/admin/toko", label: "Kelola Toko", icon: ShoppingBag },
  { to: "/admin/tanaman", label: "Tanaman User", icon: Leaf, superOnly: true },
  { to: "/admin/admin", label: "Kelola Admin Toko", icon: Shield, superOnly: true },
];

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSuperAdmin, email, roles } = useAdminRole();

  const handleLogout = async () => {
    localStorage.removeItem("kebunin_user");
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    navigate({ to: "/admin/login", replace: true });
  };

  const visible = items.filter((i) => !i.superOnly || isSuperAdmin);

  return (
    <div className="h-screen bg-muted/30 flex overflow-hidden">
      <aside className="w-64 bg-card border-r border-border flex flex-col h-full shrink-0">
        <div className="px-6 h-[72px] border-b border-border flex items-center gap-2 shrink-0">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Leaf className="size-5" />
          </div>
          <div>
            <p className="font-bold leading-tight">Kebunin</p>
            <p className="caption text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visible.map((item) => {
            const Icon = item.icon;
            const active =
              item.to === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border shrink-0">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium truncate">{email ?? "—"}</p>
            <p className="caption text-muted-foreground">
              {roles.includes("super_admin") ? "Super Admin" : roles.includes("admin") ? "Admin" : "—"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="size-4" />
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="bg-card border-b border-border px-8 h-[72px] flex items-center shrink-0">
          <h1 className="text-xl font-bold">{title}</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}
