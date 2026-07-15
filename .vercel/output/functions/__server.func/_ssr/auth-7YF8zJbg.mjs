import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-S4gzLm3e.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as MobileOnlyGate } from "./MobileOnlyGate-DeILORSp.mjs";
import { g as getOrCreateProfile, c as checkEmailExists, l as loginLocal, r as registerLocal } from "./router-C0zimY-u.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { l as ArrowLeft, L as Leaf, m as LoaderCircle, R as RefreshCw, M as Mail, n as User, E as EyeOff, o as Eye, p as Lock } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function AuthRoute() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileOnlyGate, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthPage, {}) });
}
function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState("email");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [googleLoading, setGoogleLoading] = reactExports.useState(false);
  const [isGoogleLinking, setIsGoogleLinking] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let active = true;
    const localUserStr = localStorage.getItem("kebunin_user");
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        if (localUser && localUser.id) {
          navigate({
            to: "/beranda",
            replace: true
          });
          return;
        }
      } catch (e) {
      }
    }
    const checkAndRedirect = async (user) => {
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
          if (profile && !profile.password_hash) {
            setEmail(user.email ?? "");
            setName(profile.display_name ?? "");
            setIsGoogleLinking(true);
            setStep("register");
          } else {
            localStorage.setItem("kebunin_user", JSON.stringify({
              id: profile.id,
              email: profile.email,
              display_name: profile.display_name
            }));
            navigate({
              to: "/beranda",
              replace: true
            });
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
    supabase.auth.getUser().then(({
      data
    }) => {
      if (active && data.user) {
        checkAndRedirect(data.user);
      }
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
    localStorage.removeItem("kebunin_user");
    const {
      error
    } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`
      }
    });
    if (error) {
      toast.error("Gagal masuk dengan Google", {
        description: error.message
      });
      setGoogleLoading(false);
    }
  };
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (step === "email") {
        const result = await checkEmailExists({
          data: {
            email
          }
        });
        if (result.exists) {
          if (result.type === "google") {
            setIsGoogleLinking(true);
            setStep("register");
          } else {
            setIsGoogleLinking(false);
            setStep("password");
          }
        } else {
          setIsGoogleLinking(false);
          setStep("register");
        }
      } else if (step === "password") {
        const user = await loginLocal({
          data: {
            email,
            password
          }
        });
        await supabase.auth.signOut();
        localStorage.setItem("kebunin_user", JSON.stringify(user));
        toast.success("Selamat datang kembali! 👋");
        navigate({
          to: "/beranda",
          replace: true
        });
      } else if (step === "register") {
        if (!name.trim()) {
          toast.error("Lengkapi Data", {
            description: "Nama lengkap wajib diisi."
          });
          setLoading(false);
          return;
        }
        const user = await registerLocal({
          data: {
            email,
            password,
            displayName: name
          }
        });
        await supabase.auth.signOut();
        localStorage.setItem("kebunin_user", JSON.stringify(user));
        if (isGoogleLinking) {
          toast.success("Kata sandi berhasil ditambahkan ke akun Anda! 👋");
        } else {
          toast.success("Akun berhasil dibuat! Selamat berkebun! 🌱");
        }
        navigate({
          to: "/beranda",
          replace: true
        });
      }
    } catch (err) {
      toast.error("Gagal", {
        description: err.message || "Terjadi kesalahan"
      });
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
        return isGoogleLinking ? "Akun Anda terdaftar via Google. Silakan lengkapi nama dan buat kata sandi baru untuk masuk secara manual menggunakan email." : "Email belum terdaftar. Silakan buat akun baru untuk mulai berkebun.";
      default:
        return "Lanjut rawat tanamanmu hari ini dengan asisten AI.";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen w-full flex justify-center bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md min-h-screen bg-background px-5 pt-6 pb-10 flex flex-col justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 caption text-muted-foreground w-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
        " Kembali"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-2xl bg-primary text-primary-foreground mx-auto flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4", children: getStepTitle() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: getStepSubtitle() })
      ] }),
      step === "email" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleGoogle, disabled: googleLoading, className: "mt-6 min-h-[52px] w-full bg-card border border-border text-foreground rounded-xl font-medium flex items-center justify-center gap-3 active:bg-muted disabled:opacity-60 transition-colors cursor-pointer", children: [
          googleLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleIcon, {}),
          "Lanjut dengan Google"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caption text-muted-foreground", children: "atau pakai email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmailSubmit, className: "space-y-4 mt-4", children: [
        step !== "email" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 p-3.5 rounded-xl border border-border flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden pr-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold", children: "Email Pengguna" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: async () => {
            if (isGoogleLinking) {
              await supabase.auth.signOut();
            }
            setStep("email");
            setPassword("");
            setIsGoogleLinking(false);
          }, className: "caption text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3" }),
            " Ubah"
          ] })
        ] }),
        step === "email" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "kamu@email.com", className: "w-full h-12 pl-10 pr-3 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground" }) }),
        step === "register" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nama Lengkap", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Nama lengkap Anda", className: "w-full h-12 pl-10 pr-3 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground" }) }),
        step !== "email" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: step === "register" ? "Buat Kata Sandi" : "Kata Sandi", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-4" }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), placeholder: step === "register" ? "Minimal 6 karakter" : "Masukkan kata sandi", className: "w-full h-12 pl-10 pr-10 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground animate-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer z-10", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loading, className: "w-full min-h-[52px] bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-secondary disabled:opacity-60 transition-colors cursor-pointer", children: [
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-5 animate-spin" }),
          step === "email" && "Lanjut",
          step === "password" && "Masuk",
          step === "register" && "Daftar & Masuk"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center text-xs text-muted-foreground", children: "Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi Kebunin." })
  ] }) });
}
function Field({
  label,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caption font-medium text-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 relative", children: [
      icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: icon }),
      children
    ] })
  ] });
}
function GoogleIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "size-5", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M5.84 14.11A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" })
  ] });
}
export {
  AuthRoute as component
};
