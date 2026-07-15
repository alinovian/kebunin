import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Leaf, X, r as Menu, I as Instagram, s as Twitter, G as Github } from "../_libs/lucide-react.mjs";
const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/fitur", label: "Fitur" },
  { to: "/cara-kerja", label: "Cara Kerja" },
  { to: "/tentang", label: "Tentang" },
  { to: "/faq", label: "FAQ" }
];
function MarketingLayout({ children }) {
  const location = useLocation();
  const [open, setOpen] = reactExports.useState(false);
  const [scrolled, setScrolled] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-full bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: `sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border/40 shadow-sm" : "bg-background/70 backdrop-blur-md border-b border-transparent"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-6xl mx-auto px-5 flex items-center justify-between transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 group", onClick: () => setOpen(false), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-105 group-hover:bg-secondary transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors", children: "Kebunin" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden md:flex items-center gap-1", children: navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: l.to,
            className: "px-3.5 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent-soft/40 transition-all duration-200",
            activeProps: { className: "px-3.5 py-1.5 rounded-lg text-sm font-semibold text-primary bg-accent-soft/60" },
            activeOptions: { exact: true },
            children: l.label
          },
          l.to
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/auth",
              className: "hidden sm:inline-flex h-10 px-4 items-center rounded-xl text-sm font-semibold text-primary hover:bg-accent-soft/40 transition-colors duration-200",
              children: "Masuk"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/auth",
              className: "hidden sm:inline-flex h-10 px-4 items-center rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-secondary transition-colors duration-200",
              children: "Daftar Gratis"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Menu",
              onClick: () => setOpen((v) => !v),
              className: "md:hidden size-10 rounded-xl flex items-center justify-center text-foreground hover:bg-muted transition-colors",
              children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-5" })
            }
          )
        ] })
      ] }),
      open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute left-0 right-0 md:hidden border-b border-border/40 bg-background/98 backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-200 shadow-lg z-50 transition-all duration-300 ${scrolled ? "top-14" : "top-16"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 flex flex-col divide-y divide-border/10", children: [
        navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: l.to,
            onClick: () => setOpen(false),
            className: "py-3 text-sm font-medium text-foreground/80 hover:text-primary transition-colors",
            activeProps: { className: "py-3 text-sm font-semibold text-primary" },
            activeOptions: { exact: true },
            children: l.label
          },
          l.to
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-5 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/auth",
              onClick: () => setOpen(false),
              className: "flex-1 h-11 inline-flex items-center justify-center rounded-xl text-sm font-semibold text-primary border border-border bg-card hover:bg-muted transition-colors",
              children: "Masuk"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/auth",
              onClick: () => setOpen(false),
              className: "flex-1 h-11 inline-flex items-center justify-center rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-secondary transition-colors",
              children: "Daftar"
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 animate-page", children }, location.pathname),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border/40 bg-card mt-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-6xl mx-auto px-5 py-12 flex flex-col md:flex-row justify-between gap-10 md:gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md md:max-w-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Kebunin" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed", children: "Asisten berkebun urban pintar berbasis AI untuk pekarangan rumahmu. Deteksi penyakit instan, solusi tervalidasi." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-3 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-primary transition-colors", "aria-label": "Instagram", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-primary transition-colors", "aria-label": "Twitter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-primary transition-colors", "aria-label": "GitHub", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "size-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16 md:gap-16 lg:gap-24", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Produk", items: [
            { label: "Fitur", to: "/fitur" },
            { label: "Cara Kerja", to: "/cara-kerja" },
            { label: "FAQ", to: "/faq" }
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Perusahaan", items: [
            { label: "Tentang", to: "/tentang" }
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Akun", items: [
            { label: "Masuk", to: "/auth" },
            { label: "Daftar", to: "/auth" },
            { label: "Login Admin", to: "/admin" }
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-6xl mx-auto px-5 py-4 text-xs text-muted-foreground text-center", children: "© 2026 Kebunin · Dibuat untuk pecinta tanaman urban di Indonesia." }) })
    ] })
  ] });
}
function FooterCol({
  title,
  items
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground tracking-tight", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2", children: items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: i.to, className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: i.label }) }, i.label)) })
  ] });
}
export {
  MarketingLayout as M
};
