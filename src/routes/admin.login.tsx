import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DesktopOnlyGate } from "@/components/DesktopOnlyGate";
import { Leaf, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getAdminRoles, loginLocal } from "@/lib/api/db.functions";

type SearchParams = {
  unauthorized?: string;
};

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      unauthorized: search.unauthorized as string | undefined,
    };
  },
  head: () => ({ meta: [{ title: "Login Admin | Kebunin" }] }),
  component: () => (
    <DesktopOnlyGate>
      <AdminLogin />
    </DesktopOnlyGate>
  ),
});

function AdminLogin() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (search.unauthorized === "1") {
      toast.error("Akun Anda tidak memiliki hak akses admin!");
    }
  }, [search.unauthorized]);

  useEffect(() => {
    let active = true;

    // Check local session
    const localUserStr = localStorage.getItem("kebunin_user");
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        if (localUser && localUser.id) {
          navigate({ to: "/admin", replace: true });
          return;
        }
      } catch (e) {}
    }

    const checkGoogleUser = async (user: any) => {
      setGoogleLoading(true);
      try {
        const list = await getAdminRoles({
          data: { userId: user.id }
        });
        
        if (list.includes("admin") || list.includes("super_admin")) {
          const curUser = {
            id: user.id,
            email: user.email ?? null,
            display_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          };
          localStorage.setItem("kebunin_user", JSON.stringify(curUser));
          toast.success("Selamat datang, Admin 👋");
          navigate({ to: "/admin", replace: true });
        } else {
          toast.error("Akun Anda tidak memiliki hak akses admin!");
          await supabase.auth.signOut();
          localStorage.removeItem("kebunin_user");
          setGoogleLoading(false);
        }
      } catch (err: any) {
        console.error("Gagal memeriksa role admin:", err);
        setGoogleLoading(false);
      }
    };

    supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) {
        checkGoogleUser(data.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session?.user) {
        checkGoogleUser(session.user);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    localStorage.removeItem("kebunin_user");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/login`,
      },
    });
    if (error) {
      toast.error("Gagal masuk dengan Google", { description: error.message });
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Sign in locally
      const localUser = await loginLocal({
        data: { email, password }
      });
      
      // 2. Fetch admin roles
      const list = await getAdminRoles({
        data: { userId: localUser.id }
      });

      if (!list.includes("admin") && !list.includes("super_admin")) {
        setLoading(false);
        toast.error("Akun ini bukan admin");
        return;
      }

      // Clear any Supabase session if it exists to avoid conflicts
      await supabase.auth.signOut();
      
      // Save local user session
      localStorage.setItem("kebunin_user", JSON.stringify(localUser));
      
      toast.success("Selamat datang, Admin 👋");
      navigate({ to: "/admin" });
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Gagal masuk");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Leaf className="size-5" />
          </div>
          <div>
            <p className="font-bold">Kebunin Admin</p>
            <p className="caption text-muted-foreground">Masuk untuk mengelola platform</p>
          </div>
        </div>

        {/* Google Login for Admin */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="mb-5 min-h-[46px] w-full bg-card border border-border text-foreground rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-muted/30 disabled:opacity-60 transition-colors cursor-pointer text-sm"
        >
          {googleLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Masuk dengan Google
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="caption text-muted-foreground">atau email admin</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="size-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="admin@kebunin.id"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="size-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer z-10"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Masuk
          </button>
        </form>
        <p className="caption text-muted-foreground mt-6 text-center">
          Akses dashboard ini hanya untuk admin yang ditunjuk.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
