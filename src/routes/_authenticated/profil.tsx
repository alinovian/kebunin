import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Coins,
  Flame,
  Award,
  BookOpen,
  Bell,
  Settings,
  ChevronRight,
  LogOut,
  Loader2,
  User,
  Lock,
  MapPin,
  ArrowLeft,
  Eye,
  EyeOff,
  Camera,
  Trash2,
  Compass,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile, initials } from "@/hooks/use-profile";
import { useState, useEffect, useRef, useCallback } from "react";
import { useWeather } from "@/hooks/use-weather";
import { updateProfile, updateAccount, updateUserProfileLocation } from "@/lib/api/db.functions";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({
    meta: [
      { title: "Profil | Kebunin" },
      { name: "description", content: "Lihat progres, koin, dan pencapaian berkebunmu." },
    ],
  }),
  component: ProfilPage,
});

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

function ProfilPage() {
  const navigate = useNavigate();
  const { profile, refetch: refetchProfile } = useProfile();

  const { settings, refetch } = useWeather();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [autoLocation, setAutoLocation] = useState(true);
  const [desa, setDesa] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  const [loadingGeocode, setLoadingGeocode] = useState(false);
  const [ambiguousOptions, setAmbiguousOptions] = useState<
    { desa: string; kecamatan: string; kabupaten: string; lat: number; lon: number }[]
  >([]);

  const reverseGeocodeUser = useCallback(async (latVal: number, lonVal: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latVal}&lon=${lonVal}&format=json&addressdetails=1`
      );
      if (res.ok) {
        const geoData = await res.json();
        const addr = geoData.address || {};
        const desaVal =
          addr.village ||
          addr.hamlet ||
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.municipality ||
          "";
        const kecVal =
          addr.subdistrict || addr.town || addr.municipality || addr.subcounty || "";
        const kabVal = addr.regency || addr.city || addr.county || addr.city_district || "";

        setDesa(desaVal);
        setKecamatan(kecVal);
        setKabupaten(kabVal);
        return { desa: desaVal, kecamatan: kecVal, kabupaten: kabVal };
      }
    } catch (err) {
      console.error("Gagal reverse geocode:", err);
    }
    return null;
  }, []);

  const handleDetectUserLocation = async () => {
    setLoadingGeocode(true);
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
      let detectedLat: number;
      let detectedLon: number;
      let detectedVia = "";

      try {
        const position = await getGPSLocation();
        detectedLat = position.coords.latitude;
        detectedLon = position.coords.longitude;
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

      // Perform reverse geocoding to fill address fields
      const addrResult = await reverseGeocodeUser(detectedLat, detectedLon);

      // Update map view & marker coordinates
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
      toast.success(msg, { id: toastId });
    } catch (err: any) {
      console.error("Gagal mendeteksi lokasi:", err);
      toast.error(err.message || "Gagal mendeteksi lokasi otomatis", { id: toastId });
      setAutoLocation(false);
    } finally {
      setLoadingGeocode(false);
    }
  };

  const handleAutoLocationChange = async (checked: boolean) => {
    setAutoLocation(checked);
    if (checked) {
      await handleDetectUserLocation();
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

  const [settingsView, setSettingsView] = useState<"menu" | "personal" | "account" | "location">(
    "menu",
  );
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [cropContext, setCropContext] = useState<"direct" | "settings" | null>(null);
  const profilCameraInputRef = useRef<HTMLInputElement>(null);
  const profilGalleryInputRef = useRef<HTMLInputElement>(null);
  const [sourceSelectContext, setSourceSelectContext] = useState<"direct" | "settings" | null>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, context: "direct" | "settings") => {
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

  const handleDirectAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target?.result as string);
      setPendingCropFile(file);
      setCropContext("direct");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target?.result as string);
      setPendingCropFile(file);
      setCropContext("settings");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (settingsOpen && profile) {
      setEditDisplayName(profile.display_name || "");
      setEditAvatarUrl(profile.avatar_url || "");
      setEditEmail(profile.email || "");
      setEditPassword("");
      setShowPassword(false);
    }
  }, [settingsOpen, profile]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !settingsOpen ||
      settingsView !== "location"
    ) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
      return;
    }

    const initMap = (L: any) => {
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
        attributionControl: false,
      }).setView([currentLat, currentLon], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const defaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const marker = L.marker([currentLat, currentLon], {
        icon: defaultIcon,
        draggable: true,
      }).addTo(map);

      mapRef.current = map;
      markerRef.current = marker;

      const handleLatLngChange = async (newLat: number, newLon: number) => {
        setLat(newLat);
        setLon(newLon);
        setAutoLocation(false);
        await reverseGeocodeUser(newLat, newLon);
      };

      const setupMarkerEvents = (m: any) => {
        m.on("dragend", () => {
          const position = m.getLatLng();
          handleLatLngChange(position.lat, position.lng);
        });
      };

      setupMarkerEvents(marker);

      map.on("click", (e: any) => {
        let m = markerRef.current;
        if (!m) {
          m = L.marker(e.latlng, {
            icon: defaultIcon,
            draggable: true,
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
  }, [settingsOpen, autoLocation, settingsView]);

  const handleLogout = async () => {
    localStorage.removeItem("kebunin_user");
    await supabase.auth.signOut();
    toast.success("Sampai jumpa lagi! 👋");
    navigate({ to: "/", replace: true });
  };

  const handleSearchDesa = async () => {
    if (!desa.trim()) {
      toast.error("Isi nama desa terlebih dahulu");
      return;
    }
    setLoadingGeocode(true);
    setAmbiguousOptions([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(desa.trim())}&countrycodes=id&format=json&addressdetails=1&limit=10`,
      );
      if (!res.ok) throw new Error("Gagal mencari lokasi");
      const data = await res.json();

      const uniqueMatches: any[] = [];
      const seen = new Set();

      for (const item of data) {
        const addr = item.address || {};
        const desaVal =
          addr.village ||
          addr.hamlet ||
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.municipality ||
          "";
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
            lon: parseFloat(item.lon),
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
        toast.warning(
          "Desa tidak ditemukan secara spesifik. Anda dapat mengisi Kecamatan dan Kabupaten secara manual.",
        );
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memvalidasi desa: " + (err.message || "kesalahan koneksi"));
    } finally {
      setLoadingGeocode(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
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
        const queryParts = [desa.trim(), kecamatan.trim(), kabupaten.trim()]
          .filter(Boolean)
          .join(", ");
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            queryParts,
          )}&countrycodes=id&format=json&limit=1`,
        );
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
      lon: finalLon,
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
            userLongitude: finalLon || null,
          },
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

  const handleSavePersonalData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDisplayName.trim()) {
      toast.error("Nama lengkap tidak boleh kosong");
      return;
    }
    setSavingSettings(true);
    try {
      await updateProfile({
        data: {
          id: profile!.id,
          displayName: editDisplayName.trim(),
          avatarUrl: editAvatarUrl.trim() || null,
        },
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
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memperbarui data pribadi: " + (err.message || "kesalahan server"));
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveAccountData = async (e: React.FormEvent) => {
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
            id: profile!.id,
            email: editEmail.trim(),
            password: editPassword ? editPassword : undefined,
          },
        });

        const localUser = JSON.parse(localUserStr);
        localUser.email = editEmail.trim();
        localStorage.setItem("kebunin_user", JSON.stringify(localUser));
      } else {
        const { error } = await supabase.auth.updateUser({
          email: editEmail.trim(),
          password: editPassword ? editPassword : undefined,
        });
        if (error) throw error;

        await updateAccount({
          data: {
            id: profile!.id,
            email: editEmail.trim(),
          },
        });
      }

      toast.success("Informasi akun berhasil diperbarui! ✨");
      setSettingsOpen(false);
      refetchProfile();
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memperbarui akun: " + (err.message || "kesalahan server"));
    } finally {
      setSavingSettings(false);
    }
  };

  const menu = [
    { icon: BookOpen, label: "Panduan Berkebun" },
    { icon: Bell, label: "Notifikasi" },
    {
      icon: Settings,
      label: "Pengaturan",
      onClick: () => {
        setSettingsOpen(true);
        setSettingsView("menu");
      },
    },
    { icon: LogOut, label: "Keluar", onClick: handleLogout, destructive: true },
  ];

  return (
    <AppShell>
      <header className="bg-primary-dark text-primary-foreground px-5 pt-8 pb-10 rounded-b-3xl text-center">
        <div className="relative size-24 mx-auto mb-3">
          <div
            onClick={() => {
              if (profile?.avatar_url) {
                setZoomImageUrl(profile.avatar_url);
              } else {
                toast.info("Unggah foto profil terlebih dahulu! 📸");
              }
            }}
            className={`w-full h-full rounded-full overflow-hidden border-2 border-accent bg-accent/20 flex items-center justify-center ${profile?.avatar_url ? "cursor-pointer" : ""
              }`}
            title={profile?.avatar_url ? "Klik untuk memperbesar" : undefined}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name ?? "Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-2xl font-bold text-accent-foreground select-none">
                {initials(profile?.display_name)}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setCropContext("direct");
              setSourceSelectContext("direct");
            }}
            disabled={savingAvatar}
            className="absolute bottom-0 right-0 size-8 rounded-full bg-accent hover:bg-accent/80 text-primary flex items-center justify-center border-2 border-primary-dark shadow-md active:scale-[0.9] transition-all cursor-pointer"
            title="Ubah Foto Profil"
          >
            {savingAvatar ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : (
              <Camera className="size-4 text-primary" />
            )}
          </button>
        </div>

        <h1 className="text-primary-foreground text-xl font-bold mt-3">{profile?.display_name ?? "Petani Urban"}</h1>
      </header>

      <section className="px-5 mt-6">
        <ul className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
          {menu.map((m) => {
            const Icon = m.icon;
            return (
              <li key={m.label}>
                <button
                  onClick={m.onClick}
                  className={`w-full min-h-[52px] flex items-center gap-3 px-4 py-3 active:bg-muted transition-colors ${m.destructive ? "text-destructive" : ""}`}
                >
                  <Icon
                    className={`size-5 ${m.destructive ? "text-destructive" : "text-primary"}`}
                  />
                  <span
                    className={`flex-1 text-left font-medium ${m.destructive ? "text-destructive" : "text-foreground"}`}
                  >
                    {m.label}
                  </span>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* VIEW 1: MENU SELECTION */}
            {settingsView === "menu" && (
              <>
                <h2 className="text-lg font-bold mb-1">Pengaturan</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Pilih opsi pengaturan yang ingin Anda ubah di bawah ini.
                </p>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => setSettingsView("personal")}
                    className="w-full flex items-center gap-3 p-3 bg-muted/40 border border-border hover:border-primary/30 hover:bg-muted/70 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <User className="size-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">Ubah Data Pribadi</p>
                      <p className="text-[10px] text-muted-foreground">
                        Ubah nama panggilan & avatar
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsView("account")}
                    className="w-full flex items-center gap-3 p-3 bg-muted/40 border border-border hover:border-primary/30 hover:bg-muted/70 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Lock className="size-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">Ubah Email & Password</p>
                      <p className="text-[10px] text-muted-foreground">
                        Ubah kata sandi & alamat email
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsView("location")}
                    className="w-full flex items-center gap-3 p-3 bg-muted/40 border border-border hover:border-primary/30 hover:bg-muted/70 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <MapPin className="size-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">
                        Pengaturan Lokasi
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Ubah koordinat cuaca dan daerah
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="w-full bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )}

            {/* VIEW 2: PERSONAL DATA FORM */}
            {settingsView === "personal" && (
              <>
                <div className="flex items-center gap-2 mb-1.5">
                  <button
                    type="button"
                    onClick={() => setSettingsView("menu")}
                    className="p-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <h2 className="text-lg font-bold text-foreground">Ubah Data Pribadi</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-4 pl-7">
                  Perbarui nama lengkap dan avatar profil Anda.
                </p>

                <form
                  onSubmit={handleSavePersonalData}
                  className="space-y-4 overflow-y-auto pr-1 flex-1"
                >
                  {/* Visual Avatar Editor */}
                  <div className="flex flex-col items-center gap-3 py-3 bg-muted/20 border border-border rounded-xl">
                    <div className="relative group size-20">
                      {editAvatarUrl ? (
                        <img
                          src={editAvatarUrl}
                          alt="Pratinjau Avatar"
                          className="size-20 rounded-full object-cover border-2 border-primary shadow-sm"
                        />
                      ) : (
                        <div className="size-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold border-2 border-dashed border-primary/30">
                          {initials(editDisplayName)}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setCropContext("settings");
                          setSourceSelectContext("settings");
                        }}
                        className="absolute bottom-0 right-0 size-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-card shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Unggah Foto"
                      >
                        <Camera className="size-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCropContext("settings");
                          setSourceSelectContext("settings");
                        }}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Camera className="size-3.5" />
                        Pilih Foto
                      </button>
                      {editAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setEditAvatarUrl("")}
                          className="px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="size-3.5" />
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      placeholder="Contoh: Ali Novian"
                      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      URL Foto Profil (Avatar) — Opsional
                    </label>
                    <input
                      type="url"
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setSettingsView("menu")}
                      className="flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {savingSettings && <Loader2 className="size-4 animate-spin" />}
                      Simpan
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* VIEW 3: ACCOUNT & SECURITY FORM */}
            {settingsView === "account" && (
              <>
                <div className="flex items-center gap-2 mb-1.5">
                  <button
                    type="button"
                    onClick={() => setSettingsView("menu")}
                    className="p-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <h2 className="text-lg font-bold text-foreground">Ubah Email & Password</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-4 pl-7">
                  Perbarui alamat email atau ubah kata sandi masuk Anda.
                </p>

                <form
                  onSubmit={handleSaveAccountData}
                  className="space-y-4 overflow-y-auto pr-1 flex-1"
                >
                  <div>
                    <label className="text-xs font-semibold block mb-1">Alamat Email</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      Kata Sandi Baru (Opsional)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Min. 6 karakter jika ingin diubah"
                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center size-5"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setSettingsView("menu")}
                      className="flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {savingSettings && <Loader2 className="size-4 animate-spin" />}
                      Simpan
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* VIEW 4: WEATHER LOCATION SETTINGS */}
            {settingsView === "location" && (
              <>
                <div className="flex items-center gap-2 mb-1.5">
                  <button
                    type="button"
                    onClick={() => setSettingsView("menu")}
                    className="p-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <h2 className="text-lg font-bold text-foreground">Lokasi Pengguna</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-4 pl-7">
                  Pilih metode penentuan lokasi untuk pemantauan cuaca tanaman yang akurat.
                </p>

                <form
                  onSubmit={handleSaveSettings}
                  className="space-y-4 overflow-y-auto pr-1 flex-1"
                >
                  <div className="space-y-3.5 pt-1">
                    <div className="space-y-1.5">
                      <div className="mb-1.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">Pinpoint Lokasi di Peta</span>
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={handleDetectUserLocation}
                              disabled={loadingGeocode}
                              className="text-[10.5px] font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                            >
                              {loadingGeocode ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                <Compass className="size-3" />
                              )}
                              Deteksi
                            </button>
                            <span className="text-muted-foreground/40 text-xs leading-none">|</span>
                            <button
                              type="button"
                              onClick={handleClearUserLocation}
                              className="text-[10.5px] font-semibold text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <Trash2 className="size-3" />
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        ref={mapContainerRef}
                        className="w-full h-44 rounded-xl border border-border bg-muted/30 overflow-hidden relative z-0"
                        style={{ minHeight: "176px" }}
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Geser pin atau ketuk area peta untuk menentukan titik koordinat presisi.
                        Nama wilayah di bawah akan terisi otomatis.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Desa / Kelurahan</label>
                      <div className="flex gap-2">
                        <input
                          value={desa}
                          onChange={(e) => {
                            setDesa(e.target.value);
                            setLat(0);
                            setLon(0);
                            setAutoLocation(false);
                          }}
                          placeholder="Contoh: Jatisaba"
                          className="flex-1 px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleSearchDesa}
                          disabled={loadingGeocode}
                          className="px-3.5 bg-accent-soft text-primary rounded-xl text-xs font-semibold hover:bg-accent/30 disabled:opacity-50 shrink-0 transition-colors cursor-pointer"
                        >
                          Cari
                        </button>
                      </div>
                    </div>

                    {ambiguousOptions.length > 0 && (
                      <div className="bg-muted/50 border border-border rounded-xl p-3 max-h-36 overflow-y-auto space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Pilih Lokasi yang Sesuai:
                        </p>
                        {ambiguousOptions.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
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
                            }}
                            className="w-full text-left p-2 hover:bg-background border border-transparent hover:border-border rounded-lg text-xs font-medium text-foreground transition-all cursor-pointer"
                          >
                            Kec. <span className="font-semibold">{opt.kecamatan}</span>, Kab.{" "}
                            <span className="font-semibold">{opt.kabupaten}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold block mb-1">Kecamatan</label>
                      <input
                        value={kecamatan}
                        onChange={(e) => {
                          setKecamatan(e.target.value);
                          setLat(0);
                          setLon(0);
                          setAutoLocation(false);
                        }}
                        placeholder="Contoh: Purbalingga"
                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Kabupaten / Kota</label>
                      <input
                        value={kabupaten}
                        onChange={(e) => {
                          setKabupaten(e.target.value);
                          setLat(0);
                          setLon(0);
                          setAutoLocation(false);
                        }}
                        placeholder="Contoh: Purbalingga"
                        className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setSettingsView("menu")}
                      className="flex-1 bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loadingGeocode}
                      className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loadingGeocode && <Loader2 className="size-4 animate-spin" />}
                      Simpan
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Centered glassmorphic progress overlay */}
      {uploadingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div className="bg-card border border-border p-6 rounded-2xl w-80 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <Loader2 className="size-10 animate-spin text-primary mx-auto mb-4" />
            <h3 className="font-bold text-sm text-foreground">Mengunggah Foto Profil...</h3>
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

      {/* Lightbox / Zoom Modal for Profile Photo */}
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
                Foto Profil
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
              alt="Pratinjau Foto Profil"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          cropShape="circle"
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

            if (ctxMode === "direct" && profile) {
              const progressInterval = startUploadSimulatedProgress();
              setSavingAvatar(true);
              try {
                await updateProfile({
                  data: {
                    id: profile.id,
                    displayName: profile.display_name || "Petani Urban",
                    avatarUrl: croppedBase64,
                  },
                });
                finishUploadSimulatedProgress(progressInterval, () => {
                  toast.success("Foto profil berhasil diperbarui! ✨📸");
                  refetchProfile();
                });
              } catch (err: any) {
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
          }}
        />
      )}

      <input
        type="file"
        accept="image/*"
        capture="user"
        ref={profilCameraInputRef}
        className="hidden"
        onChange={(e) => handleFileSelect(e, cropContext || "direct")}
      />
      <input
        type="file"
        accept="image/*"
        ref={profilGalleryInputRef}
        className="hidden"
        onChange={(e) => handleFileSelect(e, cropContext || "direct")}
      />

      {sourceSelectContext && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSourceSelectContext(null)} />
          <div className="bg-card border-t border-border rounded-t-3xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-250">
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4 shrink-0" />
            <h3 className="text-sm font-bold text-foreground mb-4 text-center">Pilih Sumber Foto</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => profilCameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-4 bg-muted/40 hover:bg-accent-soft hover:text-primary rounded-2xl border border-border/50 hover:border-accent/20 transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="size-12 rounded-full bg-accent-soft text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Camera className="size-6" />
                </div>
                <span className="text-xs font-bold">Kamera</span>
              </button>
              <button
                type="button"
                onClick={() => profilGalleryInputRef.current?.click()}
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

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="font-bold text-foreground text-lg leading-none">{value}</p>
      <p className="caption text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
