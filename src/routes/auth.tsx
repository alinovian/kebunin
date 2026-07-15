import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, Mail, Lock, ArrowLeft, Loader2, User, RefreshCw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { MobileOnlyGate } from "@/components/MobileOnlyGate";
import { checkEmailExists, loginLocal, registerLocal, getOrCreateProfile } from "@/lib/api/db.functions";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Masuk | Kebunin" },
      { name: "description", content: "Masuk atau daftar Kebunin untuk mulai berkebun dengan asisten AI." },
    ],
  }),
  component: AuthRoute,
});

function AuthRoute() {
  return (
    <MobileOnlyGate>
      <AuthPage />
    </MobileOnlyGate>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "password" | "register">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isGoogleLinking, setIsGoogleLinking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Already signed in? Redirect to app.
  useEffect(() => {
    let active = true;
    
    // Check local session
    const localUserStr = localStorage.getItem("kebunin_user");
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        if (localUser && localUser.id) {
          navigate({ to: "/beranda", replace: true });
          return;
        }
      } catch (e) {}
    }

    const checkAndRedirect = async (user: any) => {
      setGoogleLoading(true);
      try {
        const profile = await getOrCreateProfile({
          data: {
            id: user.id,
            email: user.email ?? null,
            display_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null
          }
        });
        
        if (active) {
          if (profile && !(profile as any).password_hash) {
            setEmail(user.email ?? "");
            setName(profile.display_name ?? "");
            setIsGoogleLinking(true);
            setStep("register");
            setGoogleLoading(false);
          } else {
            // Simpan sesi lokal untuk pengguna Google yang sudah terdaftar
            localStorage.setItem("kebunin_user", JSON.stringify({
              id: profile.id,
              email: profile.email,
              display_name: profile.display_name
            }));
            navigate({ to: "/beranda", replace: true });
          }
        }
      } catch (err) {
        console.error("Gagal memproses profil Google:", err);
        if (active) {
          toast.error("Gagal menyelaraskan akun Google dengan database lokal.");
          setGoogleLoading(false);
        }
      }
    };

    supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) {
        checkAndRedirect(data.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session?.user) {
        if (localStorage.getItem("kebunin_user")) {
          return;
        }
        checkAndRedirect(session.user);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    // Remove local user session before trying Google login
    localStorage.removeItem("kebunin_user");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });
    if (error) {
      toast.error("Gagal masuk dengan Google", { description: error.message });
      setGoogleLoading(false);
    }
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (step === "email") {
        // Step 1: Check if email exists
        const result = await checkEmailExists({ data: { email } });
        
        if (result.exists) {
          if (result.type === "google") {
            // Email exists via Google but has no password.
            // Allow them to set a password!
            setIsGoogleLinking(true);
            setStep("register");
          } else {
            // Email exists locally
            setIsGoogleLinking(false);
            setStep("password");
          }
        } else {
          // Email does not exist
          setIsGoogleLinking(false);
          setStep("register");
        }
      } else if (step === "password") {
        // Step 2: Sign in locally
        const user = await loginLocal({ data: { email, password } });
        
        // Clear any Google session to avoid conflicts
        await supabase.auth.signOut();
        
        // Save local session
        localStorage.setItem("kebunin_user", JSON.stringify(user));
        toast.success("Selamat datang kembali! 👋");
        navigate({ to: "/beranda", replace: true });
      } else if (step === "register") {
        // Step 3: Register / Link password locally
        if (!name.trim()) {
          toast.error("Lengkapi Data", { description: "Nama lengkap wajib diisi." });
          setLoading(false);
          return;
        }
        
        const user = await registerLocal({
          data: { email, password, displayName: name }
        });
        
        // Clear any Google session to avoid conflicts
        await supabase.auth.signOut();
        
        // Save local session
        localStorage.setItem("kebunin_user", JSON.stringify(user));
        
        if (isGoogleLinking) {
          toast.success("Kata sandi berhasil ditambahkan ke akun Anda! 👋");
        } else {
          toast.success("Akun berhasil dibuat! Selamat berkebun! 🌱");
        }
        
        navigate({ to: "/beranda", replace: true });
      }
    } catch (err: any) {
      toast.error("Gagal", { description: err.message || "Terjadi kesalahan" });
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "password":
        return "Masukkan Kata Sandi";
      case "register":
        return isGoogleLinking ? "Buat Kata Sandi Akun" : "Lengkapi Profil Anda";
      default:
        return "Masuk ke Kebunin";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case "password":
        return "Akun ditemukan. Masukkan kata sandi Anda untuk melanjutkan.";
      case "register":
        return isGoogleLinking
          ? "Akun Anda terdaftar via Google. Silakan lengkapi nama dan buat kata sandi baru untuk masuk secara manual menggunakan email."
          : "Email belum terdaftar. Silakan buat akun baru untuk mulai berkebun.";
      default:
        return "Lanjut rawat tanamanmu hari ini dengan asisten AI.";
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-muted">
      <div className="w-full max-w-md min-h-screen bg-background px-5 pt-6 pb-10 flex flex-col justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-1 caption text-muted-foreground w-fit">
            <ArrowLeft className="size-4" /> Kembali
          </Link>

          <div className="mt-6 text-center">
            <div className="size-14 rounded-2xl bg-primary text-primary-foreground mx-auto flex items-center justify-center">
              <Leaf className="size-7" />
            </div>
            <h1 className="mt-4">{getStepTitle()}</h1>
            <p className="mt-1 text-muted-foreground">{getStepSubtitle()}</p>
          </div>

          {/* Google Sign-in - Only visible in Step 1 (email entry) */}
          {step === "email" && (
            <>
              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="mt-6 min-h-[52px] w-full bg-card border border-border text-foreground rounded-xl font-medium flex items-center justify-center gap-3 active:bg-muted disabled:opacity-60 transition-colors cursor-pointer"
              >
                {googleLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Lanjut dengan Google
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="caption text-muted-foreground">atau pakai email</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          {/* Step Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
            {step !== "email" && (
              <div className="bg-muted/40 p-3.5 rounded-xl border border-border flex items-center justify-between">
                <div className="overflow-hidden pr-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Email Pengguna</p>
                  <p className="text-sm font-medium text-foreground truncate">{email}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (isGoogleLinking) {
                      await supabase.auth.signOut();
                    }
                    setStep("email");
                    setPassword("");
                    setIsGoogleLinking(false);
                  }}
                  className="caption text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <RefreshCw className="size-3" /> Ubah
                </button>
              </div>
            )}

            {step === "email" && (
              <Field label="Email" icon={<Mail className="size-4" />}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamu@email.com"
                  className="w-full h-12 pl-10 pr-3 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground"
                />
              </Field>
            )}

            {step === "register" && (
              <Field label="Nama Lengkap" icon={<User className="size-4" />}>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full h-12 pl-10 pr-3 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground"
                />
              </Field>
            )}

            {step !== "email" && (
              <Field 
                label={step === "register" ? "Buat Kata Sandi" : "Kata Sandi"} 
                icon={<Lock className="size-4" />}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={step === "register" ? "Minimal 6 karakter" : "Masukkan kata sandi"}
                  className="w-full h-12 pl-10 pr-10 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground animate-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer z-10"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </Field>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[52px] bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-secondary disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading && <Loader2 className="size-5 animate-spin" />}
              {step === "email" && "Lanjut"}
              {step === "password" && "Masuk"}
              {step === "register" && "Daftar & Masuk"}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi Kebunin.
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="caption font-medium text-foreground">{label}</span>
      <div className="mt-1 relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        )}
        {children}
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
