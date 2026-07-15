import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAdminRole, A as AdminShell } from "./AdminShell-BY7Tjs1d.mjs";
import { w as getAdminProfiles, x as superAdminDeleteProfile, y as superAdminUpdateProfile } from "./router-C0zimY-u.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { t as Shield, D as Search, m as LoaderCircle, a5 as Copy, L as Leaf, d as Store, J as SquarePen, y as Trash2, h as Camera } from "../_libs/lucide-react.mjs";
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
const initials = (name) => name ? name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "U";
function PenggunaPage() {
  const {
    isSuperAdmin,
    loading: roleLoading
  } = useAdminRole();
  const [rows, setRows] = reactExports.useState([]);
  const [q, setQ] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [busy, setBusy] = reactExports.useState(false);
  const [zoomImageUrl, setZoomImageUrl] = reactExports.useState(null);
  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin ke clipboard`);
  };
  const [editDialogOpen, setEditDialogOpen] = reactExports.useState(false);
  const [editingProfile, setEditingProfile] = reactExports.useState(null);
  const [displayName, setDisplayName] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("user");
  const [password, setPassword] = reactExports.useState("");
  const [avatarUrl, setAvatarUrl] = reactExports.useState(null);
  const [savingAvatar, setSavingAvatar] = reactExports.useState(false);
  const [coins, setCoins] = reactExports.useState(0);
  const [streak, setStreak] = reactExports.useState(0);
  const [level, setLevel] = reactExports.useState(1);
  const [xp, setXp] = reactExports.useState(0);
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [pageSize, setPageSize] = reactExports.useState(10);
  reactExports.useEffect(() => {
    setCurrentPage(1);
  }, [q]);
  const filtered = rows.filter((r) => (r.display_name ?? "").toLowerCase().includes(q.toLowerCase()) || (r.email ?? "").toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase()));
  const paginatedItems = (() => {
    if (pageSize === "all") return filtered;
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  })();
  const totalPages = pageSize === "all" ? 1 : Math.ceil(filtered.length / pageSize);
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSavingAvatar(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            toast.error("Gagal memproses gambar");
            setSavingAvatar(false);
            return;
          }
          const MAX_DIM = 800;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round(height * MAX_DIM / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round(width * MAX_DIM / height);
              height = MAX_DIM;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setAvatarUrl(compressedDataUrl);
          toast.success("Foto profil terpilih! Klik Simpan untuk memperbarui.");
        } catch (err) {
          console.error("Gagal memproses gambar:", err);
          toast.error("Gagal memproses gambar");
        } finally {
          setSavingAvatar(false);
        }
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };
  const load = async () => {
    setLoading(true);
    try {
      const data = await getAdminProfiles();
      setRows(data);
    } catch (err) {
      console.error("Gagal memuat daftar pengguna dari MySQL:", err);
      toast.error("Gagal memuat daftar pengguna");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const handleEditClick = (p) => {
    setEditingProfile(p);
    setDisplayName(p.display_name || "");
    setRole(p.role || "user");
    setPassword("");
    setAvatarUrl(p.avatar_url || null);
    setCoins(p.coins || 0);
    setStreak(p.streak || 0);
    setLevel(p.level || 1);
    setXp(p.xp || 0);
    setEditDialogOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingProfile) return;
    setBusy(true);
    try {
      await superAdminUpdateProfile({
        data: {
          id: editingProfile.id,
          display_name: displayName.trim() || "User",
          role,
          password: password.trim() || null,
          avatar_url: avatarUrl || null,
          coins,
          streak,
          level,
          xp
        }
      });
      toast.success("Profil pengguna berhasil diperbarui");
      setEditDialogOpen(false);
      load();
    } catch (err) {
      console.error("Gagal memperbarui profil:", err);
      toast.error("Gagal memperbarui profil");
    } finally {
      setBusy(false);
    }
  };
  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus pengguna "${name}" secara permanen? Semua data tanaman dan tugasnya akan terhapus!`)) return;
    try {
      await superAdminDeleteProfile({
        data: {
          id
        }
      });
      toast.success("Pengguna berhasil dihapus");
      load();
    } catch (err) {
      console.error("Gagal menghapus pengguna:", err);
      toast.error("Gagal menghapus pengguna");
    }
  };
  if (roleLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { title: "Pengguna", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Memuat..." }) });
  }
  if (!isSuperAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { title: "Pengguna", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-8 text-center max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 mx-auto rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold mb-1", children: "Akses Ditolak" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Hanya Super Admin yang dapat mengelola pengguna terdaftar." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminShell, { title: "Pengguna", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari nama, email, atau ID...", className: "w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Nama" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Level / XP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Koin / Streak" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Terdaftar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "UUID" }),
          isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium w-36", children: "Aksi" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: isSuperAdmin ? 8 : 7, className: "p-8 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin mx-auto mb-2 text-primary" }),
          "Memuat..."
        ] }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: isSuperAdmin ? 8 : 7, className: "p-8 text-center text-muted-foreground", children: "Belum ada pengguna" }) }) : paginatedItems.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/5 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            r.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.avatar_url, alt: "", onClick: () => setZoomImageUrl(r.avatar_url), className: "size-8 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold", children: (r.display_name ?? "?").slice(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.display_name ?? "—" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors cursor-pointer group", onClick: () => copyToClipboard(r.email, "Email"), title: "Klik untuk menyalin Email", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: r.email ?? "—" }),
            r.email && /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${r.role === "super_admin" ? "bg-primary/10 text-primary" : r.role === "admin" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`, children: r.role === "super_admin" ? "Super Admin" : r.role === "admin" ? "Admin Toko" : "User" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [
            "Lv. ",
            r.level || 1,
            " (",
            r.xp || 0,
            " XP)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [
            r.coins || 0,
            " / ",
            r.streak || 0,
            " 🔥"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors cursor-pointer group", onClick: () => copyToClipboard(r.id, "UUID"), title: "Klik untuk menyalin UUID", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              r.id.slice(0, 8),
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" })
          ] }) }),
          isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/admin/tanaman?q=${encodeURIComponent(r.email || r.id)}`, className: "text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 p-1.5 rounded-lg border border-border flex items-center justify-center transition-all active:scale-[0.95]", title: "Kelola Tanaman & Jadwal Perawatan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-4" }) }),
            r.role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/admin/toko?shopFilter=${encodeURIComponent(r.id)}`, className: "text-amber-600 hover:bg-amber-50 hover:border-amber-200 p-1.5 rounded-lg border border-border flex items-center justify-center transition-all active:scale-[0.95]", title: "Kelola Produk Toko", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleEditClick(r), className: "text-foreground hover:bg-muted p-1.5 rounded-lg border border-border flex items-center justify-center transition-all active:scale-[0.95]", title: "Edit Profil", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(r.id, r.display_name ?? "User"), className: "text-destructive hover:bg-destructive/10 hover:border-destructive/20 p-1.5 rounded-lg border border-border flex items-center justify-center transition-all active:scale-[0.95]", title: "Hapus Pengguna", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
          ] })
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
            filtered.length,
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
    editDialogOpen && editingProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-1", children: "Edit Profil Pengguna" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Ubah rincian nama tampilan dan wewenang pengguna." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-3.5 max-h-[75vh] overflow-y-auto pr-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 py-3 bg-muted/20 border border-border rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group size-16", children: [
            avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: avatarUrl, alt: "Pratinjau Avatar", className: "size-16 rounded-full object-cover border-2 border-primary shadow-sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold border-2 border-dashed border-primary/30", children: initials(displayName) }),
            savingAvatar && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", id: "admin-avatar-uploader", accept: "image/*", onChange: handleAvatarFileChange, className: "hidden", disabled: savingAvatar }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "admin-avatar-uploader", className: "px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-3.5" }),
              "Ubah Foto"
            ] }),
            avatarUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAvatarUrl(null), className: "px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }),
              "Hapus"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Nama Tampilan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: displayName, onChange: (e) => setDisplayName(e.target.value), className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Password Baru (Manual)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Kosongkan jika tidak ingin diubah", className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 bg-muted/10 p-3 rounded-xl border border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "XP (Experience)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: xp, onChange: (e) => setXp(Math.max(0, parseInt(e.target.value) || 0)), className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", min: 0, required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Level" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: level, onChange: (e) => setLevel(Math.max(1, parseInt(e.target.value) || 1)), className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", min: 1, required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Koin (Coins)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: coins, onChange: (e) => setCoins(Math.max(0, parseInt(e.target.value) || 0)), className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", min: 0, required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Streak Harian" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: streak, onChange: (e) => setStreak(Math.max(0, parseInt(e.target.value) || 0)), className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", min: 0, required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Wewenang / Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: role, onChange: (e) => setRole(e.target.value), className: "w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "user", children: "User Biasa" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Admin Toko Pertanian" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "super_admin", children: "Super Admin" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEditDialogOpen(false), className: "flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors", children: "Batal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: busy, className: "flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2", children: [
            busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
            "Simpan"
          ] })
        ] })
      ] })
    ] }) }),
    zoomImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300", onClick: () => setZoomImageUrl(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[90vw] h-[90vw] max-w-[550px] max-h-[550px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3.5 flex items-center justify-between text-white z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm drop-shadow-sm", children: "Foto Profil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setZoomImageUrl(null), className: "p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4.5 w-4.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: zoomImageUrl, alt: "Profil", className: "w-full h-full object-cover" })
    ] }) })
  ] });
}
export {
  PenggunaPage as component
};
