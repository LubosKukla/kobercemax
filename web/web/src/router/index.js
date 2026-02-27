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

export default router;
