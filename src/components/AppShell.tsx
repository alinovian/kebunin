import { Link, useLocation } from "@tanstack/react-router";
import { Home, ScanLine, CalendarDays, Store, User } from "lucide-react";
import type { ReactNode } from "react";

type NavItem = {
  to: "/beranda" | "/jadwal" | "/scan" | "/toko" | "/profil";
  label: string;
  icon: typeof Home;
  primary?: boolean;
};

const navItems: NavItem[] = [
  { to: "/beranda", label: "Beranda", icon: Home },
  { to: "/jadwal", label: "Jadwal", icon: CalendarDays },
  { to: "/scan", label: "Scan", icon: ScanLine, primary: true },
  { to: "/toko", label: "Toko", icon: Store },
  { to: "/profil", label: "Profil", icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen w-full flex justify-center bg-muted">
      <div className="relative w-full max-w-md min-h-screen bg-background shadow-xl flex flex-col">
        <main className="flex-1 pb-24">{children}</main>
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border z-40">
          <ul className="grid grid-cols-5 items-end">
            {navItems.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              if (item.primary) {
                return (
                  <li key={item.to} className="flex justify-center -mt-6">
                    <Link
                      to={item.to}
                      aria-label={item.label}
                      className="size-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 active:bg-secondary transition-colors"
                    >
                      <Icon className="size-7" />
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`min-h-[56px] flex flex-col items-center justify-center gap-1 px-2 py-2 transition-colors ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="caption font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
      </div>
    </div>
  );
}
