import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Camera, Brain, ClipboardList, Sprout, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
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

export const Route = createFileRoute("/cara-kerja")({
  head: () => ({
    meta: [
      { title: "Cara Kerja | Kebunin" },
      { name: "description", content: "4 langkah mudah: foto daun, AI analisis, dapatkan solusi, ikuti jadwal rawat otomatis." },
      { property: "og:title", content: "Cara Kerja Kebunin" },
      { property: "og:description", content: "Lihat bagaimana Kebunin membantumu dari diagnosis hingga rawat harian." },
      { property: "og:url", content: "https://kebunin.lovable.app/cara-kerja" },
    ],
    links: [{ rel: "canonical", href: "https://kebunin.lovable.app/cara-kerja" }],
  }),
  component: CaraKerja,
});

const steps = [
  { icon: Camera, title: "Foto daun yang bermasalah", desc: "Buka tab Scan, ambil foto langsung atau pilih dari galeri. Foto seadanya juga gak masalah — Kebunin tahan dengan kondisi pencahayaan rumahan." },
  { icon: Brain, title: "AI menganalisis dalam 4–6 detik", desc: "Gambar dikirim ke model Gemini untuk mendeteksi penyakit, hama, atau kekurangan nutrisi. Hasilnya divalidasi dengan knowledge base agrikultur internal." },
  { icon: ClipboardList, title: "Dapatkan diagnosis & solusi", desc: "Kamu lihat nama penyakit, tingkat keyakinan, dan langkah-langkah perawatan dalam bahasa Indonesia yang santai." },
  { icon: Sprout, title: "Ikuti jadwal rawat otomatis", desc: "Langkah pengobatan dimasukkan ke kalender. Notifikasi mengingatkanmu kapan harus siram, semprot, atau cek ulang." },
];

function CaraKerja() {
  return (
    <MarketingLayout>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-background py-16 md:py-24">
        <div className="absolute inset-0 bg-accent-soft/10 pointer-events-none" />
        <div className="relative w-full max-w-6xl mx-auto px-5 text-center z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent-soft text-primary px-3 py-1 rounded-full border border-primary/10">
            <Sparkles className="size-3.5" /> Hanya 4 Langkah
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
            Dari masalah ke solusi,<br />
            <span className="text-primary">dalam hitungan detik.</span>
          </h1>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Kebunin dirancang sesimpel mungkin. Gak perlu paham botani untuk bisa mendeteksi penyakit dan merawat tanaman kesayanganmu.
          </p>
        </div>
      </section>

      {/* STEPS SECTION */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-5 pb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="bg-card border border-border/60 rounded-3xl p-7 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative group">
                <span className="absolute top-6 right-6 text-4xl font-extrabold text-primary/10 group-hover:text-primary/20 transition-colors">
                  0{i + 1}
                </span>
                <div className="size-12 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0">
                  <s.icon className="size-6" />
                </div>
                <span className="mt-5 text-xs font-bold text-primary uppercase tracking-wider">Langkah {i + 1}</span>
                <h3 className="mt-2 text-lg font-bold text-foreground tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-grow">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* WHY US SECTION */}
      <Reveal>
        <section className="bg-muted/40 border-y border-border/60 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-5">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Kenapa Kebunin bebas halusinasi?</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Banyak chatbot AI bisa "ngarang" (halusinasi) jawaban. Kebunin menggunakan pendekatan <strong>RAG (Retrieval Augmented Generation)</strong> — setiap diagnosis dan solusi AI dicocokkan dengan basis data agrikultur internal terverifikasi sebelum disajikan kepada kamu.
              </p>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                "Database 120+ penyakit & hama tanaman",
                "Validasi langkah perawatan oleh ahli",
                "Update berkala dari riset agrikultur",
                "Sumber referensi tersedia di tiap diagnosis",
              ].map((t) => (
                <div key={t} className="flex items-center gap-3 bg-card border border-border/60 rounded-xl p-4 shadow-sm">
                  <CheckCircle2 className="size-5 text-secondary shrink-0" />
                  <span className="text-sm font-semibold text-foreground">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* CTA SECTION */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
          <div className="rounded-3xl bg-accent-soft/40 border border-primary/10 p-10 md:p-14 text-center relative overflow-hidden">
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Coba diagnosis pertamamu</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Gratis selamanya. Tanpa kartu kredit. Gabung sekarang untuk mendiagnosis tanaman dalam hitungan detik.
              </p>
              <div className="mt-6 flex justify-center">
                <Link to="/auth" className="h-12 px-8 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-secondary transition-colors duration-200">
                  Mulai Gratis <ArrowRight className="size-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </MarketingLayout>
  );
}
