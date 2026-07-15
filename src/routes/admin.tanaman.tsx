import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { useAdminRole } from "@/hooks/use-admin-role";
import { Leaf, Search, Trash2, Loader2, Lock, MessageSquare, Calendar, Edit2, Check, X, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  getAllUserPlants,
  superAdminDeleteUserPlant,
  getPlantSuggestions,
  deletePlantSuggestion,
  getPlantTasksAdmin,
  deleteUserTaskAdmin,
  updateUserTaskAdmin,
  addUserTaskAdmin,
} from "@/lib/api/db.functions";

export const Route = createFileRoute("/admin/tanaman")({
  ssr: false,
  head: () => ({ meta: [{ title: "Tanaman User | Admin Kebunin" }] }),
  component: KelolaTanamanPage,
});

type UserPlant = {
  id: string;
  user_id: string;
  name: string;
  status: string;
  days: number;
  created_at: string;
  owner_name: string | null;
  owner_email: string | null;
  planted_at?: string;
  image_url?: string | null;
};

function calculatePlantAge(plantedAt: string | Date | null | undefined): number {
  if (!plantedAt) return 1;
  const plantedDate = new Date(plantedAt);
  const today = new Date();
  const plantedDateOnly = new Date(
    plantedDate.getFullYear(),
    plantedDate.getMonth(),
    plantedDate.getDate(),
  );
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = todayDateOnly.getTime() - plantedDateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays < 1 ? 1 : diffDays;
}

type PlantSuggestion = {
  id: string;
  user_id: string;
  suggested_plant: string;
  suggestion_text: string | null;
  created_at: string;
  owner_name: string | null;
  owner_email: string | null;
};

function KelolaTanamanPage() {
  const { isSuperAdmin, loading: roleLoading } = useAdminRole();
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [suggestions, setSuggestions] = useState<PlantSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<"plants" | "suggestions">("plants");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("q") || "";
    }
    return "";
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingSuggestionId, setDeletingSuggestionId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [q, activeTab]);

  // States for Plant Schedule/Disease management
  const [selectedPlantForManage, setSelectedPlantForManage] = useState<UserPlant | null>(null);
  const [plantTasks, setPlantTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingTaskTime, setEditingTaskTime] = useState("");
  const [editingTaskIsDone, setEditingTaskIsDone] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("08:30");
  const [savingTask, setSavingTask] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  const load = async (updatedPlantId?: string) => {
    setLoading(true);
    try {
      const [plantsData, suggestionsData] = await Promise.all([
        getAllUserPlants(),
        getPlantSuggestions(),
      ]);
      setPlants(plantsData as UserPlant[]);
      setSuggestions(suggestionsData as PlantSuggestion[]);

      if (selectedPlantForManage) {
        const targetId = updatedPlantId || selectedPlantForManage.id;
        const freshPlant = (plantsData as UserPlant[]).find((p) => p.id === targetId);
        if (freshPlant) {
          setSelectedPlantForManage(freshPlant);
        }
      }
    } catch (err) {
      console.error("Gagal memuat data tanaman user:", err);
      toast.error("Gagal memuat daftar tanaman atau saran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const loadPlantTasks = async (plantId: string) => {
    setLoadingTasks(true);
    try {
      const data = await getPlantTasksAdmin({ data: { plantId } });
      setPlantTasks(data as any[]);
    } catch (err) {
      console.error("Gagal memuat tugas tanaman:", err);
      toast.error("Gagal memuat jadwal perawatan");
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Hapus jadwal perawatan ini?")) return;
    try {
      await deleteUserTaskAdmin({ data: { taskId } });
      toast.success("Jadwal perawatan berhasil dihapus");
      if (selectedPlantForManage) {
        await loadPlantTasks(selectedPlantForManage.id);
        await load(selectedPlantForManage.id);
      }
    } catch (err) {
      console.error("Gagal menghapus tugas:", err);
      toast.error("Gagal menghapus jadwal");
    }
  };

  const handleUpdateTask = async (taskId: string) => {
    if (!editingTaskTitle.trim()) {
      toast.error("Judul perawatan tidak boleh kosong!");
      return;
    }
    setSavingTask(true);
    try {
      await updateUserTaskAdmin({
        data: {
          taskId,
          title: editingTaskTitle,
          time: editingTaskTime,
          isDone: editingTaskIsDone,
        },
      });
      toast.success("Jadwal perawatan berhasil diperbarui");
      setEditingTaskId(null);
      if (selectedPlantForManage) {
        await loadPlantTasks(selectedPlantForManage.id);
        await load(selectedPlantForManage.id);
      }
    } catch (err) {
      console.error("Gagal memperbarui tugas:", err);
      toast.error("Gagal memperbarui jadwal");
    } finally {
      setSavingTask(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlantForManage) return;
    if (!newTaskTitle.trim()) {
      toast.error("Judul perawatan tidak boleh kosong!");
      return;
    }
    setSavingTask(true);
    try {
      await addUserTaskAdmin({
        data: {
          userId: selectedPlantForManage.user_id,
          plantId: selectedPlantForManage.id,
          title: newTaskTitle,
          time: newTaskTime,
        },
      });
      toast.success("Jadwal perawatan baru ditambahkan");
      setNewTaskTitle("");
      setNewTaskTime("08:30");
      await loadPlantTasks(selectedPlantForManage.id);
      await load(selectedPlantForManage.id);
    } catch (err) {
      console.error("Gagal menambahkan tugas:", err);
      toast.error("Gagal menambahkan jadwal");
    } finally {
      setSavingTask(false);
    }
  };

  const handleDelete = async (id: string, name: string, owner: string) => {
    if (!confirm(`Hapus tanaman "${name}" milik ${owner}?`)) return;
    setDeletingId(id);
    try {
      await superAdminDeleteUserPlant({ data: { id } });
      toast.success("Tanaman berhasil dihapus");
      load();
    } catch (err) {
      console.error("Gagal menghapus tanaman:", err);
      toast.error("Gagal menghapus tanaman");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteSuggestion = async (id: string, plantName: string) => {
    if (!confirm(`Hapus saran tanaman "${plantName}"?`)) return;
    setDeletingSuggestionId(id);
    try {
      await deletePlantSuggestion({ data: { id } });
      toast.success("Saran berhasil dihapus");
      load();
    } catch (err) {
      console.error("Gagal menghapus saran:", err);
      toast.error("Gagal menghapus saran");
    } finally {
      setDeletingSuggestionId(null);
    }
  };

  const filteredPlants = plants.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.owner_name ?? "").toLowerCase().includes(q.toLowerCase()) ||
      (p.owner_email ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.suggested_plant.toLowerCase().includes(q.toLowerCase()) ||
      (s.suggestion_text ?? "").toLowerCase().includes(q.toLowerCase()) ||
      (s.owner_name ?? "").toLowerCase().includes(q.toLowerCase()) ||
      (s.owner_email ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  const paginatedPlants = (() => {
    if (pageSize === "all") return filteredPlants;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPlants.slice(startIndex, startIndex + pageSize);
  })();

  const paginatedSuggestions = (() => {
    if (pageSize === "all") return filteredSuggestions;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSuggestions.slice(startIndex, startIndex + pageSize);
  })();

  const totalPages = (() => {
    const totalCount = activeTab === "plants" ? filteredPlants.length : filteredSuggestions.length;
    return pageSize === "all" ? 1 : Math.ceil(totalCount / pageSize);
  })();

  const currentCount = activeTab === "plants" ? filteredPlants.length : filteredSuggestions.length;

  if (roleLoading) {
    return (
      <AdminShell title="Tanaman User">
        <div className="text-muted-foreground">Memuat...</div>
      </AdminShell>
    );
  }

  if (!isSuperAdmin) {
    return (
      <AdminShell title="Tanaman User">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md mx-auto">
          <div className="size-12 mx-auto rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-3">
            <Lock className="size-6" />
          </div>
          <h2 className="font-semibold mb-1">Akses Ditolak</h2>
          <p className="text-sm text-muted-foreground">
            Hanya Super Admin yang dapat memantau dan mengelola seluruh tanaman user.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Tanaman & Saran User">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Pantau seluruh tanaman yang didaftarkan oleh pengguna serta saran pengembangan tanaman
            baru dari mereka.
          </p>

          <div className="flex gap-2 border-b border-border pb-px">
            <button
              onClick={() => {
                setActiveTab("plants");
                setQ("");
              }}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === "plants"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Daftar Tanaman User ({plants.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("suggestions");
                setQ("");
              }}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px flex items-center gap-1.5 ${
                activeTab === "suggestions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Saran Tanaman Baru
              {suggestions.length > 0 && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                  {suggestions.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter and Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={
                  activeTab === "plants"
                    ? "Cari tanaman atau pemilik..."
                    : "Cari saran, tanaman, atau pemilik..."
                }
                className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {activeTab === "plants"
                ? `${filteredPlants.length} tanaman ditemukan`
                : `${filteredSuggestions.length} saran ditemukan`}
            </p>
          </div>

          <div className="flex-1 overflow-x-auto">
            {activeTab === "plants" ? (
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-6 py-4 font-medium text-muted-foreground w-20">Foto</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground">Tanaman</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground">Pemilik</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground">Umur</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground">Didaftarkan</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        <Loader2 className="size-6 animate-spin mx-auto mb-2 text-primary" />
                        Memuat daftar tanaman...
                      </td>
                    </tr>
                  ) : filteredPlants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-muted-foreground">
                        <Leaf className="size-10 mx-auto mb-3 text-muted-foreground/50" />
                        Tidak ada tanaman ditemukan.
                      </td>
                    </tr>
                  ) : (
                    paginatedPlants.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              onClick={() => setZoomImageUrl(p.image_url || null)}
                              className="size-12 rounded-lg object-cover border border-border shadow-xs hover:scale-105 transition-transform cursor-pointer"
                            />
                          ) : (
                            <div className="size-12 rounded-lg bg-muted/40 flex items-center justify-center border border-border">
                              <Leaf className="size-5 text-muted-foreground/60" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {p.name}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">{p.owner_name ?? "—"}</p>
                            <p className="text-xs text-muted-foreground">{p.owner_email ?? "—"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-muted-foreground">
                          Umur: {calculatePlantAge(p.planted_at)} hari
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              p.status.toLowerCase() === "sehat"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : p.status.toLowerCase() === "sakit"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-warning/10 text-warning"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedPlantForManage(p);
                              loadPlantTasks(p.id);
                            }}
                            className="text-primary hover:bg-accent-soft p-2 rounded-lg transition-colors border border-border"
                            title="Kelola Jadwal Perawatan"
                          >
                            <Calendar className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name, p.owner_name ?? "User")}
                            disabled={deletingId === p.id}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors border border-border"
                            title="Hapus Tanaman"
                          >
                            {deletingId === p.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-6 py-4 font-medium text-muted-foreground">Tanaman</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground">Saran / Masukan</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground">Pengirim</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground">Dikirim Pada</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        <Loader2 className="size-6 animate-spin mx-auto mb-2 text-primary" />
                        Memuat daftar saran...
                      </td>
                    </tr>
                  ) : filteredSuggestions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-muted-foreground">
                        <MessageSquare className="size-10 mx-auto mb-3 text-muted-foreground/50" />
                        Tidak ada saran tanaman ditemukan.
                      </td>
                    </tr>
                  ) : (
                    paginatedSuggestions.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base shrink-0">
                              {s.suggested_plant === "Tomat" ? "🍅" : "🌶️"}
                            </span>
                            <p className="font-semibold text-foreground">{s.suggested_plant}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs md:max-w-md">
                          <p className="text-foreground leading-relaxed break-words whitespace-pre-wrap font-medium">
                            {s.suggestion_text ?? "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">{s.owner_name ?? "—"}</p>
                            <p className="text-xs text-muted-foreground">{s.owner_email ?? "—"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(s.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteSuggestion(s.id, s.suggested_plant)}
                            disabled={deletingSuggestionId === s.id}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors border border-border"
                            title="Hapus Saran"
                          >
                            {deletingSuggestionId === s.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
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
                dari {currentCount} entri
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

        {/* Modal Kelola Jadwal Perawatan */}
        {selectedPlantForManage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 p-4">
            <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-muted/40">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Calendar className="size-5 text-primary" />
                    Kelola Jadwal Perawatan
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tanaman: <span className="font-semibold text-foreground">{selectedPlantForManage.name}</span> • 
                    Pemilik: <span className="font-semibold text-foreground">{selectedPlantForManage.owner_name} ({selectedPlantForManage.owner_email})</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPlantForManage(null);
                    setEditingTaskId(null);
                  }}
                  className="p-1.5 hover:bg-muted rounded-lg border border-border transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body / Tasks List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">Daftar Jadwal Perawatan</h4>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    selectedPlantForManage.status.toLowerCase() === "sehat"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : selectedPlantForManage.status.toLowerCase() === "sakit"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-warning/10 text-warning"
                  }`}>
                    Status: {selectedPlantForManage.status}
                  </span>
                </div>

                {loadingTasks ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Loader2 className="size-6 animate-spin mx-auto mb-2 text-primary" />
                    Memuat jadwal perawatan tanaman...
                  </div>
                ) : plantTasks.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20">
                    <Leaf className="size-8 mx-auto mb-2 text-muted-foreground/40" />
                    Belum ada jadwal perawatan harian.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {plantTasks.map((t) => {
                      const isEditing = editingTaskId === t.id;
                      return (
                        <div
                          key={t.id}
                          className={`p-3 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                            t.curative ? "border-accent/40 bg-accent-soft/30" : "border-border bg-card"
                          }`}
                        >
                          {isEditing ? (
                            <div className="flex-1 space-y-3">
                              <div className="flex flex-col md:flex-row gap-2">
                                <input
                                  type="text"
                                  value={editingTaskTitle}
                                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                                  className="flex-1 px-3 py-1.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
                                  placeholder="Judul Jadwal"
                                />
                                <input
                                  type="text"
                                  value={editingTaskTime}
                                  onChange={(e) => setEditingTaskTime(e.target.value)}
                                  className="w-24 px-3 py-1.5 border border-border rounded-lg bg-background text-sm text-center outline-none focus:ring-1 focus:ring-primary"
                                  placeholder="08:00"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editingTaskIsDone}
                                    onChange={(e) => setEditingTaskIsDone(e.target.checked)}
                                    className="rounded border-border text-primary outline-none focus:ring-0 focus:ring-offset-0"
                                  />
                                  Tandai Selesai
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                  {t.time}
                                </span>
                                {t.curative ? (
                                  <span className="text-[10px] bg-accent-soft text-primary px-1.5 rounded font-medium">
                                    Kuratif AI
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 rounded font-medium">
                                    Rutin
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] px-1.5 rounded font-semibold ${
                                    t.is_done
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {t.is_done ? "Selesai" : "Belum"}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-foreground mt-1.5 break-words">
                                {t.title}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleUpdateTask(t.id)}
                                  disabled={savingTask}
                                  className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors border border-emerald-600 cursor-pointer"
                                  title="Simpan Perubahan"
                                >
                                  {savingTask ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <Check className="size-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => setEditingTaskId(null)}
                                  disabled={savingTask}
                                  className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors border border-border cursor-pointer"
                                  title="Batal"
                                >
                                  <X className="size-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingTaskId(t.id);
                                    setEditingTaskTitle(t.title);
                                    setEditingTaskTime(t.time);
                                    setEditingTaskIsDone(!!t.is_done);
                                  }}
                                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border cursor-pointer"
                                  title="Sunting Jadwal"
                                >
                                  <Edit2 className="size-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(t.id)}
                                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-border cursor-pointer"
                                  title="Hapus Jadwal"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer / Add Task Form */}
              <form onSubmit={handleAddTask} className="p-5 border-t border-border bg-muted/30 space-y-3">
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="size-3.5" />
                  Tambah Jadwal Perawatan Baru
                </h5>
                <div className="flex flex-col md:flex-row gap-2.5">
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: Semprot larutan fungisida (Hari ke-1/5)"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      className="w-24 px-3 py-2 border border-border rounded-lg bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="08:30"
                    />
                    <button
                      type="submit"
                      disabled={savingTask}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg text-sm transition-colors cursor-pointer shrink-0"
                    >
                      {savingTask ? (
                        <Loader2 className="size-4 animate-spin mx-auto" />
                      ) : (
                        "Tambah"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

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
                Foto Tanaman User
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
              alt="Tanaman"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </AdminShell>
  );
}