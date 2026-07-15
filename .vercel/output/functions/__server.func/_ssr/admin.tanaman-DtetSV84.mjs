import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAdminRole, A as AdminShell } from "./AdminShell-BY7Tjs1d.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as getAllUserPlants, n as getPlantSuggestions, o as getPlantTasksAdmin, s as superAdminDeleteUserPlant, p as deletePlantSuggestion, q as updateUserTaskAdmin, t as deleteUserTaskAdmin, v as addUserTaskAdmin } from "./router-C0zimY-u.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { p as Lock, D as Search, m as LoaderCircle, L as Leaf, a1 as Calendar, y as Trash2, a2 as MessageSquare, X, a3 as Check, a4 as Pen, P as Plus } from "../_libs/lucide-react.mjs";
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
function calculatePlantAge(plantedAt) {
  if (!plantedAt) return 1;
  const plantedDate = new Date(plantedAt);
  const today = /* @__PURE__ */ new Date();
  const plantedDateOnly = new Date(plantedDate.getFullYear(), plantedDate.getMonth(), plantedDate.getDate());
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = todayDateOnly.getTime() - plantedDateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24)) + 1;
  return diffDays < 1 ? 1 : diffDays;
}
function KelolaTanamanPage() {
  const {
    isSuperAdmin,
    loading: roleLoading
  } = useAdminRole();
  const [plants, setPlants] = reactExports.useState([]);
  const [suggestions, setSuggestions] = reactExports.useState([]);
  const [activeTab, setActiveTab] = reactExports.useState("plants");
  const [loading, setLoading] = reactExports.useState(true);
  const [q, setQ] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("q") || "";
    }
    return "";
  });
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [deletingSuggestionId, setDeletingSuggestionId] = reactExports.useState(null);
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [pageSize, setPageSize] = reactExports.useState(10);
  reactExports.useEffect(() => {
    setCurrentPage(1);
  }, [q, activeTab]);
  const [selectedPlantForManage, setSelectedPlantForManage] = reactExports.useState(null);
  const [plantTasks, setPlantTasks] = reactExports.useState([]);
  const [loadingTasks, setLoadingTasks] = reactExports.useState(false);
  const [editingTaskId, setEditingTaskId] = reactExports.useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = reactExports.useState("");
  const [editingTaskTime, setEditingTaskTime] = reactExports.useState("");
  const [editingTaskIsDone, setEditingTaskIsDone] = reactExports.useState(false);
  const [newTaskTitle, setNewTaskTitle] = reactExports.useState("");
  const [newTaskTime, setNewTaskTime] = reactExports.useState("08:30");
  const [savingTask, setSavingTask] = reactExports.useState(false);
  const [zoomImageUrl, setZoomImageUrl] = reactExports.useState(null);
  const load = async (updatedPlantId) => {
    setLoading(true);
    try {
      const [plantsData, suggestionsData] = await Promise.all([getAllUserPlants(), getPlantSuggestions()]);
      setPlants(plantsData);
      setSuggestions(suggestionsData);
      if (selectedPlantForManage) {
        const targetId = updatedPlantId || selectedPlantForManage.id;
        const freshPlant = plantsData.find((p) => p.id === targetId);
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
  reactExports.useEffect(() => {
    load();
  }, []);
  const loadPlantTasks = async (plantId) => {
    setLoadingTasks(true);
    try {
      const data = await getPlantTasksAdmin({
        data: {
          plantId
        }
      });
      setPlantTasks(data);
    } catch (err) {
      console.error("Gagal memuat tugas tanaman:", err);
      toast.error("Gagal memuat jadwal perawatan");
    } finally {
      setLoadingTasks(false);
    }
  };
  const handleDeleteTask = async (taskId) => {
    if (!confirm("Hapus jadwal perawatan ini?")) return;
    try {
      await deleteUserTaskAdmin({
        data: {
          taskId
        }
      });
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
  const handleUpdateTask = async (taskId) => {
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
          isDone: editingTaskIsDone
        }
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
  const handleAddTask = async (e) => {
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
          time: newTaskTime
        }
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
  const handleDelete = async (id, name, owner) => {
    if (!confirm(`Hapus tanaman "${name}" milik ${owner}?`)) return;
    setDeletingId(id);
    try {
      await superAdminDeleteUserPlant({
        data: {
          id
        }
      });
      toast.success("Tanaman berhasil dihapus");
      load();
    } catch (err) {
      console.error("Gagal menghapus tanaman:", err);
      toast.error("Gagal menghapus tanaman");
    } finally {
      setDeletingId(null);
    }
  };
  const handleDeleteSuggestion = async (id, plantName) => {
    if (!confirm(`Hapus saran tanaman "${plantName}"?`)) return;
    setDeletingSuggestionId(id);
    try {
      await deletePlantSuggestion({
        data: {
          id
        }
      });
      toast.success("Saran berhasil dihapus");
      load();
    } catch (err) {
      console.error("Gagal menghapus saran:", err);
      toast.error("Gagal menghapus saran");
    } finally {
      setDeletingSuggestionId(null);
    }
  };
  const filteredPlants = plants.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || (p.owner_name ?? "").toLowerCase().includes(q.toLowerCase()) || (p.owner_email ?? "").toLowerCase().includes(q.toLowerCase()));
  const filteredSuggestions = suggestions.filter((s) => s.suggested_plant.toLowerCase().includes(q.toLowerCase()) || (s.suggestion_text ?? "").toLowerCase().includes(q.toLowerCase()) || (s.owner_name ?? "").toLowerCase().includes(q.toLowerCase()) || (s.owner_email ?? "").toLowerCase().includes(q.toLowerCase()));
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { title: "Tanaman User", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Memuat..." }) });
  }
  if (!isSuperAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { title: "Tanaman User", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-8 text-center max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 mx-auto rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold mb-1", children: "Akses Ditolak" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Hanya Super Admin yang dapat memantau dan mengelola seluruh tanaman user." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminShell, { title: "Tanaman & Saran User", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Pantau seluruh tanaman yang didaftarkan oleh pengguna serta saran pengembangan tanaman baru dari mereka." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 border-b border-border pb-px", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setActiveTab("plants");
            setQ("");
          }, className: `px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${activeTab === "plants" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
            "Daftar Tanaman User (",
            plants.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setActiveTab("suggestions");
            setQ("");
          }, className: `px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px flex items-center gap-1.5 ${activeTab === "suggestions" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
            "Saran Tanaman Baru",
            suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold", children: suggestions.length })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: activeTab === "plants" ? "Cari tanaman atau pemilik..." : "Cari saran, tanaman, atau pemilik...", className: "w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: activeTab === "plants" ? `${filteredPlants.length} tanaman ditemukan` : `${filteredSuggestions.length} saran ditemukan` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-x-auto", children: activeTab === "plants" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground w-20", children: "Foto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Tanaman" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Pemilik" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Umur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Didaftarkan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground w-20", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 7, className: "p-8 text-center text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin mx-auto mb-2 text-primary" }),
            "Memuat daftar tanaman..."
          ] }) }) : filteredPlants.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 7, className: "p-12 text-center text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-10 mx-auto mb-3 text-muted-foreground/50" }),
            "Tidak ada tanaman ditemukan."
          ] }) }) : paginatedPlants.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, onClick: () => setZoomImageUrl(p.image_url || null), className: "size-12 rounded-lg object-cover border border-border shadow-xs hover:scale-105 transition-transform cursor-pointer" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-lg bg-muted/40 flex items-center justify-center border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-5 text-muted-foreground/60" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-semibold text-foreground", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: p.owner_name ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: p.owner_email ?? "—" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 font-medium text-muted-foreground", children: [
              "Umur: ",
              calculatePlantAge(p.planted_at),
              " hari"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.status.toLowerCase() === "sehat" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : p.status.toLowerCase() === "sakit" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`, children: p.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground", children: new Date(p.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                setSelectedPlantForManage(p);
                loadPlantTasks(p.id);
              }, className: "text-primary hover:bg-accent-soft p-2 rounded-lg transition-colors border border-border", title: "Kelola Jadwal Perawatan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(p.id, p.name, p.owner_name ?? "User"), disabled: deletingId === p.id, className: "text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors border border-border", title: "Hapus Tanaman", children: deletingId === p.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
            ] })
          ] }, p.id)) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Tanaman" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Saran / Masukan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Pengirim" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Dikirim Pada" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground w-20", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 5, className: "p-8 text-center text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin mx-auto mb-2 text-primary" }),
            "Memuat daftar saran..."
          ] }) }) : filteredSuggestions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 5, className: "p-12 text-center text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-10 mx-auto mb-3 text-muted-foreground/50" }),
            "Tidak ada saran tanaman ditemukan."
          ] }) }) : paginatedSuggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0", children: s.suggested_plant === "Tomat" ? "🍅" : "🌶️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: s.suggested_plant })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 max-w-xs md:max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground leading-relaxed break-words whitespace-pre-wrap font-medium", children: s.suggestion_text ?? "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: s.owner_name ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.owner_email ?? "—" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground", children: new Date(s.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeleteSuggestion(s.id, s.suggested_plant), disabled: deletingSuggestionId === s.id, className: "text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors border border-border", title: "Hapus Saran", children: deletingSuggestionId === s.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) })
          ] }, s.id)) })
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
              currentCount,
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
      selectedPlantForManage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border flex items-center justify-between bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-5 text-primary" }),
              "Kelola Jadwal Perawatan"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              "Tanaman: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: selectedPlantForManage.name }),
              " • Pemilik: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                selectedPlantForManage.owner_name,
                " (",
                selectedPlantForManage.owner_email,
                ")"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setSelectedPlantForManage(null);
            setEditingTaskId(null);
          }, className: "p-1.5 hover:bg-muted rounded-lg border border-border transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-foreground", children: "Daftar Jadwal Perawatan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-semibold px-2 py-0.5 rounded-full ${selectedPlantForManage.status.toLowerCase() === "sehat" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : selectedPlantForManage.status.toLowerCase() === "sakit" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`, children: [
              "Status: ",
              selectedPlantForManage.status
            ] })
          ] }),
          loadingTasks ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 text-center text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin mx-auto mb-2 text-primary" }),
            "Memuat jadwal perawatan tanaman..."
          ] }) : plantTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-8 mx-auto mb-2 text-muted-foreground/40" }),
            "Belum ada jadwal perawatan harian."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: plantTasks.map((t) => {
            const isEditing = editingTaskId === t.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${t.curative ? "border-accent/40 bg-accent-soft/30" : "border-border bg-card"}`, children: [
              isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: editingTaskTitle, onChange: (e) => setEditingTaskTitle(e.target.value), className: "flex-1 px-3 py-1.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-1 focus:ring-primary", placeholder: "Judul Jadwal" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: editingTaskTime, onChange: (e) => setEditingTaskTime(e.target.value), className: "w-24 px-3 py-1.5 border border-border rounded-lg bg-background text-sm text-center outline-none focus:ring-1 focus:ring-primary", placeholder: "08:00" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 text-xs font-semibold cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: editingTaskIsDone, onChange: (e) => setEditingTaskIsDone(e.target.checked), className: "rounded border-border text-primary outline-none focus:ring-0 focus:ring-offset-0" }),
                  "Tandai Selesai"
                ] }) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded", children: t.time }),
                  t.curative ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-accent-soft text-primary px-1.5 rounded font-medium", children: "Kuratif AI" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-muted text-muted-foreground px-1.5 rounded font-medium", children: "Rutin" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 rounded font-semibold ${t.is_done ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`, children: t.is_done ? "Selesai" : "Belum" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mt-1.5 break-words", children: t.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 self-end md:self-center shrink-0", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleUpdateTask(t.id), disabled: savingTask, className: "p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors border border-emerald-600 cursor-pointer", title: "Simpan Perubahan", children: savingTask ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingTaskId(null), disabled: savingTask, className: "p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors border border-border cursor-pointer", title: "Batal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                  setEditingTaskId(t.id);
                  setEditingTaskTitle(t.title);
                  setEditingTaskTime(t.time);
                  setEditingTaskIsDone(!!t.is_done);
                }, className: "p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border cursor-pointer", title: "Sunting Jadwal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeleteTask(t.id), className: "p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-border cursor-pointer", title: "Hapus Jadwal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) })
            ] }, t.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddTask, className: "p-5 border-t border-border bg-muted/30 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h5", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
            "Tambah Jadwal Perawatan Baru"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: newTaskTitle, onChange: (e) => setNewTaskTitle(e.target.value), className: "flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", placeholder: "Contoh: Semprot larutan fungisida (Hari ke-1/5)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: newTaskTime, onChange: (e) => setNewTaskTime(e.target.value), className: "w-24 px-3 py-2 border border-border rounded-lg bg-background text-sm text-center outline-none focus:ring-2 focus:ring-primary/20", placeholder: "08:30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: savingTask, className: "px-4 py-2 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg text-sm transition-colors cursor-pointer shrink-0", children: savingTask ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mx-auto" }) : "Tambah" })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    zoomImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300", onClick: () => setZoomImageUrl(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[90vw] h-[90vw] max-w-[550px] max-h-[550px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3.5 flex items-center justify-between text-white z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm drop-shadow-sm", children: "Foto Tanaman User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setZoomImageUrl(null), className: "p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4.5 w-4.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: zoomImageUrl, alt: "Tanaman", className: "w-full h-full object-cover" })
    ] }) })
  ] });
}
export {
  KelolaTanamanPage as component
};
