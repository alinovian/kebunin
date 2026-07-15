import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingLayout } from "./MarketingLayout-fZyy5413.mjs";
import { S as Sparkles, A as ArrowRight, k as CircleCheck, L as Leaf, a as ScanLine, C as CalendarCheck, b as ShieldCheck, c as Sprout, e as Coins, f as Star, h as Camera, i as Brain, Q as Quote } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function Reveal({
  children
}) {
  const [isVisible, setIsVisible] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.05
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: `transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`, children });
}
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden bg-background min-h-[calc(100vh-4rem)] flex items-center py-12 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-accent-soft/20 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-10 items-center z-10 -mt-6 md:-mt-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-semibold bg-accent-soft text-primary px-3 py-1 rounded-full border border-primary/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5" }),
            " Didukung Gemini AI"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 text-4xl sm:text-5xl font-extrabold leading-tight text-foreground tracking-tight", children: [
            "Berkebun di rumah,",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "sepintar ahli botani." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base text-muted-foreground leading-relaxed max-w-lg", children: "Foto daun yang bermasalah, dapatkan diagnosis instan dalam bahasa santai, dan biarkan Kebunin mengatur jadwal merawat tanamanmu setiap hari." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 flex flex-col sm:flex-row gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "h-12 px-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-secondary transition-colors duration-200", children: [
              "Mulai Gratis ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-5" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cara-kerja", className: "h-12 px-7 inline-flex items-center justify-center rounded-xl border border-border bg-card font-semibold text-foreground hover:bg-muted transition-colors duration-200", children: "Lihat Cara Kerja" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-secondary" }),
              " Gratis selamanya"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-secondary" }),
              " Tanpa kartu kredit"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex items-center justify-center md:justify-end w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm bg-primary-dark text-primary-foreground rounded-3xl p-8 border border-primary/20 shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-2xl bg-white/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-10 text-accent" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-2xl p-5 border border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-accent uppercase tracking-wider", children: "Hasil Diagnosis AI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2 leading-relaxed", children: '"Daunmu menguning dengan bercak coklat — kemungkinan infeksi bakteri. Jadwal rawat otomatis siap dibuat."' }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2 text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/10 rounded-full px-3 py-1 font-medium text-white/90", children: "87% yakin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/10 rounded-full px-3 py-1 font-medium text-white/90", children: "4 langkah solusi" })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-6xl mx-auto px-5 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5", children: [{
      v: "4–6 dtk",
      l: "Waktu diagnosis"
    }, {
      v: "120+",
      l: "Penyakit dikenali"
    }, {
      v: "98%",
      l: "Solusi tervalidasi"
    }, {
      v: "10rb+",
      l: "Tanaman dirawat"
    }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-2xl p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-extrabold text-primary tracking-tight", children: s.v }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 font-semibold uppercase tracking-wider", children: s.l })
    ] }, s.l)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-6xl mx-auto px-5 py-16 md:py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-foreground tracking-tight", children: "Semua yang kamu butuhkan untuk berkebun" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed", children: "Dari diagnosis cepat hingga jadwal harian otomatis — semuanya terintegrasi secara praktis." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "size-5" }), title: "Scan Daun AI", desc: "Foto daun tanamanmu, dapatkan deteksi penyakit cepat beserta saran langkah penanganan." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "size-5" }), title: "Jadwal Rawat", desc: "Pengingat menyiram, memupuk, dan merawat tanaman otomatis dibuat untukmu." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-5" }), title: "Bebas Halusinasi", desc: "Setiap saran dan diagnosis AI dicocokkan dengan basis data agrikultur terpercaya." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-5" }), title: "Database Tanaman", desc: "Simpan profil tanaman kesayanganmu and pantau perkembangannya hari demi hari." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "size-5" }), title: "Sistem Koin", desc: "Lakukan login & rawat tanaman harian, klaim koin gratis untuk fitur eksklusif." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-5" }), title: "Lencana Pencapaian", desc: "Dapatkan berbagai lencana seiring meningkatnya keahlian berkebunmu." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/fitur", className: "text-sm font-semibold text-primary inline-flex items-center gap-1 hover:underline", children: [
        "Lihat semua fitur ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 border-y border-border/40 py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-foreground tracking-tight", children: "Cuma 3 langkah mudah" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed", children: "Solusi praktis dari foto ke penanganan hanya dalam hitungan detik." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepCard, { n: "1", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-5" }), title: "Foto Daun", desc: "Ambil foto langsung lewat kamera handphone atau unggah dari galeri foto Anda." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepCard, { n: "2", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "size-5" }), title: "AI Analisis", desc: "AI menganalisis masalah fisik pada daun dan memverifikasinya ke database ahli." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepCard, { n: "3", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "size-5" }), title: "Rawat Tanaman", desc: "Ikuti panduan langkah penanganan dan jadwal penyiraman otomatis untuk pemulihan." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-6xl mx-auto px-5 py-16 md:py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center max-w-2xl mx-auto mb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-foreground tracking-tight", children: "Kata Mereka yang Telah Mencoba" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: [{
        name: "Rina S., Jakarta",
        text: "Tanaman cabaiku kembali sehat setelah mengikuti jadwal rawat otomatis dari Kebunin. Praktis sekali!",
        initial: "R"
      }, {
        name: "Budi H., Bandung",
        text: "Diagnosis AI-nya cepat dan sangat membantu. Saya tidak perlu lagi googling cari solusi.",
        initial: "B"
      }, {
        name: "Sari W., Surabaya",
        text: "Fitur pengingat siramnya sangat membantu untuk saya yang sering bepergian.",
        initial: "S"
      }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-2xl p-7 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "size-6 text-accent mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground leading-relaxed italic", children: [
            '"',
            t.text,
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center", children: t.initial }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground leading-none", children: t.name.split(",")[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: t.name.split(",")[1]?.trim() })
          ] })
        ] })
      ] }, t.name)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-6xl mx-auto px-5 pb-20 md:pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-primary-dark p-10 md:p-14 text-center text-primary-foreground relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold tracking-tight", children: "Siap mulai berkebun lebih cerdas?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 opacity-95 text-sm sm:text-base leading-relaxed", children: "Daftar gratis sekarang dengan akun Google dan buat scan diagnosis pertamamu hari ini." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "h-12 px-8 inline-flex items-center gap-2 rounded-xl bg-background text-primary font-bold hover:bg-card transition-colors duration-200", children: [
        "Daftar Gratis Sekarang ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-5" })
      ] }) })
    ] }) }) }) })
  ] });
}
function FeatureCard({
  icon,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-2xl p-7 flex flex-col items-start hover:border-primary/40 transition-colors duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-xl bg-accent-soft text-primary flex items-center justify-center", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-lg font-bold text-foreground tracking-tight", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: desc })
  ] });
}
function StepCard({
  n,
  icon,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-2xl p-7 relative flex flex-col items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-5 right-5 size-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center", children: n }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-lg font-bold text-foreground tracking-tight", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: desc })
  ] });
}
export {
  Landing as component
};
