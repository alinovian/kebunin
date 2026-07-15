import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-Qd23l6J6.mjs";
import { u as useProfile } from "./use-profile-C764uWnh.mjs";
import { T as Route$1, U as getUserTasks, K as getUserPlants, V as toggleTaskCompleted } from "./router-C0zimY-u.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { v as ChevronLeft, a9 as SlidersHorizontal, m as LoaderCircle, c as Sprout, L as Leaf, a3 as Check, F as Funnel, H as Heart, a1 as Calendar, ah as Scissors, ai as Droplet, aj as Sun } from "../_libs/lucide-react.mjs";
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
const iconMap = {
  Air: Droplet,
  Cahaya: Sun,
  Perawatan: Scissors
};
const getTaskIcon = (type, title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("potong") || titleLower.includes("pangkas") || titleLower.includes("gunting")) {
    return Scissors;
  }
  if (titleLower.includes("siram") || titleLower.includes("air") || titleLower.includes("semprot") || titleLower.includes("cairan") || titleLower.includes("pupuk") || titleLower.includes("insek") || titleLower.includes("fungi")) {
    return Droplet;
  }
  if (titleLower.includes("cahaya") || titleLower.includes("jemur") || titleLower.includes("sinar") || titleLower.includes("matahari")) {
    return Sun;
  }
  return iconMap[type] || Sprout;
};
function JadwalPage() {
  const {
    profile
  } = useProfile();
  const search = Route$1.useSearch();
  const [tasks, setTasks] = reactExports.useState([]);
  const [plants, setPlants] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [togglingId, setTogglingId] = reactExports.useState(null);
  const [activePlantId, setActivePlantId] = reactExports.useState(search.plantId || null);
  reactExports.useEffect(() => {
    if (search.plantId) {
      setActivePlantId(search.plantId);
    }
  }, [search.plantId]);
  const [filterPlantType, setFilterPlantType] = reactExports.useState("all");
  const [filterCondition, setFilterCondition] = reactExports.useState("all");
  const [filterScheduleStatus, setFilterScheduleStatus] = reactExports.useState("all");
  const [tempFilterPlantType, setTempFilterPlantType] = reactExports.useState("all");
  const [tempFilterCondition, setTempFilterCondition] = reactExports.useState("all");
  const [tempFilterScheduleStatus, setTempFilterScheduleStatus] = reactExports.useState("all");
  const [isFilterOpen, setIsFilterOpen] = reactExports.useState(false);
  const [zoomImageUrl, setZoomImageUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (isFilterOpen || zoomImageUrl) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen, zoomImageUrl]);
  reactExports.useRef(null);
  reactExports.useRef(null);
  const isLongPressActive = reactExports.useRef(false);
  const loadData = async () => {
    if (!profile) return;
    try {
      const [tasksData, plantsData] = await Promise.all([getUserTasks({
        data: {
          userId: profile.id
        }
      }), getUserPlants({
        data: {
          userId: profile.id
        }
      })]);
      setTasks(tasksData);
      setPlants(plantsData);
    } catch (err) {
      console.error("Gagal memuat jadwal rawat:", err);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);
  const toggle = async (id, currentStatus) => {
    if (!profile) return;
    setTogglingId(id);
    const requestedStatus = !currentStatus;
    try {
      await toggleTaskCompleted({
        data: {
          taskId: id,
          userId: profile.id,
          isDone: requestedStatus
        }
      });
      if (requestedStatus) {
        toast.success("Tugas diselesaikan! 🎉");
      } else {
        toast.info("Tugas dibatalkan.");
      }
      await loadData();
    } catch (err) {
      console.error("Gagal mengubah status tugas:", err);
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setTogglingId(null);
    }
  };
  const filteredTasks = tasks.filter((t) => {
    if (activePlantId === "all") return true;
    return t.plant_id === activePlantId;
  });
  const doneCount = filteredTasks.filter((t) => t.is_done).length;
  const progressPercent = filteredTasks.length ? doneCount / filteredTasks.length * 100 : 0;
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };
  const formattedDate = (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", options);
  const filteredPlants = plants.filter((p) => {
    if (filterPlantType !== "all" && p.name !== filterPlantType) {
      return false;
    }
    if (filterCondition !== "all") {
      if (filterCondition === "Sehat" && p.status !== "Sehat") return false;
      if (filterCondition === "Sakit" && p.status === "Sehat") return false;
    }
    const plantTasks = tasks.filter((t) => t.plant_id === p.id);
    const doneTasks = plantTasks.filter((t) => t.is_done).length;
    const totalTasks = plantTasks.length;
    if (filterScheduleStatus === "pending") {
      if (totalTasks === 0 || doneTasks === totalTasks) return false;
    } else if (filterScheduleStatus === "completed") {
      if (totalTasks === 0 || doneTasks !== totalTasks) return false;
    }
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-primary-dark text-primary-foreground px-5 pt-8 pb-5 rounded-b-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        activePlantId === null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-primary-foreground text-xl font-bold", children: "Jadwal Rawat" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-85 mt-1 text-primary-foreground/90", children: formattedDate })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActivePlantId(null), className: "size-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted active:scale-[0.95] transition-all cursor-pointer shrink-0", "aria-label": "Kembali ke Daftar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-primary-foreground text-xl font-bold", children: "Jadwal Tanaman" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-85 mt-1 text-primary-foreground/90", children: formattedDate })
          ] })
        ] }),
        activePlantId === null && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setTempFilterPlantType(filterPlantType);
          setTempFilterCondition(filterCondition);
          setTempFilterScheduleStatus(filterScheduleStatus);
          setIsFilterOpen(true);
        }, className: "size-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted active:scale-[0.97] transition-all relative cursor-pointer", title: "Filter Tanaman", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "size-5 text-primary" }),
          (filterPlantType !== "all" || filterCondition !== "all" || filterScheduleStatus !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1.5 right-1.5 size-2.5 bg-accent rounded-full ring-2 ring-card animate-pulse" })
        ] })
      ] }),
      activePlantId !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-white/10 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between caption mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Selesai hari ini" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: loading ? "..." : `${doneCount}/${filteredTasks.length}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-white/20 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-accent rounded-full transition-all duration-500", style: {
          width: `${progressPercent}%`
        } }) })
      ] })
    ] }),
    activePlantId === null && (filterPlantType !== "all" || filterCondition !== "all" || filterScheduleStatus !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mt-4 flex flex-wrap gap-2 animate-in fade-in duration-200", children: [
      filterPlantType !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-accent-soft text-primary border border-accent/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold", children: [
        "Jenis: ",
        filterPlantType,
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilterPlantType("all"), className: "font-mono ml-1 font-bold text-[9px] hover:text-destructive cursor-pointer", children: "✕" })
      ] }),
      filterCondition !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-accent-soft text-primary border border-accent/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold", children: [
        "Kondisi: ",
        filterCondition,
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilterCondition("all"), className: "font-mono ml-1 font-bold text-[9px] hover:text-destructive cursor-pointer", children: "✕" })
      ] }),
      filterScheduleStatus !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-accent-soft text-primary border border-accent/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold", children: [
        "Jadwal: ",
        filterScheduleStatus === "pending" ? "Ada Tugas" : "Selesai Rawat",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilterScheduleStatus("all"), className: "font-mono ml-1 font-bold text-[9px] hover:text-destructive cursor-pointer", children: "✕" })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mt-8 text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin mx-auto mb-2 text-primary" }),
      "Memuat data..."
    ] }) : activePlantId === null ? (
      /* 2-Column Grid of Plant Cards */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mt-5 pb-24 animate-in fade-in duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider", children: "Pilih Tanaman" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setActivePlantId("all"), className: "bg-card rounded-2xl p-4 border border-border flex flex-col justify-between cursor-pointer hover:border-primary active:scale-[0.98] transition-[border-color,transform] duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-xl bg-accent-soft flex items-center justify-center mb-2 border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-10 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-[15px] line-clamp-1", children: "Semua Jadwal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Seluruh tugas kebun" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px] font-semibold text-muted-foreground mb-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progress" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  tasks.filter((t) => t.is_done).length,
                  "/",
                  tasks.length,
                  " Selesai"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-secondary rounded-full transition-all duration-300", style: {
                width: `${tasks.length ? tasks.filter((t) => t.is_done).length / tasks.length * 100 : 0}%`
              } }) })
            ] })
          ] }),
          filteredPlants.map((p) => {
            const plantTasks = tasks.filter((t) => t.plant_id === p.id);
            const doneTasks = plantTasks.filter((t) => t.is_done).length;
            const totalTasks = plantTasks.length;
            const progress = totalTasks ? doneTasks / totalTasks * 100 : 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => {
              if (isLongPressActive.current) {
                isLongPressActive.current = false;
                e.stopPropagation();
                return;
              }
              setActivePlantId(p.id);
            }, className: "bg-card rounded-2xl p-4 border border-border flex flex-col justify-between cursor-pointer hover:border-primary active:scale-[0.98] transition-[border-color,transform] duration-200 touch-none select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center mb-2 border border-border/20 relative cursor-pointer", onClick: (e) => {
                  if (p.image_url) {
                    e.stopPropagation();
                    setZoomImageUrl(p.image_url);
                  }
                }, children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, className: "w-full h-full object-cover pointer-events-none" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-10 text-primary pointer-events-none" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-[15px] line-clamp-1", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "Umur: ",
                  calculatePlantAge(p.planted_at),
                  " hari • ",
                  p.status
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px] font-semibold text-muted-foreground mb-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progress" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    doneTasks,
                    "/",
                    totalTasks,
                    " Selesai"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-secondary rounded-full transition-all duration-300", style: {
                  width: `${progress}%`
                } }) })
              ] })
            ] }, p.id);
          })
        ] })
      ] })
    ) : (
      /* Detailed Tasks View for Selected Plant */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mt-5 pb-24 animate-in fade-in duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 mb-4 flex items-center gap-3", children: [
          activePlantId === "all" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-accent-soft flex items-center justify-center border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-6 text-primary" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-12 rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center border border-border/20 ${plants.find((p) => p.id === activePlantId)?.image_url ? "cursor-pointer hover:border-primary/50 hover:scale-[1.03]" : ""} transition-all duration-200`, onClick: () => {
            const url = plants.find((p) => p.id === activePlantId)?.image_url;
            if (url) {
              setZoomImageUrl(url);
            }
          }, title: plants.find((p) => p.id === activePlantId)?.image_url ? "Klik untuk memperbesar" : void 0, children: plants.find((p) => p.id === activePlantId)?.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: plants.find((p) => p.id === activePlantId)?.image_url, alt: "Detail Tanaman", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold", children: activePlantId === "all" ? "Semua Jadwal Perawatan" : plants.find((p) => p.id === activePlantId)?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: activePlantId === "all" ? "Menampilkan seluruh jadwal rawat hari ini" : `Umur: ${calculatePlantAge(plants.find((p) => p.id === activePlantId)?.planted_at)} hari • Status: ${plants.find((p) => p.id === activePlantId)?.status}` })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: filteredTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl", children: "Tidak ada jadwal perawatan untuk tanaman ini." }) : activePlantId === "all" ? Object.entries(filteredTasks.reduce((acc, t) => {
          const key = t.plant_id || "umum";
          if (!acc[key]) acc[key] = [];
          acc[key].push(t);
          return acc;
        }, {})).map(([plantId, groupTasks]) => {
          const plant = plantId !== "umum" ? plants.find((p) => p.id === plantId) : null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-in fade-in duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                plant?.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg overflow-hidden shrink-0 border border-border/20 bg-muted cursor-pointer hover:border-primary/50 hover:scale-[1.03] transition-all", onClick: () => setZoomImageUrl(plant.image_url), title: "Klik untuk memperbesar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: plant.image_url, alt: plant.name, className: "w-full h-full object-cover" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20", children: plantId === "umum" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: plant ? plant.name : "Kategori Umum" }),
                  plant && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                    "Umur: ",
                    calculatePlantAge(plant.planted_at),
                    " hari"
                  ] })
                ] })
              ] }),
              plant ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${plant.status === "Sehat" ? "bg-accent-soft text-primary" : "bg-warning/20 text-foreground"}`, children: plant.status }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground", children: "Umum" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: groupTasks.map((t) => {
              getTaskIcon(t.type, t.title);
              const isDone = !!t.is_done;
              const isCurative = !!t.curative;
              const isBusy = togglingId === t.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-card rounded-2xl p-4 border flex items-center gap-3 transition-all duration-300 ${isCurative ? "border-accent/50 ring-1 ring-accent/30" : "border-border"} ${isDone ? "opacity-80" : ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caption font-semibold text-primary", children: t.time }),
                    isCurative && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caption bg-accent-soft text-primary px-1.5 rounded", children: "Auto dari Scan" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-medium mt-0.5 break-words ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`, children: t.title })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggle(t.id, t.is_done), disabled: isBusy, "aria-label": "Tandai selesai", className: `size-11 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${isDone ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground active:bg-accent-soft"}`, children: isBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-5" }) })
              ] }, t.id);
            }) })
          ] }, plantId);
        }) : filteredTasks.map((t) => {
          getTaskIcon(t.type, t.title);
          const isDone = !!t.is_done;
          const isCurative = !!t.curative;
          const isBusy = togglingId === t.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-card rounded-2xl p-4 border flex items-center gap-3 transition-all duration-300 ${isCurative ? "border-accent/50 ring-1 ring-accent/30" : "border-border"} ${isDone ? "opacity-80" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caption font-semibold text-primary", children: t.time }),
                isCurative && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caption bg-accent-soft text-primary px-1.5 rounded", children: "Auto dari Scan" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-medium mt-0.5 break-words ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`, children: t.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggle(t.id, t.is_done), disabled: isBusy, "aria-label": "Tandai selesai", className: `size-11 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${isDone ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground active:bg-accent-soft"}`, children: isBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-5" }) })
          ] }, t.id);
        }) })
      ] })
    ),
    zoomImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300", onClick: () => setZoomImageUrl(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[85vw] h-[85vw] max-w-[340px] max-h-[340px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3.5 flex items-center justify-between text-white z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm drop-shadow-sm", children: "Foto Tanaman" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setZoomImageUrl(null), className: "p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4.5 w-4.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: zoomImageUrl, alt: "Pratinjau Tanaman", className: "w-full h-full object-cover" })
    ] }) }),
    isFilterOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setIsFilterOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5 pb-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-bold text-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-4.5 text-primary" }),
            " Filter & Urutkan"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsFilterOpen(false), className: "text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1 rounded bg-muted/40 cursor-pointer", children: "Batal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-3.5" }),
              " Jenis Tanaman"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [{
              value: "all",
              label: "Semua"
            }, {
              value: "Tomat",
              label: "Tomat"
            }, {
              value: "Cabai",
              label: "Cabai"
            }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTempFilterPlantType(opt.value), className: `px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${tempFilterPlantType === opt.value ? "bg-primary-dark text-white border-primary shadow-sm" : "bg-muted/30 text-foreground border-transparent hover:bg-muted/80"}`, children: opt.label }, opt.value)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-3.5" }),
              " Kondisi Tanaman"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [{
              value: "all",
              label: "Semua"
            }, {
              value: "Sehat",
              label: "Sehat"
            }, {
              value: "Sakit",
              label: "Sakit"
            }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTempFilterCondition(opt.value), className: `px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${tempFilterCondition === opt.value ? "bg-primary-dark text-white border-primary shadow-sm" : "bg-muted/30 text-foreground border-transparent hover:bg-muted/80"}`, children: opt.label }, opt.value)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3.5" }),
              " Jadwal Hari Ini"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [{
              value: "all",
              label: "Semua"
            }, {
              value: "pending",
              label: "Ada Tugas Rawat"
            }, {
              value: "completed",
              label: "Selesai Rawat"
            }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTempFilterScheduleStatus(opt.value), className: `px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${tempFilterScheduleStatus === opt.value ? "bg-primary-dark text-white border-primary shadow-sm" : "bg-muted/30 text-foreground border-transparent hover:bg-muted/80"}`, children: opt.label }, opt.value)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-8 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            setTempFilterPlantType("all");
            setTempFilterCondition("all");
            setTempFilterScheduleStatus("all");
            setFilterPlantType("all");
            setFilterCondition("all");
            setFilterScheduleStatus("all");
            setIsFilterOpen(false);
          }, className: "flex-1 py-3 bg-muted text-muted-foreground rounded-2xl font-bold text-xs hover:bg-muted/80 active:scale-[0.98] transition-all text-center cursor-pointer", children: "Reset Semua" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            setFilterPlantType(tempFilterPlantType);
            setFilterCondition(tempFilterCondition);
            setFilterScheduleStatus(tempFilterScheduleStatus);
            setIsFilterOpen(false);
          }, className: "flex-1 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-xs hover:bg-primary/95 active:scale-[0.98] transition-all text-center cursor-pointer shadow-sm", children: "Terapkan Filter" })
        ] })
      ] })
    ] })
  ] });
}
export {
  JadwalPage as component
};
