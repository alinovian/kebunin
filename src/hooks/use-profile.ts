import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getOrCreateProfile } from "@/lib/api/db.functions";

export type Profile = {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  coins: number;
  streak: number;
  level: number;
  xp: number;
  shop_description?: string | null;
  shop_address?: string | null;
  shop_whatsapp?: string | null;
  shop_latitude?: number | null;
  shop_longitude?: number | null;
  shop_active?: number | null;
  shop_desa?: string | null;
  shop_kecamatan?: string | null;
  shop_kabupaten?: string | null;
  user_desa?: string | null;
  user_kecamatan?: string | null;
  user_kabupaten?: string | null;
  user_latitude?: number | null;
  user_longitude?: number | null;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (mounted = true) => {
    try {
      let curUser: { id: string; email?: string | null; display_name?: string | null; avatar_url?: string | null } | null = null;

      // 1. Check local session
      const localUserStr = typeof window !== "undefined" ? localStorage.getItem("kebunin_user") : null;
      if (localUserStr) {
        try {
          const localUser = JSON.parse(localUserStr);
          if (localUser && localUser.id) {
            curUser = {
              id: localUser.id,
              email: localUser.email,
              display_name: localUser.display_name,
              avatar_url: null,
            };
          }
        } catch (e) {}
      }

      // 2. Fallback to Supabase Google Session
      if (!curUser) {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (user) {
          curUser = {
            id: user.id,
            email: user.email,
            display_name:
              (user.user_metadata?.full_name as string) ??
              (user.user_metadata?.name as string) ??
              null,
            avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
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
          avatar_url: curUser.avatar_url ?? null,
        },
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
            lon: data.user_longitude,
          };
          localStorage.setItem("kebunin_weather_settings", JSON.stringify(syncSettings));
        }
      }

      if (mounted) {
        setProfile(data as Profile);
        setLoading(false);
      }
    } catch (err) {
      console.error("Gagal sinkronisasi profil dengan MySQL:", err);
      if (mounted) setLoading(false);
    }
  };

  useEffect(() => {
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

export function initials(name?: string | null) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "??";
}
