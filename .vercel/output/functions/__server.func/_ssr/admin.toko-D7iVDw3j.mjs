import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAdminRole, A as AdminShell } from "./AdminShell-BY7Tjs1d.mjs";
import { b as getProducts, d as getAdminRolesList, u as updateProduct, e as addProduct, h as deleteProductPhoto, i as deleteProduct, j as updateShopProfile, k as uploadProductPhoto } from "./router-C0zimY-u.mjs";
import { u as useProfile } from "./use-profile-C764uWnh.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { v as ChevronLeft, w as Tag, x as Image$1, y as Trash2, P as Plus, z as TextAlignStart, m as LoaderCircle, D as Search, F as Funnel, u as ShoppingBag, d as Store, J as SquarePen, K as Building, N as Info, O as Phone, V as MapPin, W as Compass, Y as Maximize2, Z as ChevronRight, _ as Bold, $ as List, a0 as CornerDownLeft } from "../_libs/lucide-react.mjs";
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
function parseDescription(raw) {
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
}
function serializeDescription(doc) {
  const hasContent = doc.blocks.some((b) => {
    if (b.type === "paragraph" || b.type === "heading") return b.text.trim().length > 0;
    if (b.type === "bullet") return b.items.some((i) => i.trim().length > 0);
    return false;
  });
  if (!hasContent) return null;
  return JSON.stringify(doc);
}
function renderDescriptionBlocks(doc) {
  return doc.blocks.map((block, i) => {
    if (block.type === "heading") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground text-sm mb-1", children: block.text }, i);
    }
    if (block.type === "bullet") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside space-y-0.5 text-muted-foreground text-sm mb-1", children: block.items.filter(Boolean).map((item, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: item }, j)) }, i);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-1 whitespace-pre-wrap", children: block.text || "" }, i);
  });
}
function DescriptionEditor({
  value,
  onChange,
  placeholder = "Tulis deskripsi di sini..."
}) {
  const addBlock = (type) => {
    const newBlock = type === "bullet" ? {
      type: "bullet",
      items: [""]
    } : type === "heading" ? {
      type: "heading",
      text: ""
    } : {
      type: "paragraph",
      text: ""
    };
    onChange({
      ...value,
      blocks: [...value.blocks, newBlock]
    });
  };
  const updateBlock = (index, updated) => {
    const blocks = [...value.blocks];
    blocks[index] = updated;
    onChange({
      ...value,
      blocks
    });
  };
  const removeBlock = (index) => {
    if (value.blocks.length <= 1) {
      onChange({
        ...value,
        blocks: [{
          type: "paragraph",
          text: ""
        }]
      });
      return;
    }
    const blocks = value.blocks.filter((_, i) => i !== index);
    onChange({
      ...value,
      blocks
    });
  };
  const updateBulletItem = (blockIndex, itemIndex, text) => {
    const block = value.blocks[blockIndex];
    if (block.type !== "bullet") return;
    const items = [...block.items];
    items[itemIndex] = text;
    updateBlock(blockIndex, {
      ...block,
      items
    });
  };
  const addBulletItem = (blockIndex) => {
    const block = value.blocks[blockIndex];
    if (block.type !== "bullet") return;
    updateBlock(blockIndex, {
      ...block,
      items: [...block.items, ""]
    });
  };
  const removeBulletItem = (blockIndex, itemIndex) => {
    const block = value.blocks[blockIndex];
    if (block.type !== "bullet") return;
    if (block.items.length <= 1) {
      removeBlock(blockIndex);
      return;
    }
    const items = block.items.filter((_, i) => i !== itemIndex);
    updateBlock(blockIndex, {
      ...block,
      items
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-xl overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium uppercase tracking-wider mr-1", children: "Tambah blok:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => addBlock("paragraph"), className: "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all", title: "Tambah Paragraf", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignStart, { className: "size-3" }),
        " Paragraf"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => addBlock("heading"), className: "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all", title: "Tambah Judul", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "size-3" }),
        " Judul"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => addBlock("bullet"), className: "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all", title: "Tambah Poin Daftar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "size-3" }),
        " Daftar"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2", children: value.blocks.map((block, blockIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group flex gap-2 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        block.type === "heading" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: block.text, onChange: (e) => updateBlock(blockIndex, {
          ...block,
          text: e.target.value
        }), placeholder: "Tulis judul / subjudul...", className: "w-full px-3 py-1.5 bg-muted/30 rounded-lg text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30" }),
        block.type === "paragraph" && /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: block.text, onChange: (e) => updateBlock(blockIndex, {
          ...block,
          text: e.target.value
        }), placeholder: blockIndex === 0 ? placeholder : "Tulis paragraf di sini...", rows: 3, className: "w-full px-3 py-1.5 bg-transparent rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none border border-transparent focus:border-primary/30 leading-relaxed" }),
        block.type === "bullet" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          block.items.map((item, itemIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-sm font-bold mt-0.5 shrink-0", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: item, onChange: (e) => updateBulletItem(blockIndex, itemIndex, e.target.value), onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addBulletItem(blockIndex);
              }
              if (e.key === "Backspace" && item === "") {
                e.preventDefault();
                removeBulletItem(blockIndex, itemIndex);
              }
            }, placeholder: "Tulis poin daftar...", className: "flex-1 px-2 py-1 bg-transparent text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 rounded border border-transparent focus:border-primary/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeBulletItem(blockIndex, itemIndex), className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-0.5 rounded shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }) })
          ] }, itemIndex)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => addBulletItem(blockIndex), className: "flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors pl-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CornerDownLeft, { className: "size-3" }),
            " Tambah poin"
          ] })
        ] })
      ] }),
      value.blocks.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeBlock(blockIndex), className: "opacity-0 group-hover:opacity-100 mt-2 text-muted-foreground hover:text-destructive transition-all p-1 rounded shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
    ] }, blockIndex)) })
  ] });
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
function KelolaTokoPage() {
  const {
    isSuperAdmin,
    userId,
    loading: roleLoading
  } = useAdminRole();
  const {
    profile,
    refetch: refetchProfile
  } = useProfile();
  const [activeTab, setActiveTab] = reactExports.useState("products");
  const [products, setProducts] = reactExports.useState([]);
  const [shopAdmins, setShopAdmins] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [busy, setBusy] = reactExports.useState(false);
  const [showProductForm, setShowProductForm] = reactExports.useState(false);
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const [draggedIndex, setDraggedIndex] = reactExports.useState(null);
  const [zoomImageUrl, setZoomImageUrl] = reactExports.useState(null);
  const [q, setQ] = reactExports.useState("");
  const [zoomImages, setZoomImages] = reactExports.useState([]);
  const [zoomImageIdx, setZoomImageIdx] = reactExports.useState(0);
  const zoomCarouselScrollRef = reactExports.useRef(null);
  const isProgrammaticScrollRef = reactExports.useRef(false);
  const handleZoomScroll = (e) => {
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
      container.scrollTo({
        left: nextIdx * width,
        behavior: "smooth"
      });
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
      container.scrollTo({
        left: nextIdx * width,
        behavior: "smooth"
      });
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
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
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const reordered = [...images];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    setImages(reordered);
    setDraggedIndex(null);
  };
  const formatNumberWithDots = (num) => {
    if (num === null || num === void 0 || isNaN(num)) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const parseNumberFromDots = (val) => {
    const clean = val.replace(/\./g, "").replace(/\D/g, "");
    return clean ? parseInt(clean, 10) : 0;
  };
  const [shopName, setShopName] = reactExports.useState("");
  const [shopDesc, setShopDesc] = reactExports.useState("");
  const [shopAddress, setShopAddress] = reactExports.useState("");
  const [shopWhatsapp, setShopWhatsapp] = reactExports.useState("");
  const [shopLat, setShopLat] = reactExports.useState(null);
  const [shopLon, setShopLon] = reactExports.useState(null);
  const [shopActive, setShopActive] = reactExports.useState(true);
  const [savingProfile, setSavingProfile] = reactExports.useState(false);
  const [leafletLoaded, setLeafletLoaded] = reactExports.useState(false);
  const [isMapExpanded, setIsMapExpanded] = reactExports.useState(false);
  const [geocodingLoading, setGeocodingLoading] = reactExports.useState(false);
  const [shopDesa, setShopDesa] = reactExports.useState("");
  const [shopKecamatan, setShopKecamatan] = reactExports.useState("");
  const [shopKabupaten, setShopKabupaten] = reactExports.useState("");
  const [shopAmbiguousOptions, setShopAmbiguousOptions] = reactExports.useState([]);
  const mapContainerRef = reactExports.useRef(null);
  const mapRef = reactExports.useRef(null);
  const markerRef = reactExports.useRef(null);
  const modalMapContainerRef = reactExports.useRef(null);
  const modalMapRef = reactExports.useRef(null);
  const modalMarkerRef = reactExports.useRef(null);
  const ignoreNextSearchRef = reactExports.useRef(false);
  const [detectingLocation, setDetectingLocation] = reactExports.useState(false);
  const reverseGeocode = reactExports.useCallback(async (latVal, lonVal) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latVal}&lon=${lonVal}&format=json&addressdetails=1`);
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
        return {
          desa: desaVal,
          kecamatan: kecVal,
          kabupaten: kabVal
        };
      }
    } catch (err) {
      console.error("Gagal reverse geocode alamat toko:", err);
    }
    return null;
  }, []);
  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    const toastId = toast.loading("Mendeteksi lokasi perangkat...");
    const getGPSLocation = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation tidak didukung oleh browser Anda"));
        } else {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5e3,
            maximumAge: 0
          });
        }
      });
    };
    try {
      let lat;
      let lon;
      let detectedVia = "";
      try {
        const position = await getGPSLocation();
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        detectedVia = "GPS perangkat";
      } catch (gpsError) {
        console.warn("Deteksi GPS gagal/ditolak. Menggunakan IP Geolocation...", gpsError);
        toast.info("Akses GPS ditolak/tidak tersedia. Mendeteksi via IP...", {
          id: toastId
        });
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
      const addrResult = await reverseGeocode(lat, lon);
      let msg = `Lokasi berhasil dideteksi via ${detectedVia}! ✨`;
      if (addrResult) {
        const parts = [addrResult.desa, addrResult.kecamatan, addrResult.kabupaten].filter(Boolean);
        if (parts.length > 0) {
          msg += ` (${parts.join(", ")})`;
        }
      }
      toast.success(msg, {
        id: toastId
      });
    } catch (err) {
      console.error("Gagal mendeteksi lokasi:", err);
      toast.error(err.message || "Gagal mendeteksi lokasi otomatis", {
        id: toastId
      });
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
  reactExports.useEffect(() => {
    if (profile) {
      setShopName(profile.display_name || "");
      setShopDesc(profile.shop_description || "");
      setShopDescDoc(parseDescription(profile.shop_description ?? null));
      setShopAddress(profile.shop_address || "");
      if (profile.shop_desa || profile.shop_kecamatan || profile.shop_kabupaten) {
        setShopDesa(profile.shop_desa || "");
        setShopKecamatan(profile.shop_kecamatan || "");
        setShopKabupaten(profile.shop_kabupaten || "");
      } else if (profile.shop_address) {
        const parts = profile.shop_address.split(",").map((p) => p.trim());
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
      setShopLat(profile.shop_latitude !== void 0 && profile.shop_latitude !== null ? Number(profile.shop_latitude) : null);
      setShopLon(profile.shop_longitude !== void 0 && profile.shop_longitude !== null ? Number(profile.shop_longitude) : null);
      setShopActive(profile.shop_active !== 0);
    }
  }, [profile]);
  reactExports.useEffect(() => {
    if (activeTab !== "profile" || !profile) return;
    const initMap = (L) => {
      if (mapRef.current) return;
      if (!mapContainerRef.current) return;
      const container = mapContainerRef.current;
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        setTimeout(() => {
          if (activeTab === "profile") {
            initMap(L);
          }
        }, 100);
        return;
      }
      const defaultLat = shopLat || -6.2;
      const defaultLon = shopLon || 106.816666;
      const map = L.map(container).setView([defaultLat, defaultLon], 14);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      const marker = L.marker([defaultLat, defaultLon], {
        draggable: true
      }).addTo(map);
      markerRef.current = marker;
      const updateCoords = async (latVal, lonVal) => {
        setShopLat(latVal);
        setShopLon(lonVal);
        await reverseGeocode(latVal, lonVal);
      };
      const setupMarkerEvents = (m) => {
        m.on("dragend", () => {
          const position = m.getLatLng();
          updateCoords(position.lat, position.lng);
        });
      };
      setupMarkerEvents(marker);
      map.on("click", (e) => {
        let m = markerRef.current;
        if (!m) {
          m = L.marker(e.latlng, {
            draggable: true
          }).addTo(map);
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
    if (window.L) {
      setLeafletLoaded(true);
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
          setLeafletLoaded(true);
          initMap(window.L);
        };
        document.body.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (window.L) {
            clearInterval(checkInterval);
            setLeafletLoaded(true);
            initMap(window.L);
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
  reactExports.useEffect(() => {
    if (mapRef.current && markerRef.current && shopLat !== null && shopLon !== null) {
      const pos = markerRef.current.getLatLng();
      if (Math.abs(pos.lat - shopLat) > 1e-5 || Math.abs(pos.lng - shopLon) > 1e-5) {
        markerRef.current.setLatLng([shopLat, shopLon]);
        mapRef.current.setView([shopLat, shopLon], mapRef.current.getZoom());
      }
    }
  }, [shopLat, shopLon]);
  reactExports.useEffect(() => {
    if (!isMapExpanded || !profile) {
      if (modalMapRef.current) {
        modalMapRef.current.remove();
        modalMapRef.current = null;
        modalMarkerRef.current = null;
      }
      return;
    }
    const initModalMap = (L) => {
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
      const defaultLat = shopLat || -6.2;
      const defaultLon = shopLon || 106.816666;
      const map = L.map(container).setView([defaultLat, defaultLon], 14);
      modalMapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      const marker = L.marker([defaultLat, defaultLon], {
        draggable: true
      }).addTo(map);
      modalMarkerRef.current = marker;
      const updateCoords = async (latVal, lonVal) => {
        setShopLat(latVal);
        setShopLon(lonVal);
        await reverseGeocode(latVal, lonVal);
      };
      const setupMarkerEvents = (m) => {
        m.on("dragend", () => {
          const position = m.getLatLng();
          updateCoords(position.lat, position.lng);
        });
      };
      setupMarkerEvents(marker);
      map.on("click", (e) => {
        let m = modalMarkerRef.current;
        if (!m) {
          m = L.marker(e.latlng, {
            draggable: true
          }).addTo(map);
          modalMarkerRef.current = m;
          setupMarkerEvents(m);
        } else {
          m.setLatLng(e.latlng);
        }
        updateCoords(e.latlng.lat, e.latlng.lng);
      });
    };
    if (window.L) {
      initModalMap(window.L);
    } else {
      const checkInterval = setInterval(() => {
        if (window.L) {
          clearInterval(checkInterval);
          initModalMap(window.L);
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
  reactExports.useEffect(() => {
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
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryParts)}&countrycodes=id&format=json&addressdetails=1&limit=10`);
      if (!res.ok) throw new Error("Gagal mencari lokasi");
      const data = await res.json();
      const uniqueMatches = [];
      const seen = /* @__PURE__ */ new Set();
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
            lon: parseFloat(item.lon)
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
    } catch (err) {
      console.error(err);
      toast.error("Gagal memvalidasi desa: " + (err.message || "kesalahan koneksi"));
    } finally {
      setGeocodingLoading(false);
    }
  };
  reactExports.useEffect(() => {
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
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryParts)}&countrycodes=id&format=json&addressdetails=1&limit=10`);
        if (res.ok) {
          const data = await res.json();
          const uniqueMatches = [];
          const seen = /* @__PURE__ */ new Set();
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
                lon: parseFloat(item.lon)
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
    }, 1e3);
    return () => clearTimeout(delayDebounce);
  }, [shopDesa, shopKecamatan, shopKabupaten]);
  const handleSaveShopProfile = async (e) => {
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
          shopActive,
          shopDesa: shopDesa.trim() || null,
          shopKecamatan: shopKecamatan.trim() || null,
          shopKabupaten: shopKabupaten.trim() || null
        }
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
  const [shopFilter, setShopFilter] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("shopFilter") || "all";
    }
    return "all";
  });
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [pageSize, setPageSize] = reactExports.useState(10);
  reactExports.useEffect(() => {
    setCurrentPage(1);
  }, [shopFilter]);
  const [name, setName] = reactExports.useState("");
  const [price, setPrice] = reactExports.useState(0);
  const [descDoc, setDescDoc] = reactExports.useState({
    version: 1,
    blocks: [{
      type: "paragraph",
      text: ""
    }]
  });
  const [shopDescDoc, setShopDescDoc] = reactExports.useState({
    version: 1,
    blocks: [{
      type: "paragraph",
      text: ""
    }]
  });
  const [productAdminId, setProductAdminId] = reactExports.useState("global");
  const [images, setImages] = reactExports.useState([]);
  const [uploadingImage, setUploadingImage] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [pendingCropFiles, setPendingCropFiles] = reactExports.useState([]);
  const [cropImageSrc, setCropImageSrc] = reactExports.useState(null);
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
  const load = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      if (isSuperAdmin) {
        const adminsData = await getAdminRolesList();
        setShopAdmins(adminsData);
      }
    } catch (err) {
      console.error("Gagal memuat data kelola toko:", err);
      toast.error("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, [isSuperAdmin]);
  const parseProductImages = (raw) => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
    }
    return [raw];
  };
  const openAddDialog = () => {
    setEditingProduct(null);
    setName("");
    setPrice(0);
    setDescDoc({
      version: 1,
      blocks: [{
        type: "paragraph",
        text: ""
      }]
    });
    setImages([]);
    setProductAdminId(isSuperAdmin ? "global" : userId || "global");
    setShowProductForm(true);
  };
  const openEditDialog = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setDescDoc(parseDescription(p.description));
    setProductAdminId(p.admin_id || "global");
    setImages(parseProductImages(p.image_url));
    setShowProductForm(true);
  };
  const handleSubmit = async (e) => {
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
            image_url: serializedImages
          }
        });
        toast.success("Produk berhasil diperbarui");
      } else {
        await addProduct({
          data: {
            name: name.trim(),
            price: Number(price),
            description: serializedDesc,
            admin_id: finalAdminId,
            image_url: serializedImages
          }
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
  const handleDeleteProductImage = async (urlToDelete) => {
    try {
      await deleteProductPhoto({
        data: {
          imageUrl: urlToDelete
        }
      });
      setImages((prev) => prev.filter((img) => img !== urlToDelete));
      toast.success("Foto berhasil dihapus");
    } catch (err) {
      console.error("Gagal menghapus foto:", err);
      toast.error("Gagal menghapus foto");
    }
  };
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (images.length + files.length > 5) {
      toast.error("Maksimal 5 gambar per produk!");
      return;
    }
    setPendingCropFiles(files);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target?.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const handleCropDone = async (croppedBase64) => {
    setCropImageSrc(null);
    const progressInterval = startUploadSimulatedProgress();
    try {
      const file = pendingCropFiles[0];
      const uploadRes = await uploadProductPhoto({
        data: {
          base64Data: croppedBase64,
          fileName: (file?.name.split(".")[0] || "product") + ".jpg"
        }
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
          setCropImageSrc(event.target?.result);
        };
        nextReader.readAsDataURL(remaining[0]);
      }
    } catch (err) {
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
  const handleDelete = async (id, productName) => {
    if (!confirm(`Hapus produk "${productName}" dari toko?`)) return;
    try {
      await deleteProduct({
        data: {
          id
        }
      });
      toast.success("Produk berhasil dihapus");
      load();
    } catch (err) {
      console.error("Gagal menghapus produk:", err);
      toast.error("Gagal menghapus produk");
    }
  };
  const displayedProducts = products.filter((p) => {
    if (!isSuperAdmin) {
      if (p.admin_id !== userId) return false;
    } else {
      if (shopFilter === "global") {
        if (p.admin_id !== null) return false;
      } else if (shopFilter !== "all") {
        if (p.admin_id !== shopFilter) return false;
      }
    }
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, { title: "Kelola Toko", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Memuat..." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminShell, { title: showProductForm ? editingProduct ? "Edit Produk" : "Tambah Produk Baru" : "Kelola Toko", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: showProductForm ? (
      /* ─── Full-Page Product Form ─────────────────────────────────────────── */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-2 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
          setShowProductForm(false);
          setEditingProduct(null);
        }, className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4 group-hover:-translate-x-0.5 transition-transform" }),
          "Kembali ke Katalog"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-3.5" }),
                " Informasi Produk"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1.5", children: "Nama Produk / Obat" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Contoh: Fungisida Cair Organik", className: "w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow", required: true, autoFocus: true })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1.5", children: "Harga (Rupiah)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium", children: "Rp" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: price ? formatNumberWithDots(price) : "", onChange: (e) => setPrice(parseNumberFromDots(e.target.value)), placeholder: "15.000", className: "w-full pl-9 pr-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow", required: true })
                  ] })
                ] }),
                isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1.5", children: "Pemilik Toko / Penjual" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: productAdminId, onChange: (e) => setProductAdminId(e.target.value), className: "w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "global", children: "Kebunin Resmi (Sistem / Global)" }),
                    shopAdmins.map((adm) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: adm.user_id, children: adm.display_name || `Admin (${adm.user_id.slice(0, 8)})` }, adm.user_id))
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "size-3.5" }),
                  " Gambar Produk"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md", children: [
                  images.length,
                  "/5 Gambar"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mb-4", children: "Unggah minimal 1 dan maksimal 5 foto produk agar dapat dipublikasikan. Disarankan gambar persegi (ratio 1:1)." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-3", children: [
                images.map((url, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { draggable: true, onDragStart: () => handleDragStart(index), onDragOver: handleDragOver, onDrop: () => handleDrop(index), className: `aspect-square relative rounded-xl border border-border bg-muted/20 overflow-hidden group animate-in zoom-in-95 duration-200 cursor-move transition-all ${draggedIndex === index ? "opacity-30 scale-95 border-primary border-2 border-dashed" : "hover:border-primary/50"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: `Gambar ${index + 1}`, className: "w-full h-full object-cover pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleDeleteProductImage(url), className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer", title: "Hapus gambar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-2 bg-black/60 text-white rounded-md px-1.5 py-0.5 text-[9px] font-bold opacity-75 group-hover:opacity-100 transition-opacity", children: [
                    "#",
                    index + 1
                  ] })
                ] }, index)),
                images.length < 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", id: "product-image-uploader", accept: "image/*", multiple: true, className: "hidden", onChange: handleImageUpload, disabled: uploadingImage }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "product-image-uploader", className: "aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-xl cursor-pointer transition-colors group", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-5 text-muted-foreground group-hover:text-primary transition-colors" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground group-hover:text-primary mt-1 transition-colors", children: "Upload" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignStart, { className: "size-3.5" }),
                " Deskripsi Produk"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mb-3", children: "Gunakan blok paragraf, judul, dan daftar untuk membuat deskripsi yang terstruktur dan mudah dibaca." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionEditor, { value: descDoc, onChange: setDescDoc, placeholder: "Tulis deskripsi singkat produk pertanian ini..." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Aksi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: busy, className: "w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer", children: [
                busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : null,
                editingProduct ? "Simpan Perubahan" : "Simpan Produk"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setShowProductForm(false);
                setEditingProduct(null);
              }, className: "w-full bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors cursor-pointer", children: "Batal" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3", children: "Pratinjau Deskripsi" }),
              descDoc.blocks.some((b) => b.type === "paragraph" || b.type === "heading" ? b.text.trim() : b.type === "bullet" ? b.items.some((i) => i.trim()) : false) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/20 rounded-xl p-3 border border-border", children: renderDescriptionBlocks(descDoc) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground/60 italic", children: "Deskripsi akan tampil di sini saat Anda mulai mengetik." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/20 rounded-2xl p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-primary mb-1.5", children: "Tips penulisan deskripsi:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-[11px] text-muted-foreground space-y-1 list-disc list-inside", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Gunakan ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Judul" }),
                  " untuk subjudul bagian"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Gunakan ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Daftar" }),
                  " untuk fitur/manfaat"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Tekan ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "bg-muted px-1 py-0.5 rounded text-[10px] font-mono", children: "Enter" }),
                  " di daftar untuk poin baru"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Deskripsi disimpan persis seperti yang Anda ketik" })
              ] })
            ] })
          ] })
        ] }) })
      ] })
    ) : (
      /* ─── Tabbed Layout ──────────────────────────────────────────────────── */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 border-b border-border pb-px", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-md", children: isSuperAdmin ? "Kelola semua katalog produk/obat pertanian dari seluruh toko pertanian yang didaftarkan." : "Kelola katalog produk bibit, pupuk, dan obat pertanian urban milik toko Anda." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 -mb-px", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("products"), className: `px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === "products" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Katalog Produk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("profile"), className: `px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === "profile" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Profil Toko Saya" })
          ] })
        ] }),
        activeTab === "products" ? (
          /* ─── Product List View ──────────────────────────────────────────────── */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: openAddDialog, className: "bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/95 transition-colors shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              " Tambah Produk"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-card", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center gap-3 w-full sm:max-w-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => {
                      setQ(e.target.value);
                      setCurrentPage(1);
                    }, placeholder: "Cari nama produk...", className: "w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20" })
                  ] }),
                  isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-4 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: shopFilter, onChange: (e) => setShopFilter(e.target.value), className: "px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Semua Toko & Sistem" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "global", children: "Kebunin Resmi (Sistem / Global)" }),
                      shopAdmins.map((adm) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: adm.user_id, children: adm.display_name || `Admin (${adm.user_id.slice(0, 8)})` }, adm.user_id))
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground shrink-0", children: [
                  displayedProducts.length,
                  " produk ditemukan"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground w-20", children: "Foto" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Nama Produk / Obat" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Harga" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Penjual / Toko" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground", children: "Deskripsi" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-medium text-muted-foreground w-24", children: "Aksi" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 6, className: "p-8 text-center text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin mx-auto mb-2 text-primary" }),
                  "Memuat produk..."
                ] }) }) : displayedProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 6, className: "p-12 text-center text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-10 mx-auto mb-3 text-muted-foreground/50" }),
                  "Belum ada produk di katalog."
                ] }) }) : paginatedProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-lg overflow-hidden shrink-0 border border-border shadow-xs", children: (() => {
                    const imgs = parseProductImages(p.image_url);
                    if (imgs.length > 0) {
                      return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgs[0], alt: p.name, onClick: () => {
                        setZoomImages(imgs);
                        setZoomImageIdx(0);
                        setZoomImageUrl(imgs[0]);
                      }, className: "w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" });
                    }
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-muted/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "size-5 text-muted-foreground/60" }) });
                  })() }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: p.name }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 font-medium text-primary", children: [
                    "Rp ",
                    p.price.toLocaleString("id-ID")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/40 border border-border px-2.5 py-1 rounded-lg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "size-3.5 text-primary" }),
                    p.shop_name ?? "Kebunin Resmi"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 max-w-xs", children: p.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line-clamp-2", children: (() => {
                    const parsed = parseDescription(p.description);
                    const firstBlock = parsed.blocks.find((b) => b.type === "paragraph" ? b.text.trim() : b.type === "heading" ? b.text.trim() : b.type === "bullet" ? b.items.some((i) => i.trim()) : false);
                    if (!firstBlock) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" });
                    if (firstBlock.type === "bullet") {
                      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: firstBlock.items.filter(Boolean).slice(0, 2).join(" • ") });
                    }
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: firstBlock.text });
                  })() }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openEditDialog(p), className: "text-foreground hover:bg-muted p-2 rounded-lg transition-colors border border-border", title: "Edit Produk", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "size-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(p.id, p.name), className: "text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors border border-border", title: "Hapus Produk", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
                  ] })
                ] }, p.id)) })
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
                    displayedProducts.length,
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
            ] })
          ] })
        ) : (
          /* ─── Shop Profile ───────────────────────────────────────────────────── */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-card border border-border rounded-2xl p-6 shadow-sm animate-in fade-in duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-1", children: "Pengaturan Profil Toko" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Lengkapi deskripsi, alamat, dan kontak toko Anda agar pengguna dapat langsung menghubungi Anda." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveShopProfile, className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 p-4 rounded-xl border border-border flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-semibold block flex items-center gap-1 text-foreground", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "size-3.5 text-primary" }),
                        " Status Keaktifan Toko"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground mt-0.5 block leading-normal", children: "Jika tidak aktif, semua produk Anda akan disembunyikan dari katalog pengguna." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShopActive(!shopActive), className: `w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none relative flex items-center shrink-0 cursor-pointer ${shopActive ? "bg-primary" : "bg-muted-foreground/30"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-4.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${shopActive ? "translate-x-5.5" : "translate-x-0"}` }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-semibold block mb-1.5 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "size-3.5 text-muted-foreground" }),
                      " Nama Toko Pertanian"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: shopName, onChange: (e) => setShopName(e.target.value), placeholder: "Contoh: Toko Tani Subur Makmur", className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-semibold block mb-1.5 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-3.5 text-muted-foreground" }),
                      " Deskripsi Toko"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mb-2", children: "Gunakan blok teks, judul, dan daftar untuk deskripsi yang rapi dan terstruktur." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionEditor, { value: shopDescDoc, onChange: setShopDescDoc, placeholder: "Deskripsikan produk unggulan atau jam operasional toko Anda..." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-semibold block mb-1.5 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3.5 text-muted-foreground" }),
                      " Nomor WhatsApp"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: shopWhatsapp, onChange: (e) => setShopWhatsapp(e.target.value), placeholder: "Contoh: 08123456789", className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Desa / Kelurahan" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: shopDesa, onChange: (e) => {
                        setShopDesa(e.target.value);
                      }, placeholder: "Contoh: Jatisaba", className: "flex-1 px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleSearchShopDesa, disabled: geocodingLoading, className: "px-4 py-2 bg-accent-soft text-primary hover:bg-accent/30 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50", children: [
                        geocodingLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5" }),
                        "Cari"
                      ] })
                    ] })
                  ] }),
                  shopAmbiguousOptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 border border-border rounded-xl p-3 max-h-36 overflow-y-auto space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Pilih Lokasi yang Sesuai:" }),
                    shopAmbiguousOptions.map((opt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
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
                    }, className: "w-full text-left p-2 hover:bg-background border border-transparent hover:border-border rounded-lg text-xs font-medium text-foreground transition-all cursor-pointer", children: [
                      "Kec. ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: opt.kecamatan }),
                      ", Kab. ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: opt.kabupaten })
                    ] }, idx))
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Kecamatan" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: shopKecamatan, onChange: (e) => {
                        setShopKecamatan(e.target.value);
                      }, placeholder: "Contoh: Purbalingga", className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Kabupaten / Kota" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: shopKabupaten, onChange: (e) => {
                        setShopKabupaten(e.target.value);
                      }, placeholder: "Contoh: Purbalingga", className: "w-full px-3.5 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-semibold flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3.5 text-muted-foreground" }),
                        " Pinpoint Koordinat Peta (Lokasi GPS)"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleDetectLocation, disabled: detectingLocation, className: "text-[11px] font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50", children: [
                          detectingLocation ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "size-3" }),
                          "Deteksi Lokasi Otomatis"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "|" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleClearLocation, className: "text-[11px] font-semibold text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors cursor-pointer", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }),
                          "Hapus Lokasi"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: mapContainerRef, className: "w-full h-44 rounded-xl border border-border bg-muted/30 overflow-hidden relative z-0 mb-2", style: {
                        minHeight: "176px"
                      } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsMapExpanded(true), className: "absolute top-2.5 right-2.5 z-10 bg-background/90 hover:bg-background border border-border shadow-md rounded-lg p-1.5 text-muted-foreground hover:text-foreground transition-all flex items-center justify-center cursor-pointer", title: "Perbesar Peta", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "size-4" }) })
                    ] }),
                    isMapExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 md:p-8 animate-in fade-in duration-200", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setIsMapExpanded(false) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-[80vh] max-w-5xl bg-card border border-border rounded-2xl shadow-2xl p-5 relative z-10 flex flex-col gap-3.5 animate-in zoom-in-95 duration-200", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-foreground text-sm flex items-center gap-1.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4 text-primary" }),
                              " Pinpoint Lokasi Toko (Mode Perbesar)"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Geser penanda biru atau klik pada peta untuk menetapkan koordinat toko Anda" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsMapExpanded(false), className: "bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors", children: "Selesai" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: modalMapContainerRef, className: "w-full h-full rounded-xl border border-border bg-muted/30 overflow-hidden relative z-0", style: {
                          minHeight: "350px"
                        } }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            "Latitude: ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: shopLat !== null ? shopLat.toFixed(6) : "—" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            "Longitude: ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: shopLon !== null ? shopLon.toFixed(6) : "—" })
                          ] })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        "Latitude: ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: shopLat !== null ? shopLat.toFixed(6) : "—" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        "Longitude: ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: shopLon !== null ? shopLon.toFixed(6) : "—" })
                      ] })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-border flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: savingProfile, className: "bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm", children: [
                savingProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
                "Simpan Perubahan Profil"
              ] }) })
            ] })
          ] })
        )
      ] })
    ) }),
    zoomImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300", onClick: () => {
      setZoomImageUrl(null);
      setZoomImages([]);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[90vw] h-[90vw] max-w-[550px] max-h-[550px] bg-card rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border/30 flex flex-col", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3.5 flex items-center justify-between text-white z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm drop-shadow-sm", children: "Foto Produk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setZoomImageUrl(null);
          setZoomImages([]);
        }, className: "p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4.5 w-4.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      zoomImages.length > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full relative flex-1 bg-black", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
          e.stopPropagation();
          handlePrevSlide();
        }, className: "absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md", title: "Foto sebelumnya", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
          e.stopPropagation();
          handleNextSlide();
        }, className: "absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md", title: "Foto selanjutnya", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: zoomCarouselScrollRef, onScroll: handleZoomScroll, className: "w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth", children: zoomImages.map((imgUrl, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full shrink-0 snap-center flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgUrl, alt: `Zoomed ${idx + 1}`, className: "w-full h-full object-cover select-none pointer-events-none" }) }, idx)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none", children: zoomImages.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 rounded-full transition-all duration-200 ${idx === zoomImageIdx ? "w-3.5 bg-primary" : "w-1.5 bg-white/60"}` }, idx)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 right-3 bg-black/60 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full z-10 select-none", children: [
          zoomImageIdx + 1,
          "/",
          zoomImages.length
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: zoomImageUrl, alt: "Produk", className: "w-full h-full object-cover" })
    ] }) }),
    uploadingImage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border p-6 rounded-2xl w-80 text-center shadow-2xl animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-10 animate-spin text-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-foreground", children: "Mengunggah Foto Produk..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Harap tidak menutup halaman ini" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 bg-muted/40 h-2 w-full rounded-full overflow-hidden border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary h-full rounded-full transition-all duration-300 ease-out", style: {
        width: `${uploadProgress}%`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary mt-2 block", children: [
        uploadProgress,
        "%"
      ] })
    ] }) }),
    cropImageSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(ImageCropper, { imageSrc: cropImageSrc, cropShape: "square", onCrop: handleCropDone, onCancel: handleCropCancel })
  ] });
}
export {
  KelolaTokoPage as component
};
