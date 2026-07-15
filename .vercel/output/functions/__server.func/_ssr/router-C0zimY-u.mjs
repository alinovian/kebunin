import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { supabase } from "./client-S4gzLm3e.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType, b as booleanType, a as arrayType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const appCss = "/assets/styles-BIu00OK7.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$j = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kebunin | Asisten Berkebun Urban Pintar" },
      { name: "description", content: "PWA asisten berkebun urban dengan deteksi penyakit AI dan jadwal rawat otomatis." },
      { name: "author", content: "Kebunin" },
      { name: "theme-color", content: "#005461" },
      { property: "og:title", content: "Kebunin | Asisten Berkebun Urban Pintar" },
      { property: "og:description", content: "PWA asisten berkebun urban dengan deteksi penyakit AI dan jadwal rawat otomatis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Kebunin | Asisten Berkebun Urban Pintar" },
      { name: "twitter:description", content: "PWA asisten berkebun urban dengan deteksi penyakit AI dan jadwal rawat otomatis." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cf16201b-77d9-42d4-b89a-96197725865d/id-preview-cd7ebb9e--e919119c-662a-48e1-a1b2-888dfaa07957.lovable.app-1780468227754.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cf16201b-77d9-42d4-b89a-96197725865d/id-preview-cd7ebb9e--e919119c-662a-48e1-a1b2-888dfaa07957.lovable.app-1780468227754.png" }
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com"
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: ""
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$j.useRouteContext();
  const router2 = useRouter();
  reactExports.useEffect(() => {
    let unsub;
    import("./client-S4gzLm3e.mjs").then(({ supabase: supabase2 }) => {
      const { data: { subscription } } = supabase2.auth.onAuthStateChange(() => {
        router2.invalidate();
        queryClient.invalidateQueries();
      });
      unsub = () => subscription.unsubscribe();
    });
    return () => unsub?.();
  }, [router2, queryClient]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center" })
  ] });
}
const $$splitComponentImporter$i = () => import("./tentang-0kg1m6e5.mjs");
const Route$i = createFileRoute("/tentang")({
  head: () => ({
    meta: [{
      title: "Tentang Kami | Kebunin"
    }, {
      name: "description",
      content: "Misi Kebunin: membuat berkebun urban jadi mudah, menyenangkan, dan dapat diakses semua orang lewat AI."
    }, {
      property: "og:title",
      content: "Tentang Kebunin"
    }, {
      property: "og:description",
      content: "Kenalan dengan misi dan nilai-nilai di balik Kebunin."
    }, {
      property: "og:url",
      content: "https://kebunin.lovable.app/tentang"
    }],
    links: [{
      rel: "canonical",
      href: "https://kebunin.lovable.app/tentang"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./fitur-n1EdtKXr.mjs");
const Route$h = createFileRoute("/fitur")({
  head: () => ({
    meta: [{
      title: "Fitur | Kebunin"
    }, {
      name: "description",
      content: "Scan daun AI, jadwal rawat otomatis, knowledge base bebas halusinasi, toko peralatan, dan sistem koin."
    }, {
      property: "og:title",
      content: "Fitur Lengkap Kebunin"
    }, {
      property: "og:description",
      content: "Semua fitur yang membantumu menjadi gardener urban yang andal."
    }, {
      property: "og:url",
      content: "https://kebunin.lovable.app/fitur"
    }],
    links: [{
      rel: "canonical",
      href: "https://kebunin.lovable.app/fitur"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const faqItems = [{
  q: "Apakah Kebunin gratis?",
  a: "Ya, semua fitur inti seperti Scan Daun AI, jadwal rawat, dan database tanaman gratis. Toko peralatan opsional untuk yang ingin belanja kebutuhan kebun."
}, {
  q: "Seberapa akurat diagnosis AI-nya?",
  a: "Kebunin pakai model Gemini yang diperkuat dengan knowledge base agrikultur internal (pendekatan RAG). Akurasi rata-rata di atas 85% untuk penyakit umum tanaman urban."
}, {
  q: "Tanaman apa saja yang didukung?",
  a: "Kami fokus pada tanaman urban populer: cabai, tomat, terong, sayur daun, herbal (basil, mint, rosemary), dan tanaman hias indoor. Database terus bertambah."
}, {
  q: "Apakah harus install dari Play Store atau App Store?",
  a: "Tidak. Kebunin adalah PWA — buka di browser HP, tambahkan ke home screen, dan kamu siap pakai seperti app native."
}, {
  q: "Bagaimana dengan privasi foto saya?",
  a: "Foto hanya dipakai untuk diagnosis sesaat dan tidak dibagikan ke pihak ketiga. Kamu bisa hapus riwayat scan kapan saja dari halaman Profil."
}, {
  q: "Apa itu sistem koin?",
  a: "Login harian dan menyelesaikan tugas perawatan memberi kamu koin. Koin bisa ditukar dengan diskon di Toko Peralatan."
}, {
  q: "Bisakah dipakai offline?",
  a: "Sebagian fitur (lihat jadwal & profil tanaman) bisa diakses offline. Diagnosis AI butuh koneksi internet."
}, {
  q: "Bagaimana cara daftar?",
  a: "Klik tombol Daftar Gratis dan masuk dengan akun Google. Selesai dalam 30 detik."
}];
const $$splitComponentImporter$g = () => import("./faq-QcODHY-C.mjs");
const Route$g = createFileRoute("/faq")({
  head: () => ({
    meta: [{
      title: "FAQ | Kebunin"
    }, {
      name: "description",
      content: "Jawaban atas pertanyaan umum tentang Kebunin: gratis, akurasi AI, jenis tanaman, dan privasi data."
    }, {
      property: "og:title",
      content: "Pertanyaan Umum Kebunin"
    }, {
      property: "og:description",
      content: "Semua yang perlu kamu tahu sebelum mulai pakai Kebunin."
    }, {
      property: "og:url",
      content: "https://kebunin.lovable.app/faq"
    }],
    links: [{
      rel: "canonical",
      href: "https://kebunin.lovable.app/faq"
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a
          }
        }))
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./cara-kerja-C5eun3uA.mjs");
const Route$f = createFileRoute("/cara-kerja")({
  head: () => ({
    meta: [{
      title: "Cara Kerja | Kebunin"
    }, {
      name: "description",
      content: "4 langkah mudah: foto daun, AI analisis, dapatkan solusi, ikuti jadwal rawat otomatis."
    }, {
      property: "og:title",
      content: "Cara Kerja Kebunin"
    }, {
      property: "og:description",
      content: "Lihat bagaimana Kebunin membantumu dari diagnosis hingga rawat harian."
    }, {
      property: "og:url",
      content: "https://kebunin.lovable.app/cara-kerja"
    }],
    links: [{
      rel: "canonical",
      href: "https://kebunin.lovable.app/cara-kerja"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./auth-7YF8zJbg.mjs");
const Route$e = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Masuk | Kebunin"
    }, {
      name: "description",
      content: "Masuk atau daftar Kebunin untuk mulai berkebun dengan asisten AI."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const profileInput = objectType({
  id: stringType().min(1),
  email: stringType().nullable().optional(),
  display_name: stringType().nullable().optional(),
  avatar_url: stringType().nullable().optional()
});
const adminRoleInput = objectType({
  userId: stringType().min(1)
});
const addRoleInput = objectType({
  targetUserIdOrEmail: stringType().min(1),
  role: enumType(["admin", "super_admin"])
});
const removeRoleInput = objectType({
  roleId: stringType().min(1)
});
const productInput = objectType({
  name: stringType().min(1),
  price: numberType().int().min(0),
  coin: numberType().int().min(0).default(0),
  description: stringType().nullable().optional(),
  admin_id: stringType().nullable().optional(),
  image_url: stringType().nullable().optional()
});
const updateProductInput = objectType({
  id: stringType().min(1),
  name: stringType().min(1),
  price: numberType().int().min(0),
  coin: numberType().int().min(0).default(0),
  description: stringType().nullable().optional(),
  admin_id: stringType().nullable().optional(),
  image_url: stringType().nullable().optional()
});
const buyProductInput = objectType({
  userId: stringType().min(1),
  productId: stringType().min(1)
});
const userPlantsInput = objectType({
  userId: stringType().min(1)
});
const addPlantInput = objectType({
  userId: stringType().min(1),
  name: stringType().min(1),
  status: stringType().default("Sehat"),
  days: numberType().int().min(1).default(1),
  imageUrl: stringType().nullable().optional(),
  plantedAt: stringType().min(1)
});
const deletePlantInput = objectType({
  id: stringType().min(1),
  userId: stringType().min(1)
});
const userTasksInput = objectType({
  userId: stringType().min(1)
});
const toggleTaskInput = objectType({
  taskId: stringType().min(1),
  userId: stringType().min(1),
  isDone: booleanType()
});
const scanInput = objectType({
  userId: stringType().min(1),
  disease: stringType().min(1),
  confidence: numberType(),
  summary: stringType(),
  steps: arrayType(stringType()),
  plantId: stringType().nullable().optional()
});
const analyzeLeafInput = objectType({
  userId: stringType().min(1),
  image: stringType().min(1),
  plantId: stringType().nullable().optional()
});
const addPlantSuggestionInput = objectType({
  userId: stringType().min(1),
  suggestedPlant: stringType().min(1),
  suggestionText: stringType().nullable().optional()
});
const deletePlantSuggestionInput = objectType({
  id: stringType().min(1)
});
const getOrCreateProfile = createServerFn({
  method: "POST"
}).inputValidator(profileInput).handler(createSsrRpc("f235a2ec3388f5431c235048714b6feb3fa2783779056f8c3a12f79db3142119"));
const getAdminRoles = createServerFn({
  method: "GET"
}).inputValidator(adminRoleInput).handler(createSsrRpc("7d6518fb08bf5ef68a64578d5d973eef49e9b0530949000432324336608d0faa"));
const addAdminRole = createServerFn({
  method: "POST"
}).inputValidator(addRoleInput).handler(createSsrRpc("1d11917690a500db665bdcf25a4a8079d1aec0084e697cf3f8838ecfe304a37e"));
const removeAdminRole = createServerFn({
  method: "POST"
}).inputValidator(removeRoleInput).handler(createSsrRpc("3f288b5c541f68b09ca6eb4716cd5ea739431fc74024f415a67e4cd6cc8b49a9"));
const getAdminStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("ea8a994eff4c22910186a0e16c90c9c15d0f7e19b5f98f07699de199961bb3aa"));
const getAdminProfiles = createServerFn({
  method: "GET"
}).handler(createSsrRpc("2a7be8877cbc513308c34d98f5e978d222965ada2723a239274db54538289cd6"));
const getAdminRolesList = createServerFn({
  method: "GET"
}).handler(createSsrRpc("f47bd43bd1547f277b7e3724ea67eecd24d8df4eee49d19a98a10da8943bebe9"));
const getProducts = createServerFn({
  method: "GET"
}).handler(createSsrRpc("2a50a5b647acc02a57e3287d42f6b334735c7305ea91ef4a56aacd9222e4545d"));
const getProductById = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  id: stringType().min(1)
})).handler(createSsrRpc("318a6b6669862aeeb5d16b06073e649ccd22f7c7f8e614c5ce57a4dd97aa84cc"));
const addProduct = createServerFn({
  method: "POST"
}).inputValidator(productInput).handler(createSsrRpc("16604798d696a7ed7b47d7900191866bfb217d8d6f6feb5cc397c8ad4a9f8db5"));
const updateProduct = createServerFn({
  method: "POST"
}).inputValidator(updateProductInput).handler(createSsrRpc("4770555434a024d49b8af6eb8136e1d550fc6df5b1b725fe151f9b1e93d1a5e4"));
const deleteProduct = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: stringType().min(1)
})).handler(createSsrRpc("a25e7bd42bc6d7f15511d84443abf5ee889537cc41a67d519b2780effe3e6b92"));
createServerFn({
  method: "POST"
}).inputValidator(buyProductInput).handler(createSsrRpc("cbd576a8fe732fdc782443bb139b702897c588beb41e6f0b7d5b84f3d7ea5be8"));
const getUserPlants = createServerFn({
  method: "GET"
}).inputValidator(userPlantsInput).handler(createSsrRpc("fee8752a8b935fd1b2b2585b7368b830885bbea0216566a2c86be4288f3c8302"));
const addUserPlant = createServerFn({
  method: "POST"
}).inputValidator(addPlantInput).handler(createSsrRpc("5f3a6537d488f17df377229f04165fe60fb3265fcd0456b4cdda1bd46588babf"));
const uploadPhotoInput = objectType({
  base64Data: stringType(),
  fileName: stringType()
});
const uploadPlantPhoto = createServerFn({
  method: "POST"
}).inputValidator(uploadPhotoInput).handler(createSsrRpc("18a4078e51b633eb5b1bed0d600761b0026c1d29146827660d51273848be42fe"));
const uploadProductPhoto = createServerFn({
  method: "POST"
}).inputValidator(uploadPhotoInput).handler(createSsrRpc("054dde430634675cae144336234c9857df8a8f1d075e08cb2450cd1ce10fbfa8"));
const deleteProductPhoto = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  imageUrl: stringType().min(1)
})).handler(createSsrRpc("3a3c2f05d7d694db3cdec0afa9baa1166f1e567df74c9765d82011aa22adf0f0"));
const updatePlantImageInput = objectType({
  plantId: stringType().min(1),
  userId: stringType().min(1),
  imageUrl: stringType().min(1)
});
const deletePhotoInput = objectType({
  imageUrl: stringType().min(1)
});
const deletePlantPhoto = createServerFn({
  method: "POST"
}).inputValidator(deletePhotoInput).handler(createSsrRpc("32b42016a03f5ee25a58027216edf0810f0b1bce25ca47deb5e4e12038d9c303"));
const updatePlantImage = createServerFn({
  method: "POST"
}).inputValidator(updatePlantImageInput).handler(createSsrRpc("80196975074845e9f873e422d5276c34a0e678e4520aed92030696d0c6364409"));
const updatePlantPlantedAtInput = objectType({
  plantId: stringType().min(1),
  userId: stringType().min(1),
  plantedAt: stringType().min(1)
});
const updatePlantPlantedAt = createServerFn({
  method: "POST"
}).inputValidator(updatePlantPlantedAtInput).handler(createSsrRpc("875b577272acda400c0bb531357f8afa0714cc6411660b2322f049b5f24cbddd"));
const deleteUserPlant = createServerFn({
  method: "POST"
}).inputValidator(deletePlantInput).handler(createSsrRpc("0900fa5c60ef1ba04df6b4593dd6323293c6b657b56b746e9fd4b383ac26b16a"));
const getUserTasks = createServerFn({
  method: "GET"
}).inputValidator(userTasksInput).handler(createSsrRpc("3462f3e36921f2e965c749e1299bc045875c5971dcf9d4b2dec7e01d0a465edf"));
const toggleTaskCompleted = createServerFn({
  method: "POST"
}).inputValidator(toggleTaskInput).handler(createSsrRpc("6d6a1a48f4697c0558396a14584d64e7a18cbf44f112c74aa01d10f435f780fa"));
createServerFn({
  method: "POST"
}).inputValidator(scanInput).handler(createSsrRpc("ac59a9e80d26236a3b3c56c15878f7c892960f64ac7ac6cdf69b795467659f02"));
const analyzeLeafImage = createServerFn({
  method: "POST"
}).inputValidator(analyzeLeafInput).handler(createSsrRpc("d0312bdadbb06d9bbb1ec2464acc620562d831592cc3620f8385e088b849c9bc"));
const getScanHistory = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  userId: stringType().min(1)
})).handler(createSsrRpc("07645ca2e9d295844246f94bc099ea2acc9b41001e02849abcb4a0b316ba2c27"));
const deleteScanHistory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: stringType().min(1)
})).handler(createSsrRpc("5fad867b7a90838afb8cc6f7025b64c75f76e9e25dd02a1c9465f8d461a22bf1"));
const checkEmailExists = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  email: stringType().email()
})).handler(createSsrRpc("c8de46c9ea044154ee881b2ee6f90cab20da811ee7f2d03d4cd11175d8dffc55"));
const registerInput = objectType({
  email: stringType().email(),
  password: stringType().min(6),
  displayName: stringType().min(1)
});
const registerLocal = createServerFn({
  method: "POST"
}).inputValidator(registerInput).handler(createSsrRpc("907673ce0406b410c803947aaafc5fff516bcd5a1334660fac83b0211220cc18"));
const loginInput = objectType({
  email: stringType().email(),
  password: stringType()
});
const loginLocal = createServerFn({
  method: "POST"
}).inputValidator(loginInput).handler(createSsrRpc("1f44673e51d91818c80b176dcb5adf390143aaa9a0eb43d304cf7a7a53f54c15"));
const updateProfileInput = objectType({
  id: stringType().min(1),
  displayName: stringType().min(1),
  avatarUrl: stringType().nullable().optional()
});
const updateProfile = createServerFn({
  method: "POST"
}).inputValidator(updateProfileInput).handler(createSsrRpc("45381f46cd1801e535b1d3023656ab60e43e62689146c424b89d908e1b0cf9aa"));
const updateUserProfileLocationInput = objectType({
  id: stringType().min(1),
  userDesa: stringType().nullable().optional(),
  userKecamatan: stringType().nullable().optional(),
  userKabupaten: stringType().nullable().optional(),
  userLatitude: numberType().nullable().optional(),
  userLongitude: numberType().nullable().optional()
});
const updateUserProfileLocation = createServerFn({
  method: "POST"
}).inputValidator(updateUserProfileLocationInput).handler(createSsrRpc("eb02acdeb83841539e4fe6e8e1399180a433107f7a0f762916eed4e84e861fc5"));
const updateShopProfileInput = objectType({
  id: stringType().min(1),
  displayName: stringType().min(1),
  shopDescription: stringType().nullable().optional(),
  shopAddress: stringType().nullable().optional(),
  shopWhatsapp: stringType().nullable().optional(),
  shopLatitude: numberType().nullable().optional(),
  shopLongitude: numberType().nullable().optional(),
  shopActive: booleanType().optional(),
  shopDesa: stringType().nullable().optional(),
  shopKecamatan: stringType().nullable().optional(),
  shopKabupaten: stringType().nullable().optional()
});
const updateShopProfile = createServerFn({
  method: "POST"
}).inputValidator(updateShopProfileInput).handler(createSsrRpc("038b2f3bccb6ccd0467859d42acd25c730bfee87e968c2d0c35ad14e525bbe30"));
const updateAccountInput = objectType({
  id: stringType().min(1),
  email: stringType().email().optional(),
  password: stringType().min(6).optional()
});
const updateAccount = createServerFn({
  method: "POST"
}).inputValidator(updateAccountInput).handler(createSsrRpc("e395aa272a2b53b28a30d4bde5be9c8a542d2113922316b0bff3efb1c221bc0d"));
const superAdminUpdateProfileInput = objectType({
  id: stringType().min(1),
  display_name: stringType().min(1),
  role: enumType(["user", "admin", "super_admin"]),
  password: stringType().min(6).nullable().optional(),
  avatar_url: stringType().nullable().optional(),
  coins: numberType().int().min(0).optional(),
  streak: numberType().int().min(0).optional(),
  level: numberType().int().min(1).optional(),
  xp: numberType().int().min(0).optional()
});
const superAdminDeleteProfileInput = objectType({
  id: stringType().min(1)
});
const superAdminDeleteUserPlantInput = objectType({
  id: stringType().min(1)
});
const superAdminUpdateProfile = createServerFn({
  method: "POST"
}).inputValidator(superAdminUpdateProfileInput).handler(createSsrRpc("cd99e9835172a0fbba14102261e14b5b31486c8d3f125335dbda01f1eaaa69cb"));
const superAdminDeleteProfile = createServerFn({
  method: "POST"
}).inputValidator(superAdminDeleteProfileInput).handler(createSsrRpc("8702fdc5634dd052993e28073deb8bcf14524c535499fbd972cce5be5ecf6dcb"));
const getAllUserPlants = createServerFn({
  method: "GET"
}).handler(createSsrRpc("bf61550ae809244f153eea6077bf47384b1ae8b15ab6c9b5cd1306cbaec65778"));
const superAdminDeleteUserPlant = createServerFn({
  method: "POST"
}).inputValidator(superAdminDeleteUserPlantInput).handler(createSsrRpc("466c3daa0393ea6ab7e2487ebe07fc85e05d16a40d732bb544c3528346cf7efa"));
const addPlantSuggestion = createServerFn({
  method: "POST"
}).inputValidator(addPlantSuggestionInput).handler(createSsrRpc("96abc83d8c0983b4285effdd50fb621f0092a3f9b362bb9848b8de9dec178ea0"));
const getPlantSuggestions = createServerFn({
  method: "GET"
}).handler(createSsrRpc("ac0287ab7df51f1371b7ab081f507552cb8158ac09f27ca878c3c1ab38f96fca"));
const deletePlantSuggestion = createServerFn({
  method: "POST"
}).inputValidator(deletePlantSuggestionInput).handler(createSsrRpc("3ab4f9045cff8a49441e3ab12c7719bde171ae8386845cf4e09a91037fa33ba5"));
const getPlantTasksAdmin = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  plantId: stringType().min(1)
})).handler(createSsrRpc("d0bbf992f550b5c0a907d90e6dac3483d1ca509512eb0db7d1c521ad47634204"));
const deleteUserTaskAdmin = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  taskId: stringType().min(1)
})).handler(createSsrRpc("84619989b09f19084a2dc19a7139dfcc675b4d18c2381bb228d5f71eb7a4248b"));
const updateUserTaskAdmin = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  taskId: stringType().min(1),
  title: stringType().min(1),
  time: stringType().min(5).max(10),
  isDone: booleanType()
})).handler(createSsrRpc("c2ff90a3e92559203728491c39fea818b775e94418bd6ceac76cf3a4dac99ef4"));
const addUserTaskAdmin = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  userId: stringType().min(1),
  plantId: stringType().min(1),
  title: stringType().min(1),
  time: stringType().min(5).max(10)
})).handler(createSsrRpc("34385a10872e25dac466cb385005bcca6f3ae63e5c5b7d6c4742ec196078e6fe"));
const getWishlistCategories = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  userId: stringType().min(1)
})).handler(createSsrRpc("67f752fac1ddbe4c55370e962b380e61daa3d2a1d1ee4c4eb062478f7145ea87"));
const createWishlistCategory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  userId: stringType().min(1),
  name: stringType().min(1)
})).handler(createSsrRpc("ddef14b5de42ec5a56afeb3e2bf3d4193ab7ef93f13d6769a406fd750bc1204d"));
const updateWishlistCategory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: stringType().min(1),
  name: stringType().min(1)
})).handler(createSsrRpc("fa707a4d4ed35df5a0e1f2c9169ab00ace0241f6d4da255be60bb4e21a95e8cd"));
const deleteWishlistCategory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: stringType().min(1)
})).handler(createSsrRpc("14817af28be3301b67bcee8ea11a8dfa9c1597ed586d9472027335c8e434e7ab"));
const getWishlistItems = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  userId: stringType().min(1)
})).handler(createSsrRpc("89bc642a6cfb03103eca52a99c0a3a50c5534460f21483132d404611dcf9ad73"));
const toggleWishlistItem = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  userId: stringType().min(1),
  productId: stringType().min(1),
  categoryId: stringType().nullable().optional()
})).handler(createSsrRpc("668977dba0f5295d7fb2f3bae32eea6222af61b79a46e57772723389a77e8492"));
const updateWishlistItemCategory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  userId: stringType().min(1),
  productId: stringType().min(1),
  categoryId: stringType().nullable().optional()
})).handler(createSsrRpc("cac08fde4b71d90befbf723f4468d13c2e00c35d54bb8a400d66dcb2e09d0eff"));
const $$splitComponentImporter$d = () => import("./admin-Dz2Tgaoj.mjs");
const Route$d = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({
    location
  }) => {
    if (location.pathname === "/admin/login") return;
    let curUser = null;
    const localUserStr = typeof window !== "undefined" ? localStorage.getItem("kebunin_user") : null;
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        if (localUser && localUser.id) {
          curUser = localUser;
        }
      } catch (e) {
      }
    }
    if (!curUser) {
      const {
        data,
        error
      } = await supabase.auth.getUser();
      if (!error && data.user) {
        curUser = {
          id: data.user.id,
          email: data.user.email ?? null,
          display_name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("kebunin_user", JSON.stringify(curUser));
        }
      }
    }
    if (!curUser) {
      throw redirect({
        to: "/admin/login"
      });
    }
    let list = [];
    try {
      list = await getAdminRoles({
        data: {
          userId: curUser.id
        }
      });
    } catch (err) {
      console.error("Gagal memeriksa role admin dari MySQL:", err);
      throw redirect({
        to: "/admin/login",
        search: {
          unauthorized: "1"
        }
      });
    }
    if (!list.includes("admin") && !list.includes("super_admin")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("kebunin_user");
      }
      await supabase.auth.signOut();
      throw redirect({
        to: "/admin/login",
        search: {
          unauthorized: "1"
        }
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./route-DXdwpVOw.mjs");
const Route$c = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    let curUser = null;
    const localUserStr = typeof window !== "undefined" ? localStorage.getItem("kebunin_user") : null;
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        if (localUser && localUser.id) {
          curUser = localUser;
        }
      } catch (e) {
      }
    }
    if (!curUser) {
      throw redirect({
        to: "/auth"
      });
    }
    return {
      user: curUser
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./index-U-jnrcY_.mjs");
const Route$b = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Kebunin | Asisten Berkebun Urban dengan AI"
    }, {
      name: "description",
      content: "Pindai daun, dapatkan diagnosis AI tervalidasi, dan rawat tanamanmu dengan jadwal otomatis. Gratis, mobile-first."
    }, {
      property: "og:title",
      content: "Kebunin | Asisten Berkebun Urban dengan AI"
    }, {
      property: "og:description",
      content: "Deteksi penyakit daun lewat AI, solusi tervalidasi pakar, jadwal rawat otomatis."
    }, {
      property: "og:url",
      content: "https://kebunin.lovable.app/"
    }],
    links: [{
      rel: "canonical",
      href: "https://kebunin.lovable.app/"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./admin.index-CYbQYBHG.mjs");
const Route$a = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Dashboard | Admin Kebunin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./admin.toko-D7iVDw3j.mjs");
const Route$9 = createFileRoute("/admin/toko")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Kelola Toko | Admin Kebunin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin.tanaman-DtetSV84.mjs");
const Route$8 = createFileRoute("/admin/tanaman")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Tanaman User | Admin Kebunin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./admin.pengguna-CBiH-M-8.mjs");
const Route$7 = createFileRoute("/admin/pengguna")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Pengguna | Admin Kebunin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin.login-DyBYIIVy.mjs");
const Route$6 = createFileRoute("/admin/login")({
  ssr: false,
  validateSearch: (search) => {
    return {
      unauthorized: search.unauthorized
    };
  },
  head: () => ({
    meta: [{
      title: "Login Admin | Kebunin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./admin.admin-DTxGC8V3.mjs");
const Route$5 = createFileRoute("/admin/admin")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Kelola Admin | Admin Kebunin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./toko-D4QV9Gqc.mjs");
const Route$4 = createFileRoute("/_authenticated/toko")({
  head: () => ({
    meta: [{
      title: "Toko Kebunin | Bibit & Pupuk Urban"
    }, {
      name: "description",
      content: "Belanja bibit, pupuk organik, obat-obatan, dan alat berkebun."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./scan-CT7jM9-9.mjs");
const Route$3 = createFileRoute("/_authenticated/scan")({
  validateSearch: (search) => {
    return {
      plantId: search.plantId ? String(search.plantId) : void 0
    };
  },
  head: () => ({
    meta: [{
      title: "Scan Daun | Kebunin AI Deteksi"
    }, {
      name: "description",
      content: "Pindai daun sakit, dapatkan diagnosis Gemini AI dengan solusi tervalidasi pakar."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./profil--D__kaZH.mjs");
const Route$2 = createFileRoute("/_authenticated/profil")({
  head: () => ({
    meta: [{
      title: "Profil | Kebunin"
    }, {
      name: "description",
      content: "Lihat progres, koin, dan pencapaian berkebunmu."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./jadwal-B0lPiMgS.mjs");
const Route$1 = createFileRoute("/_authenticated/jadwal")({
  validateSearch: (search) => {
    return {
      plantId: search.plantId ? String(search.plantId) : void 0
    };
  },
  head: () => ({
    meta: [{
      title: "Jadwal Rawat | Kebunin"
    }, {
      name: "description",
      content: "Pengingat siram, pupuk, dan pangkas tanamanmu, otomatis menyesuaikan kondisi."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./beranda-Dyf-M6Ta.mjs");
const Route = createFileRoute("/_authenticated/beranda")({
  head: () => ({
    meta: [{
      title: "Kebunin | Asisten Berkebun Urban Pintar"
    }, {
      name: "description",
      content: "Pindai daun, dapat diagnosis AI, dan jaga jadwal rawat tanamanmu setiap hari."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TentangRoute = Route$i.update({
  id: "/tentang",
  path: "/tentang",
  getParentRoute: () => Route$j
});
const FiturRoute = Route$h.update({
  id: "/fitur",
  path: "/fitur",
  getParentRoute: () => Route$j
});
const FaqRoute = Route$g.update({
  id: "/faq",
  path: "/faq",
  getParentRoute: () => Route$j
});
const CaraKerjaRoute = Route$f.update({
  id: "/cara-kerja",
  path: "/cara-kerja",
  getParentRoute: () => Route$j
});
const AuthRoute = Route$e.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$j
});
const AdminRoute = Route$d.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$j
});
const AuthenticatedRouteRoute = Route$c.update({
  id: "/_authenticated",
  getParentRoute: () => Route$j
});
const IndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$j
});
const AdminIndexRoute = Route$a.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const AdminTokoRoute = Route$9.update({
  id: "/toko",
  path: "/toko",
  getParentRoute: () => AdminRoute
});
const AdminTanamanRoute = Route$8.update({
  id: "/tanaman",
  path: "/tanaman",
  getParentRoute: () => AdminRoute
});
const AdminPenggunaRoute = Route$7.update({
  id: "/pengguna",
  path: "/pengguna",
  getParentRoute: () => AdminRoute
});
const AdminLoginRoute = Route$6.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => AdminRoute
});
const AdminAdminRoute = Route$5.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AdminRoute
});
const AuthenticatedTokoRoute = Route$4.update({
  id: "/toko",
  path: "/toko",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedScanRoute = Route$3.update({
  id: "/scan",
  path: "/scan",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedProfilRoute = Route$2.update({
  id: "/profil",
  path: "/profil",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedJadwalRoute = Route$1.update({
  id: "/jadwal",
  path: "/jadwal",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedBerandaRoute = Route.update({
  id: "/beranda",
  path: "/beranda",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedRouteRouteChildren = {
  AuthenticatedBerandaRoute,
  AuthenticatedJadwalRoute,
  AuthenticatedProfilRoute,
  AuthenticatedScanRoute,
  AuthenticatedTokoRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const AdminRouteChildren = {
  AdminAdminRoute,
  AdminLoginRoute,
  AdminPenggunaRoute,
  AdminTanamanRoute,
  AdminTokoRoute,
  AdminIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AdminRoute: AdminRouteWithChildren,
  AuthRoute,
  CaraKerjaRoute,
  FaqRoute,
  FiturRoute,
  TentangRoute
};
const routeTree = Route$j._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  addUserPlant as $,
  removeAdminRole as A,
  addAdminRole as B,
  updateWishlistItemCategory as C,
  createWishlistCategory as D,
  updateWishlistCategory as E,
  deleteWishlistCategory as F,
  getWishlistItems as G,
  getWishlistCategories as H,
  toggleWishlistItem as I,
  Route$3 as J,
  getUserPlants as K,
  getProductById as L,
  getScanHistory as M,
  deleteScanHistory as N,
  analyzeLeafImage as O,
  updateProfile as P,
  updateAccount as Q,
  Route$6 as R,
  updateUserProfileLocation as S,
  Route$1 as T,
  getUserTasks as U,
  toggleTaskCompleted as V,
  deletePlantPhoto as W,
  deleteUserPlant as X,
  updatePlantPlantedAt as Y,
  uploadPlantPhoto as Z,
  updatePlantImage as _,
  getAdminStats as a,
  addPlantSuggestion as a0,
  router as a1,
  getProducts as b,
  checkEmailExists as c,
  getAdminRolesList as d,
  addProduct as e,
  faqItems as f,
  getOrCreateProfile as g,
  deleteProductPhoto as h,
  deleteProduct as i,
  updateShopProfile as j,
  uploadProductPhoto as k,
  loginLocal as l,
  getAllUserPlants as m,
  getPlantSuggestions as n,
  getPlantTasksAdmin as o,
  deletePlantSuggestion as p,
  updateUserTaskAdmin as q,
  registerLocal as r,
  superAdminDeleteUserPlant as s,
  deleteUserTaskAdmin as t,
  updateProduct as u,
  addUserTaskAdmin as v,
  getAdminProfiles as w,
  superAdminDeleteProfile as x,
  superAdminUpdateProfile as y,
  getAdminRoles as z
};
