import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Camera,
  Upload,
  Sparkles,
  Leaf,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Sprout,
  ShoppingBag,
  Tag,
  Trash2,
  Calendar,
  Heart,
  Store,
  Phone,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";
import {
  saveScanResult,
  getUserPlants,
  analyzeLeafImage,
  getScanHistory,
  deleteScanHistory,
  toggleWishlistItem,
  getWishlistItems,
  getProductById,
} from "@/lib/api/db.functions";
import { toast } from "sonner";
import { useWeather } from "@/hooks/use-weather";

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

type ScanSearch = {
  plantId?: string;
};

type DescBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "bullet"; items: string[] };

type DescDocument = { version: 1; blocks: DescBlock[] };

export const Route = createFileRoute("/_authenticated/scan")({
  validateSearch: (search: Record<string, unknown>): ScanSearch => {
    return {
      plantId: search.plantId ? String(search.plantId) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Scan Daun | Kebunin AI Deteksi" },
      {
        name: "description",
        content: "Pindai daun sakit, dapatkan diagnosis Gemini AI dengan solusi tervalidasi pakar.",
      },
    ],
  }),
  component: ScanPage,
});

type Result = {
  disease: string;
  confidence: number;
  summary: string;
  steps: string[];
  recommendedProducts?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
    shop_name: string;
    shop_address: string | null;
    shop_whatsapp: string | null;
    shop_latitude: number | null;
    shop_longitude: number | null;
    reason: string;
  }>;
};

function ScanPage() {
  const { profile } = useProfile();
  const { plantId } = Route.useSearch();
  const [spillProduct, setSpillProduct] = useState<any | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);
  const navigate = useNavigate();
  const { settings: weatherSettings } = useWeather();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [detailMapRoute, setDetailMapRoute] = useState<[number, number][] | null>(null);
  const [loadingRouteGeometry, setLoadingRouteGeometry] = useState(false);
  const detailMapContainerRef = useRef<HTMLDivElement | null>(null);
  const detailMapRef = useRef<any>(null);
  const [routeDistances, setRouteDistances] = useState<Record<string, number>>({});

  const hasLocation =
    weatherSettings && Number(weatherSettings.lat) !== 0 && Number(weatherSettings.lon) !== 0;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const getProductDistance = (p: any) => {
    if (
      !weatherSettings ||
      p.shop_latitude === null ||
      p.shop_longitude === null ||
      p.shop_latitude === undefined ||
      p.shop_longitude === undefined
    ) {
      return null;
    }
    const key = `${p.shop_latitude},${p.shop_longitude}`;
    if (routeDistances[key] !== undefined) {
      return routeDistances[key];
    }
    const userLat = Number(weatherSettings.lat);
    const userLon = Number(weatherSettings.lon);
    const shopLat = Number(p.shop_latitude);
    const shopLon = Number(p.shop_longitude);
    if (isNaN(userLat) || isNaN(userLon) || isNaN(shopLat) || isNaN(shopLon)) {
      return null;
    }
    return calculateDistance(userLat, userLon, shopLat, shopLon);
  };

  const fetchWishlistData = async () => {
    if (!profile) return;
    try {
      const items = await getWishlistItems({ data: { userId: profile.id } });
      setWishlistItems(items);
    } catch (error) {
      console.error("Gagal memuat data wishlist:", error);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchWishlistData();
    }
  }, [profile]);

  const handleToggleWishlist = async (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!profile) {
      toast.error("Silakan masuk terlebih dahulu untuk menggunakan fitur ini");
      return;
    }
    try {
      const res = await toggleWishlistItem({
        data: { userId: profile.id, productId },
      });
      if (res.action === "added") {
        toast.success("Produk disimpan ke wishlist");
        fetchWishlistData();
      } else {
        toast.success("Produk dihapus dari wishlist");
        fetchWishlistData();
      }
    } catch (err) {
      console.error("Gagal mengubah wishlist:", err);
      toast.error("Terjadi kesalahan sistem");
    }
  };

  // Fetch OSRM route geometry when spillProduct is opened
  useEffect(() => {
    if (!spillProduct || !weatherSettings) {
      setDetailMapRoute(null);
      return;
    }
    const userLat = Number(weatherSettings.lat);
    const userLon = Number(weatherSettings.lon);
    const shopLat = Number(spillProduct.shop_latitude);
    const shopLon = Number(spillProduct.shop_longitude);
    if (isNaN(userLat) || isNaN(userLon) || isNaN(shopLat) || isNaN(shopLon)) {
      setDetailMapRoute(null);
      return;
    }

    setLoadingRouteGeometry(true);
    const fetchRouteGeometry = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${shopLon},${shopLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.code === "Ok" && data.routes && data.routes[0] && data.routes[0].geometry) {
            const coords = data.routes[0].geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]] as [number, number],
            );
            setDetailMapRoute(coords);
            setLoadingRouteGeometry(false);
            return;
          }
        }
      } catch (err) {
        console.error("Gagal memuat geometri rute OSRM:", err);
      }
      // Fallback: straight line
      setDetailMapRoute([
        [userLat, userLon],
        [shopLat, shopLon],
      ]);
      setLoadingRouteGeometry(false);
    };

    fetchRouteGeometry();
  }, [spillProduct, weatherSettings]);

  // Initialize and update Leaflet Map in Detail Modal
  useEffect(() => {
    if (!spillProduct || !weatherSettings || !detailMapContainerRef.current) {
      if (detailMapRef.current) {
        detailMapRef.current.remove();
        detailMapRef.current = null;
      }
      return;
    }

    const userLat = Number(weatherSettings.lat);
    const userLon = Number(weatherSettings.lon);
    const shopLat = Number(spillProduct.shop_latitude);
    const shopLon = Number(spillProduct.shop_longitude);
    if (isNaN(userLat) || isNaN(userLon) || isNaN(shopLat) || isNaN(shopLon)) {
      return;
    }

    const initMap = (L: any) => {
      if (detailMapRef.current) {
        detailMapRef.current.remove();
        detailMapRef.current = null;
      }

      const map = L.map(detailMapContainerRef.current).setView([userLat, userLon], 13);
      detailMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      // 1. User Marker (Rumah)
      const userIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div class="size-6 rounded-full bg-primary border-2 border-white shadow flex items-center justify-center text-white font-bold text-[10px]">🏠</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([userLat, userLon], { icon: userIcon })
        .addTo(map)
        .bindTooltip("Rumah Anda", { permanent: false, direction: "top" });

      // 2. Store Marker (Toko)
      const storeIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div class="size-6 rounded-full bg-emerald-600 border-2 border-white shadow flex items-center justify-center text-white font-bold text-[10px]">🏪</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([shopLat, shopLon], { icon: storeIcon })
        .addTo(map)
        .bindTooltip(spillProduct.shop_name || "Toko Tani", { permanent: false, direction: "top" });

      // 3. Draw Route Polyline
      let bounds = L.latLngBounds([
        [userLat, userLon],
        [shopLat, shopLon],
      ]);
      if (detailMapRoute && detailMapRoute.length > 0) {
        L.polyline(detailMapRoute, {
          color: "var(--color-primary, #0c7779)",
          weight: 4,
          opacity: 0.85,
        }).addTo(map);

        detailMapRoute.forEach((pt) => {
          bounds.extend(pt);
        });
      } else {
        // Fallback straight line
        L.polyline(
          [
            [userLat, userLon],
            [shopLat, shopLon],
          ],
          { color: "#0c7779", weight: 4, opacity: 0.8, dashArray: "6, 6" },
        ).addTo(map);
      }

      // Default: Zoom out to cover all route (fit bounds)
      map.fitBounds(bounds, { padding: [30, 30] });
    };

    const existingCSS = document.getElementById("leaflet-css");
    const existingScript = document.getElementById("leaflet-js");

    if ((window as any).L) {
      initMap((window as any).L);
    } else {
      if (!existingCSS) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.async = true;
        script.onload = () => {
          initMap((window as any).L);
        };
        document.body.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if ((window as any).L) {
            clearInterval(checkInterval);
            initMap((window as any).L);
          }
        }, 100);
      }
    }

    return () => {
      if (detailMapRef.current) {
        detailMapRef.current.remove();
        detailMapRef.current = null;
      }
    };
  }, [spillProduct, weatherSettings, detailMapRoute]);

  const handleOpenSpillProduct = async (prod: any) => {
    setSpillProduct(prod);
    try {
      const latestProduct = await getProductById({ data: { id: prod.id } });
      if (latestProduct) {
        setSpillProduct({
          ...latestProduct,
          reason: prod.reason
        });
      }
    } catch (err) {
      console.error("Gagal memuat detail produk terbaru:", err);
    }
  };

  // Fetch latest details for recommended products when selectedHistoryItem changes
  useEffect(() => {
    const recProds = selectedHistoryItem?.recommendedProducts;
    if (!recProds || recProds.length === 0) return;
    
    let isMounted = true;
    const fetchLatestDetails = async () => {
      try {
        const updated = await Promise.all(
          recProds.map(async (prod: any) => {
            const latest = await getProductById({ data: { id: prod.id } });
            if (latest) {
              return {
                ...latest,
                reason: prod.reason
              };
            }
            return prod;
          })
        );
        if (isMounted) {
          setSelectedHistoryItem((prev: any) => {
            if (!prev) return null;
            return {
              ...prev,
              recommendedProducts: updated
            };
          });
        }
      } catch (err) {
        console.error("Gagal memuat info produk terbaru untuk riwayat:", err);
      }
    };
    fetchLatestDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedHistoryItem?.id]);

  // Fetch latest details for recommended products when result changes
  useEffect(() => {
    const recProds = result?.recommendedProducts;
    if (!recProds || recProds.length === 0) return;
    
    let isMounted = true;
    const fetchLatestDetails = async () => {
      try {
        const updated = await Promise.all(
          recProds.map(async (prod: any) => {
            const latest = await getProductById({ data: { id: prod.id } });
            if (latest) {
              return {
                ...latest,
                reason: prod.reason
              };
            }
            return prod;
          })
        );
        if (isMounted) {
          setResult((prev: any) => {
            if (!prev) return null;
            return {
              ...prev,
              recommendedProducts: updated
            };
          });
        }
      } catch (err) {
        console.error("Gagal memuat info produk terbaru untuk hasil:", err);
      }
    };
    fetchLatestDetails();
    return () => {
      isMounted = false;
    };
  }, [result?.disease]);

  const getFirstProductImage = (raw: string | null | undefined): string | null => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {}
    return raw;
  };

  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const carouselScrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(container.scrollLeft / width);
      if (newIndex !== currentImgIdx) {
        setCurrentImgIdx(newIndex);
      }
    }
  };

  const scrollToImage = (idx: number) => {
    setCurrentImgIdx(idx);
    if (carouselScrollRef.current) {
      const container = carouselScrollRef.current;
      const width = container.clientWidth;
      container.scrollTo({
        left: idx * width,
        behavior: "smooth",
      });
    }
  };

  const parseProductImages = (raw: string | null | undefined): string[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [raw];
  };

  const parseDescription = (raw: string | null): DescDocument => {
    if (!raw) return { version: 1, blocks: [{ type: "paragraph", text: "" }] };
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.version === 1 && Array.isArray(parsed.blocks)) return parsed;
    } catch {}
    return { version: 1, blocks: [{ type: "paragraph", text: raw }] };
  };

  const renderDescriptionBlocks = (doc: DescDocument) => {
    return doc.blocks.map((block, i) => {
      if (block.type === "heading") {
        return (
          <p key={i} className="font-bold text-foreground text-sm mb-1">
            {block.text}
          </p>
        );
      }
      if (block.type === "bullet") {
        return (
          <ul
            key={i}
            className="list-disc list-inside space-y-0.5 text-muted-foreground text-sm mb-1 pl-1"
          >
            {block.items.filter(Boolean).map((item, j) => (
              <li key={j} className="inline-block w-full">
                {item}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p
          key={i}
          className="text-muted-foreground text-sm mb-1 whitespace-pre-wrap leading-relaxed"
        >
          {block.text || ""}
        </p>
      );
    });
  };

  const isDescriptionEmpty = (raw: string | null | undefined): boolean => {
    if (!raw) return true;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.version === 1 && Array.isArray(parsed.blocks)) {
        return parsed.blocks.every((b: any) => !b.text && (!b.items || b.items.length === 0));
      }
    } catch {}
    return !raw.trim();
  };

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [zoomImages, setZoomImages] = useState<string[]>([]);
  const [zoomImageIdx, setZoomImageIdx] = useState<number>(0);
  const zoomCarouselScrollRef = useRef<HTMLDivElement | null>(null);

  const handleZoomScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(container.scrollLeft / width);
      if (newIndex !== zoomImageIdx) {
        setZoomImageIdx(newIndex);
      }
    }
  };

  useEffect(() => {
    if (zoomImageUrl && zoomImages.length > 0 && zoomCarouselScrollRef.current) {
      const container = zoomCarouselScrollRef.current;
      const width = container.clientWidth;
      if (width > 0) {
        container.scrollLeft = zoomImageIdx * width;
      } else {
        setTimeout(() => {
          if (zoomCarouselScrollRef.current) {
            zoomCarouselScrollRef.current.scrollLeft =
              zoomImageIdx * zoomCarouselScrollRef.current.clientWidth;
          }
        }, 50);
      }
    }
  }, [zoomImageUrl, zoomImages]);

  // Scan History States & Logic
  const [activeTab, setActiveTab] = useState<"scan" | "history">("scan");
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchScanHistory = () => {
    if (!profile) return;
    setHistoryLoading(true);
    getScanHistory({ data: { userId: profile.id } })
      .then((data) => {
        setHistoryList(data);
      })
      .catch((err) => {
        console.error("Gagal memuat riwayat:", err);
      })
      .finally(() => {
        setHistoryLoading(false);
      });
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Apakah Anda yakin ingin menghapus riwayat diagnosis ini?")) return;

    // Optimistic UI update
    setHistoryList((prev) => prev.filter((item) => item.id !== id));

    deleteScanHistory({ data: { id } })
      .then(() => {
        toast.success("Riwayat berhasil dihapus");
      })
      .catch((err) => {
        console.error("Gagal menghapus riwayat:", err);
        toast.error("Gagal menghapus riwayat dari server");
        fetchScanHistory(); // Rollback
      });
  };

  useEffect(() => {
    if (activeTab === "history" && profile) {
      fetchScanHistory();
    }
  }, [activeTab, profile]);

  useEffect(() => {
    setCurrentImgIdx(0);
  }, [spillProduct]);

  useEffect(() => {
    if (spillProduct || isUploadSheetOpen || zoomImageUrl || selectedHistoryItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [spillProduct, isUploadSheetOpen, zoomImageUrl, selectedHistoryItem]);

  const formatWhatsappLink = (number: string, productName: string) => {
    let cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.slice(1);
    }
    const text = encodeURIComponent(
      `Halo, saya tertarik dengan produk Anda di Kebunin: *${productName}*. Apakah masih tersedia?`,
    );
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  const [userPlants, setUserPlants] = useState<any[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string | undefined>(plantId);

  useEffect(() => {
    if (profile) {
      getUserPlants({ data: { userId: profile.id } })
        .then((data) => setUserPlants(data as any[]))
        .catch((err) => console.error("Gagal memuat tanaman:", err));
    }
  }, [profile]);

  useEffect(() => {
    if (plantId) {
      setSelectedPlantId(plantId);
      setIsUploadSheetOpen(true);
    }
  }, [plantId]);

  const selectedPlant = userPlants.find((p) => p.id === selectedPlantId);

  const loadingMessages = [
    "Mengompresi gambar daunmu…",
    "Sedang membaca kondisi daunmu…",
    "Mencari solusi dari knowledge base…",
    "Menyusun langkah perawatan…",
  ];

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target?.result as string;
      setImage(b64);
      runAnalysis(b64);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = (base64Image: string) => {
    if (!profile) return;
    setLoading(true);
    setResult(null);
    setStep(0);
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, loadingMessages.length - 1));
    }, 1000);

    analyzeLeafImage({
      data: {
        userId: profile.id,
        image: base64Image,
        plantId: selectedPlantId || null,
      },
    })
      .then((res) => {
        clearInterval(interval);
        setLoading(false);
        if (res.success && res.result) {
          setResult(res.result);
          toast.success("Diagnosis selesai oleh Gemini AI! 🤖", {
            description: "Jadwal perawatan kuratif otomatis ditambahkan ke kalender Anda! 🗓️",
          });
        } else {
          toast.error("Gagal melakukan analisis gambar");
        }
      })
      .catch((err) => {
        clearInterval(interval);
        setLoading(false);
        console.error("Analysis error:", err);
        toast.error("Error saat menganalisis daun.");
      });
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setLoading(false);
  };

  return (
    <AppShell>
      <header className="bg-primary-dark text-primary-foreground px-5 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-primary-foreground text-xl font-bold">Scan Daun AI</h1>
        <p className="text-xs opacity-85 mt-1 text-primary-foreground/90">
          Foto daun yang sakit, biar Kebunin bantu diagnosis
        </p>
      </header>
      {/* Sub-header Tabs Selector in Body (only when not scanning/results active) */}
      {!image && (
        <div className="px-5 mt-4.5 flex items-center justify-between">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {activeTab === "history" ? "Riwayat Diagnosis" : "Pilih Tanaman"}
          </h2>
          <div className="flex bg-card border border-border/85 p-0.5 rounded-xl">
            <button
              onClick={() => setActiveTab("scan")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                activeTab === "scan"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mulai Scan
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Riwayat
            </button>
          </div>
        </div>
      )}

      <div className="px-5 mt-5">
        {!image && activeTab === "scan" && (
          <div className="pb-24 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-3">
              {/* Card: Kategori Umum */}
              <div
                onClick={() => {
                  setSelectedPlantId(undefined);
                  setIsUploadSheetOpen(true);
                }}
                className="bg-card rounded-2xl p-4 border border-border flex flex-col justify-between cursor-pointer hover:border-primary active:scale-[0.98] transition-[border-color,transform] duration-200"
              >
                <div>
                  <div className="aspect-square rounded-xl bg-accent-soft flex items-center justify-center mb-2 border border-border/20">
                    <Leaf className="size-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-[15px] line-clamp-1">Kategori Umum</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Bukan tanaman khusus</p>
                </div>
                <span className="mt-2 inline-block text-center caption font-semibold px-2.5 py-0.5 rounded-full w-fit bg-muted text-muted-foreground">
                  Umum
                </span>
              </div>

              {/* User Plant Cards */}
              {userPlants.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPlantId(p.id);
                    setIsUploadSheetOpen(true);
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
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Sprout className="size-10 text-primary pointer-events-none" />
                      )}
                    </div>
                    <h3 className="font-bold text-[15px] line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
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
          </div>
        )}

        {!image && activeTab === "history" && (
          <div className="pb-24 animate-in fade-in duration-200 space-y-3">
            {historyLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <Loader2 className="size-6 animate-spin text-primary" />
                <p className="text-xs">Memuat riwayat diagnosis...</p>
              </div>
            )}

            {!historyLoading && historyList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-card p-6">
                <Sparkles className="size-10 text-primary/45 mb-3" />
                <h3 className="font-bold text-sm text-foreground">Belum Ada Riwayat</h3>
                <p className="text-xs mt-1 max-w-[220px]">
                  Lakukan pemindaian daun tanaman Anda untuk mendeteksi penyakit dan melihat
                  riwayatnya di sini.
                </p>
              </div>
            )}

            {!historyLoading &&
              historyList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedHistoryItem(item)}
                  className="bg-card border border-border p-3.5 rounded-2xl shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-primary active:scale-[0.99] transition-all relative group"
                >
                  {item.image_url ? (
                    <div className="size-16 rounded-xl overflow-hidden shrink-0 border border-border/20 bg-muted">
                      <img
                        src={item.image_url}
                        alt={item.disease}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="size-16 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20">
                      <Leaf className="size-7" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-success/20 text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {Math.round(item.confidence * 100)}% yakin
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-0.5">
                        <Calendar className="size-3" />
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-foreground mt-1.5 truncate">
                      {item.disease}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {item.summary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteHistory(item.id, e)}
                    className="size-8 rounded-lg bg-destructive/10 hover:bg-destructive/15 text-destructive absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all cursor-pointer border border-destructive/10"
                    title="Hapus Riwayat"
                  >
                    <Trash2 className="size-4.5" />
                  </button>
                </div>
              ))}
          </div>
        )}

        {image && (
          <div className="mb-4 bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3 animate-in fade-in duration-200">
            {selectedPlant?.image_url ? (
              <div
                className="size-11 rounded-xl overflow-hidden shrink-0 border border-border/20 bg-muted cursor-pointer hover:border-primary/50 hover:scale-[1.03] transition-all"
                onClick={() => {
                  if (selectedPlant.image_url) {
                    setZoomImageUrl(selectedPlant.image_url);
                  }
                }}
                title="Klik untuk memperbesar"
              >
                <img
                  src={selectedPlant.image_url}
                  alt={selectedPlant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="size-11 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20">
                <Leaf className="size-5" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Tanaman yang dipindai
              </p>
              <h3 className="font-bold text-sm text-foreground mt-0.5">
                {selectedPlant
                  ? `${selectedPlant.name} (Umur: ${calculatePlantAge(selectedPlant.planted_at)} hari)`
                  : "Kategori Umum"}
              </h3>
            </div>
          </div>
        )}

        {image && (
          <div
            className="bg-card rounded-2xl overflow-hidden border border-border cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => setZoomImageUrl(image)}
            title="Klik untuk memperbesar"
          >
            <img
              src={image}
              alt="Daun yang dipindai"
              className="w-full aspect-square object-cover"
            />
          </div>
        )}

        {loading && (
          <div className="mt-4 bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-secondary animate-pulse" />
              <p className="font-medium text-foreground">{loadingMessages[step]}</p>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-700"
                style={{ width: `${((step + 1) / loadingMessages.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-3">
            <div className="bg-accent-soft border border-accent/30 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="caption text-muted-foreground">Diagnosis</p>
                  <h2 className="text-foreground">{result.disease}</h2>
                </div>
                <span className="bg-success/20 text-foreground caption font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                  {Math.round(result.confidence * 100)}% yakin
                </span>
              </div>
              <p className="mt-2 text-foreground/80">{result.summary}</p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-4">
              <h2 className="mb-2">Langkah Perawatan</h2>
              <ol className="space-y-2">
                {result.steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="size-6 rounded-full bg-primary text-primary-foreground caption font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="flex-1">{s}</p>
                  </li>
                ))}
              </ol>
            </div>

            {result.recommendedProducts && result.recommendedProducts.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="size-5 text-secondary" />
                  <h2 className="text-sm font-bold text-foreground">Rekomendasi Obat & Pupuk</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Obat dan nutrisi tanaman berikut tersedia secara publik di toko aktif Kebunin
                  untuk menyembuhkan penyakit ini:
                </p>

                <div className="space-y-3 pt-1">
                  {result.recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleOpenSpillProduct(prod)}
                      className="flex gap-3 p-3 rounded-xl border border-border bg-muted/15 cursor-pointer hover:bg-muted/30 transition-all active:scale-[0.99]"
                    >
                      {getFirstProductImage(prod.image_url) ? (
                        <div className="size-16 rounded-lg overflow-hidden shrink-0 border border-border/20 bg-muted">
                          <img
                            src={getFirstProductImage(prod.image_url)!}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="size-16 rounded-lg bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20">
                          <Tag className="size-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-xs text-foreground truncate">
                              {prod.name}
                            </h3>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              Toko: {prod.shop_name}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium leading-relaxed">
                            {prod.reason}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/30">
                          <span className="text-xs font-bold text-primary">
                            Rp {prod.price.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Tersedia di Toko
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-muted rounded-2xl p-3 flex items-start gap-2">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="caption text-muted-foreground">
                Solusi diambil dari knowledge base agrikultur Kebunin yang divalidasi pakar (Strict
                RAG, anti halusinasi).
              </p>
            </div>

            <button
              onClick={reset}
              className="w-full min-h-[48px] bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-secondary transition-colors"
            >
              <RefreshCw className="size-5" />
              Scan Lagi
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            setIsUploadSheetOpen(false);
            handleFile(f);
          }
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            setIsUploadSheetOpen(false);
            handleFile(f);
          }
        }}
      />

      {/* Upload Choice Bottom Sheet */}
      {isUploadSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setIsUploadSheetOpen(false)} />

          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              {selectedPlant?.image_url ? (
                <div
                  className="size-12 rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center shrink-0 border border-border/20 cursor-pointer hover:border-primary/50 hover:scale-[1.03] transition-all"
                  onClick={() => setZoomImageUrl(selectedPlant.image_url)}
                  title="Klik untuk memperbesar"
                >
                  <img
                    src={selectedPlant.image_url}
                    alt={selectedPlant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="size-12 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20">
                  <Leaf className="size-6" />
                </div>
              )}
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {selectedPlant ? selectedPlant.name : "Kategori Umum"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedPlant ? (
                    <>
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
                    </>
                  ) : (
                    "Bukan tanaman khusus"
                  )}
                </p>
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99] text-left"
              >
                <div className="size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Camera className="size-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm block">Ambil Foto (Kamera)</span>
                  <span className="text-xs text-muted-foreground block">
                    Gunakan kamera untuk mengambil foto secara langsung
                  </span>
                </div>
              </button>

              <button
                onClick={() => galleryInputRef.current?.click()}
                className="w-full flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99] text-left"
              >
                <div className="size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Upload className="size-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm block">Pilih dari Galeri</span>
                  <span className="text-xs text-muted-foreground block">
                    Unggah foto daun yang sudah ada di galeri
                  </span>
                </div>
              </button>

              <button
                onClick={() => setIsUploadSheetOpen(false)}
                className="w-full mt-2 bg-muted text-muted-foreground py-3 rounded-2xl font-semibold text-sm hover:bg-muted/80 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Product Spill Detail Modal */}
      {spillProduct && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setSpillProduct(null)} />

          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col overflow-hidden">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-muted rounded-full mx-auto my-4 shrink-0" />

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto px-6 pb-5 scrollbar-none">
              {(() => {
                const imagesList = parseProductImages(spillProduct.image_url);
                if (imagesList.length > 0) {
                  return (
                    <>
                      <div className="w-full aspect-square rounded-2xl overflow-hidden mb-3 border border-border/50 bg-muted relative group">
                        {/* Native scroll snap list */}
                        <div
                          ref={carouselScrollRef}
                          onScroll={handleScroll}
                          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
                        >
                          {imagesList.map((imgUrl: string, idx: number) => (
                            <div
                              key={idx}
                              className="w-full h-full shrink-0 snap-center cursor-pointer"
                              onClick={() => {
                                setZoomImages(imagesList);
                                setZoomImageIdx(idx);
                                setZoomImageUrl(imgUrl);
                              }}
                              title="Klik untuk memperbesar"
                            >
                              <img
                                src={imgUrl}
                                alt={`${spillProduct.name} ${idx + 1}`}
                                className="w-full h-full object-cover select-none pointer-events-none"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Indicators (dots) and Counter badge if multiple images */}
                        {imagesList.length > 1 && (
                          <>
                            {/* Indicators (dots) */}
                            <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                              {imagesList.map((_, idx) => (
                                <span
                                  key={idx}
                                  className={`h-1.5 rounded-full transition-all duration-200 ${
                                    idx === currentImgIdx ? "w-3.5 bg-primary" : "w-1.5 bg-white/60"
                                  }`}
                                />
                              ))}
                            </div>
                            {/* Counter badge */}
                            <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full z-10 select-none">
                              {currentImgIdx + 1}/{imagesList.length}
                            </div>
                          </>
                        )}
                      </div>
                      {/* Thumbnails row */}
                      {imagesList.length > 1 && (
                        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 justify-start scrollbar-none">
                          {imagesList.map((imgUrl: string, idx: number) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => scrollToImage(idx)}
                              className={`size-13 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                                idx === currentImgIdx
                                  ? "border-primary scale-[0.98] shadow-xs"
                                  : "border-border/60 hover:border-primary/40"
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`${spillProduct.name} thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                }
                return (
                  <div className="size-16 rounded-2xl bg-accent-soft flex items-center justify-center mb-4 border border-border/50">
                    <ShoppingBag className="size-10 text-primary" />
                  </div>
                );
              })()}

              <h2 className="text-xl font-bold text-foreground leading-snug tracking-tight mb-2">
                {spillProduct.name}
              </h2>
              <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-border/40">
                <span className="text-lg font-extrabold text-primary">
                  Rp {spillProduct.price.toLocaleString("id-ID")}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(spillProduct.id, e)}
                  className="size-9 rounded-full bg-muted/65 hover:bg-muted active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-border/30"
                  title={
                    wishlistItems.some((item) => item.id === spillProduct.id)
                      ? "Hapus dari Wishlist"
                      : "Simpan ke Wishlist"
                  }
                >
                  <Heart
                    className={`size-4.5 transition-all ${
                      wishlistItems.some((item) => item.id === spillProduct.id)
                        ? "fill-destructive text-destructive scale-110"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-4">
                {/* Reason from AI */}
                <div>
                  <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    Rekomendasi AI
                  </p>
                  <div className="text-xs text-muted-foreground bg-accent-soft/30 p-4 rounded-xl border border-accent/20 leading-relaxed font-medium">
                    {spillProduct.reason}
                  </div>
                </div>

                {/* Product Description */}
                {spillProduct.description && !isDescriptionEmpty(spillProduct.description) && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Deskripsi Produk
                    </p>
                    <div className="text-sm text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">
                      {renderDescriptionBlocks(parseDescription(spillProduct.description))}
                    </div>
                  </div>
                )}

                {/* Shop/Seller Information */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Informasi Toko / Penjual
                  </p>

                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Store className="size-4.5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {spillProduct.shop_name ?? "Kebunin Resmi"}
                          </p>
                          {getProductDistance(spillProduct) !== null && (
                            <span className="text-[9px] bg-primary-dark text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                              {getProductDistance(spillProduct)?.toFixed(1)} km
                            </span>
                          )}
                        </div>
                        {!isDescriptionEmpty(spillProduct.shop_description) ? (
                          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {renderDescriptionBlocks(
                              parseDescription(spillProduct.shop_description),
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">-</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 border-t border-primary/5 pt-2.5">
                      <MapPin className="size-4 text-primary mt-0.5 shrink-0" />
                      <div className="flex-1">
                        {spillProduct.shop_address && spillProduct.shop_address.trim() !== "" ? (
                          spillProduct.shop_latitude !== undefined &&
                          spillProduct.shop_latitude !== null &&
                          spillProduct.shop_longitude !== undefined &&
                          spillProduct.shop_longitude !== null ? (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${spillProduct.shop_latitude},${spillProduct.shop_longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary font-medium hover:underline flex items-center gap-1 group w-fit"
                            >
                              <span>{spillProduct.shop_address}</span>
                              <span className="text-[10px] text-muted-foreground opacity-80 group-hover:opacity-100 shrink-0 font-normal ml-1">
                                (Buka di Maps)
                              </span>
                            </a>
                          ) : (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spillProduct.shop_address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary font-medium hover:underline flex items-center gap-1 group w-fit"
                            >
                              <span>{spillProduct.shop_address}</span>
                              <span className="text-[10px] text-muted-foreground opacity-80 group-hover:opacity-100 shrink-0 font-normal ml-1">
                                (Cari di Maps)
                              </span>
                            </a>
                          )
                        ) : (
                          <p className="text-xs text-muted-foreground">-</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 border-t border-primary/5 pt-2.5">
                      <Phone className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          WhatsApp Hubungi Penjual
                        </p>
                        <p className="text-xs font-mono text-muted-foreground">
                          {spillProduct.shop_whatsapp && spillProduct.shop_whatsapp.trim() !== ""
                            ? spillProduct.shop_whatsapp
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Map to Store */}
                  {spillProduct.shop_latitude !== null && spillProduct.shop_longitude !== null && (
                    <div className="mt-4 animate-in fade-in duration-200">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Rute Perjalanan ke Toko
                      </p>
                      {hasLocation ? (
                        <>
                          <div
                            ref={detailMapContainerRef}
                            className="w-full h-48 rounded-2xl border border-border overflow-hidden relative z-0 bg-muted/40"
                            style={{ minHeight: "192px" }}
                          />
                          {loadingRouteGeometry && (
                            <p className="text-[10px] text-muted-foreground mt-1 animate-pulse">
                              Memuat rute jalan...
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex gap-3 items-center">
                          <AlertCircle className="size-5 text-amber-500 shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                              Lokasi Anda belum diatur
                            </p>
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                              Isi alamat Anda terlebih dahulu untuk melihat rute ke toko ini.
                            </p>
                            <button
                              onClick={() => {
                                setSpillProduct(null);
                                navigate({ to: "/profil" });
                              }}
                              className="mt-2 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-800/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <MapPin className="size-3" />
                              Atur Lokasi Sekarang
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed bottom action buttons bar */}
            <div className="p-4 border-t border-border bg-card shrink-0 flex gap-3 z-10">
              <button
                type="button"
                onClick={() => setSpillProduct(null)}
                className="flex-1 py-3 px-4 border border-border text-foreground hover:bg-muted font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Tutup
              </button>
              {spillProduct.shop_whatsapp ? (
                <a
                  href={formatWhatsappLink(spillProduct.shop_whatsapp, spillProduct.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
                >
                  <Phone className="size-4" />
                  Hubungi Penjual
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex-[2] bg-muted text-muted-foreground py-3 px-4 rounded-xl text-xs font-bold cursor-not-allowed text-center"
                >
                  Kontak Tidak Tersedia
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Fullscreen Photo Lightbox / Zoom Modal */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
          onClick={() => {
            setZoomImageUrl(null);
            setZoomImages([]);
          }}
        >
          <div
            className="w-[85vw] h-[85vw] max-w-[340px] max-h-[340px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header overlay */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3.5 flex items-center justify-between text-white z-10">
              <span className="font-semibold text-sm drop-shadow-sm">
                {zoomImages.length > 0 ? "Foto Produk" : "Foto Penyakit"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setZoomImageUrl(null);
                  setZoomImages([]);
                }}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4.5 w-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {zoomImages.length > 1 ? (
              <div className="w-full h-full relative flex-1 bg-black">
                {/* Native scroll snap list */}
                <div
                  ref={zoomCarouselScrollRef}
                  onScroll={handleZoomScroll}
                  className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
                >
                  {zoomImages.map((imgUrl: string, idx: number) => (
                    <div
                      key={idx}
                      className="w-full h-full shrink-0 snap-center flex items-center justify-center"
                    >
                      <img
                        src={imgUrl}
                        alt={`Zoomed ${idx + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Progress Dots Indicator */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                  {zoomImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        idx === zoomImageIdx ? "w-3.5 bg-primary" : "w-1.5 bg-white/60"
                      }`}
                    />
                  ))}
                </div>

                {/* Counter Badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full z-10 select-none">
                  {zoomImageIdx + 1}/{zoomImages.length}
                </div>
              </div>
            ) : (
              <img src={zoomImageUrl} alt="Tanaman" className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      )}
      {/* History Detail Modal Sheet */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setSelectedHistoryItem(null)} />

          <div
            className="w-full max-w-md mx-auto bg-background rounded-t-3xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-350 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-4 shrink-0" />

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-none pb-28">
              {selectedHistoryItem.image_url && (
                <div className="mb-4">
                  <div
                    className="aspect-square rounded-2xl bg-muted/20 border border-border overflow-hidden relative cursor-pointer hover:border-primary/30 transition-colors"
                    onClick={() => setZoomImageUrl(selectedHistoryItem.image_url)}
                    title="Klik untuk memperbesar"
                  >
                    <img
                      src={selectedHistoryItem.image_url}
                      alt={selectedHistoryItem.disease}
                      className="w-full h-full object-cover animate-in fade-in duration-200"
                    />
                  </div>
                </div>
              )}

              <h2 className="text-xl font-bold text-foreground leading-snug tracking-tight mb-2">
                {selectedHistoryItem.disease}
              </h2>
              <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-border/40">
                <span className="text-xs font-bold text-primary">
                  {Math.round(selectedHistoryItem.confidence * 100)}% Yakin
                </span>
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Calendar className="size-3" />
                  Didiagnosis:{" "}
                  {new Date(selectedHistoryItem.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  {new Date(selectedHistoryItem.created_at)
                    .toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(".", ":")}
                </span>
              </div>

              <div className="space-y-4">
                {/* Description / Summary */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Diagnosis & Gejala
                  </p>
                  <div className="bg-accent-soft/30 p-4 rounded-xl border border-accent/20 leading-relaxed text-xs text-foreground/80 font-medium">
                    {selectedHistoryItem.summary}
                  </div>
                </div>

                {/* Langkah Perawatan */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Langkah Perawatan
                  </p>
                  <div className="bg-card rounded-2xl border border-border p-4">
                    <ol className="space-y-3">
                      {selectedHistoryItem.steps.map((s: string, i: number) => (
                        <li key={i} className="flex gap-3">
                          <span className="size-5.5 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-xs text-foreground/90 leading-relaxed flex-1">{s}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Recommended Products */}
                {selectedHistoryItem.recommendedProducts &&
                  selectedHistoryItem.recommendedProducts.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Rekomendasi Obat & Pupuk
                      </p>
                      <div className="space-y-3 pt-1">
                        {selectedHistoryItem.recommendedProducts.map((prod: any) => (
                          <div
                            key={prod.id}
                            onClick={() => handleOpenSpillProduct(prod)}
                            className="flex gap-3 p-3 rounded-xl border border-border bg-muted/15 cursor-pointer hover:bg-muted/30 transition-all active:scale-[0.99]"
                          >
                            {getFirstProductImage(prod.image_url) ? (
                              <div className="size-16 rounded-lg overflow-hidden shrink-0 border border-border/20 bg-muted">
                                <img
                                  src={getFirstProductImage(prod.image_url)!}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="size-16 rounded-lg bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20">
                                <Tag className="size-6" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs text-foreground truncate">
                                {prod.name}
                              </h4>
                              <p className="text-primary font-bold text-xs mt-0.5">
                                Rp {prod.price.toLocaleString("id-ID")}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                <span className="font-semibold text-secondary text-[9px] uppercase tracking-wider block mb-0.5">
                                  Saran:
                                </span>
                                {prod.reason}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent border-t border-border/40">
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-dark active:scale-[0.98] transition-all cursor-pointer shadow-sm animate-in fade-in duration-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
