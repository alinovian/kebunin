import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Search, ShoppingBag, Loader2, Store, MapPin, Phone, Filter, ArrowUpDown, SlidersHorizontal, Navigation, AlertCircle, Heart, Folder, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useWeather } from "@/hooks/use-weather";
import { 
  getProducts, 
  buyProduct,
  getWishlistCategories,
  createWishlistCategory,
  updateWishlistCategory,
  deleteWishlistCategory,
  getWishlistItems,
  toggleWishlistItem,
  updateWishlistItemCategory
} from "@/lib/api/db.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/toko")({
  head: () => ({
    meta: [
      { title: "Toko Kebunin | Bibit & Pupuk Urban" },
      { name: "description", content: "Belanja bibit, pupuk organik, obat-obatan, dan alat berkebun." },
    ],
  }),
  component: TokoPage,
});

type Product = {
  id: string;
  name: string;
  price: number;
  coin: number;
  description: string | null;
  admin_id: string | null;
  shop_name: string | null;
  shop_description: string | null;
  shop_address: string | null;
  shop_whatsapp: string | null;
  shop_latitude?: number | string | null;
  shop_longitude?: number | string | null;
  image_url?: string | null;
};

type DescBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "bullet"; items: string[] };

type DescDocument = { version: 1; blocks: DescBlock[] };

function TokoPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { settings: weatherSettings } = useWeather();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
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
            zoomCarouselScrollRef.current.scrollLeft = zoomImageIdx * zoomCarouselScrollRef.current.clientWidth;
          }
        }, 50);
      }
    }
  }, [zoomImageUrl, zoomImages]);

  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    setCurrentImgIdx(0);
  }, [detailProduct]);

  // Tab control
  const [activeTab, setActiveTab] = useState<"products" | "wishlist">("products");

  // Wishlist states
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [wishlistCategories, setWishlistCategories] = useState<any[]>([]);
  const [selectedWishlistCategory, setSelectedWishlistCategory] = useState<string | null>(null); // null = "Semua"
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false);

  // Modal / management states
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  
  // Category picker popup when saving/bookmarked in modal
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  const fetchWishlistData = async () => {
    if (!profile) return;
    try {
      setLoadingWishlist(true);
      const items = await getWishlistItems({ data: { userId: profile.id } });
      const categories = await getWishlistCategories({ data: { userId: profile.id } });
      setWishlistItems(items);
      setWishlistCategories(categories);
    } catch (error) {
      console.error("Gagal memuat data wishlist:", error);
    } finally {
      setLoadingWishlist(false);
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
        data: { userId: profile.id, productId }
      });
      if (res.action === "added") {
        toast.success("Produk disimpan ke wishlist");
        fetchWishlistData();
        // If from detailed modal, offer to select folder immediately
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

  // Check if user has set their location
  const hasLocation = weatherSettings && Number(weatherSettings.lat) !== 0 && Number(weatherSettings.lon) !== 0;

  // Applied Filter States
  const [selectedShop, setSelectedShop] = useState("Semua Toko");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("default");

  // Temporary Filter States (inside bottom sheet)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempSelectedShop, setTempSelectedShop] = useState("Semua Toko");
  const [tempMinPrice, setTempMinPrice] = useState<string>("");
  const [tempMaxPrice, setTempMaxPrice] = useState<string>("");
  const [tempSortBy, setTempSortBy] = useState("default");
  const [routeDistances, setRouteDistances] = useState<Record<string, number>>({});

  // Detail Map Refs & States
  const detailMapContainerRef = useRef<HTMLDivElement | null>(null);
  const detailMapRef = useRef<any>(null);
  const [detailMapRoute, setDetailMapRoute] = useState<[number, number][] | null>(null);
  const [loadingRouteGeometry, setLoadingRouteGeometry] = useState(false);
  const carouselScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (detailProduct || isFilterOpen || zoomImageUrl || isManageCategoriesOpen || isCategoryPickerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [detailProduct, isFilterOpen, zoomImageUrl, isManageCategoriesOpen, isCategoryPickerOpen]);

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

  const getFirstProductImage = (raw: string | null | undefined): string | null => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {}
    return raw;
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
        return <p key={i} className="font-bold text-foreground text-sm mb-1">{block.text}</p>;
      }
      if (block.type === "bullet") {
        return (
          <ul key={i} className="list-disc list-inside space-y-0.5 text-muted-foreground text-sm mb-1 pl-1">
            {block.items.filter(Boolean).map((item, j) => <li key={j} className="inline-block w-full">{item}</li>)}
          </ul>
        );
      }
      return <p key={i} className="text-muted-foreground text-sm mb-1 whitespace-pre-wrap leading-relaxed">{block.text || ""}</p>;
    });
  };

  const isDescriptionEmpty = (raw: string | null | undefined): boolean => {
    if (!raw) return true;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.version === 1 && Array.isArray(parsed.blocks)) {
        return !parsed.blocks.some((b: any) => {
          if (b.type === "paragraph" || b.type === "heading") return b.text?.trim().length > 0;
          if (b.type === "bullet") return b.items?.some((i: any) => i?.trim().length > 0);
          return false;
        });
      }
    } catch {}
    return raw.trim().length === 0;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; // Distance in km
  };

  const getProductDistance = (p: Product) => {
    if (!weatherSettings || p.shop_latitude === null || p.shop_longitude === null || p.shop_latitude === undefined || p.shop_longitude === undefined) {
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

  // Fetch actual driving road distances from OSRM API asynchronously
  useEffect(() => {
    if (!weatherSettings || products.length === 0) return;
    
    const fetchRouteDistances = async () => {
      const userLat = Number(weatherSettings.lat);
      const userLon = Number(weatherSettings.lon);
      if (isNaN(userLat) || isNaN(userLon)) return;

      const uniqueShops = new Map<string, { lat: number; lon: number }>();
      products.forEach((p) => {
        if (p.shop_latitude !== null && p.shop_longitude !== null && p.shop_latitude !== undefined && p.shop_longitude !== undefined) {
          const key = `${p.shop_latitude},${p.shop_longitude}`;
          uniqueShops.set(key, { lat: Number(p.shop_latitude), lon: Number(p.shop_longitude) });
        }
      });

      const distances: Record<string, number> = {};
      
      await Promise.all(
        Array.from(uniqueShops.entries()).map(async ([key, coord]) => {
          try {
            const url = `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${coord.lon},${coord.lat}?overview=false`;
            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              if (data.code === "Ok" && data.routes && data.routes[0]) {
                distances[key] = data.routes[0].distance / 1000;
                return;
              }
            }
          } catch (e) {
            console.error(`Gagal mengambil rute OSRM untuk ${key}:`, e);
          }
          distances[key] = calculateDistance(userLat, userLon, coord.lat, coord.lon);
        })
      );

      setRouteDistances(distances);
    };

    fetchRouteDistances();
  }, [products, weatherSettings]);

  // Fetch OSRM route geometry when detailProduct is opened
  useEffect(() => {
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
            // OSRM returns [lon, lat], Leaflet expects [lat, lon]
            const coords = data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
            setDetailMapRoute(coords);
            setLoadingRouteGeometry(false);
            return;
          }
        }
      } catch (err) {
        console.error("Gagal memuat geometri rute OSRM:", err);
      }
      // Fallback: straight line
      setDetailMapRoute([[userLat, userLon], [shopLat, shopLon]]);
      setLoadingRouteGeometry(false);
    };

    fetchRouteGeometry();
  }, [detailProduct, weatherSettings]);

  // Initialize and update Leaflet Map in Detail Modal
  useEffect(() => {
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

    const initMap = (L: any) => {
      if (detailMapRef.current) {
        detailMapRef.current.remove();
        detailMapRef.current = null;
      }

      const map = L.map(detailMapContainerRef.current).setView([userLat, userLon], 13);
      detailMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      // 1. User Marker (Rumah)
      const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="size-6 rounded-full bg-primary border-2 border-white shadow flex items-center justify-center text-white font-bold text-[10px]">🏠</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([userLat, userLon], { icon: userIcon })
        .addTo(map)
        .bindTooltip("Rumah Anda", { permanent: false, direction: 'top' });

      // 2. Store Marker (Toko)
      const storeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="size-6 rounded-full bg-emerald-600 border-2 border-white shadow flex items-center justify-center text-white font-bold text-[10px]">🏪</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([shopLat, shopLon], { icon: storeIcon })
        .addTo(map)
        .bindTooltip(detailProduct.shop_name || "Toko Tani", { permanent: false, direction: 'top' });

      // 3. Draw Route Polyline
      let bounds = L.latLngBounds([[userLat, userLon], [shopLat, shopLon]]);
      if (detailMapRoute && detailMapRoute.length > 0) {
        L.polyline(detailMapRoute, { color: 'var(--color-primary, #0c7779)', weight: 4, opacity: 0.85 }).addTo(map);
        
        detailMapRoute.forEach(pt => {
          bounds.extend(pt);
        });
      } else {
        // Fallback straight line
        L.polyline([[userLat, userLon], [shopLat, shopLon]], { color: '#0c7779', weight: 4, opacity: 0.8, dashArray: '6, 6' }).addTo(map);
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
  }, [detailProduct, weatherSettings, detailMapRoute]);

  const formatWhatsappLink = (number: string, productName: string) => {
    let cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.slice(1);
    }
    const text = encodeURIComponent(`Halo, saya tertarik dengan produk Anda di Kebunin: *${productName}*. Apakah masih tersedia?`);
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data as Product[]);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  // Generate unique list of shops from products
  const shops = [
    "Semua Toko",
    "Kebunin Resmi",
    ...Array.from(new Set(products.map((p) => p.shop_name).filter(Boolean))) as string[]
  ];

  const filtered = products
    .filter((p) => {
      // Search Match
      const matchesSearch = p.name.toLowerCase().includes(q.toLowerCase());
      if (!matchesSearch) return false;

      // Shop Match
      if (selectedShop === "Kebunin Resmi") {
        if (p.admin_id !== null) return false;
      } else if (selectedShop !== "Semua Toko") {
        if (p.shop_name !== selectedShop) return false;
      }

      // Price Min Match
      if (minPrice !== null && p.price < minPrice) return false;

      // Price Max Match
      if (maxPrice !== null && p.price > maxPrice) return false;

      return true;
    })
    .sort((a, b) => {
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
      return 0; // default
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

  return (
    <AppShell>
      <header className="bg-primary-dark text-primary-foreground px-5 pt-8 pb-5 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-primary-foreground text-xl font-bold">Toko Kebun</h1>
        </div>

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari obat, bibit, pupuk…"
              className="w-full pl-9 pr-3 h-11 rounded-xl bg-card text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
            />
          </div>
          <button
            onClick={() => {
              setTempSelectedShop(selectedShop);
              setTempMinPrice(minPrice !== null ? String(minPrice) : "");
              setTempMaxPrice(maxPrice !== null ? String(maxPrice) : "");
              setTempSortBy(sortBy);
              setIsFilterOpen(true);
            }}
            className="size-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted active:scale-[0.97] transition-all relative cursor-pointer"
            title="Filter Produk"
          >
            <SlidersHorizontal className="size-5 text-primary" />
            {(selectedShop !== "Semua Toko" || minPrice !== null || maxPrice !== null || sortBy !== "default") && (
              <span className="absolute top-2 right-2 size-2.5 bg-accent rounded-full ring-2 ring-card animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* Sub-header View Switcher in Body */}
      <div className="px-5 mt-4.5 flex items-center justify-between">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {activeTab === "wishlist" ? "Produk Disimpan" : "Katalog Produk"}
        </h2>
        <div className="flex bg-card border border-border/85 p-0.5 rounded-xl">
          <button
            onClick={() => {
              if (activeTab === "products") {
                setActiveTab("wishlist");
                fetchWishlistData();
              } else {
                setActiveTab("products");
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
              activeTab === "wishlist"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={activeTab === "wishlist" ? "Kembali ke Katalog" : "Lihat Folder Simpan"}
          >
            {activeTab === "wishlist" ? "Lihat Toko" : "Disimpan"}
          </button>
        </div>
      </div>

      {activeTab === "wishlist" ? (
        <div className="pb-24">
          <div className="px-5 mt-4 flex items-center gap-2 relative">
            {/* Kelola Folder Button */}
            <button
              onClick={() => setIsManageCategoriesOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border bg-muted/40 border-border/80 text-primary hover:bg-primary/5 hover:border-primary/30 flex items-center gap-1.5 shrink-0 h-9"
              title="Kelola Folder"
            >
              <Folder className="size-3.5" />
              Kelola
            </button>

            {/* Folder Dropdown Selector */}
            <div className="relative flex-1 min-w-0">
              <button
                onClick={() => setIsFolderDropdownOpen(!isFolderDropdownOpen)}
                className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border bg-card border-border/80 text-foreground hover:bg-muted/40 flex items-center justify-between gap-1.5 h-9"
              >
                <span className="truncate">
                  {selectedWishlistCategory === null
                    ? `Semua (${wishlistItems.length})`
                    : selectedWishlistCategory === "unassigned"
                    ? `Umum (${wishlistItems.filter((i) => !i.category_id).length})`
                    : `${wishlistCategories.find((c) => c.id === selectedWishlistCategory)?.name || ""} (${wishlistItems.filter((i) => i.category_id === selectedWishlistCategory).length})`}
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" style={{ transform: isFolderDropdownOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {isFolderDropdownOpen && (
                <>
                  {/* Backdrop overlay to close dropdown */}
                  <div className="fixed inset-0 z-30" onClick={() => setIsFolderDropdownOpen(false)} />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute left-0 right-0 mt-1.5 bg-card border border-border/80 rounded-xl shadow-lg z-40 max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => {
                        setSelectedWishlistCategory(null);
                        setIsFolderDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedWishlistCategory === null ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span>Semua</span>
                      <span className="text-[10px] text-muted-foreground font-medium">({wishlistItems.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedWishlistCategory("unassigned");
                        setIsFolderDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedWishlistCategory === "unassigned" ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span>Umum</span>
                      <span className="text-[10px] text-muted-foreground font-medium">({wishlistItems.filter((i) => !i.category_id).length})</span>
                    </button>

                    {wishlistCategories.map((cat) => {
                      const count = wishlistItems.filter((i) => i.category_id === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedWishlistCategory(cat.id);
                            setIsFolderDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                            selectedWishlistCategory === cat.id ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Wishlist Items Grid */}
          <div className="px-5 mt-4 grid grid-cols-2 gap-3">
            {loadingWishlist ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <Loader2 className="size-6 animate-spin mx-auto mb-2 text-primary" />
                Memuat wishlist...
              </div>
            ) : getWishlistFilteredItems().length === 0 ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
                Belum ada produk yang disimpan di folder ini
              </div>
            ) : (
              getWishlistFilteredItems().map((p: any) => {
                const dist = getProductDistance(p);
                return (
                  <div
                    key={p.id}
                    onClick={() => setDetailProduct(p)}
                    className="bg-card rounded-2xl p-3 border border-border flex flex-col justify-between hover:shadow-md transition-all duration-250 cursor-pointer active:scale-[0.99] relative"
                  >
                    <div>
                      <div
                        className="aspect-square rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center mb-2.5 border border-border/20 relative cursor-pointer hover:border-primary/30 transition-colors"
                        onClick={(e) => {
                          const images = parseProductImages(p.image_url);
                          if (images.length > 0) {
                            e.stopPropagation();
                            setZoomImages(images);
                            setZoomImageIdx(0);
                            setZoomImageUrl(images[0]);
                          }
                        }}
                      >
                        {getFirstProductImage(p.image_url) ? (
                          <img
                            src={getFirstProductImage(p.image_url)!}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="size-9 text-primary animate-pulse-slow" />
                        )}
                      </div>
                      <h2 className="text-[14px] font-semibold text-foreground line-clamp-1">{p.name}</h2>
                      <p className="text-primary font-bold mt-0.5 text-sm">
                        Rp {p.price.toLocaleString("id-ID")}
                      </p>
                      {/* Shop Name Label */}
                      <div className="mt-2 flex items-center gap-1 bg-muted/60 border border-border/80 px-2 py-0.5 rounded-lg w-fit">
                        <Store className="size-3 text-primary shrink-0" />
                        <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[80px]" title={p.shop_name ?? "Kebunin Resmi"}>
                          {p.shop_name ?? "Kebunin Resmi"}
                        </span>
                        {dist !== null && (
                          <span className="text-[9px] text-primary font-semibold border-l border-border/80 pl-1.5 ml-1 shrink-0">
                            {dist.toFixed(1)} km
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3.5 w-full min-h-[40px] bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/95 transition-colors flex items-center justify-center gap-1.5">
                      Detail & Hubungi
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Location Required Banner */}
          {!loading && !profileLoading && !hasLocation && (
            <div className="mx-5 mt-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex gap-3 items-start animate-in fade-in duration-300">
              <div className="shrink-0 mt-0.5">
                <div className="size-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <Navigation className="size-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-0.5">Lokasi Belum Diatur</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                  Atur lokasi Anda agar bisa melihat jarak dan rute perjalanan ke toko terdekat.
                </p>
                <button
                  onClick={() => navigate({ to: "/profil" })}
                  className="mt-2 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-800/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <MapPin className="size-3" />
                  Atur Lokasi Sekarang
                </button>
              </div>
            </div>
          )}

          {/* Active Filter Tags */}
          {!loading && (selectedShop !== "Semua Toko" || minPrice !== null || maxPrice !== null || sortBy !== "default") && (
            <div className="px-5 mt-4 flex flex-wrap gap-2 animate-in fade-in duration-200">
              {selectedShop !== "Semua Toko" && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-accent-soft text-primary border border-accent/20 px-3 py-1 rounded-full">
                  Toko: {selectedShop}
                  <button onClick={() => setSelectedShop("Semua Toko")} className="hover:text-destructive font-bold ml-1 font-mono text-[9px] cursor-pointer">✕</button>
                </span>
              )}
              {minPrice !== null && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-accent-soft text-primary border border-accent/20 px-3 py-1 rounded-full">
                  Min: Rp {minPrice.toLocaleString("id-ID")}
                  <button onClick={() => setMinPrice(null)} className="hover:text-destructive font-bold ml-1 font-mono text-[9px] cursor-pointer">✕</button>
                </span>
              )}
              {maxPrice !== null && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-accent-soft text-primary border border-accent/20 px-3 py-1 rounded-full">
                  Max: Rp {maxPrice.toLocaleString("id-ID")}
                  <button onClick={() => setMaxPrice(null)} className="hover:text-destructive font-bold ml-1 font-mono text-[9px] cursor-pointer">✕</button>
                </span>
              )}
              {sortBy !== "default" && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-accent-soft text-primary border border-accent/20 px-3 py-1 rounded-full">
                  Urut: {
                    sortBy === "distance_asc" ? "Jarak Terdekat" :
                    sortBy === "price_asc" ? "Harga Terendah" :
                    sortBy === "price_desc" ? "Harga Tertinggi" :
                    sortBy === "name_asc" ? "Nama A-Z" : "Nama Z-A"
                  }
                  <button onClick={() => setSortBy("default")} className="hover:text-destructive font-bold ml-1 font-mono text-[9px] cursor-pointer">✕</button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedShop("Semua Toko");
                  setMinPrice(null);
                  setMaxPrice(null);
                  setSortBy("default");
                }}
                className="text-[10px] font-bold text-destructive hover:underline ml-1 cursor-pointer align-middle py-1"
              >
                Hapus Semua
              </button>
            </div>
          )}

          {/* Product grid */}
          <div className="px-5 mt-4 grid grid-cols-2 gap-3 pb-24">
            {loading ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <Loader2 className="size-6 animate-spin mx-auto mb-2 text-primary" />
                Memuat produk...
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
                Belum ada obat/produk di kategori ini
              </div>
            ) : (
              filtered.map((p) => {
                const dist = getProductDistance(p);
                return (
                  <div
                    key={p.id}
                    onClick={() => setDetailProduct(p)}
                    className="bg-card rounded-2xl p-3 border border-border flex flex-col justify-between hover:shadow-md transition-all duration-250 cursor-pointer active:scale-[0.99]"
                  >
                    <div>
                      <div
                        className="aspect-square rounded-xl bg-accent-soft overflow-hidden flex items-center justify-center mb-2.5 border border-border/20 relative cursor-pointer hover:border-primary/30 transition-colors"
                        onClick={(e) => {
                          const images = parseProductImages(p.image_url);
                          if (images.length > 0) {
                            e.stopPropagation();
                            setZoomImages(images);
                            setZoomImageIdx(0);
                            setZoomImageUrl(images[0]);
                          }
                        }}
                      >
                        {getFirstProductImage(p.image_url) ? (
                          <img
                            src={getFirstProductImage(p.image_url)!}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="size-9 text-primary animate-pulse-slow" />
                        )}
                      </div>
                      <h2 className="text-[14px] font-semibold text-foreground line-clamp-1">{p.name}</h2>
                      <p className="text-primary font-bold mt-0.5 text-sm">
                        Rp {p.price.toLocaleString("id-ID")}
                      </p>
                      {/* Shop Name Label */}
                      <div className="mt-2 flex items-center gap-1 bg-muted/60 border border-border/80 px-2 py-0.5 rounded-lg w-fit">
                        <Store className="size-3 text-primary shrink-0" />
                        <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[80px]" title={p.shop_name ?? "Kebunin Resmi"}>
                          {p.shop_name ?? "Kebunin Resmi"}
                        </span>
                        {dist !== null && (
                          <span className="text-[9px] text-primary font-semibold border-l border-border/80 pl-1.5 ml-1 shrink-0">
                            {dist.toFixed(1)} km
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3.5 w-full min-h-[40px] bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/95 transition-colors flex items-center justify-center gap-1.5">
                      Detail & Hubungi
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Product Detail Modal */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setDetailProduct(null)} />
          
          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col overflow-hidden">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-muted rounded-full mx-auto my-4 shrink-0" />
            
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto px-6 pb-5 scrollbar-none">

            {(() => {
              const imagesList = parseProductImages(detailProduct.image_url);
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
                        {imagesList.map((imgUrl, idx) => (
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
                              alt={`${detailProduct.name} ${idx + 1}`}
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
                        {imagesList.map((imgUrl, idx) => (
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
                              alt={`${detailProduct.name} thumbnail ${idx + 1}`}
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
              {detailProduct.name}
            </h2>
            <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-border/40">
              <span className="text-lg font-extrabold text-primary">
                Rp {detailProduct.price.toLocaleString("id-ID")}
              </span>
              <button
                type="button"
                onClick={(e) => handleToggleWishlist(detailProduct.id, e)}
                className="size-9 rounded-full bg-muted/65 hover:bg-muted active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-border/30"
                title={wishlistItems.some((item) => item.id === detailProduct.id) ? "Hapus dari Wishlist" : "Simpan ke Wishlist"}
              >
                <Heart
                  className={`size-4.5 transition-all ${
                    wishlistItems.some((item) => item.id === detailProduct.id)
                      ? "fill-destructive text-destructive scale-110"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                />
              </button>
            </div>



            <div className="space-y-4">
              {/* Product Description */}
              {detailProduct.description && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Deskripsi Produk</p>
                  <div className="text-sm text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">
                    {renderDescriptionBlocks(parseDescription(detailProduct.description))}
                  </div>
                </div>
              )}

              {/* Shop/Seller Information */}
              <div className="border-t border-border pt-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Informasi Toko / Penjual</p>
                
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Store className="size-4.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{detailProduct.shop_name ?? "Kebunin Resmi"}</p>
                        {getProductDistance(detailProduct) !== null && (
                          <span className="text-[9px] bg-primary-dark text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                            {getProductDistance(detailProduct)?.toFixed(1)} km
                          </span>
                        )}
                      </div>
                      {!isDescriptionEmpty(detailProduct.shop_description) ? (
                        <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {renderDescriptionBlocks(parseDescription(detailProduct.shop_description))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">-</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 border-t border-primary/5 pt-2.5">
                    <MapPin className="size-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      {detailProduct.shop_address && detailProduct.shop_address.trim() !== "" ? (
                        detailProduct.shop_latitude !== undefined && detailProduct.shop_latitude !== null &&
                        detailProduct.shop_longitude !== undefined && detailProduct.shop_longitude !== null ? (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${detailProduct.shop_latitude},${detailProduct.shop_longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary font-medium hover:underline flex items-center gap-1 group w-fit"
                          >
                            <span>{detailProduct.shop_address}</span>
                            <span className="text-[10px] text-muted-foreground opacity-80 group-hover:opacity-100 shrink-0 font-normal ml-1">(Buka di Maps)</span>
                          </a>
                        ) : (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detailProduct.shop_address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary font-medium hover:underline flex items-center gap-1 group w-fit"
                          >
                            <span>{detailProduct.shop_address}</span>
                            <span className="text-[10px] text-muted-foreground opacity-80 group-hover:opacity-100 shrink-0 font-normal ml-1">(Cari di Maps)</span>
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
                      <p className="text-xs font-semibold text-foreground">WhatsApp Hubungi Penjual</p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {detailProduct.shop_whatsapp && detailProduct.shop_whatsapp.trim() !== "" ? detailProduct.shop_whatsapp : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Map to Store */}
                {detailProduct.shop_latitude !== null && detailProduct.shop_longitude !== null && (
                  <div className="mt-4 animate-in fade-in duration-200">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Rute Perjalanan ke Toko</p>
                    {hasLocation ? (
                      <>
                        <div
                          ref={detailMapContainerRef}
                          className="w-full h-48 rounded-2xl border border-border overflow-hidden relative z-0 bg-muted/40"
                          style={{ minHeight: "192px" }}
                        />
                        {loadingRouteGeometry && (
                          <p className="text-[10px] text-muted-foreground mt-1 animate-pulse">Memuat rute jalan...</p>
                        )}
                      </>
                    ) : (
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex gap-3 items-center">
                        <AlertCircle className="size-5 text-amber-500 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Lokasi Anda belum diatur</p>
                          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">Isi alamat Anda terlebih dahulu untuk melihat rute ke toko ini.</p>
                          <button
                            onClick={() => {
                              setDetailProduct(null);
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
                onClick={() => setDetailProduct(null)}
                className="flex-1 py-3 px-4 border border-border text-foreground hover:bg-muted font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Tutup
              </button>
              {detailProduct.shop_whatsapp ? (
                <a
                  href={formatWhatsappLink(detailProduct.shop_whatsapp, detailProduct.name)}
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

      {/* Filter & Sorting Bottom Sheet Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setIsFilterOpen(false)} />
          
          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
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
              {/* 1. Sorting Option */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <ArrowUpDown className="size-3.5" /> Urutkan Berdasarkan
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "default", label: "Pilihan Default" },
                    { value: "distance_asc", label: "Jarak Terdekat" },
                    { value: "price_asc", label: "Harga Terendah" },
                    { value: "price_desc", label: "Harga Tertinggi" },
                    { value: "name_asc", label: "Nama A - Z" },
                    { value: "name_desc", label: "Nama Z - A" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTempSortBy(opt.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                        tempSortBy === opt.value
                          ? "bg-primary-dark text-white border-primary shadow-sm"
                          : "bg-muted/30 text-foreground border-transparent hover:bg-muted/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Shop Option */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <Store className="size-3.5" /> Penyedia / Toko
                </p>
                <div className="flex flex-wrap gap-2">
                  {shops.map((shop) => (
                    <button
                      key={shop}
                      type="button"
                      onClick={() => setTempSelectedShop(shop)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        tempSelectedShop === shop
                          ? "bg-primary-dark text-white border-primary shadow-sm"
                          : "bg-muted/30 text-foreground border-transparent hover:bg-muted/80"
                      }`}
                    >
                      {shop}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Price Range Option */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Rentang Harga (Rp)
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Rp</span>
                    <input
                      type="number"
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                      placeholder="Minimum"
                      className="w-full pl-8 pr-3 h-10 border border-border rounded-xl bg-background text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      min={0}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-bold">—</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Rp</span>
                    <input
                      type="number"
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                      placeholder="Maksimum"
                      className="w-full pl-8 pr-3 h-10 border border-border rounded-xl bg-background text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex gap-3 mt-8 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setTempSelectedShop("Semua Toko");
                  setTempMinPrice("");
                  setTempMaxPrice("");
                  setTempSortBy("default");
                }}
                className="flex-1 py-3 bg-muted text-muted-foreground rounded-2xl font-bold text-xs hover:bg-muted/80 active:scale-[0.98] transition-all text-center cursor-pointer"
              >
                Reset Semua
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedShop(tempSelectedShop);
                  setMinPrice(tempMinPrice.trim() !== "" ? Number(tempMinPrice) : null);
                  setMaxPrice(tempMaxPrice.trim() !== "" ? Number(tempMaxPrice) : null);
                  setSortBy(tempSortBy);
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
      {/* Fullscreen Photo Lightbox / Zoom Modal */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
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
                Foto Produk
              </span>
              <button
                type="button"
                onClick={() => {
                  setZoomImageUrl(null);
                  setZoomImages([]);
                }}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
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
              <img
                src={zoomImageUrl}
                alt="Produk"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* Category Picker Pop-up (Assign item to folder) */}
      {isCategoryPickerOpen && detailProduct && (
        <div className="fixed inset-0 z-55 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsCategoryPickerOpen(false)} />
          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-250 max-h-[60vh] flex flex-col overflow-hidden">
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4 shrink-0" />
            <h3 className="text-sm font-bold text-foreground mb-4">Simpan Produk ke Folder</h3>
            
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-none">
              {/* Default "Umum" folder */}
              <button
                type="button"
                onClick={async () => {
                  const savedItem = wishlistItems.find((item) => item.id === detailProduct.id);
                  if (savedItem) {
                    await updateWishlistItemCategory({
                      data: { userId: profile!.id, productId: detailProduct.id, categoryId: null }
                    });
                    fetchWishlistData();
                    toast.success("Folder simpan diubah ke Umum");
                  }
                  setIsCategoryPickerOpen(false);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  (() => {
                    const savedItem = wishlistItems.find((item) => item.id === detailProduct.id);
                    return !savedItem?.category_id;
                  })()
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border/60 text-foreground hover:bg-muted"
                }`}
              >
                <span>Umum (Default)</span>
              </button>

              {/* Custom categories */}
              {wishlistCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={async () => {
                    await updateWishlistItemCategory({
                      data: { userId: profile!.id, productId: detailProduct.id, categoryId: cat.id }
                    });
                    fetchWishlistData();
                    toast.success(`Folder simpan diubah ke ${cat.name}`);
                    setIsCategoryPickerOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    (() => {
                      const savedItem = wishlistItems.find((item) => item.id === detailProduct.id);
                      return savedItem?.category_id === cat.id;
                    })()
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border/60 text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Add new category inside picker */}
            <div className="border-t border-border/60 pt-4 flex gap-2">
              <input
                type="text"
                placeholder="Buat folder baru..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-muted outline-none border border-border/40 focus:border-primary transition-all text-foreground"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!newCategoryName.trim()) return;
                  try {
                    const res = await createWishlistCategory({
                      data: { userId: profile!.id, name: newCategoryName.trim() }
                    });
                    if (res.success) {
                      toast.success("Folder baru dibuat");
                      await updateWishlistItemCategory({
                        data: { userId: profile!.id, productId: detailProduct.id, categoryId: res.id }
                      });
                      setNewCategoryName("");
                      fetchWishlistData();
                      setIsCategoryPickerOpen(false);
                    }
                  } catch (err) {
                    console.error("Gagal membuat folder:", err);
                  }
                }}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/95 transition-colors cursor-pointer"
              >
                Buat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {isManageCategoriesOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsManageCategoriesOpen(false)} />
          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col overflow-hidden">
            <div className="w-12 h-1 bg-muted rounded-full mx-auto my-4 shrink-0" />
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-4 scrollbar-none">
              <h2 className="text-base font-bold text-foreground mb-4">Kelola Folder Wishlist</h2>
              
              {/* Add category form */}
              <div className="bg-muted/40 p-3 rounded-2xl border border-border/60 mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Buat Folder Baru</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nama folder..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-card border border-border outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!newCategoryName.trim()) return;
                      try {
                        const res = await createWishlistCategory({
                          data: { userId: profile!.id, name: newCategoryName.trim() }
                        });
                        if (res.success) {
                          toast.success("Folder baru berhasil dibuat");
                          setNewCategoryName("");
                          fetchWishlistData();
                        }
                      } catch (err) {
                        console.error("Gagal membuat folder:", err);
                      }
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/95 transition-colors cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Folders List */}
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Daftar Folder</p>
              {wishlistCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">Belum ada folder kustom</p>
              ) : (
                <div className="space-y-2">
                  {wishlistCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-3 bg-card border border-border rounded-xl flex items-center justify-between gap-3"
                    >
                      {editingCategory?.id === cat.id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingCategory?.name || ""}
                            onChange={(e) => {
                              if (editingCategory) {
                                setEditingCategory({ id: editingCategory.id, name: e.target.value });
                              }
                            }}
                            className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-muted outline-none border border-border text-foreground"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              if (!editingCategory?.name.trim()) return;
                              await updateWishlistCategory({
                                data: { id: cat.id, name: editingCategory.name.trim() }
                              });
                              toast.success("Folder berhasil diubah");
                              setEditingCategory(null);
                              fetchWishlistData();
                            }}
                            className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="px-2.5 py-1 bg-muted text-muted-foreground text-[10px] font-bold rounded-lg"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-foreground">{cat.name}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingCategory({ id: cat.id, name: cat.name })}
                              className="text-primary hover:underline text-[11px] font-bold cursor-pointer"
                            >
                              Ubah
                            </button>
                            <span className="text-border text-[10px]">|</span>
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm(`Apakah Anda yakin ingin menghapus folder "${cat.name}"? Produk di dalamnya akan dipindahkan ke folder "Umum"`)) {
                                  await deleteWishlistCategory({ data: { id: cat.id } });
                                  toast.success("Folder berhasil dihapus");
                                  fetchWishlistData();
                                }
                              }}
                              className="text-destructive hover:underline text-[11px] font-bold cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fixed Close Button */}
            <div className="p-4 border-t border-border bg-card shrink-0">
              <button
                type="button"
                onClick={() => setIsManageCategoriesOpen(false)}
                className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
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