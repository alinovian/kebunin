import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingLayout } from "./MarketingLayout-fZyy5413.mjs";
import { S as Sparkles, a as ScanLine, b as ShieldCheck, C as CalendarCheck, B as Bell, c as Sprout, d as Store, e as Coins, f as Star, U as Users, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
const features = [{
  icon: ScanLine,
  title: "Scan Daun AI",
  desc: "Foto daun dari kamera atau galeri. AI Gemini menganalisis penyakit, hama, atau kekurangan nutrisi dalam 4–6 detik."
}, {
  icon: ShieldCheck,
  title: "Solusi Tervalidasi",
  desc: "Tiap diagnosis divalidasi dengan knowledge base agrikultur internal sehingga bebas dari halusinasi AI."
}, {
  icon: CalendarCheck,
  title: "Jadwal Rawat Otomatis",
  desc: "Setelah diagnosis, jadwal pengobatan & rawat harian otomatis dibuat di kalender app."
}, {
  icon: Bell,
  title: "Notifikasi Pintar",
  desc: "Pengingat siram, pupuk, dan pangkas via push notification PWA."
}, {
  icon: Sprout,
  title: "Profil Tanaman",
  desc: "Catat tiap tanaman dengan riwayat lengkap perawatan & dokumentasi foto."
}, {
  icon: Store,
  title: "Toko Peralatan",
  desc: "Beli pupuk, benih, dan alat berkebun dengan harga ramah pemula."
}, {
  icon: Coins,
  title: "Sistem Koin Harian",
  desc: "Login & tuntaskan tugas harian untuk mengumpulkan koin yang bisa ditukar di toko."
}, {
  icon: Star,
  title: "Achievement & Level",
  desc: "Raih lencana, naikkan level, dan tunjukkan progres berkebunmu."
}, {
  icon: Users,
  title: "Mobile-First PWA",
  desc: "Install di home screen seperti app native, ringan dan bisa dipakai offline."
}];
function FiturPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden bg-background py-16 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-accent-soft/10 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-6xl mx-auto px-5 text-center z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-semibold bg-accent-soft text-primary px-3 py-1 rounded-full border border-primary/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5" }),
          " Fitur Unggulan"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-foreground", children: [
          "Fitur Lengkap ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Kebunin" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto", children: "Dirancang khusus untuk gardener urban Indonesia — sederhana, cerdas, dan ramah pemula." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-6xl mx-auto px-5 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-3xl p-7 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "size-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-lg font-bold text-foreground tracking-tight", children: f.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed flex-grow", children: f.desc })
    ] }, f.title)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-6xl mx-auto px-5 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-accent-soft/40 border border-primary/10 p-10 md:p-14 text-center relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-foreground tracking-tight", children: "Coba semua fitur sekarang — gratis" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed", children: "Daftar gratis dalam 30 detik menggunakan akun Google Anda dan rasakan kemudahan berkebun urban dengan AI." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "h-12 px-8 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-secondary transition-colors duration-200", children: [
        "Mulai Sekarang ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-5" })
      ] }) })
    ] }) }) }) })
  ] });
}
export {
  FiturPage as component
};
