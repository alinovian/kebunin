import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf, ScanLine, CalendarCheck, Sparkles, ShieldCheck, ArrowRight,
  Camera, Brain, Sprout, Coins, Star, CheckCircle2, Quote,
} from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { useEffect, useRef, useState } from "react";

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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kebunin | Asisten Berkebun Urban dengan AI" },
      { name: "description", content: "Pindai daun, dapatkan diagnosis AI tervalidasi, dan rawat tanamanmu dengan jadwal otomatis. Gratis, mobile-first." },
      { property: "og:title", content: "Kebunin | Asisten Berkebun Urban dengan AI" },
      { property: "og:description", content: "Deteksi penyakit daun lewat AI, solusi tervalidasi pakar, jadwal rawat otomatis." },
      // TODO: Ganti domain di bawah jika menggunakan custom domain baru (misal: https://kebunin.id/)
      { property: "og:url", content: "https://kebunin.vercel.app/" },
    ],
    // TODO: Ganti domain di bawah jika menggunakan custom domain baru (misal: https://kebunin.id/)
    links: [{ rel: "canonical", href: "https://kebunin.vercel.app/" }],
  }),
  component: Landing,
});function Landing() {
  return (
    <MarketingLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background min-h-[calc(100vh-4rem)] flex items-center py-12 md:py-16">
        <div className="absolute inset-0 bg-accent-soft/20 pointer-events-none" />

        <div className="relative w-full max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-10 items-center z-10 -mt-6 md:-mt-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent-soft text-primary px-3 py-1 rounded-full border border-primary/10">
              <Sparkles className="size-3.5" /> Didukung Gemini AI
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold leading-tight text-foreground tracking-tight">
              Berkebun di rumah,<br />
              <span className="text-primary">sepintar ahli botani.</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-lg">
              Foto daun yang bermasalah, dapatkan diagnosis instan dalam bahasa santai, dan biarkan Kebunin mengatur jadwal merawat tanamanmu setiap hari.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link to="/auth" className="h-12 px-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-secondary transition-colors duration-200">
                Mulai Gratis <ArrowRight className="size-5" />
              </Link>
              <Link to="/cara-kerja" className="h-12 px-7 inline-flex items-center justify-center rounded-xl border border-border bg-card font-semibold text-foreground hover:bg-muted transition-colors duration-200">
                Lihat Cara Kerja
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-secondary" /> Gratis selamanya</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-secondary" /> Tanpa kartu kredit</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center md:justify-end w-full">
            {/* Simple Two-Tone Card Mockup */}
            <div className="w-full max-w-sm bg-primary-dark text-primary-foreground rounded-3xl p-8 border border-primary/20 shadow-md">
              <div className="flex justify-center mb-6">
                <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Leaf className="size-10 text-accent" />
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 border border-white/5">
                <p className="text-xs font-bold text-accent uppercase tracking-wider">Hasil Diagnosis AI</p>
                <p className="text-sm mt-2 leading-relaxed">
                  "Daunmu menguning dengan bercak coklat — kemungkinan infeksi bakteri. Jadwal rawat otomatis siap dibuat."
                </p>
                <div className="mt-4 flex gap-2 text-[10px]">
                  <span className="bg-white/10 rounded-full px-3 py-1 font-medium text-white/90">87% yakin</span>
                  <span className="bg-white/10 rounded-full px-3 py-1 font-medium text-white/90">4 langkah solusi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-5 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { v: "4–6 dtk", l: "Waktu diagnosis" },
              { v: "120+", l: "Penyakit dikenali" },
              { v: "98%", l: "Solusi tervalidasi" },
              { v: "10rb+", l: "Tanaman dirawat" },
            ].map((s) => (
              <div key={s.l} className="bg-card border border-border/60 rounded-2xl p-6 text-center">
                <p className="text-3xl font-extrabold text-primary tracking-tight">{s.v}</p>
                <p className="text-xs text-muted-foreground mt-2 font-semibold uppercase tracking-wider">{s.l}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* FEATURES */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Semua yang kamu butuhkan untuk berkebun
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Dari diagnosis cepat hingga jadwal harian otomatis — semuanya terintegrasi secara praktis.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<ScanLine className="size-5" />} title="Scan Daun AI" desc="Foto daun tanamanmu, dapatkan deteksi penyakit cepat beserta saran langkah penanganan." />
            <FeatureCard icon={<CalendarCheck className="size-5" />} title="Jadwal Rawat" desc="Pengingat menyiram, memupuk, dan merawat tanaman otomatis dibuat untukmu." />
            <FeatureCard icon={<ShieldCheck className="size-5" />} title="Bebas Halusinasi" desc="Setiap saran dan diagnosis AI dicocokkan dengan basis data agrikultur terpercaya." />
            <FeatureCard icon={<Sprout className="size-5" />} title="Database Tanaman" desc="Simpan profil tanaman kesayanganmu and pantau perkembangannya hari demi hari." />
            <FeatureCard icon={<Coins className="size-5" />} title="Sistem Koin" desc="Lakukan login & rawat tanaman harian, klaim koin gratis untuk fitur eksklusif." />
            <FeatureCard icon={<Star className="size-5" />} title="Lencana Pencapaian" desc="Dapatkan berbagai lencana seiring meningkatnya keahlian berkebunmu." />
          </div>
          <div className="mt-10 text-center">
            <Link to="/fitur" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:underline">
              Lihat semua fitur <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </Reveal>

      {/* HOW IT WORKS */}
      <Reveal>
        <section className="bg-muted/30 border-y border-border/40 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Cuma 3 langkah mudah
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Solusi praktis dari foto ke penanganan hanya dalam hitungan detik.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <StepCard n="1" icon={<Camera className="size-5" />} title="Foto Daun" desc="Ambil foto langsung lewat kamera handphone atau unggah dari galeri foto Anda." />
              <StepCard n="2" icon={<Brain className="size-5" />} title="AI Analisis" desc="AI menganalisis masalah fisik pada daun dan memverifikasinya ke database ahli." />
              <StepCard n="3" icon={<Sprout className="size-5" />} title="Rawat Tanaman" desc="Ikuti panduan langkah penanganan dan jadwal penyiraman otomatis untuk pemulihan." />
            </div>
          </div>
        </section>
      </Reveal>

      {/* TESTIMONIAL */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Kata Mereka yang Telah Mencoba
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rina S., Jakarta", text: "Tanaman cabaiku kembali sehat setelah mengikuti jadwal rawat otomatis dari Kebunin. Praktis sekali!", initial: "R" },
              { name: "Budi H., Bandung", text: "Diagnosis AI-nya cepat dan sangat membantu. Saya tidak perlu lagi googling cari solusi.", initial: "B" },
              { name: "Sari W., Surabaya", text: "Fitur pengingat siramnya sangat membantu untuk saya yang sering bepergian.", initial: "S" },
            ].map((t) => (
              <div key={t.name} className="bg-card border border-border/60 rounded-2xl p-7 flex flex-col justify-between">
                <div>
                  <Quote className="size-6 text-accent mb-4" />
                  <p className="text-sm text-foreground leading-relaxed italic">"{t.text}"</p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="size-9 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none">{t.name.split(",")[0]}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.name.split(",")[1]?.trim()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-5 pb-20 md:pb-24">
          <div className="rounded-3xl bg-primary-dark p-10 md:p-14 text-center text-primary-foreground relative overflow-hidden">
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight">Siap mulai berkebun lebih cerdas?</h2>
              <p className="mt-3 opacity-95 text-sm sm:text-base leading-relaxed">
                Daftar gratis sekarang dengan akun Google dan buat scan diagnosis pertamamu hari ini.
              </p>
              <div className="mt-6 flex justify-center">
                <Link to="/auth" className="h-12 px-8 inline-flex items-center gap-2 rounded-xl bg-background text-primary font-bold hover:bg-card transition-colors duration-200">
                  Daftar Gratis Sekarang <ArrowRight className="size-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </MarketingLayout>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-7 flex flex-col items-start hover:border-primary/40 transition-colors duration-200">
      <div className="size-11 rounded-xl bg-accent-soft text-primary flex items-center justify-center">{icon}</div>
      <h3 className="mt-5 text-lg font-bold text-foreground tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ n, icon, title, desc }: { n: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-7 relative flex flex-col items-start">
      <span className="absolute top-5 right-5 size-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">{n}</span>
      <div className="size-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">{icon}</div>
      <h3 className="mt-5 text-lg font-bold text-foreground tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
