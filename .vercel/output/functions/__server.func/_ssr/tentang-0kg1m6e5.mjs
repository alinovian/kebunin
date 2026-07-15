import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingLayout } from "./MarketingLayout-fZyy5413.mjs";
import { S as Sparkles, H as Heart, L as Leaf, U as Users, T as Target, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
const values = [{
  icon: Heart,
  title: "Ramah Pemula",
  desc: "Bahasa santai, langkah jelas, tanpa istilah botani yang bikin pusing."
}, {
  icon: Leaf,
  title: "Berbasis Sains",
  desc: "Setiap solusi dicocokkan dengan knowledge base agrikultur internal."
}, {
  icon: Users,
  title: "Untuk Semua",
  desc: "Gratis, mobile-first, dirancang untuk urban gardener di Indonesia."
}, {
  icon: Target,
  title: "Fokus Tindakan",
  desc: "Gak cuma diagnosis — kita kasih jadwal harian yang bisa kamu ikuti."
}];
function Tentang() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden bg-background py-16 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-accent-soft/10 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-6xl mx-auto px-5 text-center z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-semibold bg-accent-soft text-primary px-3 py-1 rounded-full border border-primary/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5" }),
          " Tentang Kebunin"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-foreground", children: [
          "Hijaukan kotamu,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "satu tanaman setiap kali." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto", children: "Kebunin lahir dari pengamatan sederhana: banyak orang ingin berkebun di rumah, tapi menyerah saat tanamannya mulai sakit. Kami percaya AI bisa jadi mentor yang selalu ada — sabar, akurat, dan gratis." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-6xl mx-auto px-5 pb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-primary-dark text-primary-foreground p-8 md:p-14 grid md:grid-cols-3 gap-8 items-center border border-primary/20 shadow-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-accent uppercase tracking-widest", children: "Misi Utama" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-3xl font-extrabold tracking-tight", children: "Misi Kami" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-lg leading-relaxed text-primary-foreground/90 font-medium", children: "Membuat berkebun urban dapat diakses semua orang dengan menggabungkan AI generatif dan knowledge base agrikultur — sehingga setiap orang bisa merawat tanaman dengan percaya diri." }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-6xl mx-auto px-5 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-foreground tracking-tight", children: "Nilai yang kami pegang" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed", children: "Prinsip utama yang memandu kami dalam mengembangkan solusi terbaik bagi setiap pecinta tanaman." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: values.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-2xl p-7 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-xl bg-accent-soft text-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(v.icon, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-base font-bold text-foreground tracking-tight", children: v.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: v.desc })
      ] }, v.title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-6xl mx-auto px-5 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-accent-soft/40 border border-primary/10 p-10 md:p-14 text-center relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-foreground tracking-tight", children: "Ayo tumbuh bareng" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed", children: "Gabung dengan ribuan urban gardener lainnya dan rawat tanamanmu secara pintar." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "h-12 px-8 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-secondary transition-colors duration-200", children: [
        "Daftar Gratis ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-5" })
      ] }) })
    ] }) }) }) })
  ] });
}
export {
  Tentang as component
};
