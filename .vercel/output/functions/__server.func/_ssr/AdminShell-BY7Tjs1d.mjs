import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useLocation, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-S4gzLm3e.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { z as getAdminRoles } from "./router-C0zimY-u.mjs";
import { a7 as LayoutDashboard, U as Users, u as ShoppingBag, L as Leaf, t as Shield, a8 as LogOut } from "../_libs/lucide-react.mjs";
function useAdminRole() {
  const [roles, setRoles] = reactExports.useState([]);
  const [userId, setUserId] = reactExports.useState(null);
  const [email, setEmail] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        let curUserId = "";
        let curEmail = "";
        const localUserStr = typeof window !== "undefined" ? localStorage.getItem("kebunin_user") : null;
        if (localUserStr) {
          try {
            const localUser = JSON.parse(localUserStr);
            if (localUser && localUser.id) {
              curUserId = localUser.id;
              curEmail = localUser.email || "";
            }
          } catch (e) {
          }
        }
        if (!curUserId) {
          const { data: userData } = await supabase.auth.getUser();
          const user = userData.user;
          if (user) {
            curUserId = user.id;
            curEmail = user.email ?? "";
          }
        }
        if (!curUserId) {
          if (mounted) setLoading(false);
          return;
        }
        const list = await getAdminRoles({
          data: { userId: curUserId }
        });
        if (mounted) {
          setUserId(curUserId);
          setEmail(curEmail || null);
          setRoles(list);
          setLoading(false);
        }
      } catch (err) {
        console.error("Gagal memuat role admin dari MySQL:", err);
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = isSuperAdmin || roles.includes("admin");
  return { roles, isAdmin, isSuperAdmin, userId, email, loading };
}
const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pengguna", label: "Pengguna", icon: Users, superOnly: true },
  { to: "/admin/toko", label: "Kelola Toko", icon: ShoppingBag },
  { to: "/admin/tanaman", label: "Tanaman User", icon: Leaf, superOnly: true },
  { to: "/admin/admin", label: "Kelola Admin Toko", icon: Shield, superOnly: true }
];
function AdminShell({ children, title }) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen bg-muted/30 flex overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 bg-card border-r border-border flex flex-col h-full shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 h-[72px] border-b border-border flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold leading-tight", children: "Kebunin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "caption text-muted-foreground", children: "Admin Panel" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-3 space-y-1 overflow-y-auto", children: visible.map((item) => {
        const Icon = item.icon;
        const active = item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
              item.label
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-t border-border shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: email ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "caption text-muted-foreground", children: roles.includes("super_admin") ? "Super Admin" : roles.includes("admin") ? "Admin" : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleLogout,
            className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
              "Keluar"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col min-w-0 h-full overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border px-8 h-[72px] flex items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: title }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-8", children })
    ] })
  ] });
}
export {
  AdminShell as A,
  useAdminRole as u
};
