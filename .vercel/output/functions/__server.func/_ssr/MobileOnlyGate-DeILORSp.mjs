import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { q as Smartphone } from "../_libs/lucide-react.mjs";
const MAX_ALLOWED_WIDTH = 1024;
function MobileOnlyGate({ children }) {
  const [ready, setReady] = reactExports.useState(false);
  const [allowed, setAllowed] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MAX_ALLOWED_WIDTH}px)`);
    const update = () => setAllowed(mql.matches);
    update();
    setReady(true);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  if (!ready) return null;
  if (allowed) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-6 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm text-center space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "size-8" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Aplikasi Hanya Untuk Perangkat Mobile" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Silakan buka aplikasi ini menggunakan smartphone atau tablet." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium",
        children: "Kembali ke Landing Page"
      }
    )
  ] }) });
}
export {
  MobileOnlyGate as M
};
