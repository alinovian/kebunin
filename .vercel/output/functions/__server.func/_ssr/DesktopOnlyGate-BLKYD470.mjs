import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a6 as Monitor } from "../_libs/lucide-react.mjs";
function DesktopOnlyGate({ children }) {
  const [isDesktop, setIsDesktop] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (isDesktop === null) return null;
  if (!isDesktop) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-6 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "size-8" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Dashboard Admin Hanya Untuk Desktop" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Silakan buka dashboard ini menggunakan komputer atau laptop dengan layar lebar." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium",
          children: "Kembali ke Landing Page"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
export {
  DesktopOnlyGate as D
};
