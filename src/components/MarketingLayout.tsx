import { Link, useLocation } from "@tanstack/react-router";
import { Leaf, Menu, X, Instagram, Twitter, Github } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";

const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/fitur", label: "Fitur" },
  { to: "/cara-kerja", label: "Cara Kerja" },
  { to: "/tentang", label: "Tentang" },
  { to: "/faq", label: "FAQ" },
] as const;

export function MarketingLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "bg-background/70 backdrop-blur-md border-b border-transparent"
      }`}>
        <div className={`max-w-6xl mx-auto px-5 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-14" : "h-16"
        }`}>
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-105 group-hover:bg-secondary transition-all duration-300">
              <Leaf className="size-5" />
            </div>
            <span className="font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">Kebunin</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent-soft/40 transition-all duration-200"
                activeProps={{ className: "px-3.5 py-1.5 rounded-lg text-sm font-semibold text-primary bg-accent-soft/60" }}
                activeOptions={{ exact: true }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="hidden sm:inline-flex h-10 px-4 items-center rounded-xl text-sm font-semibold text-primary hover:bg-accent-soft/40 transition-colors duration-200"
            >
              Masuk
            </Link>
            <Link
              to="/auth"
              className="hidden sm:inline-flex h-10 px-4 items-center rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-secondary transition-colors duration-200"
            >
              Daftar Gratis
            </Link>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden size-10 rounded-xl flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className={`absolute left-0 right-0 md:hidden border-b border-border/40 bg-background/98 backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-200 shadow-lg z-50 transition-all duration-300 ${
            scrolled ? "top-14" : "top-16"
          }`}>
            <div className="px-5 py-4 flex flex-col divide-y divide-border/10">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  activeProps={{ className: "py-3 text-sm font-semibold text-primary" }}
                  activeOptions={{ exact: true }}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-5 pb-2">
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-11 inline-flex items-center justify-center rounded-xl text-sm font-semibold text-primary border border-border bg-card hover:bg-muted transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-11 inline-flex items-center justify-center rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-secondary transition-colors"
                >
                  Daftar
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main key={location.pathname} className="flex-1 animate-page">{children}</main>

      <footer className="border-t border-border/40 bg-card mt-24">
        <div className="w-full max-w-6xl mx-auto px-5 py-12 flex flex-col md:flex-row justify-between gap-10 md:gap-8">
          <div className="max-w-md md:max-w-xs">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <Leaf className="size-4" />
              </div>
              <span className="font-semibold text-foreground">Kebunin</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Asisten berkebun urban pintar berbasis AI untuk pekarangan rumahmu. Deteksi penyakit instan, solusi tervalidasi.
            </p>
            <div className="mt-4 flex items-center gap-3 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="size-4" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="size-4" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="GitHub">
                <Github className="size-4" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16 md:gap-16 lg:gap-24">
            <FooterCol title="Produk" items={[
              { label: "Fitur", to: "/fitur" },
              { label: "Cara Kerja", to: "/cara-kerja" },
              { label: "FAQ", to: "/faq" },
            ]} />
            <FooterCol title="Perusahaan" items={[
              { label: "Tentang", to: "/tentang" },
            ]} />
            <FooterCol title="Akun" items={[
              { label: "Masuk", to: "/auth" },
              { label: "Daftar", to: "/auth" },
              { label: "Login Admin", to: "/admin" },
            ]} />
          </div>
        </div>
        <div className="border-t border-border/20">
          <p className="max-w-6xl mx-auto px-5 py-4 text-xs text-muted-foreground text-center">
            © 2026 Kebunin · Dibuat untuk pecinta tanaman urban di Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: "/" | "/fitur" | "/cara-kerja" | "/tentang" | "/faq" | "/auth" | "/admin" }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground tracking-tight">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
