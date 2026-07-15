import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { f as faqItems } from "./router-C0zimY-u.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingLayout } from "./MarketingLayout-fZyy5413.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowRight, g as ChevronDown } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./client-S4gzLm3e.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function FaqPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-3xl mx-auto px-5 pt-12 pb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-semibold text-foreground", children: "Pertanyaan Umum" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Belum nemu jawaban? Hubungi kami lewat halaman Tentang." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-3xl mx-auto px-5 pb-12 space-y-3", children: faqItems.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FaqAccordion, { q: item.q, a: item.a, defaultOpen: i === 0 }, item.q)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-3xl mx-auto px-5 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-primary text-primary-foreground p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "Siap mencoba?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "mt-4 inline-flex h-12 px-7 items-center gap-2 rounded-xl bg-background text-primary font-semibold hover:bg-card transition-colors", children: [
        "Daftar Gratis ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-5" })
      ] })
    ] }) })
  ] });
}
function FaqAccordion({
  q,
  a,
  defaultOpen = false
}) {
  const [open, setOpen] = reactExports.useState(defaultOpen);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOpen((v) => !v), className: "w-full flex items-center justify-between gap-4 p-5 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: q }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `size-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}` })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-5 text-sm text-muted-foreground leading-relaxed", children: a })
  ] });
}
export {
  FaqPage as component
};
