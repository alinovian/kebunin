import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { al as House, am as CalendarDays, a as ScanLine, d as Store, n as User } from "../_libs/lucide-react.mjs";
const navItems = [
  { to: "/beranda", label: "Beranda", icon: House },
  { to: "/jadwal", label: "Jadwal", icon: CalendarDays },
  { to: "/scan", label: "Scan", icon: ScanLine, primary: true },
  { to: "/toko", label: "Toko", icon: Store },
  { to: "/profil", label: "Profil", icon: User }
];
function AppShell({ children }) {
  const { pathname } = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen w-full flex justify-center bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md min-h-screen bg-background shadow-xl flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pb-24", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border z-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-5 items-end", children: navItems.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        if (item.primary) {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "flex justify-center -mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: item.to,
              "aria-label": item.label,
              className: "size-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 active:bg-secondary transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-7" })
            }
          ) }, item.to);
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: `min-h-[56px] flex flex-col items-center justify-center gap-1 px-2 py-2 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caption font-medium", children: item.label })
            ]
          }
        ) }, item.to);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[env(safe-area-inset-bottom)]" })
    ] })
  ] }) });
}
export {
  AppShell as A
};
