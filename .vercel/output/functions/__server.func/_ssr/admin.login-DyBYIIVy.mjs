import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-S4gzLm3e.mjs";
import { D as DesktopOnlyGate } from "./DesktopOnlyGate-BLKYD470.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Route$6, z as getAdminRoles, l as loginLocal } from "./router-C0zimY-u.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { L as Leaf, m as LoaderCircle, M as Mail, p as Lock, E as EyeOff, o as Eye } from "../_libs/lucide-react.mjs";
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
function AdminLogin() {
  const navigate = useNavigate();
  const search = Route$6.useSearch();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [googleLoading, setGoogleLoading] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (search.unauthorized === "1") {
      toast.error("Akun Anda tidak memiliki hak akses admin!");
    }
  }, [search.unauthorized]);
  reactExports.useEffect(() => {
    let active = true;
    const localUserStr = localStorage.getItem("kebunin_user");
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        if (localUser && localUser.id) {
          navigate({
            to: "/admin",
            replace: true
          });
          return;
        }
      } catch (e) {
      }
    }
    const checkGoogleUser = async (user) => {
      setGoogleLoading(true);
      try {
        const list = await getAdminRoles({
          data: {
            userId: user.id
          }
        });
        if (list.includes("admin") || list.includes("super_admin")) {
          const curUser = {
            id: user.id,
            email: user.email ?? null,
            display_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null
          };
          localStorage.setItem("kebunin_user", JSON.stringify(curUser));
          toast.success("Selamat datang, Admin 👋");
          navigate({
            to: "/admin",
            replace: true
          });
        } else {
          toast.error("Akun Anda tidak memiliki hak akses admin!");
          await supabase.auth.signOut();
          localStorage.removeItem("kebunin_user");
          setGoogleLoading(false);
        }
      } catch (err) {
        console.error("Gagal memeriksa role admin:", err);
        setGoogleLoading(false);
      }
    };
    supabase.auth.getUser().then(({
      data
    }) => {
      if (active && data.user) {
        checkGoogleUser(data.user);
      }
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
    const {
      error
    } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/login`
      }
    });
    if (error) {
      toast.error("Gagal masuk dengan Google", {
        description: error.message
      });
      setGoogleLoading(false);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const localUser = await loginLocal({
        data: {
          email,
          password
        }
      });
      const list = await getAdminRoles({
        data: {
          userId: localUser.id
        }
      });
      if (!list.includes("admin") && !list.includes("super_admin")) {
        setLoading(false);
        toast.error("Akun ini bukan admin");
        return;
      }
      await supabase.auth.signOut();
      localStorage.setItem("kebunin_user", JSON.stringify(localUser));
      toast.success("Selamat datang, Admin 👋");
      navigate({
        to: "/admin"
      });
    } catch (err) {
      setLoading(false);
      toast.error(err.message || "Gagal masuk");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-muted/30 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "Kebunin Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "caption text-muted-foreground", children: "Masuk untuk mengelola platform" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleGoogle, disabled: googleLoading, className: "mb-5 min-h-[46px] w-full bg-card border border-border text-foreground rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-muted/30 disabled:opacity-60 transition-colors cursor-pointer text-sm", children: [
      googleLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleIcon, {}),
      "Masuk dengan Google"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caption text-muted-foreground", children: "atau email admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-1.5", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", placeholder: "admin@kebunin.id" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-1.5", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full pl-10 pr-10 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", placeholder: "••••••••" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer z-10", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loading, className: "w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60", children: [
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
        "Masuk"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "caption text-muted-foreground mt-6 text-center", children: "Akses dashboard ini hanya untuk admin yang ditunjuk." })
  ] }) });
}
function GoogleIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "size-4", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M5.84 14.11A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(DesktopOnlyGate, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLogin, {}) });
export {
  SplitComponent as component
};
