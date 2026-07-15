import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingLayout } from "./MarketingLayout-fZyy5413.mjs";
import { S as Sparkles, h as Camera, i as Brain, j as ClipboardList, c as Sprout, k as CircleCheck, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
const steps = [{
  icon: Camera,
  title: "Foto daun yang bermasalah",
  desc: "Buka tab Scan, ambil foto langsung atau pilih dari galeri. Foto seadanya juga gak masalah — Kebunin tahan dengan kondisi pencahayaan rumahan."
}, {
  icon: Brain,
  title: "AI menganalisis dalam 4–6 detik",
  desc: "Gambar dikirim ke model Gemini untuk mendeteksi penyakit, hama, atau kekurangan nutrisi. Hasilnya divalidasi dengan knowledge base agrikultur internal."
}, {
  icon: ClipboardList,
  title: "Dapatkan diagnosis & solusi",
  desc: "Kamu lihat nama penyakit, tingkat keyakinan, dan langkah-langkah perawatan dalam bahasa Indonesia yang santai."
}, {
  icon: Sprout,
  title: "Ikuti jadwal rawat otomatis",
  desc: "Langkah pengobatan dimasukkan ke kalender. Notifikasi mengingatkanmu kapan harus siram, semprot, atau cek ulang."
}];
function CaraKerja() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden bg-background py-16 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-accent-soft/10 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-6xl mx-auto px-5 text-center z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-semibold bg-accent-soft text-primary px-3 py-1 rounded-full border border-primary/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5" }),
          " Hanya 4 Langkah"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-foreground", children: [
          "Dari masalah ke solusi,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "dalam hitungan detik." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto", children: "Kebunin dirancang sesimpel mungkin. Gak perlu paham botani untuk bisa mendeteksi penyakit dan merawat tanaman kesayanganmu." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-6xl mx-auto px-5 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-3xl p-7 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-6 right-6 text-4xl font-extrabold text-primary/10 group-hover:text-primary/20 transition-colors", children: [
        "0",
        i + 1
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-accent-soft text-primary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "size-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-5 text-xs font-bold text-primary uppercase tracking-wider", children: [
        "Langkah ",
        i + 1
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-lg font-bold text-foreground tracking-tight", children: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed flex-grow", children: s.desc })
    ] }, s.title)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/40 border-y border-border/60 py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-foreground tracking-tight", children: "Kenapa Kebunin bebas halusinasi?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-base text-muted-foreground leading-relaxed", children: [
          'Banyak chatbot AI bisa "ngarang" (halusinasi) jawaban. Kebunin menggunakan pendekatan ',
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "RAG (Retrieval Augmented Generation)" }),
          " — setiap diagnosis dan solusi AI dicocokkan dengan basis data agrikultur internal terverifikasi sebelum disajikan kepada kamu."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto", children: ["Database 120+ penyakit & hama tanaman", "Validasi langkah perawatan oleh ahli", "Update berkala dari riset agrikultur", "Sumber referensi tersedia di tiap diagnosis"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-card border border-border/60 rounded-xl p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5 text-secondary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: t })
      ] }, t)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-6xl mx-auto px-5 py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-accent-soft/40 border border-primary/10 p-10 md:p-14 text-center relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-foreground tracking-tight", children: "Coba diagnosis pertamamu" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed", children: "Gratis selamanya. Tanpa kartu kredit. Gabung sekarang untuk mendiagnosis tanaman dalam hitungan detik." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "h-12 px-8 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-secondary transition-colors duration-200", children: [
        "Mulai Gratis ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-5" })
      ] }) })
    ] }) }) }) })
  ] });
}
export {
  CaraKerja as component
};
