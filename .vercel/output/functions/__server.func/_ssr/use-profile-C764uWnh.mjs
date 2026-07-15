import { r as reactExports } from "../_libs/react.mjs";
import { supabase } from "./client-S4gzLm3e.mjs";
import { g as getOrCreateProfile } from "./router-C0zimY-u.mjs";
function useProfile() {
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const fetchProfile = async (mounted = true) => {
    try {
      let curUser = null;
      const localUserStr = typeof window !== "undefined" ? localStorage.getItem("kebunin_user") : null;
      if (localUserStr) {
        try {
          const localUser = JSON.parse(localUserStr);
          if (localUser && localUser.id) {
            curUser = {
              id: localUser.id,
              email: localUser.email,
              display_name: localUser.display_name,
              avatar_url: null
            };
          }
        } catch (e) {
        }
      }
      if (!curUser) {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (user) {
          curUser = {
            id: user.id,
            email: user.email,
            display_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null
          };
        }
      }
      if (!curUser) {
        if (mounted) setLoading(false);
        return;
      }
      const data = await getOrCreateProfile({
        data: {
          id: curUser.id,
          email: curUser.email ?? null,
          display_name: curUser.display_name ?? null,
          avatar_url: curUser.avatar_url ?? null
        }
      });
      if (data && typeof window !== "undefined") {
        const storedStr = localStorage.getItem("kebunin_weather_settings");
        let needSync = false;
        if (!storedStr) {
          needSync = true;
        } else {
          try {
            const parsed = JSON.parse(storedStr);
            if (!parsed || parsed.lat === 0 || parsed.lon === 0) {
              needSync = true;
            }
          } catch (e) {
            needSync = true;
          }
        }
        if (needSync && data.user_latitude && data.user_longitude) {
          const syncSettings = {
            autoLocation: false,
            desa: data.user_desa || "",
            kecamatan: data.user_kecamatan || "",
            kabupaten: data.user_kabupaten || "",
            lat: data.user_latitude,
            lon: data.user_longitude
          };
          localStorage.setItem("kebunin_weather_settings", JSON.stringify(syncSettings));
        }
      }
      if (mounted) {
        setProfile(data);
        setLoading(false);
      }
    } catch (err) {
      console.error("Gagal sinkronisasi profil dengan MySQL:", err);
      if (mounted) setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    let mounted = true;
    fetchProfile(mounted);
    return () => {
      mounted = false;
    };
  }, []);
  const refetch = () => {
    setLoading(true);
    fetchProfile(true);
  };
  return { profile, loading, refetch };
}
function initials(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "??";
}
export {
  initials as i,
  useProfile as u
};
