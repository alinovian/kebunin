import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-Qd23l6J6.mjs";
import { u as useProfile } from "./use-profile-C764uWnh.mjs";
import { J as Route$3, K as getUserPlants, G as getWishlistItems, L as getProductById, M as getScanHistory, N as deleteScanHistory, I as toggleWishlistItem, O as analyzeLeafImage } from "./router-C0zimY-u.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useWeather } from "./use-weather-DvVNi8Is.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { L as Leaf, c as Sprout, m as LoaderCircle, S as Sparkles, a1 as Calendar, y as Trash2, u as ShoppingBag, w as Tag, b as ShieldCheck, R as RefreshCw, h as Camera, ae as Upload, H as Heart, d as Store, V as MapPin, O as Phone, ac as CircleAlert } from "../_libs/lucide-react.mjs";
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
function ScanPage() {
  const {
    profile
  } = useProfile();
  const {
    plantId
  } = Route$3.useSearch();
  const [spillProduct, setSpillProduct] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = reactExports.useState(null);
  const navigate = useNavigate();
  const {
    settings: weatherSettings
  } = useWeather();
  const [wishlistItems, setWishlistItems] = reactExports.useState([]);
  const [detailMapRoute, setDetailMapRoute] = reactExports.useState(null);
  const [loadingRouteGeometry, setLoadingRouteGeometry] = reactExports.useState(false);
  const detailMapContainerRef = reactExports.useRef(null);
  const detailMapRef = reactExports.useRef(null);
  const [routeDistances, setRouteDistances] = reactExports.useState({});
  const hasLocation = weatherSettings && Number(weatherSettings.lat) !== 0 && Number(weatherSettings.lon) !== 0;
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const getProductDistance = (p) => {
    if (!weatherSettings || p.shop_latitude === null || p.shop_longitude === null || p.shop_latitude === void 0 || p.shop_longitude === void 0) {
      return null;
    }
    const key = `${p.shop_latitude},${p.shop_longitude}`;
    if (routeDistances[key] !== void 0) {
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
      const items = await getWishlistItems({
        data: {
          userId: profile.id
        }
      });
      setWishlistItems(items);
    } catch (error) {
      console.error("Gagal memuat data wishlist:", error);
    }
  };
  reactExports.useEffect(() => {
    if (profile) {
      fetchWishlistData();
    }
  }, [profile]);
  const handleToggleWishlist = async (productId, e) => {
    if (e) e.stopPropagation();
    if (!profile) {
      toast.error("Silakan masuk terlebih dahulu untuk menggunakan fitur ini");
      return;
    }
    try {
      const res = await toggleWishlistItem({
        data: {
          userId: profile.id,
          productId
        }
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
  reactExports.useEffect(() => {
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
            const coords = data.routes[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]);
            setDetailMapRoute(coords);
            setLoadingRouteGeometry(false);
            return;
          }
        }
      } catch (err) {
        console.error("Gagal memuat geometri rute OSRM:", err);
      }
      setDetailMapRoute([[userLat, userLon], [shopLat, shopLon]]);
      setLoadingRouteGeometry(false);
    };
    fetchRouteGeometry();
  }, [spillProduct, weatherSettings]);
  reactExports.useEffect(() => {
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
    const initMap = (L) => {
      if (detailMapRef.current) {
        detailMapRef.current.remove();
        detailMapRef.current = null;
      }
      const map = L.map(detailMapContainerRef.current).setView([userLat, userLon], 13);
      detailMapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap"
      }).addTo(map);
      const userIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div class="size-6 rounded-full bg-primary border-2 border-white shadow flex items-center justify-center text-white font-bold text-[10px]">🏠</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([userLat, userLon], {
        icon: userIcon
      }).addTo(map).bindTooltip("Rumah Anda", {
        permanent: false,
        direction: "top"
      });
      const storeIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div class="size-6 rounded-full bg-emerald-600 border-2 border-white shadow flex items-center justify-center text-white font-bold text-[10px]">🏪</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([shopLat, shopLon], {
        icon: storeIcon
      }).addTo(map).bindTooltip(spillProduct.shop_name || "Toko Tani", {
        permanent: false,
        direction: "top"
      });
      let bounds = L.latLngBounds([[userLat, userLon], [shopLat, shopLon]]);
      if (detailMapRoute && detailMapRoute.length > 0) {
        L.polyline(detailMapRoute, {
          color: "var(--color-primary, #0c7779)",
          weight: 4,
          opacity: 0.85
        }).addTo(map);
        detailMapRoute.forEach((pt) => {
          bounds.extend(pt);
        });
      } else {
        L.polyline([[userLat, userLon], [shopLat, shopLon]], {
          color: "#0c7779",
          weight: 4,
          opacity: 0.8,
          dashArray: "6, 6"
        }).addTo(map);
      }
      map.fitBounds(bounds, {
        padding: [30, 30]
      });
    };
    const existingCSS = document.getElementById("leaflet-css");
    const existingScript = document.getElementById("leaflet-js");
    if (window.L) {
      initMap(window.L);
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
          initMap(window.L);
        };
        document.body.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (window.L) {
            clearInterval(checkInterval);
            initMap(window.L);
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
  const handleOpenSpillProduct = async (prod) => {
    setSpillProduct(prod);
    try {
      const latestProduct = await getProductById({
        data: {
          id: prod.id
        }
      });
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
  reactExports.useEffect(() => {
    const recProds = selectedHistoryItem?.recommendedProducts;
    if (!recProds || recProds.length === 0) return;
    let isMounted = true;
    const fetchLatestDetails = async () => {
      try {
        const updated = await Promise.all(recProds.map(async (prod) => {
          const latest = await getProductById({
            data: {
              id: prod.id
            }
          });
          if (latest) {
            return {
              ...latest,
              reason: prod.reason
            };
          }
          return prod;
        }));
        if (isMounted) {
          setSelectedHistoryItem((prev) => {
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
  reactExports.useEffect(() => {
    const recProds = result?.recommendedProducts;
    if (!recProds || recProds.length === 0) return;
    let isMounted = true;
    const fetchLatestDetails = async () => {
      try {
        const updated = await Promise.all(recProds.map(async (prod) => {
          const latest = await getProductById({
            data: {
              id: prod.id
            }
          });
          if (latest) {
            return {
              ...latest,
              reason: prod.reason
            };
          }
          return prod;
        }));
        if (isMounted) {
          setResult((prev) => {
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
  const getFirstProductImage = (raw) => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {
    }
    return raw;
  };
  const [currentImgIdx, setCurrentImgIdx] = reactExports.useState(0);
  const carouselScrollRef = reactExports.useRef(null);
  const handleScroll = (e) => {
    const container = e.currentTarget;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(container.scrollLeft / width);
      if (newIndex !== currentImgIdx) {
        setCurrentImgIdx(newIndex);
      }
    }
  };
  const scrollToImage = (idx) => {
    setCurrentImgIdx(idx);
    if (carouselScrollRef.current) {
      const container = carouselScrollRef.current;
      const width = container.clientWidth;
      container.scrollTo({
        left: idx * width,
        behavior: "smooth"
      });
    }
  };
  const parseProductImages = (raw) => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
    }
    return [raw];
  };
  const parseDescription = (raw) => {
    if (!raw) return {
      version: 1,
      blocks: [{
        type: "paragraph",
        text: ""
      }]
    };
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.version === 1 && Array.isArray(parsed.blocks)) return parsed;
    } catch {
    }
    return {
      version: 1,
      blocks: [{
        type: "paragraph",
        text: raw
      }]
    };
  };
  const renderDescriptionBlocks = (doc) => {
    return doc.blocks.map((block, i) => {
      if (block.type === "heading") {
        return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground text-sm mb-1", children: block.text }, i);
      }
      if (block.type === "bullet") {
        return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside space-y-0.5 text-muted-foreground text-sm mb-1 pl-1", children: block.items.filter(Boolean).map((item, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "inline-block w-full", children: item }, j)) }, i);
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-1 whitespace-pre-wrap leading-relaxed", children: block.text || "" }, i);
    });
  };
  const isDescriptionEmpty = (raw) => {
    if (!raw) return true;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.version === 1 && Array.isArray(parsed.blocks)) {
        return parsed.blocks.every((b) => !b.text && (!b.items || b.items.length === 0));
      }
    } catch {
    }
    return !raw.trim();
  };
  const [image, setImage] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [step, setStep] = reactExports.useState(0);
  const cameraInputRef = reactExports.useRef(null);
  const galleryInputRef = reactExports.useRef(null);
  const [isUploadSheetOpen, setIsUploadSheetOpen] = reactExports.useState(false);
  const [zoomImageUrl, setZoomImageUrl] = reactExports.useState(null);
  const [zoomImages, setZoomImages] = reactExports.useState([]);
  const [zoomImageIdx, setZoomImageIdx] = reactExports.useState(0);
  const zoomCarouselScrollRef = reactExports.useRef(null);
  const handleZoomScroll = (e) => {
    const container = e.currentTarget;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(container.scrollLeft / width);
      if (newIndex !== zoomImageIdx) {
        setZoomImageIdx(newIndex);
      }
    }
  };
  reactExports.useEffect(() => {
    if (zoomImageUrl && zoomImages.length > 0 && zoomCarouselScrollRef.current) {
      const container = zoomCarouselScrollRef.current;
      const width = container.clientWidth;
      if (width > 0) {
        container.scrollLeft = zoomImageIdx * width;
      } else {
        setTimeout(() => {
          if (zoomCarouselScrollRef.current) {
            zoomCarouselScrollRef.current.scrollLeft = zoomImageIdx * zoomCarouselScrollRef.current.clientWidth;
          }
        }, 50);
      }
    }
  }, [zoomImageUrl, zoomImages]);
  const [activeTab, setActiveTab] = reactExports.useState("scan");
  const [historyList, setHistoryList] = reactExports.useState([]);
  const [historyLoading, setHistoryLoading] = reactExports.useState(false);
  const fetchScanHistory = () => {
    if (!profile) return;
    setHistoryLoading(true);
    getScanHistory({
      data: {
        userId: profile.id
      }
    }).then((data) => {
      setHistoryList(data);
    }).catch((err) => {
      console.error("Gagal memuat riwayat:", err);
    }).finally(() => {
      setHistoryLoading(false);
    });
  };
  const handleDeleteHistory = (id, e) => {
    e.stopPropagation();
    if (!confirm("Apakah Anda yakin ingin menghapus riwayat diagnosis ini?")) return;
    setHistoryList((prev) => prev.filter((item) => item.id !== id));
    deleteScanHistory({
      data: {
        id
      }
    }).then(() => {
      toast.success("Riwayat berhasil dihapus");
    }).catch((err) => {
      console.error("Gagal menghapus riwayat:", err);
      toast.error("Gagal menghapus riwayat dari server");
      fetchScanHistory();
    });
  };
  reactExports.useEffect(() => {
    if (activeTab === "history" && profile) {
      fetchScanHistory();
    }
  }, [activeTab, profile]);
  reactExports.useEffect(() => {
    setCurrentImgIdx(0);
  }, [spillProduct]);
  reactExports.useEffect(() => {
    if (spillProduct || isUploadSheetOpen || zoomImageUrl || selectedHistoryItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [spillProduct, isUploadSheetOpen, zoomImageUrl, selectedHistoryItem]);
  const formatWhatsappLink = (number, productName) => {
    let cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.slice(1);
    }
    const text = encodeURIComponent(`Halo, saya tertarik dengan produk Anda di Kebunin: *${productName}*. Apakah masih tersedia?`);
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };
  const [userPlants, setUserPlants] = reactExports.useState([]);
  const [selectedPlantId, setSelectedPlantId] = reactExports.useState(plantId);
  reactExports.useEffect(() => {
    if (profile) {
      getUserPlants({
        data: {
          userId: profile.id
        }
      }).then((data) => setUserPlants(data)).catch((err) => console.error("Gagal memuat tanaman:", err));
    }
  }, [profile]);
  reactExports.useEffect(() => {
    if (plantId) {
      setSelectedPlantId(plantId);
      setIsUploadSheetOpen(true);
    }
  }, [plantId]);
  const selectedPlant = userPlants.find((p) => p.id === selectedPlantId);
  const loadingMessages = ["Mengompresi gambar daunmu…", "Sedang membaca kondisi daunmu…", "Mencari solusi dari knowledge base…", "Menyusun langkah perawatan…"];
  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target?.result;
      setImage(b64);
      runAnalysis(b64);
    };
    reader.readAsDataURL(file);
  };
  const runAnalysis = (base64Image) => {
    if (!profile) return;
    setLoading(true);
    setResult(null);
    setStep(0);
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, loadingMessages.length - 1));
    }, 1e3);
    analyzeLeafImage({
      data: {
        userId: profile.id,
        image: base64Image,
        plantId: selectedPlantId || null
      }
    }).then((res) => {
      clearInterval(interval);
      setLoading(false);
      if (res.success && res.result) {
        setResult(res.result);
        toast.success("Diagnosis selesai oleh Gemini AI! 🤖", {
          description: "Jadwal perawatan kuratif otomatis ditambahkan ke kalender Anda! 🗓️"
        });
      } else {
        toast.error("Gagal melakukan analisis gambar");
      }
    }).catch((err) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-primary-dark text-primary-foreground px-5 pt-8 pb-6 rounded-b-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-primary-foreground text-xl font-bold", children: "Scan Daun AI" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-85 mt-1 text-primary-foreground/90", children: "Foto daun yang sakit, biar Kebunin bantu diagnosis" })
    ] }),
    !image && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mt-4.5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: activeTab === "history" ? "Riwayat Diagnosis" : "Pilih Tanaman" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-card border border-border/85 p-0.5 rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("scan"), className: `px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${activeTab === "scan" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`, children: "Mulai Scan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("history"), className: `px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${activeTab === "history" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`, children: "Riwayat" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mt-5", children: [
      !image && activeTab === "scan" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-24 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => {
          setSelectedPlantId(void 0);
          setIsUploadSheetOpen(true);
        }, className: "bg-card rounded-2xl p-4 border border-border flex flex-col justify-between cursor-pointer hover:border-primary active:scale-[0.98] transition-[border-color,transform] duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-xl bg-accent-soft flex items-center justify-center mb-2 border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-10 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-[15px] line-clamp-1", children: "Kategori Umum" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Bukan tanaman khusus" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 inline-block text-center caption font-semibold px-2.5 py-0.5 rounded-full w-fit bg-muted text-muted-foreground", children: "Umum" })
        ] }),
        userPlants.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => {
          setSelectedPlantId(p.id);
          setIsUploadSheetOpen(true);
        }, className: "bg-card rounded-2xl p-4 border border-border flex flex-col justify-between cursor-pointer hover:border-primary active:scale-[0.98] transition-[border-color,transform] duration-200 touch-none select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center mb-2 border border-border/20 relative cursor-pointer", onClick: (e) => {
              if (p.image_url) {
                e.stopPropagation();
                setZoomImageUrl(p.image_url);
              }
            }, children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-10 text-primary pointer-events-none" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-[15px] line-clamp-1", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              "Umur: ",
              calculatePlantAge(p.planted_at),
              " hari"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-2 inline-block text-center caption font-semibold px-2.5 py-0.5 rounded-full w-fit ${p.status === "Sehat" ? "bg-accent-soft text-primary" : "bg-warning/20 text-foreground"}`, children: p.status })
        ] }, p.id))
      ] }) }),
      !image && activeTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-24 animate-in fade-in duration-200 space-y-3", children: [
        historyLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-muted-foreground gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "Memuat riwayat diagnosis..." })
        ] }),
        !historyLoading && historyList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-card p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-10 text-primary/45 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-foreground", children: "Belum Ada Riwayat" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 max-w-[220px]", children: "Lakukan pemindaian daun tanaman Anda untuk mendeteksi penyakit dan melihat riwayatnya di sini." })
        ] }),
        !historyLoading && historyList.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setSelectedHistoryItem(item), className: "bg-card border border-border p-3.5 rounded-2xl shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-primary active:scale-[0.99] transition-all relative group", children: [
          item.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-xl overflow-hidden shrink-0 border border-border/20 bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.image_url, alt: item.disease, className: "w-full h-full object-cover" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-7" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pr-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-success/20 text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full", children: [
                Math.round(item.confidence * 100),
                "% yakin"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-medium flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
                new Date(item.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-sm text-foreground mt-1.5 truncate", children: item.disease }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 line-clamp-1", children: item.summary })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => handleDeleteHistory(item.id, e), className: "size-8 rounded-lg bg-destructive/10 hover:bg-destructive/15 text-destructive absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all cursor-pointer border border-destructive/10", title: "Hapus Riwayat", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4.5" }) })
        ] }, item.id))
      ] }),
      image && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3 animate-in fade-in duration-200", children: [
        selectedPlant?.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-xl overflow-hidden shrink-0 border border-border/20 bg-muted cursor-pointer hover:border-primary/50 hover:scale-[1.03] transition-all", onClick: () => {
          if (selectedPlant.image_url) {
            setZoomImageUrl(selectedPlant.image_url);
          }
        }, title: "Klik untuk memperbesar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedPlant.image_url, alt: selectedPlant.name, className: "w-full h-full object-cover" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Tanaman yang dipindai" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-foreground mt-0.5", children: selectedPlant ? `${selectedPlant.name} (Umur: ${calculatePlantAge(selectedPlant.planted_at)} hari)` : "Kategori Umum" })
        ] })
      ] }),
      image && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl overflow-hidden border border-border cursor-pointer hover:opacity-95 transition-opacity", onClick: () => setZoomImageUrl(image), title: "Klik untuk memperbesar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: image, alt: "Daun yang dipindai", className: "w-full aspect-square object-cover" }) }),
      loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5 text-secondary animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: loadingMessages[step] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-secondary transition-all duration-700", style: {
          width: `${(step + 1) / loadingMessages.length * 100}%`
        } }) })
      ] }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-accent-soft border border-accent/30 rounded-2xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "caption text-muted-foreground", children: "Diagnosis" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground", children: result.disease })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-success/20 text-foreground caption font-semibold px-2 py-1 rounded-full whitespace-nowrap", children: [
              Math.round(result.confidence * 100),
              "% yakin"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-foreground/80", children: result.summary })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2", children: "Langkah Perawatan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-2", children: result.steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded-full bg-primary text-primary-foreground caption font-bold flex items-center justify-center shrink-0", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1", children: s })
          ] }, i)) })
        ] }),
        result.recommendedProducts && result.recommendedProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-5 text-secondary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground", children: "Rekomendasi Obat & Pupuk" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Obat dan nutrisi tanaman berikut tersedia secara publik di toko aktif Kebunin untuk menyembuhkan penyakit ini:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-1", children: result.recommendedProducts.map((prod) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => handleOpenSpillProduct(prod), className: "flex gap-3 p-3 rounded-xl border border-border bg-muted/15 cursor-pointer hover:bg-muted/30 transition-all active:scale-[0.99]", children: [
            getFirstProductImage(prod.image_url) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-lg overflow-hidden shrink-0 border border-border/20 bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getFirstProductImage(prod.image_url), alt: prod.name, className: "w-full h-full object-cover" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-lg bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-xs text-foreground truncate", children: prod.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground shrink-0", children: [
                    "Toko: ",
                    prod.shop_name
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 font-medium leading-relaxed", children: prod.reason })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 pt-1 border-t border-border/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary", children: [
                  "Rp ",
                  prod.price.toLocaleString("id-ID")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded", children: "Tersedia di Toko" })
              ] })
            ] })
          ] }, prod.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted rounded-2xl p-3 flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-primary shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "caption text-muted-foreground", children: "Solusi diambil dari knowledge base agrikultur Kebunin yang divalidasi pakar (Strict RAG, anti halusinasi)." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: reset, className: "w-full min-h-[48px] bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-secondary transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-5" }),
          "Scan Lagi"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: cameraInputRef, type: "file", accept: "image/*", capture: "environment", className: "hidden", onChange: (e) => {
      const f = e.target.files?.[0];
      if (f) {
        setIsUploadSheetOpen(false);
        handleFile(f);
      }
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: galleryInputRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
      const f = e.target.files?.[0];
      if (f) {
        setIsUploadSheetOpen(false);
        handleFile(f);
      }
    } }),
    isUploadSheetOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setIsUploadSheetOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6 pb-4 border-b border-border", children: [
          selectedPlant?.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center shrink-0 border border-border/20 cursor-pointer hover:border-primary/50 hover:scale-[1.03] transition-all", onClick: () => setZoomImageUrl(selectedPlant.image_url), title: "Klik untuk memperbesar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedPlant.image_url, alt: selectedPlant.name, className: "w-full h-full object-cover" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: selectedPlant ? selectedPlant.name : "Kategori Umum" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: selectedPlant ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "Umur: ",
              calculatePlantAge(selectedPlant.planted_at),
              " hari • Status:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: selectedPlant.status === "Sehat" ? "text-primary font-semibold" : "text-warning font-semibold", children: selectedPlant.status })
            ] }) : "Bukan tanaman khusus" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => cameraInputRef.current?.click(), className: "w-full flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm block", children: "Ambil Foto (Kamera)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block", children: "Gunakan kamera untuk mengambil foto secara langsung" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => galleryInputRef.current?.click(), className: "w-full flex items-center gap-3.5 p-3.5 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-transparent hover:border-accent/20 transition-all group active:scale-[0.99] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm block", children: "Pilih dari Galeri" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block", children: "Unggah foto daun yang sudah ada di galeri" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsUploadSheetOpen(false), className: "w-full mt-2 bg-muted text-muted-foreground py-3 rounded-2xl font-semibold text-sm hover:bg-muted/80 transition-colors", children: "Batal" })
        ] })
      ] })
    ] }),
    spillProduct && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setSpillProduct(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto my-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-6 pb-5 scrollbar-none", children: [
          (() => {
            const imagesList = parseProductImages(spillProduct.image_url);
            if (imagesList.length > 0) {
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full aspect-square rounded-2xl overflow-hidden mb-3 border border-border/50 bg-muted relative group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: carouselScrollRef, onScroll: handleScroll, className: "w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth", children: imagesList.map((imgUrl, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full shrink-0 snap-center cursor-pointer", onClick: () => {
                    setZoomImages(imagesList);
                    setZoomImageIdx(idx);
                    setZoomImageUrl(imgUrl);
                  }, title: "Klik untuk memperbesar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgUrl, alt: `${spillProduct.name} ${idx + 1}`, className: "w-full h-full object-cover select-none pointer-events-none" }) }, idx)) }),
                  imagesList.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none", children: imagesList.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 rounded-full transition-all duration-200 ${idx === currentImgIdx ? "w-3.5 bg-primary" : "w-1.5 bg-white/60"}` }, idx)) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full z-10 select-none", children: [
                      currentImgIdx + 1,
                      "/",
                      imagesList.length
                    ] })
                  ] })
                ] }),
                imagesList.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-4 overflow-x-auto pb-1 justify-start scrollbar-none", children: imagesList.map((imgUrl, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => scrollToImage(idx), className: `size-13 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${idx === currentImgIdx ? "border-primary scale-[0.98] shadow-xs" : "border-border/60 hover:border-primary/40"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgUrl, alt: `${spillProduct.name} thumbnail ${idx + 1}`, className: "w-full h-full object-cover" }) }, idx)) })
              ] });
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-2xl bg-accent-soft flex items-center justify-center mb-4 border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-10 text-primary" }) });
          })(),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground leading-snug tracking-tight mb-2", children: spillProduct.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 mb-5 pb-4 border-b border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-extrabold text-primary", children: [
              "Rp ",
              spillProduct.price.toLocaleString("id-ID")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => handleToggleWishlist(spillProduct.id, e), className: "size-9 rounded-full bg-muted/65 hover:bg-muted active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-border/30", title: wishlistItems.some((item) => item.id === spillProduct.id) ? "Hapus dari Wishlist" : "Simpan ke Wishlist", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `size-4.5 transition-all ${wishlistItems.some((item) => item.id === spillProduct.id) ? "fill-destructive text-destructive scale-110" : "text-muted-foreground hover:text-foreground"}` }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5" }),
                "Rekomendasi AI"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground bg-accent-soft/30 p-4 rounded-xl border border-accent/20 leading-relaxed font-medium", children: spillProduct.reason })
            ] }),
            spillProduct.description && !isDescriptionEmpty(spillProduct.description) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1", children: "Deskripsi Produk" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50", children: renderDescriptionBlocks(parseDescription(spillProduct.description)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2", children: "Informasi Toko / Penjual" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "size-4.5 text-primary mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: spillProduct.shop_name ?? "Kebunin Resmi" }),
                      getProductDistance(spillProduct) !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] bg-primary-dark text-white font-bold px-2 py-0.5 rounded-full shrink-0", children: [
                        getProductDistance(spillProduct)?.toFixed(1),
                        " km"
                      ] })
                    ] }),
                    !isDescriptionEmpty(spillProduct.shop_description) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: renderDescriptionBlocks(parseDescription(spillProduct.shop_description)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: "-" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 border-t border-primary/5 pt-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4 text-primary mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: spillProduct.shop_address && spillProduct.shop_address.trim() !== "" ? spillProduct.shop_latitude !== void 0 && spillProduct.shop_latitude !== null && spillProduct.shop_longitude !== void 0 && spillProduct.shop_longitude !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://www.google.com/maps/search/?api=1&query=${spillProduct.shop_latitude},${spillProduct.shop_longitude}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-primary font-medium hover:underline flex items-center gap-1 group w-fit", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: spillProduct.shop_address }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground opacity-80 group-hover:opacity-100 shrink-0 font-normal ml-1", children: "(Buka di Maps)" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spillProduct.shop_address)}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-primary font-medium hover:underline flex items-center gap-1 group w-fit", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: spillProduct.shop_address }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground opacity-80 group-hover:opacity-100 shrink-0 font-normal ml-1", children: "(Cari di Maps)" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "-" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 border-t border-primary/5 pt-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4 text-emerald-500 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "WhatsApp Hubungi Penjual" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground", children: spillProduct.shop_whatsapp && spillProduct.shop_whatsapp.trim() !== "" ? spillProduct.shop_whatsapp : "-" })
                  ] })
                ] })
              ] }),
              spillProduct.shop_latitude !== null && spillProduct.shop_longitude !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 animate-in fade-in duration-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2", children: "Rute Perjalanan ke Toko" }),
                hasLocation ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: detailMapContainerRef, className: "w-full h-48 rounded-2xl border border-border overflow-hidden relative z-0 bg-muted/40", style: {
                    minHeight: "192px"
                  } }),
                  loadingRouteGeometry && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1 animate-pulse", children: "Memuat rute jalan..." })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex gap-3 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-5 text-amber-500 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-amber-800 dark:text-amber-300", children: "Lokasi Anda belum diatur" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-amber-600 dark:text-amber-400 mt-0.5", children: "Isi alamat Anda terlebih dahulu untuk melihat rute ke toko ini." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                      setSpillProduct(null);
                      navigate({
                        to: "/profil"
                      });
                    }, className: "mt-2 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-800/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
                      "Atur Lokasi Sekarang"
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t border-border bg-card shrink-0 flex gap-3 z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSpillProduct(null), className: "flex-1 py-3 px-4 border border-border text-foreground hover:bg-muted font-bold text-xs rounded-xl transition-all cursor-pointer text-center", children: "Tutup" }),
          spillProduct.shop_whatsapp ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: formatWhatsappLink(spillProduct.shop_whatsapp, spillProduct.name), target: "_blank", rel: "noopener noreferrer", className: "flex-[2] bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4" }),
            "Hubungi Penjual"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: true, className: "flex-[2] bg-muted text-muted-foreground py-3 px-4 rounded-xl text-xs font-bold cursor-not-allowed text-center", children: "Kontak Tidak Tersedia" })
        ] })
      ] })
    ] }),
    zoomImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300", onClick: () => {
      setZoomImageUrl(null);
      setZoomImages([]);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[85vw] h-[85vw] max-w-[340px] max-h-[340px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3.5 flex items-center justify-between text-white z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm drop-shadow-sm", children: zoomImages.length > 0 ? "Foto Produk" : "Foto Penyakit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setZoomImageUrl(null);
          setZoomImages([]);
        }, className: "p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4.5 w-4.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      zoomImages.length > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full relative flex-1 bg-black", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: zoomCarouselScrollRef, onScroll: handleZoomScroll, className: "w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth", children: zoomImages.map((imgUrl, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full shrink-0 snap-center flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgUrl, alt: `Zoomed ${idx + 1}`, className: "w-full h-full object-cover select-none pointer-events-none" }) }, idx)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none", children: zoomImages.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 rounded-full transition-all duration-200 ${idx === zoomImageIdx ? "w-3.5 bg-primary" : "w-1.5 bg-white/60"}` }, idx)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 right-3 bg-black/60 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full z-10 select-none", children: [
          zoomImageIdx + 1,
          "/",
          zoomImages.length
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: zoomImageUrl, alt: "Tanaman", className: "w-full h-full object-cover" })
    ] }) }),
    selectedHistoryItem && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setSelectedHistoryItem(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md mx-auto bg-background rounded-t-3xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-350 relative z-10", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mt-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-6 scrollbar-none pb-28", children: [
          selectedHistoryItem.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-2xl bg-muted/20 border border-border overflow-hidden relative cursor-pointer hover:border-primary/30 transition-colors", onClick: () => setZoomImageUrl(selectedHistoryItem.image_url), title: "Klik untuk memperbesar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedHistoryItem.image_url, alt: selectedHistoryItem.disease, className: "w-full h-full object-cover animate-in fade-in duration-200" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground leading-snug tracking-tight mb-2", children: selectedHistoryItem.disease }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 mb-5 pb-4 border-b border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary", children: [
              Math.round(selectedHistoryItem.confidence * 100),
              "% Yakin"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
              "Didiagnosis:",
              " ",
              new Date(selectedHistoryItem.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
              }),
              " ",
              new Date(selectedHistoryItem.created_at).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit"
              }).replace(".", ":")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Diagnosis & Gejala" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-accent-soft/30 p-4 rounded-xl border border-accent/20 leading-relaxed text-xs text-foreground/80 font-medium", children: selectedHistoryItem.summary })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2", children: "Langkah Perawatan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3", children: selectedHistoryItem.steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-5.5 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/90 leading-relaxed flex-1", children: s })
              ] }, i)) }) })
            ] }),
            selectedHistoryItem.recommendedProducts && selectedHistoryItem.recommendedProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2", children: "Rekomendasi Obat & Pupuk" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-1", children: selectedHistoryItem.recommendedProducts.map((prod) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => handleOpenSpillProduct(prod), className: "flex gap-3 p-3 rounded-xl border border-border bg-muted/15 cursor-pointer hover:bg-muted/30 transition-all active:scale-[0.99]", children: [
                getFirstProductImage(prod.image_url) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-lg overflow-hidden shrink-0 border border-border/20 bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getFirstProductImage(prod.image_url), alt: prod.name, className: "w-full h-full object-cover" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-lg bg-accent-soft text-primary flex items-center justify-center shrink-0 border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-6" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-xs text-foreground truncate", children: prod.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-bold text-xs mt-0.5", children: [
                    "Rp ",
                    prod.price.toLocaleString("id-ID")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-secondary text-[9px] uppercase tracking-wider block mb-0.5", children: "Saran:" }),
                    prod.reason
                  ] })
                ] })
              ] }, prod.id)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedHistoryItem(null), className: "w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-dark active:scale-[0.98] transition-all cursor-pointer shadow-sm animate-in fade-in duration-200", children: "Tutup" }) })
      ] })
    ] })
  ] });
}
export {
  ScanPage as component
};
