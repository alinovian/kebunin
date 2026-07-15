import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Heart, Leaf, Users, Target, ArrowRight, Sparkles } from "lucide-react";
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

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Kami | Kebunin" },
      { name: "description", content: "Misi Kebunin: membuat berkebun urban jadi mudah, menyenangkan, dan dapat diakses semua orang lewat AI." },
      { property: "og:title", content: "Tentang Kebunin" },
      { property: "og:description", content: "Kenalan dengan misi dan nilai-nilai di balik Kebunin." },
      // TODO: Ganti domain di bawah jika menggunakan custom domain baru (misal: https://kebunin.id/)
      { property: "og:url", content: "https://kebunin.vercel.app/tentang" },
    ],
    // TODO: Ganti domain di bawah jika menggunakan custom domain baru (misal: https://kebunin.id/)
    links: [{ rel: "canonical", href: "https://kebunin.vercel.app/tentang" }],
  }),
  component: Tentang,
});

const values = [
  { icon: Heart, title: "Ramah Pemula", desc: "Bahasa santai, langkah jelas, tanpa istilah botani yang bikin pusing." },
  { icon: Leaf, title: "Berbasis Sains", desc: "Setiap solusi dicocokkan dengan knowledge base agrikultur internal." },
  { icon: Users, title: "Untuk Semua", desc: "Gratis, mobile-first, dirancang untuk urban gardener di Indonesia." },
  { icon: Target, title: "Fokus Tindakan", desc: "Gak cuma diagnosis — kita kasih jadwal harian yang bisa kamu ikuti." },
];

function Tentang() {
  return (
    <MarketingLayout>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-background py-16 md:py-24">
        <div className="absolute inset-0 bg-accent-soft/10 pointer-events-none" />
        <div className="relative w-full max-w-6xl mx-auto px-5 text-center z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent-soft text-primary px-3 py-1 rounded-full border border-primary/10">
            <Sparkles className="size-3.5" /> Tentang Kebunin
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
            Hijaukan kotamu,<br />
            <span className="text-primary">satu tanaman setiap kali.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Kebunin lahir dari pengamatan sederhana: banyak orang ingin berkebun di rumah, tapi menyerah saat tanamannya mulai sakit. Kami percaya AI bisa jadi mentor yang selalu ada — sabar, akurat, dan gratis.
          </p>
        </div>
      </section>

      {/* MISSION SECTION */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-5 pb-10">
          <div className="rounded-3xl bg-primary-dark text-primary-foreground p-8 md:p-14 grid md:grid-cols-3 gap-8 items-center border border-primary/20 shadow-md">
            <div className="md:col-span-1">
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Misi Utama</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Misi Kami</h2>
            </div>
            <div className="md:col-span-2">
              <p className="text-base sm:text-lg leading-relaxed text-primary-foreground/90 font-medium">
                Membuat berkebun urban dapat diakses semua orang dengan menggabungkan AI generatif dan knowledge base agrikultur — sehingga setiap orang bisa merawat tanaman dengan percaya diri.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* VALUES SECTION */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-5 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Nilai yang kami pegang</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Prinsip utama yang memandu kami dalam mengembangkan solusi terbaik bagi setiap pecinta tanaman.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border/60 rounded-2xl p-7 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                <div className="size-11 rounded-xl bg-accent-soft text-primary flex items-center justify-center">
                  <v.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground tracking-tight">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
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
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Ayo tumbuh bareng</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Gabung dengan ribuan urban gardener lainnya dan rawat tanamanmu secara pintar.
              </p>
              <div className="mt-6 flex justify-center">
                <Link to="/auth" className="h-12 px-8 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-secondary transition-colors duration-200">
                  Daftar Gratis <ArrowRight className="size-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </MarketingLayout>
  );
}
