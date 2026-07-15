import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { ScanLine, CalendarCheck, ShieldCheck, Sprout, Coins, Star, Store, Bell, Users, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function Reveal({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {children}
    </div>
  );
}

export const Route = createFileRoute("/fitur")({
  head: () => ({
    meta: [
      { title: "Fitur | Kebunin" },
      { name: "description", content: "Scan daun AI, jadwal rawat otomatis, knowledge base bebas halusinasi, toko peralatan, dan sistem koin." },
      { property: "og:title", content: "Fitur Lengkap Kebunin" },
      { property: "og:description", content: "Semua fitur yang membantumu menjadi gardener urban yang andal." },
      // TODO: Ganti domain di bawah jika menggunakan custom domain baru (misal: https://kebunin.id/)
      { property: "og:url", content: "https://kebunin.vercel.app/fitur" },
    ],
    // TODO: Ganti domain di bawah jika menggunakan custom domain baru (misal: https://kebunin.id/)
    links: [{ rel: "canonical", href: "https://kebunin.vercel.app/fitur" }],
  }),
  component: FiturPage,
});

const features = [
  { icon: ScanLine, title: "Scan Daun AI", desc: "Foto daun dari kamera atau galeri. AI Gemini menganalisis penyakit, hama, atau kekurangan nutrisi dalam 4–6 detik." },
  { icon: ShieldCheck, title: "Solusi Tervalidasi", desc: "Tiap diagnosis divalidasi dengan knowledge base agrikultur internal sehingga bebas dari halusinasi AI." },
  { icon: CalendarCheck, title: "Jadwal Rawat Otomatis", desc: "Setelah diagnosis, jadwal pengobatan & rawat harian otomatis dibuat di kalender app." },
  { icon: Bell, title: "Notifikasi Pintar", desc: "Pengingat siram, pupuk, dan pangkas via push notification PWA." },
  { icon: Sprout, title: "Profil Tanaman", desc: "Catat tiap tanaman dengan riwayat lengkap perawatan & dokumentasi foto." },
  { icon: Store, title: "Toko Peralatan", desc: "Beli pupuk, benih, dan alat berkebun dengan harga ramah pemula." },
  { icon: Coins, title: "Sistem Koin Harian", desc: "Login & tuntaskan tugas harian untuk mengumpulkan koin yang bisa ditukar di toko." },
  { icon: Star, title: "Achievement & Level", desc: "Raih lencana, naikkan level, dan tunjukkan progres berkebunmu." },
  { icon: Users, title: "Mobile-First PWA", desc: "Install di home screen seperti app native, ringan dan bisa dipakai offline." },
];

function FiturPage() {
  return (
    <MarketingLayout>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-background py-16 md:py-24">
        <div className="absolute inset-0 bg-accent-soft/10 pointer-events-none" />
        <div className="relative w-full max-w-6xl mx-auto px-5 text-center z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent-soft text-primary px-3 py-1 rounded-full border border-primary/10">
            <Sparkles className="size-3.5" /> Fitur Unggulan
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
            Fitur Lengkap <span className="text-primary">Kebunin</span>
          </h1>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Dirancang khusus untuk gardener urban Indonesia — sederhana, cerdas, dan ramah pemula.
          </p>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-5 pb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card border border-border/60 rounded-3xl p-7 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="size-12 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0">
                  <f.icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground tracking-tight">{f.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-grow">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* CTA SECTION */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-5 pb-20">
          <div className="rounded-3xl bg-accent-soft/40 border border-primary/10 p-10 md:p-14 text-center relative overflow-hidden">
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Coba semua fitur sekarang — gratis</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Daftar gratis dalam 30 detik menggunakan akun Google Anda dan rasakan kemudahan berkebun urban dengan AI.
              </p>
              <div className="mt-6 flex justify-center">
                <Link to="/auth" className="h-12 px-8 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-secondary transition-colors duration-200">
                  Mulai Sekarang <ArrowRight className="size-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </MarketingLayout>
  );
}
