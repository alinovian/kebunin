import { useEffect, useState } from "react";

export type WeatherSettings = {
  autoLocation: boolean;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  lat: number;
  lon: number;
};

const DEFAULT_SETTINGS: WeatherSettings = {
  autoLocation: false,
  desa: "",
  kecamatan: "",
  kabupaten: "",
  lat: 0,
  lon: 0,

  // autoLocation: true,
  // desa: "Watumas",
  // kecamatan: "Purwokerto Utara",
  // kabupaten: "Banyumas",
  // lat: -7.4024,
  // lon: 109.2312,
};

export function useWeather() {
  const [settings, setSettings] = useState<WeatherSettings>(DEFAULT_SETTINGS);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage
  const loadSettings = (): WeatherSettings => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const stored = localStorage.getItem("kebunin_weather_settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.lat === "number") {
          return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`
      );
      if (!res.ok) throw new Error("Gagal mengambil data cuaca");
      const data = await res.json();
      setTemperature(Math.round(data.current.temperature_2m));
      setHumidity(Math.round(data.current.relative_humidity_2m));
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal mengambil data cuaca");
    } finally {
      setLoading(false);
    }
  };

  const syncGPSLocation = async (currentSettings: WeatherSettings) => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Calculate difference to avoid redundant API calls
        const diffLat = Math.abs(currentSettings.lat - latitude);
        const diffLon = Math.abs(currentSettings.lon - longitude);

        if (diffLat > 0.005 || diffLon > 0.005 || !currentSettings.desa) {
          try {
            // Reverse geocode via Nominatim
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
            );
            if (!geoRes.ok) throw new Error("Gagal geocode lokasi");
            const geoData = await geoRes.json();
            const addr = geoData.address || {};

            const desa = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.residential || addr.municipality || "";
            const kecamatan = addr.subdistrict || addr.town || addr.municipality || addr.subcounty || "";
            const kabupaten = addr.regency || addr.city || addr.county || addr.city_district || "";

            const updated: WeatherSettings = {
              autoLocation: true,
              desa: desa || currentSettings.desa || "",
              kecamatan: kecamatan || currentSettings.kecamatan || "",
              kabupaten: kabupaten || currentSettings.kabupaten || "",
              lat: latitude,
              lon: longitude,
            };

            localStorage.setItem("kebunin_weather_settings", JSON.stringify(updated));
            setSettings(updated);
            fetchWeather(latitude, longitude);
          } catch (err) {
            console.error("Reverse geocoding failed, using coordinates only:", err);
            // Even if reverse geocoding fails, update coordinates to load correct local weather
            const updated: WeatherSettings = {
              ...currentSettings,
              lat: latitude,
              lon: longitude,
            };
            localStorage.setItem("kebunin_weather_settings", JSON.stringify(updated));
            setSettings(updated);
            fetchWeather(latitude, longitude);
          }
        }
      },
      (geoError) => {
        console.warn("Geolocation access denied or failed, using cached manual settings:", geoError);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    const initialSettings = loadSettings();
    setSettings(initialSettings);

    // Only fetch weather if the user has actually set a location
    if (initialSettings.lat !== 0 && initialSettings.lon !== 0) {
      fetchWeather(initialSettings.lat, initialSettings.lon);
    } else {
      setLoading(false);
    }

    // If autoLocation is enabled AND user already has saved location, update coordinates dynamically in background
    if (initialSettings.autoLocation && initialSettings.lat !== 0 && initialSettings.lon !== 0) {
      syncGPSLocation(initialSettings);
    }
  }, []);

  const refetch = () => {
    const updated = loadSettings();
    setSettings(updated);
    setLoading(true);
    fetchWeather(updated.lat, updated.lon);
    if (updated.autoLocation) {
      syncGPSLocation(updated);
    }
  };

  return {
    settings,
    temperature,
    humidity,
    loading,
    error,
    refetch,
  };
}
