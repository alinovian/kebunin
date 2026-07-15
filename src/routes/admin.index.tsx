import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { Users, Shield, Coins, Flame, Leaf, ShoppingBag } from "lucide-react";
import { getAdminStats, getProducts } from "@/lib/api/db.functions";
import { useAdminRole } from "@/hooks/use-admin-role";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard | Admin Kebunin" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { isSuperAdmin, userId } = useAdminRole();
  const [stats, setStats] = useState({ 
    users: 0, 
    admins: 0, 
    superAdmins: 0, 
    totalCoins: 0, 
    avgStreak: 0,
    totalPlants: 0,
    totalProducts: 0
  });
  const [myProductsCount, setMyProductsCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAdminStats();
        setStats(data as any);
      } catch (err) {
        console.error("Gagal memuat statistik admin:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (userId && !isSuperAdmin) {
      (async () => {
        try {
          const products = await getProducts();
          const myProducts = (products as any[]).filter((p) => p.admin_id === userId);
          setMyProductsCount(myProducts.length);
        } catch (err) {
          console.error("Gagal memuat produk saya:", err);
        }
      })();
    }
  }, [userId, isSuperAdmin]);

  const superAdminCards = [
    { label: "Total Pengguna", value: stats.users, icon: Users, color: "text-primary bg-primary/10" },
    { label: "Admin Toko Pertanian", value: stats.admins, icon: Shield, color: "text-secondary bg-secondary/10" },
    { label: "Total Tanaman User", value: stats.totalPlants, icon: Leaf, color: "text-emerald-600 bg-emerald-500/10" },
    { label: "Total Produk Toko", value: stats.totalProducts, icon: ShoppingBag, color: "text-warning bg-warning/10" },
  ];

  const shopAdminCards = [
    { label: "Produk Toko Saya", value: myProductsCount, icon: ShoppingBag, color: "text-primary bg-primary/10" },
  ];

  const cards = isSuperAdmin ? superAdminCards : shopAdminCards;

  return (
    <AdminShell title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className={`size-10 rounded-lg flex items-center justify-center ${c.color} mb-3`}>
                <Icon className="size-5" />
              </div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="caption text-muted-foreground mt-1">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold mb-2">Selamat Datang di Admin Panel Kebunin 🌱</h2>
        {isSuperAdmin ? (
          <p className="text-sm text-muted-foreground">
            Sebagai <strong>Super Admin</strong>, Anda memiliki hak penuh untuk mengelola pengguna (koin, level, dll), 
            admin toko pertanian (menambah/menghapus hak akses toko), memantau tanaman user yang terdaftar, serta 
            mengelola semua produk/obat pertanian dari seluruh toko.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sebagai <strong>Admin Toko Pertanian</strong>, Anda bertindak sebagai penyedia obat & nutrisi tanaman. 
            Gunakan menu di samping untuk menambahkan obat baru atau mengelola inventaris produk Anda agar pengguna 
            memiliki lebih banyak variasi obat untuk merawat tanaman mereka.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
