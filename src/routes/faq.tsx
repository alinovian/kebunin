import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Kebunin" },
      { name: "description", content: "Jawaban atas pertanyaan umum tentang Kebunin: gratis, akurasi AI, jenis tanaman, dan privasi data." },
      { property: "og:title", content: "Pertanyaan Umum Kebunin" },
      { property: "og:description", content: "Semua yang perlu kamu tahu sebelum mulai pakai Kebunin." },
      // TODO: Ganti domain di bawah jika menggunakan custom domain baru (misal: https://kebunin.id/)
      { property: "og:url", content: "https://kebunin.vercel.app/faq" },
    ],
    // TODO: Ganti domain di bawah jika menggunakan custom domain baru (misal: https://kebunin.id/)
    links: [{ rel: "canonical", href: "https://kebunin.vercel.app/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

const faqItems = [
  { q: "Apakah Kebunin gratis?", a: "Ya, semua fitur inti seperti Scan Daun AI, jadwal rawat, dan database tanaman gratis. Toko peralatan opsional untuk yang ingin belanja kebutuhan kebun." },
  { q: "Seberapa akurat diagnosis AI-nya?", a: "Kebunin pakai model Gemini yang diperkuat dengan knowledge base agrikultur internal (pendekatan RAG). Akurasi rata-rata di atas 85% untuk penyakit umum tanaman urban." },
  { q: "Tanaman apa saja yang didukung?", a: "Kami fokus pada tanaman urban populer: cabai, tomat, terong, sayur daun, herbal (basil, mint, rosemary), dan tanaman hias indoor. Database terus bertambah." },
  { q: "Apakah harus install dari Play Store atau App Store?", a: "Tidak. Kebunin adalah PWA — buka di browser HP, tambahkan ke home screen, dan kamu siap pakai seperti app native." },
  { q: "Bagaimana dengan privasi foto saya?", a: "Foto hanya dipakai untuk diagnosis sesaat dan tidak dibagikan ke pihak ketiga. Kamu bisa hapus riwayat scan kapan saja dari halaman Profil." },
  { q: "Apa itu sistem koin?", a: "Login harian dan menyelesaikan tugas perawatan memberi kamu koin. Koin bisa ditukar dengan diskon di Toko Peralatan." },
  { q: "Bisakah dipakai offline?", a: "Sebagian fitur (lihat jadwal & profil tanaman) bisa diakses offline. Diagnosis AI butuh koneksi internet." },
  { q: "Bagaimana cara daftar?", a: "Klik tombol Daftar Gratis dan masuk dengan akun Google. Selesai dalam 30 detik." },
];

function FaqPage() {
  return (
    <MarketingLayout>
      <section className="max-w-3xl mx-auto px-5 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-foreground">Pertanyaan Umum</h1>
        <p className="mt-4 text-muted-foreground">Belum nemu jawaban? Hubungi kami lewat halaman Tentang.</p>
      </section>

      <section className="max-w-3xl mx-auto px-5 pb-12 space-y-3">
        {faqItems.map((item, i) => (
          <FaqAccordion key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-5 pb-16">
        <div className="rounded-3xl bg-primary text-primary-foreground p-8 text-center">
          <h2 className="text-2xl font-semibold">Siap mencoba?</h2>
          <Link to="/auth" className="mt-4 inline-flex h-12 px-7 items-center gap-2 rounded-xl bg-background text-primary font-semibold hover:bg-card transition-colors">
            Daftar Gratis <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}

function FaqAccordion({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-semibold text-foreground">{q}</span>
        <ChevronDown className={`size-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}
