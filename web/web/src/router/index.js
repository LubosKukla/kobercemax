import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ProductsView from "../views/ProductsView.vue";
import ProductDetailView from "../views/ProductDetailView.vue";
import RealizationsView from "../views/RealizationsView.vue";
import ShowroomView from "../views/ShowroomView.vue";
import ContactView from "../views/ContactView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import RealizationDetailView from "../views/RealizationDetailView.vue";
import PrivacyView from "../views/PrivacyView.vue";
import CookiesView from "../views/CookiesView.vue";
import productsData from "../data/products.json";
import realizationsData from "../data/realizations.json";

const routes = [
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
        path: "realizacie/:id/:slug",
        name: "realization-detail",
        component: RealizationDetailView,
        props: true,
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

const SITE_NAME = "Koberce MAX";
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
  const bySlug = items.find((item) => item.slug === to.params.slug);
  if (bySlug) return bySlug;
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

function applySeoMeta(to) {
  if (typeof document === "undefined") return;

  const seo = buildSeoMeta(to);
  const title = cleanText(seo.title || "Web");
  const description = cleanText(seo.description || DEFAULT_DESCRIPTION);
  const fullTitle = `${title} | ${SITE_NAME}`;
  const robotsValue = to.name === "not-found" ? "noindex, nofollow" : "index, follow";

  document.title = fullTitle;
  upsertMetaTag("description", description);
  upsertMetaTag("robots", robotsValue);
  upsertPropertyMetaTag("og:title", fullTitle);
  upsertPropertyMetaTag("og:description", description);
}

router.afterEach((to) => {
  applySeoMeta(to);
});

export default router;
