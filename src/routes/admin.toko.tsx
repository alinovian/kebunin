import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { AdminShell } from "@/components/AdminShell";
import { getProducts, addProduct, updateProduct, deleteProduct, getAdminRolesList, updateShopProfile, uploadProductPhoto, deleteProductPhoto } from "@/lib/api/db.functions";
import { useAdminRole } from "@/hooks/use-admin-role";
import { useProfile } from "@/hooks/use-profile";
import { ShoppingBag, Plus, Trash2, Edit, Loader2, Store, Filter, Building, Phone, MapPin, Info, Maximize2, Search, Compass, Bold, Italic, List, AlignLeft, CornerDownLeft, ChevronLeft, ChevronRight, Tag, Camera, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

// ─── JSON Description Types & Helpers ───────────────────────────────────────
type DescBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullet"; items: string[] }
  | { type: "heading"; text: string };

type DescDocument = { version: 1; blocks: DescBlock[] };

function parseDescription(raw: string | null): DescDocument {
  if (!raw) return { version: 1, blocks: [{ type: "paragraph", text: "" }] };
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1 && Array.isArray(parsed.blocks)) return parsed;
  } catch {}
  // Legacy plain text → single paragraph block
  return { version: 1, blocks: [{ type: "paragraph", text: raw }] };
}

function serializeDescription(doc: DescDocument): string | null {
  const hasContent = doc.blocks.some((b) => {
    if (b.type === "paragraph" || b.type === "heading") return b.text.trim().length > 0;
    if (b.type === "bullet") return b.items.some((i) => i.trim().length > 0);
    return false;
  });
  if (!hasContent) return null;
  return JSON.stringify(doc);
}

function renderDescriptionBlocks(doc: DescDocument) {
  return doc.blocks.map((block, i) => {
    if (block.type === "heading") {
      return <p key={i} className="font-bold text-foreground text-sm mb-1">{block.text}</p>;
    }
    if (block.type === "bullet") {
      return (
        <ul key={i} className="list-disc list-inside space-y-0.5 text-muted-foreground text-sm mb-1">
          {block.items.filter(Boolean).map((item, j) => <li key={j}>{item}</li>)}
        </ul>
      );
    }
    return <p key={i} className="text-muted-foreground text-sm mb-1 whitespace-pre-wrap">{block.text || ""}</p>;
  });
}

function compressImage(
  base64Str: string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
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

// ─── Rich Description Editor Component ──────────────────────────────────────
function DescriptionEditor({
  value,
  onChange,
  placeholder = "Tulis deskripsi di sini...",
}: {
  value: DescDocument;
  onChange: (v: DescDocument) => void;
  placeholder?: string;
}) {
  const addBlock = (type: DescBlock["type"]) => {
    const newBlock: DescBlock =
      type === "bullet"
        ? { type: "bullet", items: [""] }
        : type === "heading"
        ? { type: "heading", text: "" }
        : { type: "paragraph", text: "" };
    onChange({ ...value, blocks: [...value.blocks, newBlock] });
  };

  const updateBlock = (index: number, updated: DescBlock) => {
    const blocks = [...value.blocks];
    blocks[index] = updated;
    onChange({ ...value, blocks });
  };

  const removeBlock = (index: number) => {
    if (value.blocks.length <= 1) {
      onChange({ ...value, blocks: [{ type: "paragraph", text: "" }] });
      return;
    }
    const blocks = value.blocks.filter((_, i) => i !== index);
    onChange({ ...value, blocks });
  };

  const updateBulletItem = (blockIndex: number, itemIndex: number, text: string) => {
    const block = value.blocks[blockIndex];
    if (block.type !== "bullet") return;
    const items = [...block.items];
    items[itemIndex] = text;
    updateBlock(blockIndex, { ...block, items });
  };

  const addBulletItem = (blockIndex: number) => {
    const block = value.blocks[blockIndex];
    if (block.type !== "bullet") return;
    updateBlock(blockIndex, { ...block, items: [...block.items, ""] });
  };

  const removeBulletItem = (blockIndex: number, itemIndex: number) => {
    const block = value.blocks[blockIndex];
    if (block.type !== "bullet") return;
    if (block.items.length <= 1) {
      removeBlock(blockIndex);
      return;
    }
    const items = block.items.filter((_, i) => i !== itemIndex);
    updateBlock(blockIndex, { ...block, items });
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/30">
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mr-1">Tambah blok:</span>
        <button
          type="button"
          onClick={() => addBlock("paragraph")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          title="Tambah Paragraf"
        >
          <AlignLeft className="size-3" /> Paragraf
        </button>
        <button
          type="button"
          onClick={() => addBlock("heading")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          title="Tambah Judul"
        >
          <Bold className="size-3" /> Judul
        </button>
        <button
          type="button"
          onClick={() => addBlock("bullet")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          title="Tambah Poin Daftar"
        >
          <List className="size-3" /> Daftar
        </button>
      </div>

      {/* Blocks */}
      <div className="p-3 space-y-2">
        {value.blocks.map((block, blockIndex) => (
          <div key={blockIndex} className="group flex gap-2 items-start">
            <div className="flex-1">
              {block.type === "heading" && (
                <input
                  value={block.text}
                  onChange={(e) => updateBlock(blockIndex, { ...block, text: e.target.value })}
                  placeholder="Tulis judul / subjudul..."
                  className="w-full px-3 py-1.5 bg-muted/30 rounded-lg text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
                />
              )}
              {block.type === "paragraph" && (
                <textarea
                  value={block.text}
                  onChange={(e) => updateBlock(blockIndex, { ...block, text: e.target.value })}
                  placeholder={blockIndex === 0 ? placeholder : "Tulis paragraf di sini..."}
                  rows={3}
                  className="w-full px-3 py-1.5 bg-transparent rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none border border-transparent focus:border-primary/30 leading-relaxed"
                />
              )}
              {block.type === "bullet" && (
                <div className="space-y-1">
                  {block.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <span className="text-primary text-sm font-bold mt-0.5 shrink-0">•</span>
                      <input
                        value={item}
                        onChange={(e) => updateBulletItem(blockIndex, itemIndex, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { e.preventDefault(); addBulletItem(blockIndex); }
                          if (e.key === "Backspace" && item === "") { e.preventDefault(); removeBulletItem(blockIndex, itemIndex); }
                        }}
                        placeholder="Tulis poin daftar..."
                        className="flex-1 px-2 py-1 bg-transparent text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 rounded border border-transparent focus:border-primary/30"
                      />
                      <button
                        type="button"
                        onClick={() => removeBulletItem(blockIndex, itemIndex)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-0.5 rounded shrink-0"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addBulletItem(blockIndex)}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors pl-5"
                  >
                    <CornerDownLeft className="size-3" /> Tambah poin
                  </button>
                </div>
              )}
            </div>
            {value.blocks.length > 1 && (
              <button
                type="button"
                onClick={() => removeBlock(blockIndex)}
                className="opacity-0 group-hover:opacity-100 mt-2 text-muted-foreground hover:text-destructive transition-all p-1 rounded shrink-0"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Image Cropper Component ────────────────────────────────────────────────
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

export const Route = createFileRoute("/admin/toko")({
  ssr: false,
  head: () => ({ meta: [{ title: "Kelola Toko | Admin Kebunin" }] }),
  component: KelolaTokoPage,
});

type Product = {
  id: string;
  name: string;
  price: number;
  coin: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
  admin_id: string | null;
  shop_name: string | null;
};

type ShopAdmin = {
  user_id: string;
  display_name: string | null;
  role: string;
};

function KelolaTokoPage() {
  const { isSuperAdmin, userId, loading: roleLoading } = useAdminRole();
  const { profile, refetch: refetchProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<"products" | "profile">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [shopAdmins, setShopAdmins] = useState<ShopAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [zoomImages, setZoomImages] = useState<string[]>([]);
  const [zoomImageIdx, setZoomImageIdx] = useState<number>(0);
  const zoomCarouselScrollRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);

  const handleZoomScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isProgrammaticScrollRef.current) return;
    const container = e.currentTarget;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(container.scrollLeft / width);
      if (newIndex !== zoomImageIdx) {
        setZoomImageIdx(newIndex);
      }
    }
  };

  const handlePrevSlide = () => {
    if (!zoomCarouselScrollRef.current) return;
    const container = zoomCarouselScrollRef.current;
    const width = container.clientWidth;
    if (width > 0) {
      const nextIdx = zoomImageIdx > 0 ? zoomImageIdx - 1 : zoomImages.length - 1;
      isProgrammaticScrollRef.current = true;
      setZoomImageIdx(nextIdx);
      container.scrollTo({ left: nextIdx * width, behavior: "smooth" });
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
    }
  };

  const handleNextSlide = () => {
    if (!zoomCarouselScrollRef.current) return;
    const container = zoomCarouselScrollRef.current;
    const width = container.clientWidth;
    if (width > 0) {
      const nextIdx = zoomImageIdx < zoomImages.length - 1 ? zoomImageIdx + 1 : 0;
      isProgrammaticScrollRef.current = true;
      setZoomImageIdx(nextIdx);
      container.scrollTo({ left: nextIdx * width, behavior: "smooth" });
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const reordered = [...images];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    setImages(reordered);
    setDraggedIndex(null);
  };

  const formatNumberWithDots = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumberFromDots = (val: string): number => {
    const clean = val.replace(/\./g, "").replace(/\D/g, "");
    return clean ? parseInt(clean, 10) : 0;
  };

  // Shop Profile Edit States
  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopWhatsapp, setShopWhatsapp] = useState("");
  const [shopLat, setShopLat] = useState<number | null>(null);
  const [shopLon, setShopLon] = useState<number | null>(null);
  const [shopActive, setShopActive] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [shopDesa, setShopDesa] = useState("");
  const [shopKecamatan, setShopKecamatan] = useState("");
  const [shopKabupaten, setShopKabupaten] = useState("");
  const [shopAmbiguousOptions, setShopAmbiguousOptions] = useState<any[]>([]);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const modalMapContainerRef = useRef<HTMLDivElement | null>(null);
  const modalMapRef = useRef<any>(null);
  const modalMarkerRef = useRef<any>(null);

  const ignoreNextSearchRef = useRef(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const reverseGeocode = useCallback(async (latVal: number, lonVal: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latVal}&lon=${lonVal}&format=json&addressdetails=1`
      );
      if (res.ok) {
        const geoData = await res.json();
        const addr = geoData.address || {};
        const desaVal = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.residential || addr.municipality || "";
        const kecVal = addr.subdistrict || addr.town || addr.municipality || addr.subcounty || "";
        const kabVal = addr.regency || addr.city || addr.county || addr.city_district || "";
        
        ignoreNextSearchRef.current = true;
        setShopDesa(desaVal);
        setShopKecamatan(kecVal);
        setShopKabupaten(kabVal);
        return { desa: desaVal, kecamatan: kecVal, kabupaten: kabVal };
      }
    } catch (err) {
      console.error("Gagal reverse geocode alamat toko:", err);
    }
    return null;
  }, []);

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    const toastId = toast.loading("Mendeteksi lokasi perangkat...");

    const getGPSLocation = (): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation tidak didukung oleh browser Anda"));
        } else {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        }
      });
    };

    try {
      let lat: number;
      let lon: number;
      let detectedVia = "";

      try {
        const position = await getGPSLocation();
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        detectedVia = "GPS perangkat";
      } catch (gpsError: any) {
        console.warn("Deteksi GPS gagal/ditolak. Menggunakan IP Geolocation...", gpsError);
        toast.info("Akses GPS ditolak/tidak tersedia. Mendeteksi via IP...", { id: toastId });

        const ipRes = await fetch("https://ipapi.co/json/");
        if (!ipRes.ok) {
          const ipBackupRes = await fetch("https://ipwho.is/");
          if (!ipBackupRes.ok) {
            throw new Error("Gagal mendeteksi lokasi via GPS maupun IP Address.");
          }
          const backupData = await ipBackupRes.json();
          if (!backupData.success) {
            throw new Error("Gagal mendeteksi lokasi via GPS maupun IP Address.");
          }
          lat = backupData.latitude;
          lon = backupData.longitude;
          detectedVia = "IP Address (Cadangan)";
        } else {
          const ipData = await ipRes.json();
          if (ipData.error) {
            throw new Error(ipData.reason || "Gagal mendeteksi lokasi via IP Address");
          }
          lat = ipData.latitude;
          lon = ipData.longitude;
          detectedVia = "IP Address";
        }
      }

      setShopLat(lat);
      setShopLon(lon);

      // Perform reverse geocoding to fill address fields
      const addrResult = await reverseGeocode(lat, lon);
      
      let msg = `Lokasi berhasil dideteksi via ${detectedVia}! ✨`;
      if (addrResult) {
        const parts = [addrResult.desa, addrResult.kecamatan, addrResult.kabupaten].filter(Boolean);
        if (parts.length > 0) {
          msg += ` (${parts.join(", ")})`;
        }
      }
      toast.success(msg, { id: toastId });
    } catch (err: any) {
      console.error("Gagal mendeteksi lokasi:", err);
      toast.error(err.message || "Gagal mendeteksi lokasi otomatis", { id: toastId });
    } finally {
      setDetectingLocation(false);
    }
  };
  const handleClearLocation = () => {
    setShopDesa("");
    setShopKecamatan("");
    setShopKabupaten("");
    setShopLat(null);
    setShopLon(null);
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    toast.success("Lokasi berhasil dikosongkan. Silakan klik 'Simpan Perubahan Profil' untuk menyimpan.");
  };

  useEffect(() => {
    if (profile) {
      setShopName(profile.display_name || "");
      setShopDesc(profile.shop_description || "");
      setShopDescDoc(parseDescription(profile.shop_description ?? null));
      setShopAddress(profile.shop_address || "");
      
      // Prioritize loading directly from database columns
      if (profile.shop_desa || profile.shop_kecamatan || profile.shop_kabupaten) {
        setShopDesa(profile.shop_desa || "");
        setShopKecamatan(profile.shop_kecamatan || "");
        setShopKabupaten(profile.shop_kabupaten || "");
      } else if (profile.shop_address) {
        // Fallback: Parse shop address into Desa, Kecamatan, Kabupaten
        const parts = profile.shop_address.split(",").map(p => p.trim());
        if (parts.length >= 3) {
          setShopDesa(parts[0]);
          setShopKecamatan(parts[1]);
          setShopKabupaten(parts[2]);
        } else {
          setShopDesa(profile.shop_address);
          setShopKecamatan("");
          setShopKabupaten("");
        }
      } else {
        setShopDesa("");
        setShopKecamatan("");
        setShopKabupaten("");
      }

      setShopWhatsapp(profile.shop_whatsapp || "");
      setShopLat(profile.shop_latitude !== undefined && profile.shop_latitude !== null ? Number(profile.shop_latitude) : null);
      setShopLon(profile.shop_longitude !== undefined && profile.shop_longitude !== null ? Number(profile.shop_longitude) : null);
      setShopActive(profile.shop_active !== 0);
    }
  }, [profile]);

  useEffect(() => {
    if (activeTab !== "profile" || !profile) return;

    const initMap = (L: any) => {
      if (mapRef.current) return;
      if (!mapContainerRef.current) return;

      // Ensure container has visible dimensions before Leaflet initialization
      const container = mapContainerRef.current;
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        setTimeout(() => {
          if (activeTab === "profile") {
            initMap(L);
          }
        }, 100);
        return;
      }

      const defaultLat = shopLat || -6.200000;
      const defaultLon = shopLon || 106.816666;

      const map = L.map(container).setView([defaultLat, defaultLon], 14);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const marker = L.marker([defaultLat, defaultLon], { draggable: true }).addTo(map);
      markerRef.current = marker;

      const updateCoords = async (latVal: number, lonVal: number) => {
        setShopLat(latVal);
        setShopLon(lonVal);
        await reverseGeocode(latVal, lonVal);
      };

      const setupMarkerEvents = (m: any) => {
        m.on("dragend", () => {
          const position = m.getLatLng();
          updateCoords(position.lat, position.lng);
        });
      };

      setupMarkerEvents(marker);

      map.on("click", (e: any) => {
        let m = markerRef.current;
        if (!m) {
          m = L.marker(e.latlng, { draggable: true }).addTo(map);
          markerRef.current = m;
          setupMarkerEvents(m);
        } else {
          m.setLatLng(e.latlng);
        }
        updateCoords(e.latlng.lat, e.latlng.lng);
      });
    };

    const existingCSS = document.getElementById("leaflet-css");
    const existingScript = document.getElementById("leaflet-js");

    if ((window as any).L) {
      setLeafletLoaded(true);
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
          setLeafletLoaded(true);
          initMap((window as any).L);
        };
        document.body.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if ((window as any).L) {
            clearInterval(checkInterval);
            setLeafletLoaded(true);
            initMap((window as any).L);
          }
        }, 100);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [activeTab, profile]);

  // Sync inline map marker and view with state changes (e.g. from modal map edits)
  useEffect(() => {
    if (mapRef.current && markerRef.current && shopLat !== null && shopLon !== null) {
      const pos = markerRef.current.getLatLng();
      if (Math.abs(pos.lat - shopLat) > 0.00001 || Math.abs(pos.lng - shopLon) > 0.00001) {
        markerRef.current.setLatLng([shopLat, shopLon]);
        mapRef.current.setView([shopLat, shopLon], mapRef.current.getZoom());
      }
    }
  }, [shopLat, shopLon]);

  // Modal Map initialization and cleanup
  useEffect(() => {
    if (!isMapExpanded || !profile) {
      if (modalMapRef.current) {
        modalMapRef.current.remove();
        modalMapRef.current = null;
        modalMarkerRef.current = null;
      }
      return;
    }

    const initModalMap = (L: any) => {
      if (modalMapRef.current) return;
      if (!modalMapContainerRef.current) return;

      const container = modalMapContainerRef.current;
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        setTimeout(() => {
          if (isMapExpanded) {
            initModalMap(L);
          }
        }, 100);
        return;
      }

      const defaultLat = shopLat || -6.200000;
      const defaultLon = shopLon || 106.816666;

      const map = L.map(container).setView([defaultLat, defaultLon], 14);
      modalMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const marker = L.marker([defaultLat, defaultLon], { draggable: true }).addTo(map);
      modalMarkerRef.current = marker;

      const updateCoords = async (latVal: number, lonVal: number) => {
        setShopLat(latVal);
        setShopLon(lonVal);
        await reverseGeocode(latVal, lonVal);
      };

      const setupMarkerEvents = (m: any) => {
        m.on("dragend", () => {
          const position = m.getLatLng();
          updateCoords(position.lat, position.lng);
        });
      };

      setupMarkerEvents(marker);

      map.on("click", (e: any) => {
        let m = modalMarkerRef.current;
        if (!m) {
          m = L.marker(e.latlng, { draggable: true }).addTo(map);
          modalMarkerRef.current = m;
          setupMarkerEvents(m);
        } else {
          m.setLatLng(e.latlng);
        }
        updateCoords(e.latlng.lat, e.latlng.lng);
      });
    };

    if ((window as any).L) {
      initModalMap((window as any).L);
    } else {
      const checkInterval = setInterval(() => {
        if ((window as any).L) {
          clearInterval(checkInterval);
          initModalMap((window as any).L);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    return () => {
      if (modalMapRef.current) {
        modalMapRef.current.remove();
        modalMapRef.current = null;
        modalMarkerRef.current = null;
      }
    };
  }, [isMapExpanded, profile]);

  // Adjust Leaflet map size on tab switch
  useEffect(() => {
    if (activeTab === "profile" && mapRef.current) {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleSearchShopDesa = async () => {
    if (!shopDesa.trim()) {
      toast.error("Isi nama desa terlebih dahulu");
      return;
    }
    ignoreNextSearchRef.current = true;
    setGeocodingLoading(true);
    setShopAmbiguousOptions([]);
    try {
      const queryParts = [shopDesa.trim(), shopKecamatan.trim(), shopKabupaten.trim()].filter(Boolean).join(", ");
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryParts)}&countrycodes=id&format=json&addressdetails=1&limit=10`
      );
      if (!res.ok) throw new Error("Gagal mencari lokasi");
      const data = await res.json();

      const uniqueMatches: any[] = [];
      const seen = new Set();

      for (const item of data) {
        const addr = item.address || {};
        const desaVal = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.residential || addr.municipality || "";
        const kecVal = addr.subdistrict || addr.town || addr.municipality || addr.subcounty || "";
        const kabVal = addr.regency || addr.city || addr.county || addr.city_district || "";

        if (!desaVal && !item.display_name.toLowerCase().includes(shopDesa.toLowerCase())) continue;

        const key = `${kecVal.toLowerCase()}|${kabVal.toLowerCase()}`;
        if (!seen.has(key) && kecVal && kabVal) {
          seen.add(key);
          uniqueMatches.push({
            desa: desaVal || shopDesa.trim(),
            kecamatan: kecVal,
            kabupaten: kabVal,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
          });
        }
      }

      if (uniqueMatches.length === 1) {
        const match = uniqueMatches[0];
        ignoreNextSearchRef.current = true;
        setShopDesa(match.desa);
        setShopKecamatan(match.kecamatan);
        setShopKabupaten(match.kabupaten);
        setShopLat(match.lat);
        setShopLon(match.lon);
        if (mapRef.current) {
          mapRef.current.setView([match.lat, match.lon], 14);
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([match.lat, match.lon]);
        }
        toast.success("Alamat toko berhasil diisi otomatis! ✨");
      } else if (uniqueMatches.length > 1) {
        setShopAmbiguousOptions(uniqueMatches);
        toast.info(`Ditemukan ${uniqueMatches.length} lokasi berbeda. Silakan pilih salah satu.`);
      } else {
        toast.warning("Desa tidak ditemukan secara spesifik. Anda dapat mengisi Kecamatan dan Kabupaten secara manual.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memvalidasi desa: " + (err.message || "kesalahan koneksi"));
    } finally {
      setGeocodingLoading(false);
    }
  };

  // Debounced auto-search when text inputs change
  useEffect(() => {
    if (!shopDesa.trim()) {
      setShopAmbiguousOptions([]);
      return;
    }

    if (ignoreNextSearchRef.current) {
      ignoreNextSearchRef.current = false;
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setGeocodingLoading(true);
      setShopAmbiguousOptions([]);
      try {
        const queryParts = [shopDesa.trim(), shopKecamatan.trim(), shopKabupaten.trim()].filter(Boolean).join(", ");
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryParts)}&countrycodes=id&format=json&addressdetails=1&limit=10`
        );
        if (res.ok) {
          const data = await res.json();
          const uniqueMatches: any[] = [];
          const seen = new Set();

          for (const item of data) {
            const addr = item.address || {};
            const desaVal = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.residential || addr.municipality || "";
            const kecVal = addr.subdistrict || addr.town || addr.municipality || addr.subcounty || "";
            const kabVal = addr.regency || addr.city || addr.county || addr.city_district || "";

            if (!desaVal && !item.display_name.toLowerCase().includes(shopDesa.toLowerCase())) continue;

            const key = `${kecVal.toLowerCase()}|${kabVal.toLowerCase()}`;
            if (!seen.has(key) && kecVal && kabVal) {
              seen.add(key);
              uniqueMatches.push({
                desa: desaVal || shopDesa.trim(),
                kecamatan: kecVal,
                kabupaten: kabVal,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
              });
            }
          }

          if (uniqueMatches.length > 0) {
            setShopAmbiguousOptions(uniqueMatches);
          }
        }
      } catch (err) {
        console.error("Auto geocoding failed:", err);
      } finally {
        setGeocodingLoading(false);
      }
    }, 1000); // 1000ms debounce

    return () => clearTimeout(delayDebounce);
  }, [shopDesa, shopKecamatan, shopKabupaten]);

  const handleSaveShopProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!shopName.trim()) {
      toast.error("Nama Toko wajib diisi");
      return;
    }
    const formattedAddress = [shopDesa.trim(), shopKecamatan.trim(), shopKabupaten.trim()].filter(Boolean).join(", ");
    const serializedShopDesc = serializeDescription(shopDescDoc);
    setSavingProfile(true);
    try {
      await updateShopProfile({
        data: {
          id: profile.id,
          displayName: shopName.trim(),
          shopDescription: serializedShopDesc,
          shopAddress: formattedAddress || null,
          shopWhatsapp: shopWhatsapp.trim() || null,
          shopLatitude: shopLat !== null ? Number(shopLat) : null,
          shopLongitude: shopLon !== null ? Number(shopLon) : null,
          shopActive: shopActive,
          shopDesa: shopDesa.trim() || null,
          shopKecamatan: shopKecamatan.trim() || null,
          shopKabupaten: shopKabupaten.trim() || null,
        },
      });
      toast.success("Profil toko berhasil diperbarui!");
      refetchProfile();
    } catch (err) {
      console.error("Gagal menyimpan profil toko:", err);
      toast.error("Gagal menyimpan profil toko");
    } finally {
      setSavingProfile(false);
    }
  };

  // Filters
  const [shopFilter, setShopFilter] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("shopFilter") || "all";
    }
    return "all";
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [shopFilter]);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [descDoc, setDescDoc] = useState<DescDocument>({ version: 1, blocks: [{ type: "paragraph", text: "" }] });
  const [shopDescDoc, setShopDescDoc] = useState<DescDocument>({ version: 1, blocks: [{ type: "paragraph", text: "" }] });
  const [productAdminId, setProductAdminId] = useState<string>("global"); // "global" or specific admin_id

  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [pendingCropFiles, setPendingCropFiles] = useState<File[]>([]);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

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

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data as Product[]);

      if (isSuperAdmin) {
        const adminsData = await getAdminRolesList();
        setShopAdmins(adminsData as ShopAdmin[]);
      }
    } catch (err) {
      console.error("Gagal memuat data kelola toko:", err);
      toast.error("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isSuperAdmin]);

  const parseProductImages = (raw: string | null): string[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [raw];
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setName("");
    setPrice(0);
    setDescDoc({ version: 1, blocks: [{ type: "paragraph", text: "" }] });
    setImages([]);
    // Default to the current admin's ID if not superadmin, otherwise default to global (null)
    setProductAdminId(isSuperAdmin ? "global" : userId || "global");
    setShowProductForm(true);
  };

  const openEditDialog = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setDescDoc(parseDescription(p.description));
    setProductAdminId(p.admin_id || "global");
    setImages(parseProductImages(p.image_url));
    setShowProductForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0) {
      toast.error("Mohon isi semua data dengan benar");
      return;
    }

    if (images.length === 0) {
      toast.error("Wajib mengunggah minimal 1 gambar agar produk bisa dilihat user!");
      return;
    }

    setBusy(true);
    // Determine the admin_id value to save
    const finalAdminId = productAdminId === "global" ? null : productAdminId;
    const serializedDesc = serializeDescription(descDoc);
    const serializedImages = JSON.stringify(images);

    try {
      if (editingProduct) {
        await updateProduct({
          data: {
            id: editingProduct.id,
            name: name.trim(),
            price: Number(price),
            description: serializedDesc,
            admin_id: finalAdminId,
            image_url: serializedImages,
          },
        });
        toast.success("Produk berhasil diperbarui");
      } else {
        await addProduct({
          data: {
            name: name.trim(),
            price: Number(price),
            description: serializedDesc,
            admin_id: finalAdminId,
            image_url: serializedImages,
          },
        });
        toast.success("Produk baru berhasil ditambahkan");
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setImages([]);
      load();
    } catch (err) {
      console.error("Gagal menyimpan produk:", err);
      toast.error("Gagal menyimpan produk");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteProductImage = async (urlToDelete: string) => {
    try {
      await deleteProductPhoto({ data: { imageUrl: urlToDelete } });
      setImages((prev) => prev.filter((img) => img !== urlToDelete));
      toast.success("Foto berhasil dihapus");
    } catch (err) {
      console.error("Gagal menghapus foto:", err);
      toast.error("Gagal menghapus foto");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("Maksimal 5 gambar per produk!");
      return;
    }

    setPendingCropFiles(files);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleCropDone = async (croppedBase64: string) => {
    setCropImageSrc(null);
    const progressInterval = startUploadSimulatedProgress();
    try {
      const file = pendingCropFiles[0];
      const uploadRes = await uploadProductPhoto({
        data: {
          base64Data: croppedBase64,
          fileName: (file?.name.split(".")[0] || "product") + ".jpg",
        },
      });

      finishUploadSimulatedProgress(progressInterval, () => {
        setImages((prev) => [...prev, uploadRes.url]);
        toast.success("Foto berhasil diunggah! 📸");
      });

      const remaining = pendingCropFiles.slice(1);
      setPendingCropFiles(remaining);

      if (remaining.length > 0) {
        const nextReader = new FileReader();
        nextReader.onload = (event) => {
          setCropImageSrc(event.target?.result as string);
        };
        nextReader.readAsDataURL(remaining[0]);
      }
    } catch (err: any) {
      failUploadSimulatedProgress(progressInterval);
      console.error(err);
      toast.error(err.message || "Gagal mengunggah foto");
      setPendingCropFiles([]);
    }
  };

  const handleCropCancel = () => {
    setCropImageSrc(null);
    setPendingCropFiles([]);
  };

  const handleDelete = async (id: string, productName: string) => {
    if (!confirm(`Hapus produk "${productName}" dari toko?`)) return;

    try {
      await deleteProduct({ data: { id } });
      toast.success("Produk berhasil dihapus");
      load();
    } catch (err) {
      console.error("Gagal menghapus produk:", err);
      toast.error("Gagal menghapus produk");
    }
  };

  // Filter products based on user role and filters selected
  const displayedProducts = products.filter((p) => {
    // 1. Role boundary filter
    if (!isSuperAdmin) {
      // Shop admin only sees their own products
      if (p.admin_id !== userId) return false;
    } else {
      // Super Admin shop filter
      if (shopFilter === "global") {
        if (p.admin_id !== null) return false;
      } else if (shopFilter !== "all") {
        if (p.admin_id !== shopFilter) return false;
      }
    }

    // 2. Search query filter
    if (q.trim() !== "") {
      return p.name.toLowerCase().includes(q.toLowerCase());
    }
    return true;
  });

  const paginatedProducts = (() => {
    if (pageSize === "all") return displayedProducts;
    const startIndex = (currentPage - 1) * pageSize;
    return displayedProducts.slice(startIndex, startIndex + pageSize);
  })();

  const totalPages = pageSize === "all" ? 1 : Math.ceil(displayedProducts.length / pageSize);

  if (roleLoading) {
    return (
      <AdminShell title="Kelola Toko">
        <div className="text-muted-foreground">Memuat...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={showProductForm ? (editingProduct ? "Edit Produk" : "Tambah Produk Baru") : "Kelola Toko"}>
      <div className="space-y-6">
        {showProductForm ? (
          /* ─── Full-Page Product Form ─────────────────────────────────────────── */
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                Kembali ke Katalog
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Tag className="size-3.5" /> Informasi Produk
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold block mb-1.5">Nama Produk / Obat</label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Contoh: Fungisida Cair Organik"
                          className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                          required
                          autoFocus
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold block mb-1.5">Harga (Rupiah)</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">Rp</span>
                          <input
                            type="text"
                            value={price ? formatNumberWithDots(price) : ""}
                            onChange={(e) => setPrice(parseNumberFromDots(e.target.value))}
                            placeholder="15.000"
                            className="w-full pl-9 pr-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                            required
                          />
                        </div>
                      </div>

                      {isSuperAdmin && (
                        <div>
                          <label className="text-xs font-semibold block mb-1.5">Pemilik Toko / Penjual</label>
                          <select
                            value={productAdminId}
                            onChange={(e) => setProductAdminId(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="global">Kebunin Resmi (Sistem / Global)</option>
                            {shopAdmins.map((adm) => (
                              <option key={adm.user_id} value={adm.user_id}>
                                {adm.display_name || `Admin (${adm.user_id.slice(0, 8)})`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gambar Produk */}
                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-1.5">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="size-3.5" /> Gambar Produk
                      </h3>
                      <span className="text-xs font-medium text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md">
                        {images.length}/5 Gambar
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-4">Unggah minimal 1 dan maksimal 5 foto produk agar dapat dipublikasikan. Disarankan gambar persegi (ratio 1:1).</p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {images.map((url, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(index)}
                          className={`aspect-square relative rounded-xl border border-border bg-muted/20 overflow-hidden group animate-in zoom-in-95 duration-200 cursor-move transition-all ${
                            draggedIndex === index
                              ? "opacity-30 scale-95 border-primary border-2 border-dashed"
                              : "hover:border-primary/50"
                          }`}
                        >
                          <img src={url} alt={`Gambar ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => handleDeleteProductImage(url)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
                            title="Hapus gambar"
                          >
                            <Trash2 className="size-5" />
                          </button>
                          <div className="absolute top-2 left-2 bg-black/60 text-white rounded-md px-1.5 py-0.5 text-[9px] font-bold opacity-75 group-hover:opacity-100 transition-opacity">
                            #{index + 1}
                          </div>
                        </div>
                      ))}

                      {images.length < 5 && (
                        <div>
                          <input
                            type="file"
                            id="product-image-uploader"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                          <label
                            htmlFor="product-image-uploader"
                            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-xl cursor-pointer transition-colors group"
                          >
                            <Plus className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-primary mt-1 transition-colors">Upload</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description Editor */}
                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <AlignLeft className="size-3.5" /> Deskripsi Produk
                    </h3>
                    <p className="text-[11px] text-muted-foreground mb-3">Gunakan blok paragraf, judul, dan daftar untuk membuat deskripsi yang terstruktur dan mudah dibaca.</p>
                    <DescriptionEditor
                      value={descDoc}
                      onChange={setDescDoc}
                      placeholder="Tulis deskripsi singkat produk pertanian ini..."
                    />
                  </div>
                </div>

                {/* Sidebar - Preview & Actions */}
                <div className="space-y-4">
                  {/* Action Buttons */}
                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aksi</h3>
                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                    >
                      {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                      {editingProduct ? "Simpan Perubahan" : "Simpan Produk"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                      className="w-full bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>

                  {/* Preview */}
                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Pratinjau Deskripsi</h3>
                    {descDoc.blocks.some((b) => (b.type === "paragraph" || b.type === "heading" ? b.text.trim() : b.type === "bullet" ? b.items.some(i => i.trim()) : false)) ? (
                      <div className="bg-muted/20 rounded-xl p-3 border border-border">
                        {renderDescriptionBlocks(descDoc)}
                      </div>
                    ) : (
                      <div className="text-[11px] text-muted-foreground/60 italic">
                        Deskripsi akan tampil di sini saat Anda mulai mengetik.
                      </div>
                    )}
                  </div>

                  {/* Tips */}
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                    <p className="text-[11px] font-bold text-primary mb-1.5">Tips penulisan deskripsi:</p>
                    <ul className="text-[11px] text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Gunakan <span className="font-semibold">Judul</span> untuk subjudul bagian</li>
                      <li>Gunakan <span className="font-semibold">Daftar</span> untuk fitur/manfaat</li>
                      <li>Tekan <kbd className="bg-muted px-1 py-0.5 rounded text-[10px] font-mono">Enter</kbd> di daftar untuk poin baru</li>
                      <li>Deskripsi disimpan persis seperti yang Anda ketik</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* ─── Tabbed Layout ──────────────────────────────────────────────────── */
          <>
            <div className="flex flex-col gap-4 border-b border-border pb-px">
              <p className="text-sm text-muted-foreground max-w-md">
                {isSuperAdmin
                  ? "Kelola semua katalog produk/obat pertanian dari seluruh toko pertanian yang didaftarkan."
                  : "Kelola katalog produk bibit, pupuk, dan obat pertanian urban milik toko Anda."}
              </p>

              <div className="flex gap-2 -mb-px">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === "products"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Katalog Produk
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === "profile"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Profil Toko Saya
                </button>
              </div>
            </div>

            {activeTab === "products" ? (
              /* ─── Product List View ──────────────────────────────────────────────── */
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={openAddDialog}
                    className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/95 transition-colors shadow-sm"
                  >
                    <Plus className="size-4" /> Tambah Produk
                  </button>
                </div>

                {/* Product Table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col animate-in fade-in duration-200">
                  {/* Search and Filters Header Block inside the card - exactly like the plants dashboard */}
                  <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-card">
                    <div className="flex flex-1 items-center gap-3 w-full sm:max-w-xl">
                      {/* Search Input */}
                      <div className="relative flex-1">
                        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={q}
                          onChange={(e) => {
                            setQ(e.target.value);
                            setCurrentPage(1);
                          }}
                          placeholder="Cari nama produk..."
                          className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {/* Filter Toko (Only for Super Admin) */}
                      {isSuperAdmin && (
                        <div className="flex items-center gap-2 shrink-0">
                          <Filter className="size-4 text-muted-foreground" />
                          <select
                            value={shopFilter}
                            onChange={(e) => setShopFilter(e.target.value)}
                            className="px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="all">Semua Toko & Sistem</option>
                            <option value="global">Kebunin Resmi (Sistem / Global)</option>
                            {shopAdmins.map((adm) => (
                              <option key={adm.user_id} value={adm.user_id}>
                                {adm.display_name || `Admin (${adm.user_id.slice(0, 8)})`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground shrink-0">
                      {displayedProducts.length} produk ditemukan
                    </p>
                  </div>

                  <div className="flex-1 overflow-x-auto">
                     <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-left">
                        <tr>
                          <th className="px-6 py-4 font-medium text-muted-foreground w-20">Foto</th>
                          <th className="px-6 py-4 font-medium text-muted-foreground">Nama Produk / Obat</th>
                          <th className="px-6 py-4 font-medium text-muted-foreground">Harga</th>
                          <th className="px-6 py-4 font-medium text-muted-foreground">Penjual / Toko</th>
                          <th className="px-6 py-4 font-medium text-muted-foreground">Deskripsi</th>
                          <th className="px-6 py-4 font-medium text-muted-foreground w-24">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {loading ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                              <Loader2 className="size-6 animate-spin mx-auto mb-2 text-primary" />
                              Memuat produk...
                            </td>
                          </tr>
                        ) : displayedProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-muted-foreground">
                              <ShoppingBag className="size-10 mx-auto mb-3 text-muted-foreground/50" />
                              Belum ada produk di katalog.
                            </td>
                          </tr>
                        ) : (
                          paginatedProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4">
                                <div className="size-12 rounded-lg overflow-hidden shrink-0 border border-border shadow-xs">
                                  {(() => {
                                    const imgs = parseProductImages(p.image_url);
                                    if (imgs.length > 0) {
                                      return (
                                        <img
                                          src={imgs[0]}
                                          alt={p.name}
                                          onClick={() => {
                                            setZoomImages(imgs);
                                            setZoomImageIdx(0);
                                            setZoomImageUrl(imgs[0]);
                                          }}
                                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                        />
                                      );
                                    }
                                    return (
                                      <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                                        <ImageIcon className="size-5 text-muted-foreground/60" />
                                      </div>
                                    );
                                  })()}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-semibold text-foreground">{p.name}</p>
                              </td>
                              <td className="px-6 py-4 font-medium text-primary">
                                Rp {p.price.toLocaleString("id-ID")}
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/40 border border-border px-2.5 py-1 rounded-lg">
                                  <Store className="size-3.5 text-primary" />
                                  {p.shop_name ?? "Kebunin Resmi"}
                                </span>
                              </td>
                              <td className="px-6 py-4 max-w-xs">
                                {p.description ? (
                                  <div className="line-clamp-2">
                                    {(() => {
                                      const parsed = parseDescription(p.description);
                                      const firstBlock = parsed.blocks.find((b) =>
                                        b.type === "paragraph" ? b.text.trim() :
                                        b.type === "heading" ? b.text.trim() :
                                        b.type === "bullet" ? b.items.some(i => i.trim()) : false
                                      );
                                      if (!firstBlock) return <span className="text-muted-foreground">—</span>;
                                      if (firstBlock.type === "bullet") {
                                        return <span className="text-muted-foreground text-xs">{firstBlock.items.filter(Boolean).slice(0, 2).join(" • ")}</span>;
                                      }
                                      return <span className="text-muted-foreground text-xs">{(firstBlock as any).text}</span>;
                                    })()}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 flex gap-2">
                                <button
                                  onClick={() => openEditDialog(p)}
                                  className="text-foreground hover:bg-muted p-2 rounded-lg transition-colors border border-border"
                                  title="Edit Produk"
                                >
                                  <Edit className="size-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(p.id, p.name)}
                                  className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors border border-border"
                                  title="Hapus Produk"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
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
                        dari {displayedProducts.length} entri
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
              </div>
            ) : (
              /* ─── Shop Profile ───────────────────────────────────────────────────── */
              <div className="w-full bg-card border border-border rounded-2xl p-6 shadow-sm animate-in fade-in duration-200">
                <h2 className="text-lg font-bold mb-1">Pengaturan Profil Toko</h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Lengkapi deskripsi, alamat, dan kontak toko Anda agar pengguna dapat langsung menghubungi Anda.
                </p>

                <form onSubmit={handleSaveShopProfile} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Kolom Kiri: Informasi Utama Toko */}
                    <div className="space-y-5">
                      <div className="bg-muted/40 p-4 rounded-xl border border-border flex items-center justify-between">
                        <div className="pr-4">
                          <label className="text-xs font-semibold block flex items-center gap-1 text-foreground">
                            <Building className="size-3.5 text-primary" /> Status Keaktifan Toko
                          </label>
                          <span className="text-[11px] text-muted-foreground mt-0.5 block leading-normal">
                            Jika tidak aktif, semua produk Anda akan disembunyikan dari katalog pengguna.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShopActive(!shopActive)}
                          className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none relative flex items-center shrink-0 cursor-pointer ${
                            shopActive ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`size-4.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                              shopActive ? "translate-x-5.5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      <div>
                        <label className="text-xs font-semibold block mb-1.5 flex items-center gap-1">
                          <Store className="size-3.5 text-muted-foreground" /> Nama Toko Pertanian
                        </label>
                        <input
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          placeholder="Contoh: Toko Tani Subur Makmur"
                          className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold block mb-1.5 flex items-center gap-1">
                          <Info className="size-3.5 text-muted-foreground" /> Deskripsi Toko
                        </label>
                        <p className="text-[11px] text-muted-foreground mb-2">Gunakan blok teks, judul, dan daftar untuk deskripsi yang rapi dan terstruktur.</p>
                        <DescriptionEditor
                          value={shopDescDoc}
                          onChange={setShopDescDoc}
                          placeholder="Deskripsikan produk unggulan atau jam operasional toko Anda..."
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold block mb-1.5 flex items-center gap-1">
                          <Phone className="size-3.5 text-muted-foreground" /> Nomor WhatsApp
                        </label>
                        <input
                          value={shopWhatsapp}
                          onChange={(e) => setShopWhatsapp(e.target.value)}
                          placeholder="Contoh: 08123456789"
                          className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Kolom Kanan: Alamat, Geocoding & Peta */}
                    <div className="space-y-5">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Desa / Kelurahan</label>
                        <div className="flex gap-2">
                          <input
                            value={shopDesa}
                            onChange={(e) => {
                              setShopDesa(e.target.value);
                            }}
                            placeholder="Contoh: Jatisaba"
                            className="flex-1 px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                          <button
                            type="button"
                            onClick={handleSearchShopDesa}
                            disabled={geocodingLoading}
                            className="px-4 py-2 bg-accent-soft text-primary hover:bg-accent/30 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {geocodingLoading ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Search className="size-3.5" />
                            )}
                            Cari
                          </button>
                        </div>
                      </div>

                      {shopAmbiguousOptions.length > 0 && (
                        <div className="bg-muted/50 border border-border rounded-xl p-3 max-h-36 overflow-y-auto space-y-2">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Pilih Lokasi yang Sesuai:
                          </p>
                          {shopAmbiguousOptions.map((opt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                ignoreNextSearchRef.current = true;
                                setShopDesa(opt.desa);
                                setShopKecamatan(opt.kecamatan);
                                setShopKabupaten(opt.kabupaten);
                                setShopLat(opt.lat);
                                setShopLon(opt.lon);
                                if (mapRef.current) {
                                  mapRef.current.setView([opt.lat, opt.lon], 14);
                                }
                                if (markerRef.current) {
                                  markerRef.current.setLatLng([opt.lat, opt.lon]);
                                }
                                setShopAmbiguousOptions([]);
                                toast.success("Lokasi dipilih!");
                              }}
                              className="w-full text-left p-2 hover:bg-background border border-transparent hover:border-border rounded-lg text-xs font-medium text-foreground transition-all cursor-pointer"
                            >
                              Kec. <span className="font-semibold">{opt.kecamatan}</span>, Kab. <span className="font-semibold">{opt.kabupaten}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold block mb-1">Kecamatan</label>
                          <input
                            value={shopKecamatan}
                            onChange={(e) => {
                              setShopKecamatan(e.target.value);
                            }}
                            placeholder="Contoh: Purbalingga"
                            className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1">Kabupaten / Kota</label>
                          <input
                            value={shopKabupaten}
                            onChange={(e) => {
                              setShopKabupaten(e.target.value);
                            }}
                            placeholder="Contoh: Purbalingga"
                            className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs font-semibold flex items-center gap-1">
                            <MapPin className="size-3.5 text-muted-foreground" /> Pinpoint Koordinat Peta (Lokasi GPS)
                          </label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={handleDetectLocation}
                              disabled={detectingLocation}
                              className="text-[11px] font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {detectingLocation ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                <Compass className="size-3" />
                              )}
                              Deteksi Lokasi Otomatis
                            </button>
                            <span className="text-muted-foreground/40 text-xs">|</span>
                            <button
                              type="button"
                              onClick={handleClearLocation}
                              className="text-[11px] font-semibold text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-3" />
                              Hapus Lokasi
                            </button>
                          </div>
                        </div>
                        
                        {/* 1. Inline Map (Always in layout) */}
                        <div className="relative w-full">
                          <div
                            ref={mapContainerRef}
                            className="w-full h-44 rounded-xl border border-border bg-muted/30 overflow-hidden relative z-0 mb-2"
                            style={{ minHeight: "176px" }}
                          />
                          <button
                            type="button"
                            onClick={() => setIsMapExpanded(true)}
                            className="absolute top-2.5 right-2.5 z-10 bg-background/90 hover:bg-background border border-border shadow-md rounded-lg p-1.5 text-muted-foreground hover:text-foreground transition-all flex items-center justify-center cursor-pointer"
                            title="Perbesar Peta"
                          >
                            <Maximize2 className="size-4" />
                          </button>
                        </div>

                        {/* 2. Modal Map Lightbox Overlay */}
                        {isMapExpanded && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 md:p-8 animate-in fade-in duration-200">
                            <div className="absolute inset-0" onClick={() => setIsMapExpanded(false)} />
                            
                            <div className="w-full h-[80vh] max-w-5xl bg-card border border-border rounded-2xl shadow-2xl p-5 relative z-10 flex flex-col gap-3.5 animate-in zoom-in-95 duration-200">
                              <div className="flex justify-between items-center shrink-0">
                                <div>
                                  <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                                    <MapPin className="size-4 text-primary" /> Pinpoint Lokasi Toko (Mode Perbesar)
                                  </h3>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">Geser penanda biru atau klik pada peta untuk menetapkan koordinat toko Anda</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsMapExpanded(false)}
                                  className="bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors"
                                >
                                  Selesai
                                </button>
                              </div>

                              <div className="relative flex-1 w-full">
                                <div
                                  ref={modalMapContainerRef}
                                  className="w-full h-full rounded-xl border border-border bg-muted/30 overflow-hidden relative z-0"
                                  style={{ minHeight: "350px" }}
                                />
                              </div>

                              <div className="flex gap-4 text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border shrink-0">
                                <div>Latitude: <span className="font-semibold text-foreground">{shopLat !== null ? shopLat.toFixed(6) : "—"}</span></div>
                                <div>Longitude: <span className="font-semibold text-foreground">{shopLon !== null ? shopLon.toFixed(6) : "—"}</span></div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-4 text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border mt-2">
                          <div>Latitude: <span className="font-semibold text-foreground">{shopLat !== null ? shopLat.toFixed(6) : "—"}</span></div>
                          <div>Longitude: <span className="font-semibold text-foreground">{shopLon !== null ? shopLon.toFixed(6) : "—"}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-4 border-t border-border flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                      {savingProfile && <Loader2 className="size-4 animate-spin" />}
                      Simpan Perubahan Profil
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>

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
            className="w-[90vw] h-[90vw] max-w-[550px] max-h-[550px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col"
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
                {/* Navigation Arrows */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevSlide();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md"
                  title="Foto sebelumnya"
                >
                  <ChevronLeft className="size-6" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextSlide();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md"
                  title="Foto selanjutnya"
                >
                  <ChevronRight className="size-6" />
                </button>

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

      {/* Centered glassmorphic progress overlay */}
      {uploadingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div className="bg-card border border-border p-6 rounded-2xl w-80 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <Loader2 className="size-10 animate-spin text-primary mx-auto mb-4" />
            <h3 className="font-bold text-sm text-foreground">Mengunggah Foto Produk...</h3>
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

      {/* Manual Cropper Modal */}
      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          cropShape="square"
          onCrop={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}
    </AdminShell>
  );
}