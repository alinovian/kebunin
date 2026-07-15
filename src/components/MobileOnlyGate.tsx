import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";

// Tablet & smaller allowed. Laptop/desktop blocked.
const MAX_ALLOWED_WIDTH = 1024;

export function MobileOnlyGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MAX_ALLOWED_WIDTH}px)`);
    const update = () => setAllowed(mql.matches);
    update();
    setReady(true);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (!ready) return null;
  if (allowed) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-sm text-center space-y-4">
        <div className="size-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Smartphone className="size-8" />
        </div>
        <h1 className="text-xl font-bold">Aplikasi Hanya Untuk Perangkat Mobile</h1>
        <p className="text-muted-foreground text-sm">
          Silakan buka aplikasi ini menggunakan smartphone atau tablet.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
        >
          Kembali ke Landing Page
        </Link>
      </div>
    </div>
  );
}
