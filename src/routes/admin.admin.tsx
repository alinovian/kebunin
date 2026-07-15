import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { useAdminRole } from "@/hooks/use-admin-role";
import { Shield, Trash2, Plus, Loader2, Lock, Copy } from "lucide-react";
import { toast } from "sonner";
import { getAdminRolesList, addAdminRole, removeAdminRole } from "@/lib/api/db.functions";

export const Route = createFileRoute("/admin/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Kelola Admin | Admin Kebunin" }] }),
  component: KelolaAdminPage,
});

type RoleRow = {
  id: string;
  user_id: string;
  role: "admin" | "super_admin" | "user";
  created_at: string;
};

type Row = RoleRow & { display_name: string | null };

function KelolaAdminPage() {
  const { isSuperAdmin, userId, loading: roleLoading } = useAdminRole();
  const [rows, setRows] = useState<Row[]>([]);
  const [targetUserId, setTargetUserId] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "super_admin">("admin");
  const [busy, setBusy] = useState(false);

  const copyToClipboard = (text: string | null, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin ke clipboard`);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(10);

  const paginatedRows = (() => {
    if (pageSize === "all") return rows;
    const startIndex = (currentPage - 1) * pageSize;
    return rows.slice(startIndex, startIndex + pageSize);
  })();

  const totalPages = pageSize === "all" ? 1 : Math.ceil(rows.length / pageSize);

  const load = async () => {
    try {
      const data = await getAdminRolesList();
      setRows(data as Row[]);
    } catch (err) {
      console.error("Gagal memuat daftar admin dari MySQL:", err);
      toast.error("Gagal memuat daftar admin");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId.trim()) return;
    setBusy(true);
    try {
      await addAdminRole({
        data: { targetUserIdOrEmail: targetUserId.trim(), role: newRole }
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

  const removeRole = async (id: string) => {
    if (!confirm("Hapus role ini?")) return;
    try {
      await removeAdminRole({
        data: { roleId: id }
      });
      toast.success("Role dihapus");
      load();
    } catch (err) {
      console.error("Gagal menghapus role admin:", err);
      toast.error("Gagal menghapus role admin");
    }
  };

  if (roleLoading) {
    return (
      <AdminShell title="Kelola Admin Toko">
        <div className="text-muted-foreground">Memuat...</div>
      </AdminShell>
    );
  }

  if (!isSuperAdmin) {
    return (
      <AdminShell title="Kelola Admin Toko">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md mx-auto">
          <div className="size-12 mx-auto rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-3">
            <Lock className="size-6" />
          </div>
          <h2 className="font-semibold mb-1">Akses Ditolak</h2>
          <p className="text-sm text-muted-foreground">
            Hanya Super Admin yang dapat mengelola daftar admin toko.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Kelola Admin Toko">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Daftar Admin Toko & Sistem</h2>
            <span className="text-sm text-muted-foreground">{rows.length} admin</span>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">User ID</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Belum ada admin</td></tr>
                ) : (
                  paginatedRows.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{r.display_name ?? "—"}</td>
                      <td
                        className="px-4 py-3 text-muted-foreground font-mono text-xs hover:text-primary hover:bg-muted/30 transition-colors cursor-pointer group"
                        onClick={() => copyToClipboard(r.user_id, "User ID")}
                        title="Klik untuk menyalin User ID"
                      >
                        <div className="flex items-center gap-1.5 justify-between">
                          <span>{r.user_id.slice(0, 8)}…</span>
                          <Copy className="size-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.role === "super_admin"
                             ? "bg-primary/10 text-primary"
                             : "bg-secondary/10 text-secondary"
                        }`}>
                          <Shield className="size-3" />
                          {r.role === "super_admin" ? "Super Admin" : "Admin Toko"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {r.user_id !== userId && (
                          <button
                            onClick={() => removeRole(r.id)}
                            className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </td>
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
                dari {rows.length} entri
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

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold mb-1">Tambah Admin</h2>
          <p className="caption text-muted-foreground mb-4">
            Masukkan User ID atau Email pengguna.
          </p>
          <form onSubmit={addRole} className="space-y-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">User ID atau Email</label>
              <input
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="uuid atau email pengguna"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm font-mono"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as "admin" | "super_admin")}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="admin">Admin Toko</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Tambahkan
            </button>
          </form>
          <p className="caption text-muted-foreground mt-4">
            Tip: User ID dapat dilihat di halaman Pengguna (kolom UUID singkat).
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
