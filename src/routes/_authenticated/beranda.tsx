import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Sun,
  Droplets,
  ScanLine,
  Sprout,
  Plus,
  Trash2,
  Loader2,
  MapPin,
  Check,
  ChevronRight,
  Calendar,
  CalendarCheck,
  Camera,
} from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useWeather } from "@/hooks/use-weather";
import { useEffect, useState, useRef } from "react";
import {
  getUserPlants,
  addUserPlant,
  deleteUserPlant,
  getUserTasks,
  toggleTaskCompleted,
  addPlantSuggestion,
  uploadPlantPhoto,
  updatePlantImage,
  deletePlantPhoto,
  updatePlantPlantedAt,
} from "@/lib/api/db.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/beranda")({
  head: () => ({
    meta: [
      { title: "Kebunin | Asisten Berkebun Urban Pintar" },
      {
        name: "description",
        content: "Pindai daun, dapat diagnosis AI, dan jaga jadwal rawat tanamanmu setiap hari.",
      },
    ],
  }),
  component: Beranda,
});

type Plant = {
  id: string;
  name: string;
  status: string;
  days: number;
  image_url?: string | null;
  planted_at?: string;
};

type Task = {
  id: string;
  title?: string;
  curative?: boolean | number;
  is_done: number | boolean;
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

function compressImage(
  base64Str: string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedBase64);
    };
    img.onerror = (err) => reject(err);
  });
}

interface ImageCropperProps {
  imageSrc: string;
  cropShape: "square" | "circle";
  onCrop: (croppedBase64: string) => void;
  onCancel: () => void;
}

function ImageCropper({ imageSrc, cropShape, onCrop, onCancel }: ImageCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImgElement(img);
    };
  }, [imageSrc]);

  if (!imgElement) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin mx-auto mb-2" />
          <p className="text-xs">Memuat foto...</p>
        </div>
      </div>
    );
  }

  const W = 280;
  const imgW = imgElement.naturalWidth;
  const imgH = imgElement.naturalHeight;
  const fitScale = Math.max(W / imgW, W / imgH);
  const baseW = imgW * fitScale;
  const baseH = imgH * fitScale;
  const currentW = baseW * zoom;
  const currentH = baseH * zoom;

  const maxX = Math.max(0, (currentW - W) / 2);
  const minX = -maxX;
  const maxY = Math.max(0, (currentH - W) / 2);
  const minY = -maxY;

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY };
    panStart.current = { ...pan };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    
    let newX = panStart.current.x + dx;
    let newY = panStart.current.y + dy;

    newX = Math.min(Math.max(newX, minX), maxX);
    newY = Math.min(Math.max(newY, minY), maxY);

    setPan({ x: newX, y: newY });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleDone = () => {
    const canvas = document.createElement("canvas");
    const outDim = 800;
    canvas.width = outDim;
    canvas.height = outDim;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outDim, outDim);

    const scaleFactor = outDim / W;
    const currentX = (W - currentW) / 2 + pan.x;
    const currentY = (W - currentH) / 2 + pan.y;

    const drawX = currentX * scaleFactor;
    const drawY = currentY * scaleFactor;
    const drawW = currentW * scaleFactor;
    const drawH = currentH * scaleFactor;

    ctx.drawImage(imgElement, drawX, drawY, drawW, drawH);
    
    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onCrop(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between select-none animate-in fade-in duration-200">
      <div className="h-14 flex items-center justify-between px-4 bg-zinc-950 text-white shrink-0 border-b border-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold hover:text-white/80 active:scale-95 transition-all px-2 py-1 cursor-pointer"
        >
          Batal
        </button>
        <span className="text-sm font-bold">Sesuaikan Foto</span>
        <button
          type="button"
          onClick={handleDone}
          className="text-sm font-bold text-primary hover:text-primary/80 active:scale-95 transition-all px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded-lg cursor-pointer"
        >
          Pilih
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          style={{ width: W, height: W }}
          className={`relative overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl ${
            cropShape === "circle" ? "rounded-full" : "rounded-2xl"
          }`}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            handleStart(touch.clientX, touch.clientY);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
          }}
          onTouchEnd={handleEnd}
        >
          <img
            src={imageSrc}
            alt="Crop Area"
            draggable={false}
            style={{
              width: baseW,
              height: baseH,
              transform: `translate(${(W - baseW) / 2 + pan.x}px, ${(W - baseH) / 2 + pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
            }}
            className="absolute max-w-none max-h-none pointer-events-none object-cover"
          />

          <div className="absolute inset-0 pointer-events-none border border-white/20 flex flex-col justify-between">
            <div className="w-full h-px bg-white/25 mt-[33.3%]" />
            <div className="w-full h-px bg-white/25 mb-[33.3%]" />
          </div>
          <div className="absolute inset-0 pointer-events-none flex justify-between">
            <div className="h-full w-px bg-white/25 ml-[33.3%]" />
            <div className="h-full w-px bg-white/25 mr-[33.3%]" />
          </div>
        </div>
      </div>

      <div className="p-6 bg-zinc-950 text-white shrink-0 flex flex-col items-center gap-3 border-t border-white/5">
        <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">Seret untuk menggeser • Geser slider untuk zoom</span>
        <div className="w-full max-w-xs flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-semibold select-none">A-</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => {
              const newZoom = parseFloat(e.target.value);
              setZoom(newZoom);
              
              const nextW = baseW * newZoom;
              const nextH = baseH * newZoom;
              const nextMaxX = Math.max(0, (nextW - W) / 2);
              const nextMaxY = Math.max(0, (nextH - W) / 2);
              
              setPan((prev) => ({
                x: Math.min(Math.max(prev.x, -nextMaxX), nextMaxX),
                y: Math.min(Math.max(prev.y, -nextMaxY), nextMaxY),
              }));
            }}
            className="flex-1 accent-primary h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-zinc-300 font-semibold select-none">A+</span>
        </div>
      </div>
    </div>
  );
}

function Beranda() {
  const { profile, loading: profileLoading } = useProfile();
  const {
    settings: weatherSettings,
    temperature,
    humidity,
    loading: weatherLoading,
  } = useWeather();
  const [plants, setProducts] = useState<Plant[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPlantName, setNewPlantName] = useState("Tomat");
  const [suggestionText, setSuggestionText] = useState("");
  const [busy, setBusy] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<{ id: string; name: string } | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [plantedAtDate, setPlantedAtDate] = useState(new Date().toISOString().split("T")[0]);
  const [editDateDialogOpen, setEditDateDialogOpen] = useState(false);
  const [editPlantedAtValue, setEditPlantedAtValue] = useState("");

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [cropContext, setCropContext] = useState<"add" | "edit" | null>(null);
  const berandaCameraInputRef = useRef<HTMLInputElement>(null);
  const berandaGalleryInputRef = useRef<HTMLInputElement>(null);
  const [sourceSelectContext, setSourceSelectContext] = useState<"add" | "edit" | null>(null);

  useEffect(() => {
    if (dialogOpen || plantToDelete || selectedPlant || editDateDialogOpen || zoomImageUrl || sourceSelectContext) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dialogOpen, plantToDelete, selectedPlant, editDateDialogOpen, zoomImageUrl, sourceSelectContext]);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, context: "add" | "edit") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target?.result as string);
      setPendingCropFile(file);
      setCropContext(context);
      setSourceSelectContext(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

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

  const startUploadSimulatedProgress = () => {
    setUploadingImage(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const diff = prev < 40 ? 12 : prev < 70 ? 6 : prev < 90 ? 2 : 1;
        return prev + diff;
      });
    }, 100);
    return interval;
  };

  const finishUploadSimulatedProgress = (interval: any, onSuccess: () => void) => {
    clearInterval(interval);
    setUploadProgress(100);
    setTimeout(() => {
      setUploadingImage(false);
      setUploadProgress(0);
      onSuccess();
    }, 400);
  };

  const failUploadSimulatedProgress = (interval: any) => {
    clearInterval(interval);
    setUploadingImage(false);
    setUploadProgress(0);
  };

  const handleCancelAdd = () => {
    setDialogOpen(false);
    if (imageUrl) {
      deletePlantPhoto({ data: { imageUrl } }).catch(console.error);
      setImageUrl(null);
    }
  };

  const loadData = async () => {
    if (!profile) return;
    try {
      const tasksData = await getUserTasks({ data: { userId: profile.id } });
      const plantsData = await getUserPlants({ data: { userId: profile.id } });
      setProducts(plantsData as Plant[]);
      setTasks(tasksData as Task[]);
    } catch (err) {
      console.error("Gagal memuat data beranda:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!imageUrl) {
      toast.error("Foto tanaman wajib diunggah!");
      return;
    }
    setBusy(true);
    try {
      await addUserPlant({
        data: {
          userId: profile.id,
          name: newPlantName,
          status: "Sehat",
          days: 1,
          imageUrl: imageUrl,
          plantedAt: plantedAtDate,
        },
      });

      if (suggestionText.trim()) {
        await addPlantSuggestion({
          data: {
            userId: profile.id,
            suggestedPlant: newPlantName,
            suggestionText: suggestionText.trim(),
          },
        });
      }

      toast.success(`Berhasil menanam ${newPlantName}! 🌱`);
      setNewPlantName("Tomat");
      setSuggestionText("");
      setImageUrl(null);
      setPlantedAtDate(new Date().toISOString().split("T")[0]);
      setDialogOpen(false);
      loadData();
    } catch (err) {
      console.error("Gagal menambahkan tanaman:", err);
      toast.error("Gagal menambahkan tanaman");
    } finally {
      setBusy(false);
    }
  };

  const handleDeletePlant = (id: string, name: string) => {
    setPlantToDelete({ id, name });
  };

  const firstName = profile?.display_name?.split(" ")[0] ?? "Petani Urban";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return { text: "Selamat pagi", emoji: "🌤️" };
    if (hour >= 11 && hour < 15) return { text: "Selamat siang", emoji: "☀️" };
    if (hour >= 15 && hour < 18) return { text: "Selamat sore", emoji: "🌇" };
    return { text: "Selamat malam", emoji: "🌙" };
  };
  const greeting = getGreeting();

  // Calculate dynamic checklist progress
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.is_done).length;
  const progressPercent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  if (profileLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="size-8 animate-spin mx-auto text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Menghubungkan ke sistem...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell>
        <div className="px-5 py-10 flex items-center justify-center min-h-[80vh]">
          <div className="bg-card border border-border p-6 rounded-2xl text-center max-w-sm shadow-md">
            <div className="size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
              <Sprout className="size-7" />
            </div>
            <p className="font-bold text-lg mb-2 text-foreground">Koneksi Database Gagal ⚠️</p>
            <p className="text-sm text-muted-foreground mb-4">
              Gagal menyinkronkan profil Anda dengan database lokal MySQL. Harap pastikan langkah
              berikut sudah dilakukan:
            </p>
            <ul className="text-left text-xs text-muted-foreground list-disc list-inside space-y-2 bg-muted/40 p-4 rounded-xl border border-border">
              <li>MySQL di server lokal (XAMPP/WAMP) sudah berjalan di port 3306</li>
              <li>
                Anda telah membuat database dengan nama{" "}
                <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">kebunin</code>
              </li>
              <li>
                Anda telah mengimpor berkas{" "}
                <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">schema.sql</code>{" "}
                di phpMyAdmin
              </li>
            </ul>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="bg-primary-dark text-primary-foreground px-5 pt-8 pb-10 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-85 text-primary-foreground/90 font-medium">{greeting.text} {greeting.emoji}</p>
            <h1 className="text-primary-foreground text-xl font-bold mt-1">Halo, {firstName}!</h1>
            {weatherSettings && (
              <div className="flex items-center gap-1 mt-1 text-xs opacity-85 text-primary-foreground">
                <MapPin className="size-3 text-accent" />
                <span className="truncate max-w-[180px]">
                  {weatherSettings.lat !== 0 && weatherSettings.lon !== 0
                    ? weatherSettings.kecamatan
                      ? [weatherSettings.desa, weatherSettings.kecamatan].filter(Boolean).join(", ")
                      : [weatherSettings.desa, weatherSettings.kabupaten].filter(Boolean).join(", ") || "Lokasi tersimpan"
                    : "Lokasi belum diatur"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat
            icon={<Sun className="size-4" />}
            label="Cuaca"
            value={weatherLoading ? "..." : (temperature !== null ? `${temperature}°C` : "—")}
          />
          <Stat
            icon={<Droplets className="size-4" />}
            label="Kelembapan"
            value={weatherLoading ? "..." : (humidity !== null ? `${humidity}%` : "—")}
          />
        </div>
      </header>

      {/* Quick Scan Link */}
      <section className="px-5 -mt-6">
        <Link
          to="/scan"
          className="block bg-card rounded-2xl p-4 shadow-md border border-border active:scale-[0.98] transition-transform animate-in slide-in-from-bottom duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-accent-soft text-primary flex items-center justify-center">
              <ScanLine className="size-6" />
            </div>
            <div className="flex-1">
              <h2>Scan Daun Sekarang</h2>
              <p className="text-muted-foreground">Deteksi penyakit instan dengan AI</p>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </div>
        </Link>
      </section>

      {/* Progress Section */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2>Progress Harian</h2>
          <span className="caption text-muted-foreground">
            {doneTasks} dari {totalTasks} selesai
          </span>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-3 text-muted-foreground">
            {progressPercent === 100
              ? "Hebat! Semua tugas hari ini sudah selesai! 🎉"
              : "Selesaikan tugas hari ini untuk menjaga kesehatan kebun Anda!"}
          </p>
        </div>
      </section>

      {/* Plants Section */}
      <section className="px-5 mt-6 pb-24">
        <div className="flex items-center justify-between mb-3">
          <h2>Tanamanku</h2>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1 bg-accent-soft text-primary px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-accent/30 transition-colors"
          >
            <Plus className="size-3.5" /> Tambah
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground bg-card border border-border rounded-2xl">
            <Loader2 className="size-5 animate-spin mx-auto mb-2 text-primary" />
            Memuat tanaman...
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-card border border-border rounded-2xl p-5">
            <Sprout className="size-8 mx-auto mb-2 text-muted-foreground/50" />
            Belum ada tanaman. Mulai menanam sekarang!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {plants.map((p) => (
              <div
                key={p.id}
                onClick={(e) => {
                  if (isLongPressActive.current) {
                    isLongPressActive.current = false;
                    e.stopPropagation();
                    return;
                  }
                  setSelectedPlant(p);
                }}
                className="bg-card rounded-2xl p-3 border border-border flex flex-col justify-between relative group cursor-pointer hover:border-primary active:scale-[0.98] transition-all"
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
                  <h2 className="text-[15px] pr-5 line-clamp-1">{p.name}</h2>
                  <p className="caption text-muted-foreground">
                    Umur: {calculatePlantAge(p.planted_at)} hari
                  </p>
                </div>
                <span
                  className={`mt-2 inline-block text-center caption font-semibold px-2.5 py-0.5 rounded-full w-fit ${
                    p.status === "Sehat"
                      ? "bg-accent-soft text-primary"
                      : "bg-warning/20 text-foreground"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Plant Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={handleCancelAdd} />

          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-1">Tambah Tanaman Saya</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Masukkan nama tanaman yang baru Anda tanam di kebun urban Anda.
            </p>
            <form onSubmit={handleAddPlant} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Pilih Tanaman</label>
                <select
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="Tomat">🍅 Tomat</option>
                  <option value="Cabai">🌶️ Cabai</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Tanggal Penanaman</label>
                <input
                  type="date"
                  value={plantedAtDate}
                  onChange={(e) => setPlantedAtDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Foto Tanaman (Wajib)</label>
                <div className="flex flex-col gap-2">
                  {imageUrl ? (
                    <div className="relative size-24 rounded-xl overflow-hidden border border-border bg-muted/20">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const oldUrl = imageUrl;
                          setImageUrl(null);
                          if (oldUrl) {
                            deletePlantPhoto({ data: { imageUrl: oldUrl } }).catch(console.error);
                          }
                        }}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full size-5 flex items-center justify-center text-[10px] font-bold cursor-pointer"
                        title="Hapus foto"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCropContext("add");
                          setSourceSelectContext("add");
                        }}
                        className="px-4 py-2.5 bg-accent-soft text-primary rounded-xl font-semibold text-xs border border-accent/20 hover:bg-accent/30 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" /> Mengunggah...
                          </>
                        ) : (
                          <>Ambil / Unggah Foto</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  Saran untuk Pengembang (Opsional)
                </label>
                <textarea
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                  placeholder="Tulis saran tanaman baru atau masukan lainnya..."
                  className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCancelAdd}
                  className="flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={busy || uploadingImage || !imageUrl}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  Tanam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Plant Confirmation Modal */}
      {plantToDelete && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setPlantToDelete(null)} />

          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
            <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-1.5 text-destructive">
              <Trash2 className="size-4.5" /> Hapus Tanaman Saya
            </h2>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Apakah Anda yakin ingin menghapus tanaman{" "}
              <span className="font-semibold text-foreground">{plantToDelete.name}</span> dari kebun
              Anda? Semua jadwal perawatan terkait tanaman ini juga akan dihapus.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setPlantToDelete(null)}
                className="flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-xs hover:bg-muted/80 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!profile) return;
                  setBusy(true);
                  try {
                    await deleteUserPlant({
                      data: {
                        id: plantToDelete.id,
                        userId: profile.id,
                      },
                    });
                    toast.success(`${plantToDelete.name} telah dihapus.`);
                    loadData();
                  } catch (err) {
                    console.error("Gagal menghapus tanaman:", err);
                    toast.error("Gagal menghapus tanaman");
                  } finally {
                    setBusy(false);
                    setPlantToDelete(null);
                  }
                }}
                disabled={busy}
                className="flex-1 bg-destructive text-destructive-foreground py-2.5 rounded-xl font-semibold text-xs hover:bg-destructive/95 transition-colors flex items-center justify-center gap-1.5"
              >
                {busy && <Loader2 className="size-3.5 animate-spin" />}
                Hapus Tanaman
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plant Options Bottom Sheet */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setSelectedPlant(null)} />

          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div
                className={`size-12 rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center shrink-0 border border-border/20 ${
                  selectedPlant.image_url ? "cursor-pointer hover:border-primary/50 hover:scale-[1.03]" : ""
                } transition-all duration-200`}
                onClick={() => {
                  if (selectedPlant.image_url) {
                    setZoomImageUrl(selectedPlant.image_url);
                  }
                }}
                title={selectedPlant.image_url ? "Klik untuk memperbesar" : undefined}
              >
                {selectedPlant.image_url ? (
                  <img
                    src={selectedPlant.image_url}
                    alt={selectedPlant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Sprout className="size-6 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">{selectedPlant.name}</h2>
                <p className="text-xs text-muted-foreground">
                  Umur: {calculatePlantAge(selectedPlant.planted_at)} hari &bull; Status:{" "}
                  <span
                    className={
                      selectedPlant.status === "Sehat"
                        ? "text-primary font-semibold"
                        : "text-warning font-semibold"
                    }
                  >
                    {selectedPlant.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              <Link
                to="/scan"
                search={{ plantId: selectedPlant.id }}
                onClick={() => setSelectedPlant(null)}
                className="flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99]"
              >
                <div className="size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ScanLine className="size-5" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-semibold text-sm block">Diagnosis Penyakit Daun</span>
                  <span className="text-xs text-muted-foreground block">
                    Pindai daun dengan AI untuk mendeteksi penyakit
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCropContext("edit");
                    setSourceSelectContext("edit");
                  }}
                  className="w-full flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99] cursor-pointer"
                >
                  <div className="size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Camera className="size-5" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-semibold text-sm block">Ubah / Edit Foto Tanaman</span>
                    <span className="text-xs text-muted-foreground block">
                      Ambil foto baru untuk memperbarui gambar tanaman ini
                    </span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <button
                onClick={() => {
                  if (selectedPlant.planted_at) {
                    const dateStr = new Date(selectedPlant.planted_at).toISOString().split("T")[0];
                    setEditPlantedAtValue(dateStr);
                  } else {
                    setEditPlantedAtValue(new Date().toISOString().split("T")[0]);
                  }
                  setEditDateDialogOpen(true);
                }}
                className="w-full flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99] text-left cursor-pointer"
              >
                <div className="size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Calendar className="size-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm block">Ubah Tanggal Penanaman</span>
                  <span className="text-xs text-muted-foreground block">
                    Sesuaikan tanggal saat Anda menanam tanaman ini
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <Link
                to="/jadwal"
                search={{ plantId: selectedPlant.id }}
                onClick={() => setSelectedPlant(null)}
                className="flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99]"
              >
                <div className="size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="size-5" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-semibold text-sm block">Lihat Jadwal Perawatan</span>
                  <span className="text-xs text-muted-foreground block">
                    Atur & lihat pengingat siram, pupuk, atau pangkas
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                onClick={() => {
                  handleDeletePlant(selectedPlant.id, selectedPlant.name);
                  setSelectedPlant(null);
                }}
                className="w-full flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-destructive/10 hover:text-destructive rounded-2xl border border-transparent hover:border-destructive/20 transition-all group active:scale-[0.99]"
              >
                <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Trash2 className="size-5" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-semibold text-sm block">Hapus Tanaman</span>
                  <span className="text-xs text-muted-foreground block">
                    Hapus tanaman ini beserta seluruh riwayat rawat
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedPlant(null)}
              className="mt-6 w-full py-3 bg-muted text-muted-foreground rounded-2xl font-semibold text-sm hover:bg-muted/80 active:scale-[0.99] transition-all text-center"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      {/* Centered glassmorphic progress overlay */}
      {uploadingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div className="bg-card border border-border p-6 rounded-2xl w-80 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <Loader2 className="size-10 animate-spin text-primary mx-auto mb-4" />
            <h3 className="font-bold text-sm text-foreground">Mengunggah Foto Tanaman...</h3>
            <p className="text-xs text-muted-foreground mt-1">Harap tidak menutup halaman ini</p>

            <div className="mt-4 bg-muted/40 h-2 w-full rounded-full overflow-hidden border border-border/20">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-primary mt-2 block">{uploadProgress}%</span>
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

      {/* Edit Planting Date Modal */}
      {editDateDialogOpen && selectedPlant && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setEditDateDialogOpen(false)} />

          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-1">Ubah Tanggal Penanaman</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Sesuaikan tanggal mulai menanam untuk <strong>{selectedPlant.name}</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Pilih Tanggal</label>
                <input
                  type="date"
                  value={editPlantedAtValue}
                  onChange={(e) => setEditPlantedAtValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditDateDialogOpen(false)}
                  className="flex-1 py-3 text-sm font-semibold text-muted-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors active:scale-[0.98]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    if (!profile) return;
                    setBusy(true);
                    try {
                      await updatePlantPlantedAt({
                        data: {
                          plantId: selectedPlant.id,
                          userId: profile.id,
                          plantedAt: editPlantedAtValue,
                        },
                      });
                      toast.success("Tanggal penanaman berhasil diperbarui! 📅");
                      setEditDateDialogOpen(false);
                      setSelectedPlant(null);
                      loadData();
                    } catch (err) {
                      console.error("Gagal mengubah tanggal penanaman:", err);
                      toast.error("Gagal memperbarui tanggal");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="flex-1 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors active:scale-[0.98] flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          cropShape="square"
          onCancel={() => {
            setCropImageSrc(null);
            setPendingCropFile(null);
            setCropContext(null);
          }}
          onCrop={async (croppedBase64) => {
            setCropImageSrc(null);
            const file = pendingCropFile;
            const ctxMode = cropContext;
            setPendingCropFile(null);
            setCropContext(null);
            if (!file) return;

            const progressInterval = startUploadSimulatedProgress();
            if (ctxMode === "add") {
              try {
                const res = await uploadPlantPhoto({
                  data: {
                    base64Data: croppedBase64,
                    fileName: file.name.split(".")[0] + ".jpg",
                  },
                });
                finishUploadSimulatedProgress(progressInterval, () => {
                  setImageUrl(res.url);
                  toast.success("Foto berhasil diunggah! 📸");
                });
              } catch (err: any) {
                console.error("Gagal mengunggah foto tanaman:", err);
                failUploadSimulatedProgress(progressInterval);
                toast.error(err.message || "Gagal mengunggah foto ❌");
              }
            } else if (ctxMode === "edit" && selectedPlant && profile) {
              setBusy(true);
              try {
                const uploadRes = await uploadPlantPhoto({
                  data: {
                    base64Data: croppedBase64,
                    fileName: file.name.split(".")[0] + ".jpg",
                  },
                });
                await updatePlantImage({
                  data: {
                    plantId: selectedPlant.id,
                    userId: profile.id,
                    imageUrl: uploadRes.url,
                  },
                });
                finishUploadSimulatedProgress(progressInterval, () => {
                  toast.success("Foto tanaman berhasil diperbarui! 📸");
                  setSelectedPlant((prev) =>
                    prev ? { ...prev, image_url: uploadRes.url } : null,
                  );
                  loadData();
                });
              } catch (err: any) {
                console.error("Gagal memperbarui foto tanaman:", err);
                failUploadSimulatedProgress(progressInterval);
                toast.error(err.message || "Gagal memperbarui foto ❌");
              } finally {
                setBusy(false);
              }
            }
          }}
        />
      )}

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={berandaCameraInputRef}
        className="hidden"
        onChange={(e) => handleFileSelect(e, cropContext || "add")}
      />
      <input
        type="file"
        accept="image/*"
        ref={berandaGalleryInputRef}
        className="hidden"
        onChange={(e) => handleFileSelect(e, cropContext || "add")}
      />

      {sourceSelectContext && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSourceSelectContext(null)} />
          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-250">
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4 shrink-0" />
            <h3 className="text-sm font-bold text-foreground mb-4 text-center">Pilih Sumber Foto</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => berandaCameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-4 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-border/50 hover:border-accent/20 transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="size-12 rounded-full bg-accent-soft text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Camera className="size-6" />
                </div>
                <span className="text-xs font-bold">Kamera</span>
              </button>
              <button
                type="button"
                onClick={() => berandaGalleryInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-4 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-border/50 hover:border-accent/20 transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="size-12 rounded-full bg-accent-soft text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-bold">Galeri / Foto</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSourceSelectContext(null)}
              className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-xl active:scale-[0.98] transition-all cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/10 rounded-xl px-3 py-2.5">
      <div className="flex items-center gap-1.5 opacity-80">
        {icon}
        <span className="caption">{label}</span>
      </div>
      <p className="font-semibold text-primary-foreground mt-0.5">{value}</p>
    </div>
  );
}