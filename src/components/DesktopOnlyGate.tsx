import { useEffect, useState, type ReactNode } from "react";
import { Monitor } from "lucide-react";

export function DesktopOnlyGate({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (isDesktop === null) return null;

  if (!isDesktop) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-sm text-center space-y-4">
          <div className="size-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Monitor className="size-8" />
          </div>
          <h1 className="text-xl font-bold">Dashboard Admin Hanya Untuk Desktop</h1>
          <p className="text-muted-foreground text-sm">
            Silakan buka dashboard ini menggunakan komputer atau laptop dengan layar lebar.
          </p>
          <a
            href="/"
            className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
          >
            Kembali ke Landing Page
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
