import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAdminRole, A as AdminShell } from "./AdminShell-BY7Tjs1d.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { d as getAdminRolesList, A as removeAdminRole, B as addAdminRole } from "./router-C0zimY-u.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { p as Lock, a5 as Copy, t as Shield, y as Trash2, m as LoaderCircle, P as Plus } from "../_libs/lucide-react.mjs";
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
function KelolaAdminPage() {
  const {
    isSuperAdmin,
    userId,
    loading: roleLoading
  } = useAdminRole();
  const [rows, setRows] = reactExports.useState([]);
  const [targetUserId, setTargetUserId] = reactExports.useState("");
  const [newRole, setNewRole] = reactExports.useState("admin");
  const [busy, setBusy] = reactExports.useState(false);
  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin ke clipboard`);
  };
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [pageSize, setPageSize] = reactExports.useState(10);
  const paginatedRows = (() => {
    if (pageSize === "all") return rows;
    const startIndex = (currentPage - 1) * pageSize;
    return rows.slice(startIndex, startIndex + pageSize);
  })();
  const totalPages = pageSize === "all" ? 1 : Math.ceil(rows.length / pageSize);
  const load = async () => {
    try {
      const data = await getAdminRolesList();
      setRows(data);
    } catch (err) {
      console.error("Gagal memuat daftar admin dari MySQL:", err);
      toast.error("Gagal memuat daftar admin");
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const addRole = async (e) => {
    e.preventDefault();
    if (!targetUserId.trim()) return;
    setBusy(true);
    try {
      await addAdminRole({
        data: {
          targetUserIdOrEmail: targetUserId.trim(),
          role: newRole
        }
      });
      toast.success("Role berhasil ditambahkan");
      setTargetUserId("");
      load();
    } catch (err) {
      console.error("Gagal menambahkan role admin:", err);
      toast.error("Gagal menambahkan role admin");
    } finally {
      setBusy(false);
    }
  };
  const removeRole = async (id) => {
    if (!confirm("Hapus role ini?")) return;
    try {
      await removeAdminRole({
        data: {
          roleId: id
        }
      });
      toast.success("Role dihapus");
      load();
    } catch (err) {
      console.error("Gagal menghapus role admin:", err);
      toast.error("Gagal menghapus role admin");
    }
  };
  if (roleLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { title: "Kelola Admin Toko", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Memuat..." }) });
  }
  if (!isSuperAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { title: "Kelola Admin Toko", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-8 text-center max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 mx-auto rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold mb-1", children: "Akses Ditolak" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Hanya Super Admin yang dapat mengelola daftar admin toko." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { title: "Kelola Admin Toko", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Daftar Admin Toko & Sistem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
          rows.length,
          " admin"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Nama" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "User ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium w-12" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "p-8 text-center text-muted-foreground", children: "Belum ada admin" }) }) : paginatedRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: r.display_name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-mono text-xs hover:text-primary hover:bg-muted/30 transition-colors cursor-pointer group", onClick: () => copyToClipboard(r.user_id, "User ID"), title: "Klik untuk menyalin User ID", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              r.user_id.slice(0, 8),
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${r.role === "super_admin" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-3" }),
            r.role === "super_admin" ? "Super Admin" : "Admin Toko"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: r.user_id !== userId && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeRole(r.id), className: "text-destructive hover:bg-destructive/10 p-1.5 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) })
        ] }, r.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-card mt-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Tampilkan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: pageSize, onChange: (e) => {
            const val = e.target.value;
            setPageSize(val === "all" ? "all" : Number(val));
            setCurrentPage(1);
          }, className: "px-2.5 py-1 border border-border rounded-lg bg-card text-xs outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all cursor-pointer font-medium hover:bg-muted/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 10, children: "10 Baris" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 25, children: "25 Baris" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 50, children: "50 Baris" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 100, children: "100 Baris" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Semua" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "dari ",
            rows.length,
            " entri"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)), disabled: currentPage === 1 || pageSize === "all", className: "px-3 py-1.5 border border-border rounded-lg bg-card text-xs font-semibold text-foreground hover:bg-muted/50 hover:shadow-sm active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-sm", children: "Kembali" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-foreground shadow-sm", children: [
            "Halaman ",
            pageSize === "all" ? 1 : currentPage,
            " dari ",
            pageSize === "all" ? 1 : totalPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)), disabled: currentPage === totalPages || pageSize === "all", className: "px-3 py-1.5 border border-border rounded-lg bg-card text-xs font-semibold text-foreground hover:bg-muted/50 hover:shadow-sm active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-sm", children: "Lanjut" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold mb-1", children: "Tambah Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "caption text-muted-foreground mb-4", children: "Masukkan User ID atau Email pengguna." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: addRole, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-1.5", children: "User ID atau Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: targetUserId, onChange: (e) => setTargetUserId(e.target.value), placeholder: "uuid atau email pengguna", className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm font-mono", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-1.5", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newRole, onChange: (e) => setNewRole(e.target.value), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Admin Toko" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "super_admin", children: "Super Admin" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: busy, className: "w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60", children: [
          busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
          "Tambahkan"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "caption text-muted-foreground mt-4", children: "Tip: User ID dapat dilihat di halaman Pengguna (kolom UUID singkat)." })
    ] })
  ] }) });
}
export {
  KelolaAdminPage as component
};
