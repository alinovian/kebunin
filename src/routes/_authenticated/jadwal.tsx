import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Droplet,
  Scissors,
  Sprout,
  Sun,
  Check,
  Loader2,
  SlidersHorizontal,
  Filter,
  Calendar,
  Heart,
  ChevronLeft,
  Leaf,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useProfile } from "@/hooks/use-profile";
import { getUserTasks, toggleTaskCompleted, getUserPlants } from "@/lib/api/db.functions";
import { toast } from "sonner";

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

type JadwalSearch = {
  plantId?: string;
};

export const Route = createFileRoute("/_authenticated/jadwal")({
  validateSearch: (search: Record<string, unknown>): JadwalSearch => {
    return {
      plantId: search.plantId ? String(search.plantId) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Jadwal Rawat | Kebunin" },
      {
        name: "description",
        content: "Pengingat siram, pupuk, dan pangkas tanamanmu, otomatis menyesuaikan kondisi.",
      },
    ],
  }),
  component: JadwalPage,
});

type Task = {
  id: string;
  time: string;
  title: string;
  type: string;
  curative: number | boolean;
  is_done: number | boolean;
  plant_id?: string | null;
};

const iconMap: Record<string, any> = {
  Air: Droplet,
  Cahaya: Sun,
  Perawatan: Scissors,
};

const getTaskIcon = (type: string, title: string) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("potong") || titleLower.includes("pangkas") || titleLower.includes("gunting")) {
    return Scissors;
  }
  if (
    titleLower.includes("siram") ||
    titleLower.includes("air") ||
    titleLower.includes("semprot") ||
    titleLower.includes("cairan") ||
    titleLower.includes("pupuk") ||
    titleLower.includes("insek") ||
    titleLower.includes("fungi")
  ) {
    return Droplet;
  }
  if (
    titleLower.includes("cahaya") ||
    titleLower.includes("jemur") ||
    titleLower.includes("sinar") ||
    titleLower.includes("matahari")
  ) {
    return Sun;
  }
  return iconMap[type] || Sprout;
};

function JadwalPage() {
  const { profile } = useProfile();
  const search = Route.useSearch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // activePlantId: null = main grid, 'all' = all schedules, plantId = specific plant schedule
  const [activePlantId, setActivePlantId] = useState<string | null>(search.plantId || null);

  useEffect(() => {
    if (search.plantId) {
      setActivePlantId(search.plantId);
    }
  }, [search.plantId]);

  // Filters for plant cards list
  const [filterPlantType, setFilterPlantType] = useState<string>("all");
  const [filterCondition, setFilterCondition] = useState<string>("all");
  const [filterScheduleStatus, setFilterScheduleStatus] = useState<string>("all");

  // Temp states for filter modal
  const [tempFilterPlantType, setTempFilterPlantType] = useState<string>("all");
  const [tempFilterCondition, setTempFilterCondition] = useState<string>("all");
  const [tempFilterScheduleStatus, setTempFilterScheduleStatus] = useState<string>("all");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Zoom lightbox photo preview states/refs
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isFilterOpen || zoomImageUrl) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen, zoomImageUrl]);

  const longPressTimeout = useRef<any>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isLongPressActive = useRef(false);

  const handlePointerDown = (imgUrl: string, e: React.PointerEvent) => {
    touchStartPos.current = { x: e.clientX, y: e.clientY };
    longPressTimeout.current = setTimeout(() => {
      isLongPressActive.current = true;
      setZoomImageUrl(imgUrl);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 600);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!touchStartPos.current || !longPressTimeout.current) return;
    const dx = Math.abs(e.clientX - touchStartPos.current.x);
    const dy = Math.abs(e.clientY - touchStartPos.current.y);
    if (dx > 8 || dy > 8) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
      touchStartPos.current = null;
    }
  };

  const handlePointerUp = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    touchStartPos.current = null;
  };

  const handlePointerLeave = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    touchStartPos.current = null;
  };

  const loadData = async () => {
    if (!profile) return;
    try {
      const [tasksData, plantsData] = await Promise.all([
        getUserTasks({ data: { userId: profile.id } }),
        getUserPlants({ data: { userId: profile.id } }),
      ]);
      setTasks(tasksData as Task[]);
      setPlants(plantsData as any[]);
    } catch (err) {
      console.error("Gagal memuat jadwal rawat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  const toggle = async (id: string, currentStatus: number | boolean) => {
    if (!profile) return;
    setTogglingId(id);
    const requestedStatus = !currentStatus;

    try {
      await toggleTaskCompleted({
        data: {
          taskId: id,
          userId: profile.id,
          isDone: requestedStatus,
        },
      });

      if (requestedStatus) {
        toast.success("Tugas diselesaikan! 🎉");
      } else {
        toast.info("Tugas dibatalkan.");
      }

      // Reload tasks and plants to update plant health status
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
  const progressPercent = filteredTasks.length ? (doneCount / filteredTasks.length) * 100 : 0;

  // Formatting current date in Indonesian
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = new Date().toLocaleDateString("id-ID", options);

  const filteredPlants = plants.filter((p) => {
    // 1. Filter by Plant Type
    if (filterPlantType !== "all" && p.name !== filterPlantType) {
      return false;
    }
    // 2. Filter by Plant Condition (Status)
    if (filterCondition !== "all") {
      if (filterCondition === "Sehat" && p.status !== "Sehat") return false;
      if (filterCondition === "Sakit" && p.status === "Sehat") return false;
    }
    // 3. Filter by Schedule Status
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

  return (
    <AppShell>
      <header className="bg-primary-dark text-primary-foreground px-5 pt-8 pb-5 rounded-b-3xl">
        <div className="flex items-start justify-between">
          {activePlantId === null ? (
            <div>
              <h1 className="text-primary-foreground text-xl font-bold">Jadwal Rawat</h1>
              <p className="text-xs opacity-85 mt-1 text-primary-foreground/90">{formattedDate}</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePlantId(null)}
                className="size-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted active:scale-[0.95] transition-all cursor-pointer shrink-0"
                aria-label="Kembali ke Daftar"
              >
                <ChevronLeft className="size-5 text-primary" />
              </button>
              <div>
                <h1 className="text-primary-foreground text-xl font-bold">Jadwal Tanaman</h1>
                <p className="text-xs opacity-85 mt-1 text-primary-foreground/90">{formattedDate}</p>
              </div>
            </div>
          )}
          {activePlantId === null && (
            <button
              onClick={() => {
                setTempFilterPlantType(filterPlantType);
                setTempFilterCondition(filterCondition);
                setTempFilterScheduleStatus(filterScheduleStatus);
                setIsFilterOpen(true);
              }}
              className="size-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted active:scale-[0.97] transition-all relative cursor-pointer"
              title="Filter Tanaman"
            >
              <SlidersHorizontal className="size-5 text-primary" />
              {(filterPlantType !== "all" ||
                filterCondition !== "all" ||
                filterScheduleStatus !== "all") && (
                <span className="absolute top-1.5 right-1.5 size-2.5 bg-accent rounded-full ring-2 ring-card animate-pulse" />
              )}
            </button>
          )}
        </div>
        {activePlantId !== null && (
          <div className="mt-4 bg-white/10 rounded-xl p-3">
            <div className="flex justify-between caption mb-2">
              <span>Selesai hari ini</span>
              <span className="font-semibold">
                {loading ? "..." : `${doneCount}/${filteredTasks.length}`}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {activePlantId === null &&
        (filterPlantType !== "all" ||
          filterCondition !== "all" ||
          filterScheduleStatus !== "all") && (
          <div className="px-5 mt-4 flex flex-wrap gap-2 animate-in fade-in duration-200">
            {filterPlantType !== "all" && (
              <span className="inline-flex items-center gap-1 bg-accent-soft text-primary border border-accent/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                Jenis: {filterPlantType}
                <button
                  onClick={() => setFilterPlantType("all")}
                  className="font-mono ml-1 font-bold text-[9px] hover:text-destructive cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}
            {filterCondition !== "all" && (
              <span className="inline-flex items-center gap-1 bg-accent-soft text-primary border border-accent/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                Kondisi: {filterCondition}
                <button
                  onClick={() => setFilterCondition("all")}
                  className="font-mono ml-1 font-bold text-[9px] hover:text-destructive cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}
            {filterScheduleStatus !== "all" && (
              <span className="inline-flex items-center gap-1 bg-accent-soft text-primary border border-accent/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                Jadwal: {filterScheduleStatus === "pending" ? "Ada Tugas" : "Selesai Rawat"}
                <button
                  onClick={() => setFilterScheduleStatus("all")}
                  className="font-mono ml-1 font-bold text-[9px] hover:text-destructive cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}

      {loading ? (
        <div className="px-5 mt-8 text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
          <Loader2 className="size-6 animate-spin mx-auto mb-2 text-primary" />
          Memuat data...
        </div>
      ) : activePlantId === null ? (
        /* 2-Column Grid of Plant Cards */
        <div className="px-5 mt-5 pb-24 animate-in fade-in duration-200">
          <h2 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">
            Pilih Tanaman
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Card for "Semua Tanaman" (All) */}
            <div
              onClick={() => setActivePlantId("all")}
              className="bg-card rounded-2xl p-4 border border-border flex flex-col justify-between cursor-pointer hover:border-primary active:scale-[0.98] transition-[border-color,transform] duration-200"
            >
              <div>
                <div className="aspect-square rounded-xl bg-accent-soft flex items-center justify-center mb-2 border border-border/20">
                  <Sprout className="size-10 text-primary" />
                </div>
                <h3 className="font-bold text-[15px] line-clamp-1">Semua Jadwal</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Seluruh tugas kebun</p>
              </div>

              {/* Progress Info */}
              <div className="mt-4 pt-3 border-t border-border/40">
                <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span>
                    {tasks.filter((t) => t.is_done).length}/{tasks.length} Selesai
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-300"
                    style={{
                      width: `${tasks.length ? (tasks.filter((t) => t.is_done).length / tasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Individual Plant Cards */}
            {filteredPlants.map((p) => {
              const plantTasks = tasks.filter((t) => t.plant_id === p.id);
              const doneTasks = plantTasks.filter((t) => t.is_done).length;
              const totalTasks = plantTasks.length;
              const progress = totalTasks ? (doneTasks / totalTasks) * 100 : 0;

              return (
                <div
                  key={p.id}
                  onClick={(e) => {
                    if (isLongPressActive.current) {
                      isLongPressActive.current = false;
                      e.stopPropagation();
                      return;
                    }
                    setActivePlantId(p.id);
                  }}
                  className="bg-card rounded-2xl p-4 border border-border flex flex-col justify-between cursor-pointer hover:border-primary active:scale-[0.98] transition-[border-color,transform] duration-200 touch-none select-none"
                >
                  <div>
                    <div
                      className="aspect-square rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center mb-2 border border-border/20 relative cursor-pointer"
                      onClick={(e) => {
                        if (p.image_url) {
                          e.stopPropagation();
                          setZoomImageUrl(p.image_url);
                        }
                      }}
                    >
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      ) : (
                        <Sprout className="size-10 text-primary pointer-events-none" />
                      )}
                    </div>
                    <h3 className="font-bold text-[15px] line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Umur: {calculatePlantAge(p.planted_at)} hari &bull; {p.status}
                    </p>
                  </div>

                  {/* Progress Info */}
                  <div className="mt-4 pt-3 border-t border-border/40">
                    <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-1.5">
                      <span>Progress</span>
                      <span>
                        {doneTasks}/{totalTasks} Selesai
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Detailed Tasks View for Selected Plant */
        <div className="px-5 mt-5 pb-24 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-4 mb-4 flex items-center gap-3">
            {activePlantId === "all" ? (
              <div className="size-12 rounded-xl bg-accent-soft flex items-center justify-center border border-border/20">
                <Sprout className="size-6 text-primary" />
              </div>
            ) : (
              <div
                className={`size-12 rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center border border-border/20 ${
                  plants.find((p) => p.id === activePlantId)?.image_url ? "cursor-pointer hover:border-primary/50 hover:scale-[1.03]" : ""
                } transition-all duration-200`}
                onClick={() => {
                  const url = plants.find((p) => p.id === activePlantId)?.image_url;
                  if (url) {
                    setZoomImageUrl(url);
                  }
                }}
                title={plants.find((p) => p.id === activePlantId)?.image_url ? "Klik untuk memperbesar" : undefined}
              >
                {plants.find((p) => p.id === activePlantId)?.image_url ? (
                  <img
                    src={plants.find((p) => p.id === activePlantId)?.image_url}
                    alt="Detail Tanaman"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Sprout className="size-6 text-primary" />
                )}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold">
                {activePlantId === "all"
                  ? "Semua Jadwal Perawatan"
                  : plants.find((p) => p.id === activePlantId)?.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activePlantId === "all"
                  ? "Menampilkan seluruh jadwal rawat hari ini"
                  : `Umur: ${calculatePlantAge(plants.find((p) => p.id === activePlantId)?.planted_at)} hari • Status: ${plants.find((p) => p.id === activePlantId)?.status}`}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
                Tidak ada jadwal perawatan untuk tanaman ini.
              </div>
            ) : activePlantId === "all" ? (
              Object.entries(
                filteredTasks.reduce<Record<string, typeof filteredTasks>>((acc, t) => {
                  const key = t.plant_id || "umum";
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(t);
                  return acc;
                }, {})
              ).map(([plantId, groupTasks]) => {
                const plant = plantId !== "umum" ? plants.find((p) => p.id === plantId) : null;
                return (
                  <div key={plantId} className="space-y-3 animate-in fade-in duration-300">
                    {/* Group Header */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2.5">
                        {plant?.image_url ? (
                          <div
                            className="size-8 rounded-lg overflow-hidden shrink-0 border border-border/20 bg-muted cursor-pointer hover:border-primary/50 hover:scale-[1.03] transition-all"
                            onClick={() => setZoomImageUrl(plant.image_url)}
                            title="Klik untuk memperbesar"
                          >
                            <img
                              src={plant.image_url}
                              alt={plant.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="size-8 rounded-lg bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20">
                            {plantId === "umum" ? <Leaf className="size-4" /> : <Sprout className="size-4" />}
                          </div>
                        )}
                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            {plant ? plant.name : "Kategori Umum"}
                          </h3>
                          {plant && (
                            <p className="text-[10px] text-muted-foreground">
                              Umur: {calculatePlantAge(plant.planted_at)} hari
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {plant ? (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            plant.status === "Sehat"
                              ? "bg-accent-soft text-primary"
                              : "bg-warning/20 text-foreground"
                          }`}
                        >
                          {plant.status}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Umum
                        </span>
                      )}
                    </div>

                    {/* Group Tasks */}
                    <div className="space-y-3">
                      {groupTasks.map((t) => {
                        const Icon = getTaskIcon(t.type, t.title);
                        const isDone = !!t.is_done;
                        const isCurative = !!t.curative;
                        const isBusy = togglingId === t.id;

                        return (
                          <div
                            key={t.id}
                            className={`bg-card rounded-2xl p-4 border flex items-center gap-3 transition-all duration-300 ${
                              isCurative ? "border-accent/50 ring-1 ring-accent/30" : "border-border"
                            } ${isDone ? "opacity-80" : ""}`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="caption font-semibold text-primary">{t.time}</span>
                                {isCurative && (
                                  <span className="caption bg-accent-soft text-primary px-1.5 rounded">
                                    Auto dari Scan
                                  </span>
                                )}
                              </div>
                              <p
                                className={`font-medium mt-0.5 break-words ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}
                              >
                                {t.title}
                              </p>
                            </div>
                            <button
                              onClick={() => toggle(t.id, t.is_done)}
                              disabled={isBusy}
                              aria-label="Tandai selesai"
                              className={`size-11 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                                isDone
                                  ? "bg-secondary text-secondary-foreground"
                                  : "bg-muted text-muted-foreground active:bg-accent-soft"
                              }`}
                            >
                              {isBusy ? (
                                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                              ) : (
                                <Check className="size-5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              filteredTasks.map((t) => {
                const Icon = getTaskIcon(t.type, t.title);
                const isDone = !!t.is_done;
                const isCurative = !!t.curative;
                const isBusy = togglingId === t.id;

                return (
                  <div
                    key={t.id}
                    className={`bg-card rounded-2xl p-4 border flex items-center gap-3 transition-all duration-300 ${
                      isCurative ? "border-accent/50 ring-1 ring-accent/30" : "border-border"
                    } ${isDone ? "opacity-80" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="caption font-semibold text-primary">{t.time}</span>
                        {isCurative && (
                          <span className="caption bg-accent-soft text-primary px-1.5 rounded">
                            Auto dari Scan
                          </span>
                        )}
                      </div>
                      <p
                        className={`font-medium mt-0.5 break-words ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}
                      >
                        {t.title}
                      </p>
                    </div>
                    <button
                      onClick={() => toggle(t.id, t.is_done)}
                      disabled={isBusy}
                      aria-label="Tandai selesai"
                      className={`size-11 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isDone
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground active:bg-accent-soft"
                      }`}
                    >
                      {isBusy ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Check className="size-5" />
                      )}
                    </button>
                  </div>
                );
              })
            )}
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
            className="w-[85vw] h-[85vw] max-w-[340px] max-h-[340px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header overlay */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3.5 flex items-center justify-between text-white z-10">
              <span className="font-semibold text-sm drop-shadow-sm">
                Foto Tanaman
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
              alt="Pratinjau Tanaman"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Filter Bottom Sheet Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsFilterOpen(false)} />

          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
              <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
                <Filter className="size-4.5 text-primary" /> Filter & Urutkan
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1 rounded bg-muted/40 cursor-pointer"
              >
                Batal
              </button>
            </div>

            <div className="space-y-6">
              {/* Jenis Tanaman */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <Sprout className="size-3.5" /> Jenis Tanaman
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "all", label: "Semua" },
                    { value: "Tomat", label: "Tomat" },
                    { value: "Cabai", label: "Cabai" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTempFilterPlantType(opt.value)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        tempFilterPlantType === opt.value
                          ? "bg-primary-dark text-white border-primary shadow-sm"
                          : "bg-muted/30 text-foreground border-transparent hover:bg-muted/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kondisi Tanaman */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <Heart className="size-3.5" /> Kondisi Tanaman
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "all", label: "Semua" },
                    { value: "Sehat", label: "Sehat" },
                    { value: "Sakit", label: "Sakit" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTempFilterCondition(opt.value)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        tempFilterCondition === opt.value
                          ? "bg-primary-dark text-white border-primary shadow-sm"
                          : "bg-muted/30 text-foreground border-transparent hover:bg-muted/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jadwal Hari Ini */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <Calendar className="size-3.5" /> Jadwal Hari Ini
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "all", label: "Semua" },
                    { value: "pending", label: "Ada Tugas Rawat" },
                    { value: "completed", label: "Selesai Rawat" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTempFilterScheduleStatus(opt.value)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        tempFilterScheduleStatus === opt.value
                          ? "bg-primary-dark text-white border-primary shadow-sm"
                          : "bg-muted/30 text-foreground border-transparent hover:bg-muted/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setTempFilterPlantType("all");
                  setTempFilterCondition("all");
                  setTempFilterScheduleStatus("all");
                  setFilterPlantType("all");
                  setFilterCondition("all");
                  setFilterScheduleStatus("all");
                  setIsFilterOpen(false);
                }}
                className="flex-1 py-3 bg-muted text-muted-foreground rounded-2xl font-bold text-xs hover:bg-muted/80 active:scale-[0.98] transition-all text-center cursor-pointer"
              >
                Reset Semua
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterPlantType(tempFilterPlantType);
                  setFilterCondition(tempFilterCondition);
                  setFilterScheduleStatus(tempFilterScheduleStatus);
                  setIsFilterOpen(false);
                }}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-xs hover:bg-primary/95 active:scale-[0.98] transition-all text-center cursor-pointer shadow-sm"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}