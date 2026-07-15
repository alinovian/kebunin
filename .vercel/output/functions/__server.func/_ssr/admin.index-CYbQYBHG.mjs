import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAdminRole, A as AdminShell } from "./AdminShell-BY7Tjs1d.mjs";
import { a as getAdminStats, b as getProducts } from "./router-C0zimY-u.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { U as Users, t as Shield, L as Leaf, u as ShoppingBag } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./client-S4gzLm3e.mjs";
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
function AdminDashboard() {
  const {
    isSuperAdmin,
    userId
  } = useAdminRole();
  const [stats, setStats] = reactExports.useState({
    users: 0,
    admins: 0,
    superAdmins: 0,
    totalCoins: 0,
    avgStreak: 0,
    totalPlants: 0,
    totalProducts: 0
  });
  const [myProductsCount, setMyProductsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    (async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Gagal memuat statistik admin:", err);
      }
    })();
  }, []);
  reactExports.useEffect(() => {
    if (userId && !isSuperAdmin) {
      (async () => {
        try {
          const products = await getProducts();
          const myProducts = products.filter((p) => p.admin_id === userId);
          setMyProductsCount(myProducts.length);
        } catch (err) {
          console.error("Gagal memuat produk saya:", err);
        }
      })();
    }
  }, [userId, isSuperAdmin]);
  const superAdminCards = [{
    label: "Total Pengguna",
    value: stats.users,
    icon: Users,
    color: "text-primary bg-primary/10"
  }, {
    label: "Admin Toko Pertanian",
    value: stats.admins,
    icon: Shield,
    color: "text-secondary bg-secondary/10"
  }, {
    label: "Total Tanaman User",
    value: stats.totalPlants,
    icon: Leaf,
    color: "text-emerald-600 bg-emerald-500/10"
  }, {
    label: "Total Produk Toko",
    value: stats.totalProducts,
    icon: ShoppingBag,
    color: "text-warning bg-warning/10"
  }];
  const shopAdminCards = [{
    label: "Produk Toko Saya",
    value: myProductsCount,
    icon: ShoppingBag,
    color: "text-primary bg-primary/10"
  }];
  const cards = isSuperAdmin ? superAdminCards : shopAdminCards;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminShell, { title: "Dashboard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4", children: cards.map((c) => {
      const Icon = c.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-10 rounded-lg flex items-center justify-center ${c.color} mb-3`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: c.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "caption text-muted-foreground mt-1", children: c.label })
      ] }, c.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 bg-card border border-border rounded-xl p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold mb-2", children: "Selamat Datang di Admin Panel Kebunin 🌱" }),
      isSuperAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Sebagai ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Super Admin" }),
        ", Anda memiliki hak penuh untuk mengelola pengguna (koin, level, dll), admin toko pertanian (menambah/menghapus hak akses toko), memantau tanaman user yang terdaftar, serta mengelola semua produk/obat pertanian dari seluruh toko."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Sebagai ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Admin Toko Pertanian" }),
        ", Anda bertindak sebagai penyedia obat & nutrisi tanaman. Gunakan menu di samping untuk menambahkan obat baru atau mengelola inventaris produk Anda agar pengguna memiliki lebih banyak variasi obat untuk merawat tanaman mereka."
      ] })
    ] })
  ] });
}
export {
  AdminDashboard as component
};
