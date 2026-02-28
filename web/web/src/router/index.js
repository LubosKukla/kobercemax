import { createRouter, createWebHistory } from "vue-router";
import productsData from "../data/products.json";
import realizationsData from "../data/realizations.json";
import { fetchAdminMe } from "@/services/adminApi";
import { trackPageView } from "@/services/analytics";
import defaultShareImage from "@/assets/img/logo.png";

const MainLayout = () => import(/* webpackChunkName: "layout-main" */ "../layouts/MainLayout.vue");
const AdminLayout = () =>
  import(/* webpackChunkName: "layout-admin" */ "../layouts/AdminLayout.vue");
const HomeView = () => import(/* webpackChunkName: "page-home" */ "../views/HomeView.vue");
const AboutView = () => import(/* webpackChunkName: "page-about" */ "../views/AboutView.vue");
const ProductsView = () => import(/* webpackChunkName: "page-products" */ "../views/ProductsView.vue");
const ProductDetailView = () =>
  import(/* webpackChunkName: "page-product-detail" */ "../views/ProductDetailView.vue");
const RealizationsView = () =>
  import(/* webpackChunkName: "page-realizations" */ "../views/RealizationsView.vue");
const ShowroomView = () =>
  import(/* webpackChunkName: "page-showroom" */ "../views/ShowroomView.vue");
const ContactView = () => import(/* webpackChunkName: "page-contact" */ "../views/ContactView.vue");
const NotFoundView = () =>
  import(/* webpackChunkName: "page-not-found" */ "../views/NotFoundView.vue");
const RealizationDetailView = () =>
  import(/* webpackChunkName: "page-realization-detail" */ "../views/RealizationDetailView.vue");
const PrivacyView = () => import(/* webpackChunkName: "page-privacy" */ "../views/PrivacyView.vue");
const CookiesView = () => import(/* webpackChunkName: "page-cookies" */ "../views/CookiesView.vue");
const AdminLoginView = () =>
  import(/* webpackChunkName: "page-admin-login" */ "../views/AdminLoginView.vue");
const AdminRealizationsView = () =>
  import(/* webpackChunkName: "page-admin-realizations" */ "../views/AdminRealizationsView.vue");
const AdminRealizationFormView = () =>
  import(/* webpackChunkName: "page-admin-realization-form" */ "../views/AdminRealizationFormView.vue");

const routes = [
  {
    path: "/admin/login",
    name: "admin-login",
    component: AdminLoginView,
  },
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "",
        redirect: "/admin/realizations",
      },
      {
        path: "realizations",
        name: "admin-realizations",
        component: AdminRealizationsView,
      },
      {
        path: "realizations/new",
        name: "admin-realization-create",
        component: AdminRealizationFormView,
      },
      {
        path: "realizations/:id/edit",
        name: "admin-realization-edit",
        component: AdminRealizationFormView,
        props: true,
      },
    ],
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
      },
      {
        path: "o-nas",
        name: "about",
        component: AboutView,
      },
      {
        path: "produkty",
        name: "products",
        component: ProductsView,
      },
      {
        path: "produkty/:id/:slug",
        name: "product-detail",
        component: ProductDetailView,
        props: true,
      },
      {
        path: "realizacie",
        name: "realizations",
        component: RealizationsView,
      },
      {
        path: "realizacie/:id/:slug?",
        name: "realization-detail",
        component: RealizationDetailView,
        props: (route) => ({
          id: String(route.params.id || ""),
        }),
      },
      {
        path: "showroom",
        name: "showroom",
        component: ShowroomView,
      },
      {
        path: "kontakt",
        name: "contact",
        component: ContactView,
      },
      {
        path: "zasady-ochrany-sukromia",
        name: "privacy",
        component: PrivacyView,
      },
      {
        path: "cookies",
        name: "cookies",
        component: CookiesView,
      },
      {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: NotFoundView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

function isAdminRouteName(name) {
  return typeof name === "string" && name.startsWith("admin-");
}

router.beforeEach(async (to) => {
  if (!isAdminRouteName(to.name)) {
    return true;
  }

  if (to.name === "admin-login") {
    return true;
  }

  try {
    await fetchAdminMe();
    return true;
  } catch (_error) {
    return {
      name: "admin-login",
      query: { redirect: to.fullPath },
    };
  }
});

const SITE_NAME = "Koberce MAX";
const DEFAULT_SITE_URL = "https://www.kobercemax.sk";
const ENV_SITE_URL = cleanText(process.env.VUE_APP_SITE_URL || "").replace(/\/+$/, "");
const COMPANY_EMAIL = "kobercemax@kobercemax.sk";
const COMPANY_PHONE = "+421444323884";
const COMPANY_STREET = "Plavisko 7";
const COMPANY_CITY = "Ruzomberok";
const COMPANY_POSTAL_CODE = "034 01";
const COMPANY_COUNTRY = "SK";
const FACEBOOK_URL = "https://www.facebook.com/kobercemax";
const INSTAGRAM_URL = "https://www.instagram.com/kobercemax";
const DEFAULT_DESCRIPTION =
  "Predaj a montáž podláh, kobercov, dverí a interiérových riešení. Koberce MAX - návrh, dodanie a realizácia na jednom mieste.";

function cleanText(value = "") {
  return value.toString().replace(/\s+/g, " ").trim();
}

function getProductFromRoute(to) {
  const items = productsData.products || [];
  const bySlug = items.find((item) => item.slug === to.params.slug);
  if (bySlug) return bySlug;
  return items.find((item) => String(item.id) === String(to.params.id)) || null;
}

function getRealizationFromRoute(to) {
  const items = realizationsData.realizations || [];
  return items.find((item) => String(item.id) === String(to.params.id)) || null;
}

function buildSeoMeta(to) {
  switch (to.name) {
    case "home":
      return {
        title: "Podlahy a koberce od návrhu po montáž",
        description:
          "Vyberte si parkety, vinyl, koberce aj dvere na jednom mieste. Zabezpečíme návrh, zameranie, prípravu podkladu aj profesionálnu montáž.",
      };
    case "about":
      return {
        title: "O nás - tím, ktorý rieši podlahy kompletne",
        description:
          "Spoznajte Koberce MAX: skúsený tím, ktorý navrhuje a realizuje podlahy, koberce, dvere a interiérové riešenia pre domácnosti aj firmy.",
      };
    case "products":
      return {
        title: "Produkty a materiály pre každý interiér",
        description:
          "Objavte kompletnú ponuku: parkety, vinyl, plávajúce podlahy, koberce, dvere, akustické panely aj montážne riešenia.",
      };
    case "product-detail": {
      const product = getProductFromRoute(to);
      if (!product) {
        return {
          title: "Produkt - detail ponuky",
          description:
            "Detail produktu nebol nájdený. Pozrite si kompletnú ponuku podláh, kobercov a doplnkov.",
        };
      }

      return {
        title: `${cleanText(product.title || "Produkt")} - predaj a montáž`,
        description: cleanText(product.description || product.hero?.description || DEFAULT_DESCRIPTION),
      };
    }
    case "realizations":
      return {
        title: "Realizácie podláh a kobercov z praxe",
        description:
          "Pozrite si reálne ukážky dokončených realizácií: podlahy, schody, koberce aj komerčné priestory.",
      };
    case "realization-detail": {
      const realization = getRealizationFromRoute(to);
      if (!realization) {
        return {
          title: "Detail realizácie - fotogaléria",
          description: "Realizácia nebola nájdená. Pozrite si všetky dostupné realizácie.",
        };
      }

      return {
        title: `${cleanText(realization.title || "Realizácia")} - detail realizácie`,
        description: cleanText(realization.excerpt || realization.summary || DEFAULT_DESCRIPTION),
      };
    }
    case "showroom":
      return {
        title: "Showroom - porovnajte materiály naživo",
        description:
          "Navštívte náš showroom a porovnajte dekory, materiály a vzorky podláh, kobercov aj dverí priamo na mieste.",
      };
    case "contact":
      return {
        title: "Kontakt - dohodnite si meranie",
        description:
          "Ozvite sa nám a dohodnite si meranie. Radi poradíme s výberom materiálu, prípravou podkladu aj realizáciou.",
      };
    case "privacy":
      return {
        title: "Zásady ochrany súkromia a osobných údajov",
        description:
          "Informácie o spracovaní osobných údajov a pravidlách ochrany súkromia na webe Koberce MAX.",
      };
    case "cookies":
      return {
        title: "Cookies - nastavenia a pravidlá používania",
        description:
          "Prečítajte si, aké cookies používame, na aké účely ich spracúvame a ako môžete spravovať svoj súhlas.",
      };
    case "admin-login":
      return {
        title: "Admin prihlasenie",
        description: "Prihlasenie do administracie Koberce MAX.",
      };
    case "admin-realizations":
      return {
        title: "Admin realizacie",
        description: "Administracia realizacii Koberce MAX.",
      };
    case "admin-realization-create":
      return {
        title: "Admin nova realizacia",
        description: "Vytvorenie novej realizacie v administracii.",
      };
    case "admin-realization-edit":
      return {
        title: "Admin uprava realizacie",
        description: "Uprava realizacie v administracii.",
      };
    case "not-found":
      return {
        title: "Ups, túto stránku sme nenašli",
        description: "Požadovaná stránka neexistuje alebo bola presunutá.",
      };
    default:
      return {
        title: "Podlahové riešenia pre dom aj firmu",
        description: DEFAULT_DESCRIPTION,
      };
  }
}

function upsertMetaTag(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertPropertyMetaTag(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertLinkTag(rel, href) {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function isAbsoluteUrl(value = "") {
  return /^(?:https?:)?\/\//i.test(value);
}

function getCurrentOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin || "";
}

function getSiteBaseUrl() {
  if (ENV_SITE_URL) return ENV_SITE_URL;

  const origin = getCurrentOrigin();
  if (!origin) return DEFAULT_SITE_URL;

  const isLocalhost = /(?:^https?:\/\/)?(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(origin);
  if (isLocalhost) return DEFAULT_SITE_URL;

  return origin.replace(/\/+$/, "");
}

function toAbsoluteUrl(value = "") {
  const input = String(value || "").trim();
  if (!input) return "";
  const baseUrl = getSiteBaseUrl();
  if (!baseUrl) return input;

  if (isAbsoluteUrl(input)) {
    if (input.startsWith("//")) {
      const protocol = typeof window !== "undefined" ? window.location.protocol : "https:";
      return `${protocol}${input}`;
    }
    return input;
  }

  const normalized = input.startsWith("/") ? input : `/${input}`;
  return `${baseUrl}${normalized}`;
}

function normalizeSiteUrl() {
  const baseUrl = getSiteBaseUrl();
  if (!baseUrl) return "";
  return `${baseUrl}/`;
}

function getCanonicalUrl(to) {
  const path = cleanText(to?.path || "/");
  return toAbsoluteUrl(path || "/");
}

function clearJsonLd() {
  const nodes = document.querySelectorAll('script[type="application/ld+json"][data-km-jsonld]');
  nodes.forEach((node) => node.remove());
}

function injectJsonLd(items) {
  clearJsonLd();
  items.forEach((item) => {
    if (!item) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-km-jsonld", "true");
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  });
}

function buildOrganizationSchema(siteUrl) {
  if (!siteUrl) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: siteUrl,
    email: COMPANY_EMAIL,
    telephone: COMPANY_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_STREET,
      addressLocality: COMPANY_CITY,
      postalCode: COMPANY_POSTAL_CODE,
      addressCountry: COMPANY_COUNTRY,
    },
    sameAs: [FACEBOOK_URL, INSTAGRAM_URL],
  };
}

function buildWebsiteSchema(siteUrl) {
  if (!siteUrl) return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: "sk-SK",
  };
}

function buildBreadcrumbItems(to, product, realization) {
  const items = [{ name: "Domov", path: "/" }];

  switch (to.name) {
    case "about":
      items.push({ name: "O nas", path: "/o-nas" });
      break;
    case "products":
      items.push({ name: "Produkty", path: "/produkty" });
      break;
    case "product-detail":
      items.push({ name: "Produkty", path: "/produkty" });
      if (product) {
        items.push({
          name: cleanText(product.title || "Detail produktu"),
          path: to.path,
        });
      }
      break;
    case "realizations":
      items.push({ name: "Realizacie", path: "/realizacie" });
      break;
    case "realization-detail":
      items.push({ name: "Realizacie", path: "/realizacie" });
      if (realization) {
        items.push({
          name: cleanText(realization.title || "Detail realizacie"),
          path: to.path,
        });
      }
      break;
    case "showroom":
      items.push({ name: "Showroom", path: "/showroom" });
      break;
    case "contact":
      items.push({ name: "Kontakt", path: "/kontakt" });
      break;
    case "privacy":
      items.push({ name: "Zasady ochrany sukromia", path: "/zasady-ochrany-sukromia" });
      break;
    case "cookies":
      items.push({ name: "Cookies", path: "/cookies" });
      break;
    default:
      break;
  }

  return items;
}

function buildBreadcrumbSchema(to, product, realization) {
  const items = buildBreadcrumbItems(to, product, realization);
  if (items.length <= 1) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

function buildRouteSchema(to, product, realization, seo, canonicalUrl, imageUrl) {
  if (to.name === "product-detail" && product) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: cleanText(product.title || "Produkt"),
      description: cleanText(product.description || product.hero?.description || seo.description),
      image: imageUrl ? [imageUrl] : undefined,
      category: Array.isArray(product.categoryTags) ? product.categoryTags.join(", ") : undefined,
      brand: {
        "@type": "Brand",
        name: SITE_NAME,
      },
      url: canonicalUrl,
    };
  }

  if (to.name === "realization-detail" && realization) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: cleanText(realization.title || "Realizacia"),
      description: cleanText(realization.excerpt || realization.summary || seo.description),
      image: imageUrl ? [imageUrl] : undefined,
      datePublished: realization.date || undefined,
      author: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      mainEntityOfPage: canonicalUrl,
      url: canonicalUrl,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: cleanText(seo.title || ""),
    description: cleanText(seo.description || DEFAULT_DESCRIPTION),
    url: canonicalUrl,
    inLanguage: "sk-SK",
  };
}

function resolveSeoImage(to, product, realization) {
  if (to.name === "product-detail" && product?.hero?.image) {
    return toAbsoluteUrl(product.hero.image);
  }

  if (to.name === "realization-detail" && realization?.coverImage) {
    return toAbsoluteUrl(realization.coverImage);
  }

  return toAbsoluteUrl(defaultShareImage);
}

function applySeoMeta(to) {
  if (typeof document === "undefined") return;

  const product = getProductFromRoute(to);
  const realization = getRealizationFromRoute(to);
  const seo = buildSeoMeta(to);
  const title = cleanText(seo.title || "Web");
  const description = cleanText(seo.description || DEFAULT_DESCRIPTION);
  const fullTitle = `${title} | ${SITE_NAME}`;
  const robotsValue =
    to.name === "not-found" || isAdminRouteName(to.name) ? "noindex, nofollow" : "index, follow";
  const canonicalUrl = getCanonicalUrl(to);
  const seoImage = resolveSeoImage(to, product, realization);
  const ogType =
    to.name === "product-detail"
      ? "product"
      : to.name === "realization-detail"
        ? "article"
        : "website";

  document.title = fullTitle;
  upsertMetaTag("description", description);
  upsertMetaTag("robots", robotsValue);
  upsertMetaTag("twitter:card", seoImage ? "summary_large_image" : "summary");
  upsertMetaTag("twitter:title", fullTitle);
  upsertMetaTag("twitter:description", description);
  upsertMetaTag("twitter:image", seoImage);
  upsertLinkTag("canonical", canonicalUrl);
  upsertPropertyMetaTag("og:type", ogType);
  upsertPropertyMetaTag("og:url", canonicalUrl);
  upsertPropertyMetaTag("og:site_name", SITE_NAME);
  upsertPropertyMetaTag("og:title", fullTitle);
  upsertPropertyMetaTag("og:description", description);
  upsertPropertyMetaTag("og:image", seoImage);
  upsertPropertyMetaTag("og:locale", "sk_SK");

  const siteUrl = normalizeSiteUrl();
  injectJsonLd([
    buildOrganizationSchema(siteUrl),
    buildWebsiteSchema(siteUrl),
    buildRouteSchema(to, product, realization, seo, canonicalUrl, seoImage),
    buildBreadcrumbSchema(to, product, realization),
  ]);
}

router.afterEach((to) => {
  applySeoMeta(to);
  trackPageView({
    path: to.fullPath,
    title: typeof document !== "undefined" ? document.title : "",
  });
});

export default router;
