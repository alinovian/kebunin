import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-Qd23l6J6.mjs";
import { u as useProfile } from "./use-profile-C764uWnh.mjs";
import { u as useWeather } from "./use-weather-DvVNi8Is.mjs";
import { b as getProducts, C as updateWishlistItemCategory, D as createWishlistCategory, E as updateWishlistCategory, F as deleteWishlistCategory, G as getWishlistItems, H as getWishlistCategories, I as toggleWishlistItem } from "./router-C0zimY-u.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { D as Search, a9 as SlidersHorizontal, aa as Folder, g as ChevronDown, m as LoaderCircle, u as ShoppingBag, d as Store, ab as Navigation, V as MapPin, H as Heart, O as Phone, ac as CircleAlert, F as Funnel, ad as ArrowUpDown } from "../_libs/lucide-react.mjs";
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
function TokoPage() {
  const {
    profile,
    loading: profileLoading
  } = useProfile();
  const {
    settings: weatherSettings
  } = useWeather();
  const navigate = useNavigate();
  const [products, setProducts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [q, setQ] = reactExports.useState("");
  const [detailProduct, setDetailProduct] = reactExports.useState(null);
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
  const [currentImgIdx, setCurrentImgIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    setCurrentImgIdx(0);
  }, [detailProduct]);
  const [activeTab, setActiveTab] = reactExports.useState("products");
  const [wishlistItems, setWishlistItems] = reactExports.useState([]);
  const [wishlistCategories, setWishlistCategories] = reactExports.useState([]);
  const [selectedWishlistCategory, setSelectedWishlistCategory] = reactExports.useState(null);
  const [loadingWishlist, setLoadingWishlist] = reactExports.useState(false);
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = reactExports.useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = reactExports.useState(false);
  const [newCategoryName, setNewCategoryName] = reactExports.useState("");
  const [editingCategory, setEditingCategory] = reactExports.useState(null);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = reactExports.useState(false);
  const fetchWishlistData = async () => {
    if (!profile) return;
    try {
      setLoadingWishlist(true);
      const items = await getWishlistItems({
        data: {
          userId: profile.id
        }
      });
      const categories = await getWishlistCategories({
        data: {
          userId: profile.id
        }
      });
      setWishlistItems(items);
      setWishlistCategories(categories);
    } catch (error) {
      console.error("Gagal memuat data wishlist:", error);
    } finally {
      setLoadingWishlist(false);
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
        if (detailProduct && detailProduct.id === productId) {
          setIsCategoryPickerOpen(true);
        }
      } else {
        toast.success("Produk dihapus dari wishlist");
        fetchWishlistData();
      }
    } catch (err) {
      console.error("Gagal mengubah wishlist:", err);
      toast.error("Terjadi kesalahan sistem");
    }
  };
  const hasLocation = weatherSettings && Number(weatherSettings.lat) !== 0 && Number(weatherSettings.lon) !== 0;
  const [selectedShop, setSelectedShop] = reactExports.useState("Semua Toko");
  const [minPrice, setMinPrice] = reactExports.useState(null);
  const [maxPrice, setMaxPrice] = reactExports.useState(null);
  const [sortBy, setSortBy] = reactExports.useState("default");
  const [isFilterOpen, setIsFilterOpen] = reactExports.useState(false);
  const [tempSelectedShop, setTempSelectedShop] = reactExports.useState("Semua Toko");
  const [tempMinPrice, setTempMinPrice] = reactExports.useState("");
  const [tempMaxPrice, setTempMaxPrice] = reactExports.useState("");
  const [tempSortBy, setTempSortBy] = reactExports.useState("default");
  const [routeDistances, setRouteDistances] = reactExports.useState({});
  const detailMapContainerRef = reactExports.useRef(null);
  const detailMapRef = reactExports.useRef(null);
  const [detailMapRoute, setDetailMapRoute] = reactExports.useState(null);
  const [loadingRouteGeometry, setLoadingRouteGeometry] = reactExports.useState(false);
  const carouselScrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (detailProduct || isFilterOpen || zoomImageUrl || isManageCategoriesOpen || isCategoryPickerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [detailProduct, isFilterOpen, zoomImageUrl, isManageCategoriesOpen, isCategoryPickerOpen]);
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
  const getFirstProductImage = (raw) => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {
    }
    return raw;
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
        return !parsed.blocks.some((b) => {
          if (b.type === "paragraph" || b.type === "heading") return b.text?.trim().length > 0;
          if (b.type === "bullet") return b.items?.some((i) => i?.trim().length > 0);
          return false;
        });
      }
    } catch {
    }
    return raw.trim().length === 0;
  };
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
  reactExports.useEffect(() => {
    if (!weatherSettings || products.length === 0) return;
    const fetchRouteDistances = async () => {
      const userLat = Number(weatherSettings.lat);
      const userLon = Number(weatherSettings.lon);
      if (isNaN(userLat) || isNaN(userLon)) return;
      const uniqueShops = /* @__PURE__ */ new Map();
      products.forEach((p) => {
        if (p.shop_latitude !== null && p.shop_longitude !== null && p.shop_latitude !== void 0 && p.shop_longitude !== void 0) {
          const key = `${p.shop_latitude},${p.shop_longitude}`;
          uniqueShops.set(key, {
            lat: Number(p.shop_latitude),
            lon: Number(p.shop_longitude)
          });
        }
      });
      const distances = {};
      await Promise.all(Array.from(uniqueShops.entries()).map(async ([key, coord]) => {
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${coord.lon},${coord.lat}?overview=false`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.code === "Ok" && data.routes && data.routes[0]) {
              distances[key] = data.routes[0].distance / 1e3;
              return;
            }
          }
        } catch (e) {
          console.error(`Gagal mengambil rute OSRM untuk ${key}:`, e);
        }
        distances[key] = calculateDistance(userLat, userLon, coord.lat, coord.lon);
      }));
      setRouteDistances(distances);
    };
    fetchRouteDistances();
  }, [products, weatherSettings]);
  reactExports.useEffect(() => {
    if (!detailProduct || !weatherSettings) {
      setDetailMapRoute(null);
      return;
    }
    const userLat = Number(weatherSettings.lat);
    const userLon = Number(weatherSettings.lon);
    const shopLat = Number(detailProduct.shop_latitude);
    const shopLon = Number(detailProduct.shop_longitude);
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
  }, [detailProduct, weatherSettings]);
  reactExports.useEffect(() => {
    if (!detailProduct || !weatherSettings || !detailMapContainerRef.current) {
      if (detailMapRef.current) {
        detailMapRef.current.remove();
        detailMapRef.current = null;
      }
      return;
    }
    const userLat = Number(weatherSettings.lat);
    const userLon = Number(weatherSettings.lon);
    const shopLat = Number(detailProduct.shop_latitude);
    const shopLon = Number(detailProduct.shop_longitude);
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
      }).addTo(map).bindTooltip(detailProduct.shop_name || "Toko Tani", {
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
  }, [detailProduct, weatherSettings, detailMapRoute]);
  const formatWhatsappLink = (number, productName) => {
    let cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.slice(1);
    }
    const text = encodeURIComponent(`Halo, saya tertarik dengan produk Anda di Kebunin: *${productName}*. Apakah masih tersedia?`);
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };
  reactExports.useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const shops = ["Semua Toko", "Kebunin Resmi", ...Array.from(new Set(products.map((p) => p.shop_name).filter(Boolean)))];
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(q.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedShop === "Kebunin Resmi") {
      if (p.admin_id !== null) return false;
    } else if (selectedShop !== "Semua Toko") {
      if (p.shop_name !== selectedShop) return false;
    }
    if (minPrice !== null && p.price < minPrice) return false;
    if (maxPrice !== null && p.price > maxPrice) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    if (sortBy === "name_desc") return b.name.localeCompare(a.name);
    if (sortBy === "distance_asc") {
      const distA = getProductDistance(a);
      const distB = getProductDistance(b);
      if (distA === null) return 1;
      if (distB === null) return -1;
      return distA - distB;
    }
    return 0;
  });
  const getWishlistFilteredItems = () => {
    return wishlistItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(q.toLowerCase());
      if (!matchesSearch) return false;
      if (selectedWishlistCategory === "unassigned") {
        return !item.category_id;
      } else if (selectedWishlistCategory !== null) {
        return item.category_id === selectedWishlistCategory;
      }
      return true;
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-primary-dark text-primary-foreground px-5 pt-8 pb-5 rounded-b-3xl shadow-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-primary-foreground text-xl font-bold", children: "Toko Kebun" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari obat, bibit, pupuk…", className: "w-full pl-9 pr-3 h-11 rounded-xl bg-card text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-accent transition-all text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setTempSelectedShop(selectedShop);
          setTempMinPrice(minPrice !== null ? String(minPrice) : "");
          setTempMaxPrice(maxPrice !== null ? String(maxPrice) : "");
          setTempSortBy(sortBy);
          setIsFilterOpen(true);
        }, className: "size-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted active:scale-[0.97] transition-all relative cursor-pointer", title: "Filter Produk", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "size-5 text-primary" }),
          (selectedShop !== "Semua Toko" || minPrice !== null || maxPrice !== null || sortBy !== "default") && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 size-2.5 bg-accent rounded-full ring-2 ring-card animate-pulse" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mt-4.5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: activeTab === "wishlist" ? "Produk Disimpan" : "Katalog Produk" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex bg-card border border-border/85 p-0.5 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        if (activeTab === "products") {
          setActiveTab("wishlist");
          fetchWishlistData();
        } else {
          setActiveTab("products");
        }
      }, className: `px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${activeTab === "wishlist" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`, title: activeTab === "wishlist" ? "Kembali ke Katalog" : "Lihat Folder Simpan", children: activeTab === "wishlist" ? "Lihat Toko" : "Disimpan" }) })
    ] }),
    activeTab === "wishlist" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mt-4 flex items-center gap-2 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsManageCategoriesOpen(true), className: "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border bg-muted/40 border-border/80 text-primary hover:bg-primary/5 hover:border-primary/30 flex items-center gap-1.5 shrink-0 h-9", title: "Kelola Folder", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "size-3.5" }),
          "Kelola"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsFolderDropdownOpen(!isFolderDropdownOpen), className: "w-full px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border bg-card border-border/80 text-foreground hover:bg-muted/40 flex items-center justify-between gap-1.5 h-9", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: selectedWishlistCategory === null ? `Semua (${wishlistItems.length})` : selectedWishlistCategory === "unassigned" ? `Umum (${wishlistItems.filter((i) => !i.category_id).length})` : `${wishlistCategories.find((c) => c.id === selectedWishlistCategory)?.name || ""} (${wishlistItems.filter((i) => i.category_id === selectedWishlistCategory).length})` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 shrink-0 text-muted-foreground transition-transform duration-200", style: {
              transform: isFolderDropdownOpen ? "rotate(180deg)" : "none"
            } })
          ] }),
          isFolderDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-30", onClick: () => setIsFolderDropdownOpen(false) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 right-0 mt-1.5 bg-card border border-border/80 rounded-xl shadow-lg z-40 max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 duration-150", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                setSelectedWishlistCategory(null);
                setIsFolderDropdownOpen(false);
              }, className: `w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${selectedWishlistCategory === null ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Semua" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-medium", children: [
                  "(",
                  wishlistItems.length,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                setSelectedWishlistCategory("unassigned");
                setIsFolderDropdownOpen(false);
              }, className: `w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${selectedWishlistCategory === "unassigned" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Umum" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-medium", children: [
                  "(",
                  wishlistItems.filter((i) => !i.category_id).length,
                  ")"
                ] })
              ] }),
              wishlistCategories.map((cat) => {
                const count = wishlistItems.filter((i) => i.category_id === cat.id).length;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                  setSelectedWishlistCategory(cat.id);
                  setIsFolderDropdownOpen(false);
                }, className: `w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${selectedWishlistCategory === cat.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: cat.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-medium", children: [
                    "(",
                    count,
                    ")"
                  ] })
                ] }, cat.id);
              })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 mt-4 grid grid-cols-2 gap-3", children: loadingWishlist ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 text-center py-12 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin mx-auto mb-2 text-primary" }),
        "Memuat wishlist..."
      ] }) : getWishlistFilteredItems().length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl", children: "Belum ada produk yang disimpan di folder ini" }) : getWishlistFilteredItems().map((p) => {
        const dist = getProductDistance(p);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setDetailProduct(p), className: "bg-card rounded-2xl p-3 border border-border flex flex-col justify-between hover:shadow-md transition-all duration-250 cursor-pointer active:scale-[0.99] relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center mb-2.5 border border-border/20 relative cursor-pointer hover:border-primary/30 transition-colors", onClick: (e) => {
              const images = parseProductImages(p.image_url);
              if (images.length > 0) {
                e.stopPropagation();
                setZoomImages(images);
                setZoomImageIdx(0);
                setZoomImageUrl(images[0]);
              }
            }, children: getFirstProductImage(p.image_url) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getFirstProductImage(p.image_url), alt: p.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-9 text-primary animate-pulse-slow" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[14px] font-semibold text-foreground line-clamp-1", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-bold mt-0.5 text-sm", children: [
              "Rp ",
              p.price.toLocaleString("id-ID")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1 bg-muted/60 border border-border/80 px-2 py-0.5 rounded-lg w-fit", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "size-3 text-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium truncate max-w-[80px]", title: p.shop_name ?? "Kebunin Resmi", children: p.shop_name ?? "Kebunin Resmi" }),
              dist !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-primary font-semibold border-l border-border/80 pl-1.5 ml-1 shrink-0", children: [
                dist.toFixed(1),
                " km"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3.5 w-full min-h-[40px] bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/95 transition-colors flex items-center justify-center gap-1.5", children: "Detail & Hubungi" })
        ] }, p.id);
      }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      !loading && !profileLoading && !hasLocation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-5 mt-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex gap-3 items-start animate-in fade-in duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "size-4 text-amber-600 dark:text-amber-400" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-amber-800 dark:text-amber-300 mb-0.5", children: "Lokasi Belum Diatur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed", children: "Atur lokasi Anda agar bisa melihat jarak dan rute perjalanan ke toko terdekat." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
            to: "/profil"
          }), className: "mt-2 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-800/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
            "Atur Lokasi Sekarang"
          ] })
        ] })
      ] }),
      !loading && (selectedShop !== "Semua Toko" || minPrice !== null || maxPrice !== null || sortBy !== "default") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mt-4 flex flex-wrap gap-2 animate-in fade-in duration-200", children: [
        selectedShop !== "Semua Toko" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-semibold bg-accent-soft text-primary border border-accent/20 px-3 py-1 rounded-full", children: [
          "Toko: ",
          selectedShop,
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedShop("Semua Toko"), className: "hover:text-destructive font-bold ml-1 font-mono text-[9px] cursor-pointer", children: "✕" })
        ] }),
        minPrice !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-semibold bg-accent-soft text-primary border border-accent/20 px-3 py-1 rounded-full", children: [
          "Min: Rp ",
          minPrice.toLocaleString("id-ID"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMinPrice(null), className: "hover:text-destructive font-bold ml-1 font-mono text-[9px] cursor-pointer", children: "✕" })
        ] }),
        maxPrice !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-semibold bg-accent-soft text-primary border border-accent/20 px-3 py-1 rounded-full", children: [
          "Max: Rp ",
          maxPrice.toLocaleString("id-ID"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMaxPrice(null), className: "hover:text-destructive font-bold ml-1 font-mono text-[9px] cursor-pointer", children: "✕" })
        ] }),
        sortBy !== "default" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-semibold bg-accent-soft text-primary border border-accent/20 px-3 py-1 rounded-full", children: [
          "Urut: ",
          sortBy === "distance_asc" ? "Jarak Terdekat" : sortBy === "price_asc" ? "Harga Terendah" : sortBy === "price_desc" ? "Harga Tertinggi" : sortBy === "name_asc" ? "Nama A-Z" : "Nama Z-A",
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSortBy("default"), className: "hover:text-destructive font-bold ml-1 font-mono text-[9px] cursor-pointer", children: "✕" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setSelectedShop("Semua Toko");
          setMinPrice(null);
          setMaxPrice(null);
          setSortBy("default");
        }, className: "text-[10px] font-bold text-destructive hover:underline ml-1 cursor-pointer align-middle py-1", children: "Hapus Semua" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 mt-4 grid grid-cols-2 gap-3 pb-24", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 text-center py-12 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin mx-auto mb-2 text-primary" }),
        "Memuat produk..."
      ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl", children: "Belum ada obat/produk di kategori ini" }) : filtered.map((p) => {
        const dist = getProductDistance(p);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setDetailProduct(p), className: "bg-card rounded-2xl p-3 border border-border flex flex-col justify-between hover:shadow-md transition-all duration-250 cursor-pointer active:scale-[0.99]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center mb-2.5 border border-border/20 relative cursor-pointer hover:border-primary/30 transition-colors", onClick: (e) => {
              const images = parseProductImages(p.image_url);
              if (images.length > 0) {
                e.stopPropagation();
                setZoomImages(images);
                setZoomImageIdx(0);
                setZoomImageUrl(images[0]);
              }
            }, children: getFirstProductImage(p.image_url) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getFirstProductImage(p.image_url), alt: p.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-9 text-primary animate-pulse-slow" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[14px] font-semibold text-foreground line-clamp-1", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-bold mt-0.5 text-sm", children: [
              "Rp ",
              p.price.toLocaleString("id-ID")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1 bg-muted/60 border border-border/80 px-2 py-0.5 rounded-lg w-fit", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "size-3 text-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium truncate max-w-[80px]", title: p.shop_name ?? "Kebunin Resmi", children: p.shop_name ?? "Kebunin Resmi" }),
              dist !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-primary font-semibold border-l border-border/80 pl-1.5 ml-1 shrink-0", children: [
                dist.toFixed(1),
                " km"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3.5 w-full min-h-[40px] bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/95 transition-colors flex items-center justify-center gap-1.5", children: "Detail & Hubungi" })
        ] }, p.id);
      }) })
    ] }),
    detailProduct && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setDetailProduct(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto my-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-6 pb-5 scrollbar-none", children: [
          (() => {
            const imagesList = parseProductImages(detailProduct.image_url);
            if (imagesList.length > 0) {
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full aspect-square rounded-2xl overflow-hidden mb-3 border border-border/50 bg-muted relative group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: carouselScrollRef, onScroll: handleScroll, className: "w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth", children: imagesList.map((imgUrl, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full shrink-0 snap-center cursor-pointer", onClick: () => {
                    setZoomImages(imagesList);
                    setZoomImageIdx(idx);
                    setZoomImageUrl(imgUrl);
                  }, title: "Klik untuk memperbesar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgUrl, alt: `${detailProduct.name} ${idx + 1}`, className: "w-full h-full object-cover select-none pointer-events-none" }) }, idx)) }),
                  imagesList.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none", children: imagesList.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 rounded-full transition-all duration-200 ${idx === currentImgIdx ? "w-3.5 bg-primary" : "w-1.5 bg-white/60"}` }, idx)) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full z-10 select-none", children: [
                      currentImgIdx + 1,
                      "/",
                      imagesList.length
                    ] })
                  ] })
                ] }),
                imagesList.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-4 overflow-x-auto pb-1 justify-start scrollbar-none", children: imagesList.map((imgUrl, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => scrollToImage(idx), className: `size-13 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${idx === currentImgIdx ? "border-primary scale-[0.98] shadow-xs" : "border-border/60 hover:border-primary/40"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgUrl, alt: `${detailProduct.name} thumbnail ${idx + 1}`, className: "w-full h-full object-cover" }) }, idx)) })
              ] });
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-2xl bg-accent-soft flex items-center justify-center mb-4 border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-10 text-primary" }) });
          })(),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground leading-snug tracking-tight mb-2", children: detailProduct.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 mb-5 pb-4 border-b border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-extrabold text-primary", children: [
              "Rp ",
              detailProduct.price.toLocaleString("id-ID")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => handleToggleWishlist(detailProduct.id, e), className: "size-9 rounded-full bg-muted/65 hover:bg-muted active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-border/30", title: wishlistItems.some((item) => item.id === detailProduct.id) ? "Hapus dari Wishlist" : "Simpan ke Wishlist", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `size-4.5 transition-all ${wishlistItems.some((item) => item.id === detailProduct.id) ? "fill-destructive text-destructive scale-110" : "text-muted-foreground hover:text-foreground"}` }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            detailProduct.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1", children: "Deskripsi Produk" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50", children: renderDescriptionBlocks(parseDescription(detailProduct.description)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2", children: "Informasi Toko / Penjual" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "size-4.5 text-primary mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: detailProduct.shop_name ?? "Kebunin Resmi" }),
                      getProductDistance(detailProduct) !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] bg-primary-dark text-white font-bold px-2 py-0.5 rounded-full shrink-0", children: [
                        getProductDistance(detailProduct)?.toFixed(1),
                        " km"
                      ] })
                    ] }),
                    !isDescriptionEmpty(detailProduct.shop_description) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: renderDescriptionBlocks(parseDescription(detailProduct.shop_description)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: "-" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 border-t border-primary/5 pt-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4 text-primary mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: detailProduct.shop_address && detailProduct.shop_address.trim() !== "" ? detailProduct.shop_latitude !== void 0 && detailProduct.shop_latitude !== null && detailProduct.shop_longitude !== void 0 && detailProduct.shop_longitude !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://www.google.com/maps/search/?api=1&query=${detailProduct.shop_latitude},${detailProduct.shop_longitude}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-primary font-medium hover:underline flex items-center gap-1 group w-fit", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: detailProduct.shop_address }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground opacity-80 group-hover:opacity-100 shrink-0 font-normal ml-1", children: "(Buka di Maps)" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detailProduct.shop_address)}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-primary font-medium hover:underline flex items-center gap-1 group w-fit", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: detailProduct.shop_address }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground opacity-80 group-hover:opacity-100 shrink-0 font-normal ml-1", children: "(Cari di Maps)" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "-" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 border-t border-primary/5 pt-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4 text-emerald-500 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "WhatsApp Hubungi Penjual" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground", children: detailProduct.shop_whatsapp && detailProduct.shop_whatsapp.trim() !== "" ? detailProduct.shop_whatsapp : "-" })
                  ] })
                ] })
              ] }),
              detailProduct.shop_latitude !== null && detailProduct.shop_longitude !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 animate-in fade-in duration-200", children: [
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
                      setDetailProduct(null);
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDetailProduct(null), className: "flex-1 py-3 px-4 border border-border text-foreground hover:bg-muted font-bold text-xs rounded-xl transition-all cursor-pointer text-center", children: "Tutup" }),
          detailProduct.shop_whatsapp ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: formatWhatsappLink(detailProduct.shop_whatsapp, detailProduct.name), target: "_blank", rel: "noopener noreferrer", className: "flex-[2] bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4" }),
            "Hubungi Penjual"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: true, className: "flex-[2] bg-muted text-muted-foreground py-3 px-4 rounded-xl text-xs font-bold cursor-not-allowed text-center", children: "Kontak Tidak Tersedia" })
        ] })
      ] })
    ] }),
    isFilterOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setIsFilterOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto", children: [
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "size-3.5" }),
              " Urutkan Berdasarkan"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [{
              value: "default",
              label: "Pilihan Default"
            }, {
              value: "distance_asc",
              label: "Jarak Terdekat"
            }, {
              value: "price_asc",
              label: "Harga Terendah"
            }, {
              value: "price_desc",
              label: "Harga Tertinggi"
            }, {
              value: "name_asc",
              label: "Nama A - Z"
            }, {
              value: "name_desc",
              label: "Nama Z - A"
            }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTempSortBy(opt.value), className: `px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${tempSortBy === opt.value ? "bg-primary-dark text-white border-primary shadow-sm" : "bg-muted/30 text-foreground border-transparent hover:bg-muted/80"}`, children: opt.label }, opt.value)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "size-3.5" }),
              " Penyedia / Toko"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: shops.map((shop) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTempSelectedShop(shop), className: `px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${tempSelectedShop === shop ? "bg-primary-dark text-white border-primary shadow-sm" : "bg-muted/30 text-foreground border-transparent hover:bg-muted/80"}`, children: shop }, shop)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5", children: "Rentang Harga (Rp)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground", children: "Rp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: tempMinPrice, onChange: (e) => setTempMinPrice(e.target.value), placeholder: "Minimum", className: "w-full pl-8 pr-3 h-10 border border-border rounded-xl bg-background text-xs outline-none focus:ring-2 focus:ring-primary/20", min: 0 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-bold", children: "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground", children: "Rp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: tempMaxPrice, onChange: (e) => setTempMaxPrice(e.target.value), placeholder: "Maksimum", className: "w-full pl-8 pr-3 h-10 border border-border rounded-xl bg-background text-xs outline-none focus:ring-2 focus:ring-primary/20", min: 0 })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-8 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            setTempSelectedShop("Semua Toko");
            setTempMinPrice("");
            setTempMaxPrice("");
            setTempSortBy("default");
          }, className: "flex-1 py-3 bg-muted text-muted-foreground rounded-2xl font-bold text-xs hover:bg-muted/80 active:scale-[0.98] transition-all text-center cursor-pointer", children: "Reset Semua" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            setSelectedShop(tempSelectedShop);
            setMinPrice(tempMinPrice.trim() !== "" ? Number(tempMinPrice) : null);
            setMaxPrice(tempMaxPrice.trim() !== "" ? Number(tempMaxPrice) : null);
            setSortBy(tempSortBy);
            setIsFilterOpen(false);
          }, className: "flex-1 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-xs hover:bg-primary/95 active:scale-[0.98] transition-all text-center cursor-pointer shadow-sm", children: "Terapkan Filter" })
        ] })
      ] })
    ] }),
    zoomImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300", onClick: () => {
      setZoomImageUrl(null);
      setZoomImages([]);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[85vw] h-[85vw] max-w-[340px] max-h-[340px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3.5 flex items-center justify-between text-white z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm drop-shadow-sm", children: "Foto Produk" }),
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
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: zoomImageUrl, alt: "Produk", className: "w-full h-full object-cover" })
    ] }) }),
    isCategoryPickerOpen && detailProduct && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-55 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setIsCategoryPickerOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-250 max-h-[60vh] flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground mb-4", children: "Simpan Produk ke Folder" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
            const savedItem = wishlistItems.find((item) => item.id === detailProduct.id);
            if (savedItem) {
              await updateWishlistItemCategory({
                data: {
                  userId: profile.id,
                  productId: detailProduct.id,
                  categoryId: null
                }
              });
              fetchWishlistData();
              toast.success("Folder simpan diubah ke Umum");
            }
            setIsCategoryPickerOpen(false);
          }, className: `w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${(() => {
            const savedItem = wishlistItems.find((item) => item.id === detailProduct.id);
            return !savedItem?.category_id;
          })() ? "border-primary bg-primary/5 text-primary" : "border-border/60 text-foreground hover:bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Umum (Default)" }) }),
          wishlistCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
            await updateWishlistItemCategory({
              data: {
                userId: profile.id,
                productId: detailProduct.id,
                categoryId: cat.id
              }
            });
            fetchWishlistData();
            toast.success(`Folder simpan diubah ke ${cat.name}`);
            setIsCategoryPickerOpen(false);
          }, className: `w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${(() => {
            const savedItem = wishlistItems.find((item) => item.id === detailProduct.id);
            return savedItem?.category_id === cat.id;
          })() ? "border-primary bg-primary/5 text-primary" : "border-border/60 text-foreground hover:bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cat.name }) }, cat.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 pt-4 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Buat folder baru...", value: newCategoryName, onChange: (e) => setNewCategoryName(e.target.value), className: "flex-1 px-3 py-2 text-xs rounded-xl bg-muted outline-none border border-border/40 focus:border-primary transition-all text-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
            if (!newCategoryName.trim()) return;
            try {
              const res = await createWishlistCategory({
                data: {
                  userId: profile.id,
                  name: newCategoryName.trim()
                }
              });
              if (res.success) {
                toast.success("Folder baru dibuat");
                await updateWishlistItemCategory({
                  data: {
                    userId: profile.id,
                    productId: detailProduct.id,
                    categoryId: res.id
                  }
                });
                setNewCategoryName("");
                fetchWishlistData();
                setIsCategoryPickerOpen(false);
              }
            } catch (err) {
              console.error("Gagal membuat folder:", err);
            }
          }, className: "px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/95 transition-colors cursor-pointer", children: "Buat" })
        ] })
      ] })
    ] }),
    isManageCategoriesOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setIsManageCategoriesOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto my-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-6 pb-4 scrollbar-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground mb-4", children: "Kelola Folder Wishlist" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 p-3 rounded-2xl border border-border/60 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "Buat Folder Baru" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Nama folder...", value: newCategoryName, onChange: (e) => setNewCategoryName(e.target.value), className: "flex-1 px-3 py-2 text-xs rounded-xl bg-card border border-border outline-none focus:ring-1 focus:ring-primary text-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
                if (!newCategoryName.trim()) return;
                try {
                  const res = await createWishlistCategory({
                    data: {
                      userId: profile.id,
                      name: newCategoryName.trim()
                    }
                  });
                  if (res.success) {
                    toast.success("Folder baru berhasil dibuat");
                    setNewCategoryName("");
                    fetchWishlistData();
                  }
                } catch (err) {
                  console.error("Gagal membuat folder:", err);
                }
              }, className: "px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/95 transition-colors cursor-pointer", children: "Tambah" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2", children: "Daftar Folder" }),
          wishlistCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic py-2", children: "Belum ada folder kustom" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: wishlistCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-card border border-border rounded-xl flex items-center justify-between gap-3", children: editingCategory?.id === cat.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: editingCategory?.name || "", onChange: (e) => {
              if (editingCategory) {
                setEditingCategory({
                  id: editingCategory.id,
                  name: e.target.value
                });
              }
            }, className: "flex-1 px-2.5 py-1 text-xs rounded-lg bg-muted outline-none border border-border text-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
              if (!editingCategory?.name.trim()) return;
              await updateWishlistCategory({
                data: {
                  id: cat.id,
                  name: editingCategory.name.trim()
                }
              });
              toast.success("Folder berhasil diubah");
              setEditingCategory(null);
              fetchWishlistData();
            }, className: "px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg", children: "Simpan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEditingCategory(null), className: "px-2.5 py-1 bg-muted text-muted-foreground text-[10px] font-bold rounded-lg", children: "Batal" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: cat.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEditingCategory({
                id: cat.id,
                name: cat.name
              }), className: "text-primary hover:underline text-[11px] font-bold cursor-pointer", children: "Ubah" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border text-[10px]", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
                if (confirm(`Apakah Anda yakin ingin menghapus folder "${cat.name}"? Produk di dalamnya akan dipindahkan ke folder "Umum"`)) {
                  await deleteWishlistCategory({
                    data: {
                      id: cat.id
                    }
                  });
                  toast.success("Folder berhasil dihapus");
                  fetchWishlistData();
                }
              }, className: "text-destructive hover:underline text-[11px] font-bold cursor-pointer", children: "Hapus" })
            ] })
          ] }) }, cat.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-border bg-card shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsManageCategoriesOpen(false), className: "w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-xl transition-all cursor-pointer text-center", children: "Tutup" }) })
      ] })
    ] })
  ] });
}
export {
  TokoPage as component
};
