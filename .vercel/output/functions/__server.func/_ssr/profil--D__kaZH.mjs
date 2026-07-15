import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-Qd23l6J6.mjs";
import { supabase } from "./client-S4gzLm3e.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useProfile, i as initials } from "./use-profile-C764uWnh.mjs";
import { u as useWeather } from "./use-weather-DvVNi8Is.mjs";
import { P as updateProfile, Q as updateAccount, S as updateUserProfileLocation } from "./router-C0zimY-u.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { m as LoaderCircle, h as Camera, af as BookOpen, B as Bell, ag as Settings, a8 as LogOut, Z as ChevronRight, n as User, p as Lock, V as MapPin, l as ArrowLeft, y as Trash2, E as EyeOff, o as Eye, W as Compass } from "../_libs/lucide-react.mjs";
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
function ProfilPage() {
  const navigate = useNavigate();
  const {
    profile,
    refetch: refetchProfile
  } = useProfile();
  const {
    settings,
    refetch
  } = useWeather();
  const [settingsOpen, setSettingsOpen] = reactExports.useState(false);
  const [autoLocation, setAutoLocation] = reactExports.useState(true);
  const [desa, setDesa] = reactExports.useState("");
  const [kecamatan, setKecamatan] = reactExports.useState("");
  const [kabupaten, setKabupaten] = reactExports.useState("");
  const [lat, setLat] = reactExports.useState(0);
  const [lon, setLon] = reactExports.useState(0);
  const [loadingGeocode, setLoadingGeocode] = reactExports.useState(false);
  const [ambiguousOptions, setAmbiguousOptions] = reactExports.useState([]);
  const reverseGeocodeUser = reactExports.useCallback(async (latVal, lonVal) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latVal}&lon=${lonVal}&format=json&addressdetails=1`);
      if (res.ok) {
        const geoData = await res.json();
        const addr = geoData.address || {};
        const desaVal = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.residential || addr.municipality || "";
        const kecVal = addr.subdistrict || addr.town || addr.municipality || addr.subcounty || "";
        const kabVal = addr.regency || addr.city || addr.county || addr.city_district || "";
        setDesa(desaVal);
        setKecamatan(kecVal);
        setKabupaten(kabVal);
        return {
          desa: desaVal,
          kecamatan: kecVal,
          kabupaten: kabVal
        };
      }
    } catch (err) {
      console.error("Gagal reverse geocode:", err);
    }
    return null;
  }, []);
  const handleDetectUserLocation = async () => {
    setLoadingGeocode(true);
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
      let detectedLat;
      let detectedLon;
      let detectedVia = "";
      try {
        const position = await getGPSLocation();
        detectedLat = position.coords.latitude;
        detectedLon = position.coords.longitude;
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
          detectedLat = backupData.latitude;
          detectedLon = backupData.longitude;
          detectedVia = "IP Address (Cadangan)";
        } else {
          const ipData = await ipRes.json();
          if (ipData.error) {
            throw new Error(ipData.reason || "Gagal mendeteksi lokasi via IP Address");
          }
          detectedLat = ipData.latitude;
          detectedLon = ipData.longitude;
          detectedVia = "IP Address";
        }
      }
      setLat(detectedLat);
      setLon(detectedLon);
      const addrResult = await reverseGeocodeUser(detectedLat, detectedLon);
      if (mapRef.current) {
        mapRef.current.setView([detectedLat, detectedLon], 14);
      }
      if (markerRef.current) {
        markerRef.current.setLatLng([detectedLat, detectedLon]);
      }
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
      setAutoLocation(false);
    } finally {
      setLoadingGeocode(false);
    }
  };
  const handleClearUserLocation = () => {
    setDesa("");
    setKecamatan("");
    setKabupaten("");
    setLat(0);
    setLon(0);
    setAutoLocation(false);
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    toast.success("Lokasi berhasil dikosongkan. Silakan klik 'Simpan' untuk menyimpan.");
  };
  const [settingsView, setSettingsView] = reactExports.useState("menu");
  const [editDisplayName, setEditDisplayName] = reactExports.useState("");
  const [editAvatarUrl, setEditAvatarUrl] = reactExports.useState("");
  const [editEmail, setEditEmail] = reactExports.useState("");
  const [editPassword, setEditPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [savingSettings, setSavingSettings] = reactExports.useState(false);
  reactExports.useRef(null);
  const [zoomImageUrl, setZoomImageUrl] = reactExports.useState(null);
  const [savingAvatar, setSavingAvatar] = reactExports.useState(false);
  const [cropImageSrc, setCropImageSrc] = reactExports.useState(null);
  const [pendingCropFile, setPendingCropFile] = reactExports.useState(null);
  const [cropContext, setCropContext] = reactExports.useState(null);
  const profilCameraInputRef = reactExports.useRef(null);
  const profilGalleryInputRef = reactExports.useRef(null);
  const [sourceSelectContext, setSourceSelectContext] = reactExports.useState(null);
  reactExports.useRef(null);
  const [uploadingImage, setUploadingImage] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const startUploadSimulatedProgress = () => {
    setUploadingImage(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
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
  reactExports.useEffect(() => {
    if (settingsOpen && profile) {
      setEditDisplayName(profile.display_name || "");
      setEditAvatarUrl(profile.avatar_url || "");
      setEditEmail(profile.email || "");
      setEditPassword("");
      setShowPassword(false);
    }
  }, [settingsOpen, profile]);
  const mapContainerRef = reactExports.useRef(null);
  const mapRef = reactExports.useRef(null);
  const markerRef = reactExports.useRef(null);
  const [leafletLoaded, setLeafletLoaded] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (settingsOpen) {
      setAutoLocation(settings.autoLocation);
      setDesa(settings.desa);
      setKecamatan(settings.kecamatan);
      setKabupaten(settings.kabupaten);
      setLat(settings.lat);
      setLon(settings.lon);
      setAmbiguousOptions([]);
    }
  }, [settingsOpen, settings]);
  reactExports.useEffect(() => {
    if (typeof window === "undefined" || !settingsOpen || settingsView !== "location") {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
      return;
    }
    const initMap = (L) => {
      if (!mapContainerRef.current) return;
      const currentLat = lat || -7.4024;
      const currentLon = lon || 109.2312;
      if (mapRef.current) {
        mapRef.current.setView([currentLat, currentLon], 14);
        if (markerRef.current) {
          markerRef.current.setLatLng([currentLat, currentLon]);
        }
        return;
      }
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView([currentLat, currentLon], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(map);
      const defaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      const marker = L.marker([currentLat, currentLon], {
        icon: defaultIcon,
        draggable: true
      }).addTo(map);
      mapRef.current = map;
      markerRef.current = marker;
      const handleLatLngChange = async (newLat, newLon) => {
        setLat(newLat);
        setLon(newLon);
        setAutoLocation(false);
        await reverseGeocodeUser(newLat, newLon);
      };
      const setupMarkerEvents = (m) => {
        m.on("dragend", () => {
          const position = m.getLatLng();
          handleLatLngChange(position.lat, position.lng);
        });
      };
      setupMarkerEvents(marker);
      map.on("click", (e) => {
        let m = markerRef.current;
        if (!m) {
          m = L.marker(e.latlng, {
            icon: defaultIcon,
            draggable: true
          }).addTo(map);
          markerRef.current = m;
          setupMarkerEvents(m);
        } else {
          m.setLatLng(e.latlng);
        }
        handleLatLngChange(e.latlng.lat, e.latlng.lng);
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
  }, [settingsOpen, autoLocation, settingsView]);
  const handleLogout = async () => {
    localStorage.removeItem("kebunin_user");
    await supabase.auth.signOut();
    toast.success("Sampai jumpa lagi! 👋");
    navigate({
      to: "/",
      replace: true
    });
  };
  const handleSearchDesa = async () => {
    if (!desa.trim()) {
      toast.error("Isi nama desa terlebih dahulu");
      return;
    }
    setLoadingGeocode(true);
    setAmbiguousOptions([]);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(desa.trim())}&countrycodes=id&format=json&addressdetails=1&limit=10`);
      if (!res.ok) throw new Error("Gagal mencari lokasi");
      const data = await res.json();
      const uniqueMatches = [];
      const seen = /* @__PURE__ */ new Set();
      for (const item of data) {
        const addr = item.address || {};
        const desaVal = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.residential || addr.municipality || "";
        const kecVal = addr.subdistrict || addr.town || addr.municipality || addr.subcounty || "";
        const kabVal = addr.regency || addr.city || addr.county || addr.city_district || "";
        if (!desaVal && !item.display_name.toLowerCase().includes(desa.toLowerCase())) continue;
        const key = `${kecVal.toLowerCase()}|${kabVal.toLowerCase()}`;
        if (!seen.has(key) && kecVal && kabVal) {
          seen.add(key);
          uniqueMatches.push({
            desa: desaVal || desa.trim(),
            kecamatan: kecVal,
            kabupaten: kabVal,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon)
          });
        }
      }
      if (uniqueMatches.length === 1) {
        const match = uniqueMatches[0];
        setDesa(match.desa);
        setKecamatan(match.kecamatan);
        setKabupaten(match.kabupaten);
        setLat(match.lat);
        setLon(match.lon);
        if (mapRef.current) {
          mapRef.current.setView([match.lat, match.lon], 14);
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([match.lat, match.lon]);
        }
        toast.success("Kecamatan & Kabupaten berhasil diisi otomatis! ✨");
      } else if (uniqueMatches.length > 1) {
        setAmbiguousOptions(uniqueMatches);
        toast.info(`Ditemukan ${uniqueMatches.length} lokasi berbeda. Silakan pilih salah satu.`);
      } else {
        toast.warning("Desa tidak ditemukan secara spesifik. Anda dapat mengisi Kecamatan dan Kabupaten secara manual.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memvalidasi desa: " + (err.message || "kesalahan koneksi"));
    } finally {
      setLoadingGeocode(false);
    }
  };
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!desa.trim() || !kabupaten.trim()) {
      toast.error("Mohon lengkapi data Desa dan Kabupaten/Kota.");
      return;
    }
    setLoadingGeocode(true);
    let finalLat = lat;
    let finalLon = lon;
    if (finalLat === 0 || finalLon === 0) {
      try {
        const queryParts = [desa.trim(), kecamatan.trim(), kabupaten.trim()].filter(Boolean).join(", ");
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryParts)}&countrycodes=id&format=json&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
          finalLat = parseFloat(data[0].lat);
          finalLon = parseFloat(data[0].lon);
          setLat(finalLat);
          setLon(finalLon);
        } else {
          toast.error("Kombinasi wilayah tidak ditemukan. Silakan periksa ejaan.");
          setLoadingGeocode(false);
          return;
        }
      } catch (err) {
        toast.error("Kesalahan jaringan saat validasi.");
        setLoadingGeocode(false);
        return;
      }
    }
    const finalSettings = {
      autoLocation,
      desa: desa.trim(),
      kecamatan: kecamatan.trim(),
      kabupaten: kabupaten.trim(),
      lat: finalLat,
      lon: finalLon
    };
    try {
      localStorage.setItem("kebunin_weather_settings", JSON.stringify(finalSettings));
      if (profile) {
        await updateUserProfileLocation({
          data: {
            id: profile.id,
            userDesa: desa.trim() || null,
            userKecamatan: kecamatan.trim() || null,
            userKabupaten: kabupaten.trim() || null,
            userLatitude: finalLat || null,
            userLongitude: finalLon || null
          }
        });
      }
      toast.success("Pengaturan lokasi berhasil disimpan! 💾");
      refetch();
      setSettingsOpen(false);
    } catch (err) {
      console.error("Gagal menyimpan lokasi ke DB:", err);
      toast.error("Gagal menyinkronkan lokasi ke server");
    } finally {
      setLoadingGeocode(false);
    }
  };
  const handleSavePersonalData = async (e) => {
    e.preventDefault();
    if (!editDisplayName.trim()) {
      toast.error("Nama lengkap tidak boleh kosong");
      return;
    }
    setSavingSettings(true);
    try {
      await updateProfile({
        data: {
          id: profile.id,
          displayName: editDisplayName.trim(),
          avatarUrl: editAvatarUrl.trim() || null
        }
      });
      const localUserStr = localStorage.getItem("kebunin_user");
      if (localUserStr) {
        const localUser = JSON.parse(localUserStr);
        localUser.display_name = editDisplayName.trim();
        localStorage.setItem("kebunin_user", JSON.stringify(localUser));
      }
      toast.success("Data pribadi berhasil diperbarui! ✨");
      setSettingsOpen(false);
      refetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui data pribadi: " + (err.message || "kesalahan server"));
    } finally {
      setSavingSettings(false);
    }
  };
  const handleSaveAccountData = async (e) => {
    e.preventDefault();
    if (!editEmail.trim()) {
      toast.error("Email tidak boleh kosong");
      return;
    }
    setSavingSettings(true);
    try {
      const localUserStr = localStorage.getItem("kebunin_user");
      if (localUserStr) {
        await updateAccount({
          data: {
            id: profile.id,
            email: editEmail.trim(),
            password: editPassword ? editPassword : void 0
          }
        });
        const localUser = JSON.parse(localUserStr);
        localUser.email = editEmail.trim();
        localStorage.setItem("kebunin_user", JSON.stringify(localUser));
      } else {
        const {
          error
        } = await supabase.auth.updateUser({
          email: editEmail.trim(),
          password: editPassword ? editPassword : void 0
        });
        if (error) throw error;
        await updateAccount({
          data: {
            id: profile.id,
            email: editEmail.trim()
          }
        });
      }
      toast.success("Informasi akun berhasil diperbarui! ✨");
      setSettingsOpen(false);
      refetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui akun: " + (err.message || "kesalahan server"));
    } finally {
      setSavingSettings(false);
    }
  };
  const menu = [{
    icon: BookOpen,
    label: "Panduan Berkebun"
  }, {
    icon: Bell,
    label: "Notifikasi"
  }, {
    icon: Settings,
    label: "Pengaturan",
    onClick: () => {
      setSettingsOpen(true);
      setSettingsView("menu");
    }
  }, {
    icon: LogOut,
    label: "Keluar",
    onClick: handleLogout,
    destructive: true
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-primary-dark text-primary-foreground px-5 pt-8 pb-10 rounded-b-3xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative size-24 mx-auto mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => {
          if (profile?.avatar_url) {
            setZoomImageUrl(profile.avatar_url);
          } else {
            toast.info("Unggah foto profil terlebih dahulu! 📸");
          }
        }, className: `w-full h-full rounded-full overflow-hidden border-2 border-accent bg-accent/20 flex items-center justify-center ${profile?.avatar_url ? "cursor-pointer" : ""}`, title: profile?.avatar_url ? "Klik untuk memperbesar" : void 0, children: profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.avatar_url, alt: profile.display_name ?? "Avatar", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-accent-foreground select-none", children: initials(profile?.display_name) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setCropContext("direct");
          setSourceSelectContext("direct");
        }, disabled: savingAvatar, className: "absolute bottom-0 right-0 size-8 rounded-full bg-accent hover:bg-accent/80 text-primary flex items-center justify-center border-2 border-primary-dark shadow-md active:scale-[0.9] transition-all cursor-pointer", title: "Ubah Foto Profil", children: savingAvatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-4 text-primary" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-primary-foreground text-xl font-bold mt-3", children: profile?.display_name ?? "Petani Urban" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-5 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden", children: menu.map((m) => {
      const Icon = m.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: m.onClick, className: `w-full min-h-[52px] flex items-center gap-3 px-4 py-3 active:bg-muted transition-colors ${m.destructive ? "text-destructive" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-5 ${m.destructive ? "text-destructive" : "text-primary"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex-1 text-left font-medium ${m.destructive ? "text-destructive" : "text-foreground"}`, children: m.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-5 text-muted-foreground" })
      ] }) }, m.label);
    }) }) }),
    settingsOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]", children: [
      settingsView === "menu" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-1", children: "Pengaturan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Pilih opsi pengaturan yang ingin Anda ubah di bawah ini." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 flex-1 overflow-y-auto pr-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSettingsView("personal"), className: "w-full flex items-center gap-3 p-3 bg-muted/40 border border-border hover:border-primary/30 hover:bg-muted/70 rounded-xl text-left transition-all cursor-pointer group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Ubah Data Pribadi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Ubah nama panggilan & avatar" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSettingsView("account"), className: "w-full flex items-center gap-3 p-3 bg-muted/40 border border-border hover:border-primary/30 hover:bg-muted/70 rounded-xl text-left transition-all cursor-pointer group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Ubah Email & Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Ubah kata sandi & alamat email" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSettingsView("location"), className: "w-full flex items-center gap-3 p-3 bg-muted/40 border border-border hover:border-primary/30 hover:bg-muted/70 rounded-xl text-left transition-all cursor-pointer group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Pengaturan Lokasi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Ubah koordinat cuaca dan daerah" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSettingsOpen(false), className: "w-full bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors cursor-pointer", children: "Tutup" }) })
      ] }),
      settingsView === "personal" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSettingsView("menu"), className: "p-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground", children: "Ubah Data Pribadi" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4 pl-7", children: "Perbarui nama lengkap dan avatar profil Anda." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSavePersonalData, className: "space-y-4 overflow-y-auto pr-1 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 py-3 bg-muted/20 border border-border rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group size-20", children: [
              editAvatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: editAvatarUrl, alt: "Pratinjau Avatar", className: "size-20 rounded-full object-cover border-2 border-primary shadow-sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold border-2 border-dashed border-primary/30", children: initials(editDisplayName) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setCropContext("settings");
                setSourceSelectContext("settings");
              }, className: "absolute bottom-0 right-0 size-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-card shadow hover:scale-105 active:scale-95 transition-all cursor-pointer", title: "Unggah Foto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-3.5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                setCropContext("settings");
                setSourceSelectContext("settings");
              }, className: "px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-3.5" }),
                "Pilih Foto"
              ] }),
              editAvatarUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setEditAvatarUrl(""), className: "px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }),
                "Hapus"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Nama Lengkap" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: editDisplayName, onChange: (e) => setEditDisplayName(e.target.value), placeholder: "Contoh: Ali Novian", className: "w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "URL Foto Profil (Avatar) — Opsional" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "url", value: editAvatarUrl, onChange: (e) => setEditAvatarUrl(e.target.value), placeholder: "https://example.com/avatar.jpg", className: "w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSettingsView("menu"), className: "flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors cursor-pointer", children: "Batal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: savingSettings, className: "flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer", children: [
              savingSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
              "Simpan"
            ] })
          ] })
        ] })
      ] }),
      settingsView === "account" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSettingsView("menu"), className: "p-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground", children: "Ubah Email & Password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4 pl-7", children: "Perbarui alamat email atau ubah kata sandi masuk Anda." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveAccountData, className: "space-y-4 overflow-y-auto pr-1 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Alamat Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: editEmail, onChange: (e) => setEditEmail(e.target.value), placeholder: "name@example.com", className: "w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Kata Sandi Baru (Opsional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", value: editPassword, onChange: (e) => setEditPassword(e.target.value), placeholder: "Min. 6 karakter jika ingin diubah", className: "w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 pr-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center size-5", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSettingsView("menu"), className: "flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors cursor-pointer", children: "Batal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: savingSettings, className: "flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer", children: [
              savingSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
              "Simpan"
            ] })
          ] })
        ] })
      ] }),
      settingsView === "location" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSettingsView("menu"), className: "p-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground", children: "Lokasi Pengguna" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4 pl-7", children: "Pilih metode penentuan lokasi untuk pemantauan cuaca tanaman yang akurat." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveSettings, className: "space-y-4 overflow-y-auto pr-1 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3.5 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: "Pinpoint Lokasi di Peta" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleDetectUserLocation, disabled: loadingGeocode, className: "text-[10.5px] font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap", children: [
                    loadingGeocode ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "size-3" }),
                    "Deteksi"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs leading-none", children: "|" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleClearUserLocation, className: "text-[10.5px] font-semibold text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }),
                    "Hapus"
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: mapContainerRef, className: "w-full h-44 rounded-xl border border-border bg-muted/30 overflow-hidden relative z-0", style: {
                minHeight: "176px"
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Geser pin atau ketuk area peta untuk menentukan titik koordinat presisi. Nama wilayah di bawah akan terisi otomatis." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Desa / Kelurahan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: desa, onChange: (e) => {
                  setDesa(e.target.value);
                  setLat(0);
                  setLon(0);
                  setAutoLocation(false);
                }, placeholder: "Contoh: Jatisaba", className: "flex-1 px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleSearchDesa, disabled: loadingGeocode, className: "px-3.5 bg-accent-soft text-primary rounded-xl text-xs font-semibold hover:bg-accent/30 disabled:opacity-50 shrink-0 transition-colors cursor-pointer", children: "Cari" })
              ] })
            ] }),
            ambiguousOptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 border border-border rounded-xl p-3 max-h-36 overflow-y-auto space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Pilih Lokasi yang Sesuai:" }),
              ambiguousOptions.map((opt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                setDesa(opt.desa);
                setKecamatan(opt.kecamatan);
                setKabupaten(opt.kabupaten);
                setLat(opt.lat);
                setLon(opt.lon);
                if (mapRef.current) {
                  mapRef.current.setView([opt.lat, opt.lon], 14);
                }
                if (markerRef.current) {
                  markerRef.current.setLatLng([opt.lat, opt.lon]);
                }
                setAmbiguousOptions([]);
                setAutoLocation(false);
                toast.success("Lokasi dipilih!");
              }, className: "w-full text-left p-2 hover:bg-background border border-transparent hover:border-border rounded-lg text-xs font-medium text-foreground transition-all cursor-pointer", children: [
                "Kec. ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: opt.kecamatan }),
                ", Kab.",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: opt.kabupaten })
              ] }, idx))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Kecamatan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: kecamatan, onChange: (e) => {
                setKecamatan(e.target.value);
                setLat(0);
                setLon(0);
                setAutoLocation(false);
              }, placeholder: "Contoh: Purbalingga", className: "w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold block mb-1", children: "Kabupaten / Kota" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: kabupaten, onChange: (e) => {
                setKabupaten(e.target.value);
                setLat(0);
                setLon(0);
                setAutoLocation(false);
              }, placeholder: "Contoh: Purbalingga", className: "w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20", required: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSettingsView("menu"), className: "flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors", children: "Batal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loadingGeocode, className: "flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer", children: [
              loadingGeocode && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
              "Simpan"
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    uploadingImage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border p-6 rounded-2xl w-80 text-center shadow-2xl animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-10 animate-spin text-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-foreground", children: "Mengunggah Foto Profil..." }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm drop-shadow-sm", children: "Foto Profil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setZoomImageUrl(null), className: "p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4.5 w-4.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: zoomImageUrl, alt: "Pratinjau Foto Profil", className: "w-full h-full object-cover" })
    ] }) }),
    cropImageSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(ImageCropper, { imageSrc: cropImageSrc, cropShape: "circle", onCancel: () => {
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
      if (ctxMode === "direct" && profile) {
        const progressInterval = startUploadSimulatedProgress();
        setSavingAvatar(true);
        try {
          await updateProfile({
            data: {
              id: profile.id,
              displayName: profile.display_name || "Petani Urban",
              avatarUrl: croppedBase64
            }
          });
          finishUploadSimulatedProgress(progressInterval, () => {
            toast.success("Foto profil berhasil diperbarui! ✨📸");
            refetchProfile();
          });
        } catch (err) {
          console.error("Gagal memperbarui foto profil:", err);
          failUploadSimulatedProgress(progressInterval);
          toast.error(err.message || "Gagal memperbarui foto profil ❌");
        } finally {
          setSavingAvatar(false);
        }
      } else if (ctxMode === "settings") {
        setEditAvatarUrl(croppedBase64);
        toast.success("Foto berhasil diproses! 📸");
      }
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", capture: "user", ref: profilCameraInputRef, className: "hidden", onChange: (e) => handleFileSelect(e, cropContext || "direct") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", ref: profilGalleryInputRef, className: "hidden", onChange: (e) => handleFileSelect(e, cropContext || "direct") }),
    sourceSelectContext && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[120] flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", onClick: () => setSourceSelectContext(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-250", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 bg-muted rounded-full mx-auto mb-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground mb-4 text-center", children: "Pilih Sumber Foto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => profilCameraInputRef.current?.click(), className: "flex flex-col items-center justify-center p-4 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-border/50 hover:border-accent/20 transition-all cursor-pointer group active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-accent-soft text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "Kamera" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => profilGalleryInputRef.current?.click(), className: "flex flex-col items-center justify-center p-4 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-border/50 hover:border-accent/20 transition-all cursor-pointer group active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-accent-soft text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "Galeri / Foto" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSourceSelectContext(null), className: "w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-xl active:scale-[0.98] transition-all cursor-pointer", children: "Batal" })
      ] })
    ] })
  ] });
}
export {
  ProfilPage as component
};
