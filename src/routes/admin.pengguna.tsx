import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { Search, Edit, Trash2, Loader2, Shield, Camera, Leaf, Store, Copy } from "lucide-react";
import { getAdminProfiles, superAdminUpdateProfile, superAdminDeleteProfile } from "@/lib/api/db.functions";
import { useAdminRole } from "@/hooks/use-admin-role";
import { toast } from "sonner";

const initials = (name: string | null) => (name ? name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase() : "U");

export const Route = createFileRoute("/admin/pengguna")({
  ssr: false,
  head: () => ({ meta: [{ title: "Pengguna | Admin Kebunin" }] }),
  component: PenggunaPage,
});

type Profile = {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  coins: number;
  streak: number;
  level: number;
  xp: number;
  created_at: string;
  role: "super_admin" | "admin" | "user" | null;
};

function PenggunaPage() {
  const { isSuperAdmin, loading: roleLoading } = useAdminRole();
  const [rows, setRows] = useState<Profile[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  const copyToClipboard = (text: string | null, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin ke clipboard`);
  };

  // Edit Modal State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"user" | "admin" | "super_admin">("user");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);

  // Gamification States
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [q]);

  const filtered = rows.filter((r) =>
    (r.display_name ?? "").toLowerCase().includes(q.toLowerCase()) ||
    (r.email ?? "").toLowerCase().includes(q.toLowerCase()) ||
    r.id.toLowerCase().includes(q.toLowerCase())
  );

  const paginatedItems = (() => {
    if (pageSize === "all") return filtered;
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  })();

  const totalPages = pageSize === "all" ? 1 : Math.ceil(filtered.length / pageSize);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
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
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAdminProfiles();
      setRows(data as Profile[]);
    } catch (err) {
      console.error("Gagal memuat daftar pengguna dari MySQL:", err);
      toast.error("Gagal memuat daftar pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEditClick = (p: Profile) => {
    setEditingProfile(p);
    setDisplayName(p.display_name || "");
    setRole((p.role as any) || "user");
    setPassword("");
    setAvatarUrl(p.avatar_url || null);
    setCoins(p.coins || 0);
    setStreak(p.streak || 0);
    setLevel(p.level || 1);
    setXp(p.xp || 0);
    setEditDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
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
          xp,
        },
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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus pengguna "${name}" secara permanen? Semua data tanaman dan tugasnya akan terhapus!`)) return;

    try {
      await superAdminDeleteProfile({ data: { id } });
      toast.success("Pengguna berhasil dihapus");
      load();
    } catch (err) {
      console.error("Gagal menghapus pengguna:", err);
      toast.error("Gagal menghapus pengguna");
    }
  };



  if (roleLoading) {
    return (
      <AdminShell title="Pengguna">
        <div className="text-muted-foreground">Memuat...</div>
      </AdminShell>
    );
  }

  if (!isSuperAdmin) {
    return (
      <AdminShell title="Pengguna">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md mx-auto">
          <div className="size-12 mx-auto rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-3">
            <Shield className="size-6" />
          </div>
          <h2 className="font-semibold mb-1">Akses Ditolak</h2>
          <p className="text-sm text-muted-foreground">
            Hanya Super Admin yang dapat mengelola pengguna terdaftar.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Pengguna">
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama, email, atau ID..."
              className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Level / XP</th>
                <th className="px-4 py-3 font-medium">Koin / Streak</th>
                <th className="px-4 py-3 font-medium">Terdaftar</th>
                <th className="px-4 py-3 font-medium">UUID</th>
                {isSuperAdmin && <th className="px-4 py-3 font-medium w-36">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 8 : 7} className="p-8 text-center text-muted-foreground">
                    <Loader2 className="size-6 animate-spin mx-auto mb-2 text-primary" />
                    Memuat...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 8 : 7} className="p-8 text-center text-muted-foreground">
                    Belum ada pengguna
                  </td>
                </tr>
              ) : (
                paginatedItems.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.avatar_url ? (
                          <img
                            src={r.avatar_url}
                            alt=""
                            onClick={() => setZoomImageUrl(r.avatar_url)}
                            className="size-8 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {(r.display_name ?? "?").slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium">{r.display_name ?? "—"}</span>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => copyToClipboard(r.email, "Email")}
                      title="Klik untuk menyalin Email"
                    >
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="truncate">{r.email ?? "—"}</span>
                        {r.email && (
                          <Copy className="size-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        r.role === "super_admin"
                          ? "bg-primary/10 text-primary"
                          : r.role === "admin"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {r.role === "super_admin" ? "Super Admin" : r.role === "admin" ? "Admin Toko" : "User"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">Lv. {r.level || 1} ({r.xp || 0} XP)</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.coins || 0} / {r.streak || 0} 🔥</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                    <td
                      className="px-4 py-3 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => copyToClipboard(r.id, "UUID")}
                      title="Klik untuk menyalin UUID"
                    >
                      <div className="flex items-center gap-1.5 justify-between">
                        <span>{r.id.slice(0, 8)}…</span>
                        <Copy className="size-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
                      </div>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 py-3 flex gap-1">
                        <a
                          href={`/admin/tanaman?q=${encodeURIComponent(r.email || r.id)}`}
                          className="text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 p-1.5 rounded-lg border border-border flex items-center justify-center transition-all active:scale-[0.95]"
                          title="Kelola Tanaman & Jadwal Perawatan"
                        >
                          <Leaf className="size-4" />
                        </a>
                        {r.role === "admin" && (
                          <a
                            href={`/admin/toko?shopFilter=${encodeURIComponent(r.id)}`}
                            className="text-amber-600 hover:bg-amber-50 hover:border-amber-200 p-1.5 rounded-lg border border-border flex items-center justify-center transition-all active:scale-[0.95]"
                            title="Kelola Produk Toko"
                          >
                            <Store className="size-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleEditClick(r)}
                          className="text-foreground hover:bg-muted p-1.5 rounded-lg border border-border flex items-center justify-center transition-all active:scale-[0.95]"
                          title="Edit Profil"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.display_name ?? "User")}
                          className="text-destructive hover:bg-destructive/10 hover:border-destructive/20 p-1.5 rounded-lg border border-border flex items-center justify-center transition-all active:scale-[0.95]"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-card mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Tampilkan</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value;
                setPageSize(val === "all" ? "all" : Number(val));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 border border-border rounded-lg bg-card text-xs outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all cursor-pointer font-medium hover:bg-muted/50"
            >
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
              <option value={100}>100 Baris</option>
              <option value="all">Semua</option>
            </select>
            <span className="text-xs text-muted-foreground">
              dari {filtered.length} entri
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || pageSize === "all"}
              className="px-3 py-1.5 border border-border rounded-lg bg-card text-xs font-semibold text-foreground hover:bg-muted/50 hover:shadow-sm active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-sm"
            >
              Kembali
            </button>
            <span className="text-xs font-medium px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-foreground shadow-sm">
              Halaman {pageSize === "all" ? 1 : currentPage} dari {pageSize === "all" ? 1 : totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || pageSize === "all"}
              className="px-3 py-1.5 border border-border rounded-lg bg-card text-xs font-semibold text-foreground hover:bg-muted/50 hover:shadow-sm active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-sm"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editDialogOpen && editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold mb-1">Edit Profil Pengguna</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Ubah rincian nama tampilan dan wewenang pengguna.
            </p>

            <form onSubmit={handleSave} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
              {/* Visual Avatar Editor */}
              <div className="flex flex-col items-center gap-3 py-3 bg-muted/20 border border-border rounded-xl">
                <div className="relative group size-16">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Pratinjau Avatar"
                      className="size-16 rounded-full object-cover border-2 border-primary shadow-sm"
                    />
                  ) : (
                    <div className="size-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold border-2 border-dashed border-primary/30">
                      {initials(displayName)}
                    </div>
                  )}
                  {savingAvatar && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="admin-avatar-uploader"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                    disabled={savingAvatar}
                  />
                  <label
                    htmlFor="admin-avatar-uploader"
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Camera className="size-3.5" />
                    Ubah Foto
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl(null)}
                      className="px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="size-3.5" />
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Nama Tampilan</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Password Baru (Manual)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin diubah"
                  className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Gamification Editors */}
              <div className="grid grid-cols-2 gap-3 bg-muted/10 p-3 rounded-xl border border-border/50">
                <div>
                  <label className="text-xs font-semibold block mb-1">XP (Experience)</label>
                  <input
                    type="number"
                    value={xp}
                    onChange={(e) => setXp(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    min={0}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Level</label>
                  <input
                    type="number"
                    value={level}
                    onChange={(e) => setLevel(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Koin (Coins)</label>
                  <input
                    type="number"
                    value={coins}
                    onChange={(e) => setCoins(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    min={0}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Streak Harian</label>
                  <input
                    type="number"
                    value={streak}
                    onChange={(e) => setStreak(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    min={0}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Wewenang / Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="user">User Biasa</option>
                  <option value="admin">Admin Toko Pertanian</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditDialogOpen(false)}
                  className="flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2"
                >
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
       )}

      {/* Fullscreen Photo Lightbox / Zoom Modal */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
          onClick={() => setZoomImageUrl(null)}
        >
          <div
            className="w-[90vw] h-[90vw] max-w-[550px] max-h-[550px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header overlay */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3.5 flex items-center justify-between text-white z-10">
              <span className="font-semibold text-sm drop-shadow-sm">
                Foto Profil
              </span>
              <button
                type="button"
                onClick={() => setZoomImageUrl(null)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img
              src={zoomImageUrl}
              alt="Profil"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </AdminShell>
  );
}
