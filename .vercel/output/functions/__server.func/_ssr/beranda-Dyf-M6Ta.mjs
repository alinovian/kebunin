import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-Qd23l6J6.mjs";
import { u as useProfile } from "./use-profile-C764uWnh.mjs";
import { u as useWeather } from "./use-weather-DvVNi8Is.mjs";
import { W as deletePlantPhoto, X as deleteUserPlant, Y as updatePlantPlantedAt, Z as uploadPlantPhoto, _ as updatePlantImage, U as getUserTasks, K as getUserPlants, $ as addUserPlant, a0 as addPlantSuggestion } from "./router-C0zimY-u.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { m as LoaderCircle, c as Sprout, V as MapPin, aj as Sun, ak as Droplets, a as ScanLine, Z as ChevronRight, P as Plus, y as Trash2, h as Camera, a1 as Calendar, C as CalendarCheck } from "../_libs/lucide-react.mjs";
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
function ImageCropper({
  imageSrc,
  cropShape,
  onCrop,
  onCancel
}) {
  const [zoom, setZoom] = reactExports.useState(1);
  const [pan, setPan] = reactExports.useState({
    x: 0,
    y: 0
  });
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const dragStart = reactExports.useRef({
    x: 0,
    y: 0
  });
  const panStart = reactExports.useRef({
    x: 0,
    y: 0
  });
  const containerRef = reactExports.useRef(null);
  const [imgElement, setImgElement] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImgElement(img);
    };
  }, [imageSrc]);
  if (!imgElement) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] bg-black flex items-center justify-center text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin mx-auto mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "Memuat foto..." })
    ] }) });
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
  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    dragStart.current = {
      x: clientX,
      y: clientY
    };
    panStart.current = {
      ...pan
    };
  };
  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    let newX = panStart.current.x + dx;
    let newY = panStart.current.y + dy;
    newX = Math.min(Math.max(newX, minX), maxX);
    newY = Math.min(Math.max(newY, minY), maxY);
    setPan({
      x: newX,
      y: newY
    });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[100] bg-black flex flex-col justify-between select-none animate-in fade-in duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-14 flex items-center justify-between px-4 bg-zinc-950 text-white shrink-0 border-b border-white/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onCancel, className: "text-sm font-semibold hover:text-white/80 active:scale-95 transition-all px-2 py-1 cursor-pointer", children: "Batal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: "Sesuaikan Foto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleDone, className: "text-sm font-bold text-primary hover:text-primary/80 active:scale-95 transition-all px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded-lg cursor-pointer", children: "Pilih" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, style: {
      width: W,
      height: W
    }, className: `relative overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl ${cropShape === "circle" ? "rounded-full" : "rounded-2xl"}`, onMouseDown: (e) => handleStart(e.clientX, e.clientY), onMouseMove: (e) => handleMove(e.clientX, e.clientY), onMouseUp: handleEnd, onMouseLeave: handleEnd, onTouchStart: (e) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    }, onTouchMove: (e) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }, onTouchEnd: handleEnd, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageSrc, alt: "Crop Area", draggable: false, style: {
        width: baseW,
        height: baseH,
        transform: `translate(${(W - baseW) / 2 + pan.x}px, ${(W - baseH) / 2 + pan.y}px) scale(${zoom})`,
        transformOrigin: "center center"
      }, className: "absolute max-w-none max-h-none pointer-events-none object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none border border-white/20 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-px bg-white/25 mt-[33.3%]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-px bg-white/25 mb-[33.3%]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-px bg-white/25 ml-[33.3%]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-px bg-white/25 mr-[33.3%]" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 bg-zinc-950 text-white shrink-0 flex flex-col items-center gap-3 border-t border-white/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-zinc-400 font-medium tracking-wide uppercase", children: "Seret untuk menggeser • Geser slider untuk zoom" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-zinc-500 font-semibold select-none", children: "A-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "1", max: "3", step: "0.01", value: zoom, onChange: (e) => {
          const newZoom = parseFloat(e.target.value);
          setZoom(newZoom);
          const nextW = baseW * newZoom;
          const nextH = baseH * newZoom;
          const nextMaxX = Math.max(0, (nextW - W) / 2);
          const nextMaxY = Math.max(0, (nextH - W) / 2);
          setPan((prev) => ({
            x: Math.min(Math.max(prev.x, -nextMaxX), nextMaxX),
            y: Math.min(Math.max(prev.y, -nextMaxY), nextMaxY)
          }));
        }, className: "flex-1 accent-primary h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-zinc-300 font-semibold select-none", children: "A+" })
      ] })
    ] })
  ] });
}
function Beranda() {
  const {
    profile,
    loading: profileLoading
  } = useProfile();
  const {
    settings: weatherSettings,
    temperature,
    humidity,
    loading: weatherLoading
  } = useWeather();
  const [plants, setProducts] = reactExports.useState([]);
  const [tasks, setTasks] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [newPlantName, setNewPlantName] = reactExports.useState("Tomat");
  const [suggestionText, setSuggestionText] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [plantToDelete, setPlantToDelete] = reactExports.useState(null);
  const [selectedPlant, setSelectedPlant] = reactExports.useState(null);
  const [plantedAtDate, setPlantedAtDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [editDateDialogOpen, setEditDateDialogOpen] = reactExports.useState(false);
  const [editPlantedAtValue, setEditPlantedAtValue] = reactExports.useState("");
  const [imageUrl, setImageUrl] = reactExports.useState(null);
  const [uploadingImage, setUploadingImage] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [zoomImageUrl, setZoomImageUrl] = reactExports.useState(null);
  const [cropImageSrc, setCropImageSrc] = reactExports.useState(null);
  const [pendingCropFile, setPendingCropFile] = reactExports.useState(null);
  const [cropContext, setCropContext] = reactExports.useState(null);
  const berandaCameraInputRef = reactExports.useRef(null);
  const berandaGalleryInputRef = reactExports.useRef(null);
  const [sourceSelectContext, setSourceSelectContext] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (dialogOpen || plantToDelete || selectedPlant || editDateDialogOpen || zoomImageUrl || sourceSelectContext) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dialogOpen, plantToDelete, selectedPlant, editDateDialogOpen, zoomImageUrl, sourceSelectContext]);
  const handleFileSelect = (e, context) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target?.result);
      setPendingCropFile(file);
      setCropContext(context);
      setSourceSelectContext(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  reactExports.useRef(null);
  reactExports.useRef(null);
  const isLongPressActive = reactExports.useRef(false);
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
  const finishUploadSimulatedProgress = (interval, onSuccess) => {
    clearInterval(interval);
    setUploadProgress(100);
    setTimeout(() => {
      setUploadingImage(false);
      setUploadProgress(0);
      onSuccess();
    }, 400);
  };
  const failUploadSimulatedProgress = (interval) => {
    clearInterval(interval);
    setUploadingImage(false);
    setUploadProgress(0);
  };
  const handleCancelAdd = () => {
    setDialogOpen(false);
    if (imageUrl) {
      deletePlantPhoto({
        data: {
          imageUrl
        }
      }).catch(console.error);
      setImageUrl(null);
    }
  };
  const loadData = async () => {
    if (!profile) return;
    try {
      const tasksData = await getUserTasks({
        data: {
          userId: profile.id
        }
      });
      const plantsData = await getUserPlants({
        data: {
          userId: profile.id
        }
      });
      setProducts(plantsData);
      setTasks(tasksData);
    } catch (err) {
      console.error("Gagal memuat data beranda:", err);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);
  const handleAddPlant = async (e) => {
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
          imageUrl,
          plantedAt: plantedAtDate
        }
      });
      if (suggestionText.trim()) {
        await addPlantSuggestion({
          data: {
            userId: profile.id,
            suggestedPlant: newPlantName,
            suggestionText: suggestionText.trim()
          }
        });
      }
      toast.success(`Berhasil menanam ${newPlantName}! 🌱`);
      setNewPlantName("Tomat");
      setSuggestionText("");
      setImageUrl(null);
      setPlantedAtDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
      setDialogOpen(false);
      loadData();
    } catch (err) {
      console.error("Gagal menambahkan tanaman:", err);
      toast.error("Gagal menambahkan tanaman");
    } finally {
      setBusy(false);
    }
  };
  const handleDeletePlant = (id, name) => {
    setPlantToDelete({
      id,
      name
    });
  };
  const firstName = profile?.display_name?.split(" ")[0] ?? "Petani Urban";
  const getGreeting = () => {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour >= 4 && hour < 11) return {
      text: "Selamat pagi",
      emoji: "🌤️"
    };
    if (hour >= 11 && hour < 15) return {
      text: "Selamat siang",
      emoji: "☀️"
    };
    if (hour >= 15 && hour < 18) return {
      text: "Selamat sore",
      emoji: "🌇"
    };
    return {
      text: "Selamat malam",
      emoji: "🌙"
    };
  };
  const greeting = getGreeting();
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.is_done).length;
  const progressPercent = totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0;
  if (profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[80vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin mx-auto text-primary mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Menghubungkan ke sistem..." })
    ] }) }) });
  }
  if (!profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-10 flex items-center justify-center min-h-[80vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border p-6 rounded-2xl text-center max-w-sm shadow-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg mb-2 text-foreground", children: "Koneksi Database Gagal ⚠️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Gagal menyinkronkan profil Anda dengan database lokal MySQL. Harap pastikan langkah berikut sudah dilakukan:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-left text-xs text-muted-foreground list-disc list-inside space-y-2 bg-muted/40 p-4 rounded-xl border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "MySQL di server lokal (XAMPP/WAMP) sudah berjalan di port 3306" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Anda telah membuat database dengan nama",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-muted px-1 py-0.5 rounded font-mono text-xs", children: "kebunin" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Anda telah mengimpor berkas",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-muted px-1 py-0.5 rounded font-mono text-xs", children: "schema.sql" }),
          " ",
          "di phpMyAdmin"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => window.location.reload(), className: "mt-6 w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors", children: "Coba Lagi" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-primary-dark text-primary-foreground px-5 pt-8 pb-10 rounded-b-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs opacity-85 text-primary-foreground/90 font-medium", children: [
          greeting.text,
          " ",
          greeting.emoji
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-primary-foreground text-xl font-bold mt-1", children: [
          "Halo, ",
          firstName,
          "!"
        ] }),
        weatherSettings && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1 text-xs opacity-85 text-primary-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[180px]", children: weatherSettings.lat !== 0 && weatherSettings.lon !== 0 ? weatherSettings.kecamatan ? [weatherSettings.desa, weatherSettings.kecamatan].filter(Boolean).join(", ") : [weatherSettings.desa, weatherSettings.kabupaten].filter(Boolean).join(", ") || "Lokasi tersimpan" : "Lokasi belum diatur" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "size-4" }), label: "Cuaca", value: weatherLoading ? "..." : temperature !== null ? `${temperature}°C` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { className: "size-4" }), label: "Kelembapan", value: weatherLoading ? "..." : humidity !== null ? `${humidity}%` : "—" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 -mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/scan", className: "block bg-card rounded-2xl p-4 shadow-md border border-border active:scale-[0.98] transition-transform animate-in slide-in-from-bottom duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-accent-soft text-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "size-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Scan Daun Sekarang" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Deteksi penyakit instan dengan AI" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-5 text-muted-foreground" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Progress Harian" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "caption text-muted-foreground", children: [
          doneTasks,
          " dari ",
          totalTasks,
          " selesai"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl p-4 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-secondary rounded-full transition-all duration-500", style: {
          width: `${progressPercent}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: progressPercent === 100 ? "Hebat! Semua tugas hari ini sudah selesai! 🎉" : "Selesaikan tugas hari ini untuk menjaga kesehatan kebun Anda!" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 mt-6 pb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Tanamanku" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setDialogOpen(true), className: "flex items-center gap-1 bg-accent-soft text-primary px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-accent/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
          " Tambah"
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground bg-card border border-border rounded-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-5 animate-spin mx-auto mb-2 text-primary" }),
        "Memuat tanaman..."
      ] }) : plants.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground bg-card border border-border rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-8 mx-auto mb-2 text-muted-foreground/50" }),
        "Belum ada tanaman. Mulai menanam sekarang!"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: plants.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => {
        if (isLongPressActive.current) {
          isLongPressActive.current = false;
          e.stopPropagation();
          return;
        }
        setSelectedPlant(p);
      }, className: "bg-card rounded-2xl p-3 border border-border flex flex-col justify-between relative group cursor-pointer hover:border-primary active:scale-[0.98] transition-all touch-none select-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center mb-2 border border-border/20 relative cursor-pointer", onClick: (e) => {
            if (p.image_url) {
              e.stopPropagation();
              setZoomImageUrl(p.image_url);
            }
          }, children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, className: "w-full h-full object-cover pointer-events-none" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-10 text-primary pointer-events-none" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[15px] pr-5 line-clamp-1", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "caption text-muted-foreground", children: [
            "Umur: ",
            calculatePlantAge(p.planted_at),
            " hari"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-2 inline-block text-center caption font-semibold px-2.5 py-0.5 rounded-full w-fit ${p.status === "Sehat" ? "bg-accent-soft text-primary" : "bg-warning/20 text-foreground"}`, children: p.status })
      ] }, p.id)) })
    ] }),
    dialogOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: handleCancelAdd }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-1", children: "Tambah Tanaman Saya" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Masukkan nama tanaman yang baru Anda tanam di kebun urban Anda." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddPlant, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Pilih Tanaman" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newPlantName, onChange: (e) => setNewPlantName(e.target.value), className: "w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Tomat", children: "🍅 Tomat" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Cabai", children: "🌶️ Cabai" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Tanggal Penanaman" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: plantedAtDate, onChange: (e) => setPlantedAtDate(e.target.value), className: "w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Foto Tanaman (Wajib)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative size-24 rounded-xl overflow-hidden border border-border bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl, alt: "Preview", className: "w-full h-full object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                const oldUrl = imageUrl;
                setImageUrl(null);
                if (oldUrl) {
                  deletePlantPhoto({
                    data: {
                      imageUrl: oldUrl
                    }
                  }).catch(console.error);
                }
              }, className: "absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full size-5 flex items-center justify-center text-[10px] font-bold cursor-pointer", title: "Hapus foto", children: "✕" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              setCropContext("add");
              setSourceSelectContext("add");
            }, className: "px-4 py-2.5 bg-accent-soft text-primary rounded-xl font-semibold text-xs border border-accent/20 hover:bg-accent/30 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5", children: uploadingImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }),
              " Mengunggah..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Ambil / Unggah Foto" }) }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Saran untuk Pengembang (Opsional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: suggestionText, onChange: (e) => setSuggestionText(e.target.value), placeholder: "Tulis saran tanaman baru atau masukan lainnya...", className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleCancelAdd, className: "flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors", children: "Batal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: busy || uploadingImage || !imageUrl, className: "flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", children: [
              busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
              "Tanam"
            ] })
          ] })
        ] })
      ] })
    ] }),
    plantToDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setPlantToDelete(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-bold text-foreground mb-2 flex items-center gap-1.5 text-destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4.5" }),
          " Hapus Tanaman Saya"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-5 leading-relaxed", children: [
          "Apakah Anda yakin ingin menghapus tanaman",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: plantToDelete.name }),
          " dari kebun Anda? Semua jadwal perawatan terkait tanaman ini juga akan dihapus."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPlantToDelete(null), className: "flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-xs hover:bg-muted/80 transition-colors", children: "Batal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: async () => {
            if (!profile) return;
            setBusy(true);
            try {
              await deleteUserPlant({
                data: {
                  id: plantToDelete.id,
                  userId: profile.id
                }
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
          }, disabled: busy, className: "flex-1 bg-destructive text-destructive-foreground py-2.5 rounded-xl font-semibold text-xs hover:bg-destructive/95 transition-colors flex items-center justify-center gap-1.5", children: [
            busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }),
            "Hapus Tanaman"
          ] })
        ] })
      ] })
    ] }),
    selectedPlant && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setSelectedPlant(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6 pb-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-12 rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center shrink-0 border border-border/20 ${selectedPlant.image_url ? "cursor-pointer hover:border-primary/50 hover:scale-[1.03]" : ""} transition-all duration-200`, onClick: () => {
            if (selectedPlant.image_url) {
              setZoomImageUrl(selectedPlant.image_url);
            }
          }, title: selectedPlant.image_url ? "Klik untuk memperbesar" : void 0, children: selectedPlant.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedPlant.image_url, alt: selectedPlant.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: selectedPlant.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Umur: ",
              calculatePlantAge(selectedPlant.planted_at),
              " hari • Status:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: selectedPlant.status === "Sehat" ? "text-primary font-semibold" : "text-warning font-semibold", children: selectedPlant.status })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/scan", search: {
            plantId: selectedPlant.id
          }, onClick: () => setSelectedPlant(null), className: "flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm block", children: "Diagnosis Penyakit Daun" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block", children: "Pindai daun dengan AI untuk mendeteksi penyakit" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
            setCropContext("edit");
            setSourceSelectContext("edit");
          }, className: "w-full flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99] cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm block", children: "Ubah / Edit Foto Tanaman" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block", children: "Ambil foto baru untuk memperbarui gambar tanaman ini" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            if (selectedPlant.planted_at) {
              const dateStr = new Date(selectedPlant.planted_at).toISOString().split("T")[0];
              setEditPlantedAtValue(dateStr);
            } else {
              setEditPlantedAtValue((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
            }
            setEditDateDialogOpen(true);
          }, className: "w-full flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99] text-left cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm block", children: "Ubah Tanggal Penanaman" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block", children: "Sesuaikan tanggal saat Anda menanam tanaman ini" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/jadwal", search: {
            plantId: selectedPlant.id
          }, onClick: () => setSelectedPlant(null), className: "flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm block", children: "Lihat Jadwal Perawatan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block", children: "Atur & lihat pengingat siram, pupuk, atau pangkas" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            handleDeletePlant(selectedPlant.id, selectedPlant.name);
            setSelectedPlant(null);
          }, className: "w-full flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-destructive/10 hover:text-destructive rounded-2xl border border-transparent hover:border-destructive/20 transition-all group active:scale-[0.99]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm block", children: "Hapus Tanaman" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block", children: "Hapus tanaman ini beserta seluruh riwayat rawat" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedPlant(null), className: "mt-6 w-full py-3 bg-muted text-muted-foreground rounded-2xl font-semibold text-sm hover:bg-muted/80 active:scale-[0.99] transition-all text-center", children: "Tutup" })
      ] })
    ] }),
    uploadingImage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border p-6 rounded-2xl w-80 text-center shadow-2xl animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-10 animate-spin text-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-foreground", children: "Mengunggah Foto Tanaman..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Harap tidak menutup halaman ini" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 bg-muted/40 h-2 w-full rounded-full overflow-hidden border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary h-full rounded-full transition-all duration-300 ease-out", style: {
        width: `${uploadProgress}%`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary mt-2 block", children: [
        uploadProgress,
        "%"
      ] })
    ] }) }),
    zoomImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300", onClick: () => setZoomImageUrl(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[85vw] h-[85vw] max-w-[340px] max-h-[340px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3.5 flex items-center justify-between text-white z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm drop-shadow-sm", children: "Foto Tanaman" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setZoomImageUrl(null), className: "p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4.5 w-4.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: zoomImageUrl, alt: "Pratinjau Tanaman", className: "w-full h-full object-cover" })
    ] }) }),
    editDateDialogOpen && selectedPlant && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setEditDateDialogOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-1", children: "Ubah Tanggal Penanaman" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-4", children: [
          "Sesuaikan tanggal mulai menanam untuk ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedPlant.name }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Pilih Tanggal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: editPlantedAtValue, onChange: (e) => setEditPlantedAtValue(e.target.value), className: "w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEditDateDialogOpen(false), className: "flex-1 py-3 text-sm font-semibold text-muted-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors active:scale-[0.98]", children: "Batal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: busy, onClick: async () => {
              if (!profile) return;
              setBusy(true);
              try {
                await updatePlantPlantedAt({
                  data: {
                    plantId: selectedPlant.id,
                    userId: profile.id,
                    plantedAt: editPlantedAtValue
                  }
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
            }, className: "flex-1 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors active:scale-[0.98] flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed", children: [
              busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
              "Simpan"
            ] })
          ] })
        ] })
      ] })
    ] }),
    cropImageSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(ImageCropper, { imageSrc: cropImageSrc, cropShape: "square", onCancel: () => {
      setCropImageSrc(null);
      setPendingCropFile(null);
      setCropContext(null);
    }, onCrop: async (croppedBase64) => {
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
              fileName: file.name.split(".")[0] + ".jpg"
            }
          });
          finishUploadSimulatedProgress(progressInterval, () => {
            setImageUrl(res.url);
            toast.success("Foto berhasil diunggah! 📸");
          });
        } catch (err) {
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
              fileName: file.name.split(".")[0] + ".jpg"
            }
          });
          await updatePlantImage({
            data: {
              plantId: selectedPlant.id,
              userId: profile.id,
              imageUrl: uploadRes.url
            }
          });
          finishUploadSimulatedProgress(progressInterval, () => {
            toast.success("Foto tanaman berhasil diperbarui! 📸");
            setSelectedPlant((prev) => prev ? {
              ...prev,
              image_url: uploadRes.url
            } : null);
            loadData();
          });
        } catch (err) {
          console.error("Gagal memperbarui foto tanaman:", err);
          failUploadSimulatedProgress(progressInterval);
          toast.error(err.message || "Gagal memperbarui foto ❌");
        } finally {
          setBusy(false);
        }
      }
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", capture: "environment", ref: berandaCameraInputRef, className: "hidden", onChange: (e) => handleFileSelect(e, cropContext || "add") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", ref: berandaGalleryInputRef, className: "hidden", onChange: (e) => handleFileSelect(e, cropContext || "add") }),
    sourceSelectContext && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setSourceSelectContext(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-250", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground mb-4 text-center", children: "Pilih Sumber Foto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => berandaCameraInputRef.current?.click(), className: "flex flex-col items-center justify-center p-4 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-border/50 hover:border-accent/20 transition-all cursor-pointer group active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-accent-soft text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "Kamera" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => berandaGalleryInputRef.current?.click(), className: "flex flex-col items-center justify-center p-4 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-border/50 hover:border-accent/20 transition-all cursor-pointer group active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-accent-soft text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "Galeri / Foto" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSourceSelectContext(null), className: "w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-xl active:scale-[0.98] transition-all cursor-pointer", children: "Batal" })
      ] })
    ] })
  ] });
}
function Stat({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-xl px-3 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 opacity-80", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caption", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-primary-foreground mt-0.5", children: value })
  ] });
}
export {
  Beranda as component
};
