<template>
  <div>
    <ProductsPage ref="productsPageRef" />
  </div>
</template>

<script>
import ProductsPage from "@/features/web/products/ProductsPage.vue";

const PRODUCTS_SCROLL_KEY = "products:list-scroll";

export default {
  name: "ProductsView",
  components: {
    ProductsPage,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.restoreScrollAfterDetail(from);
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "product-detail") {
      const payload = {
        y: window.scrollY || 0,
        detailId: String(to.params?.id || ""),
        visibleCount: this.$refs.productsPageRef?.getVisibleCount?.() || null,
      };
      sessionStorage.setItem(PRODUCTS_SCROLL_KEY, JSON.stringify(payload));
    }
    next();
  },
  methods: {
    restoreScrollAfterDetail(fromRoute) {
      if (fromRoute?.name !== "product-detail") return;

      const raw = sessionStorage.getItem(PRODUCTS_SCROLL_KEY);
      if (!raw) return;

      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        sessionStorage.removeItem(PRODUCTS_SCROLL_KEY);
        return;
      }

      const expectedDetailId = String(fromRoute.params?.id || "");
      if (!parsed || String(parsed.detailId || "") !== expectedDetailId) {
        return;
      }

      const targetY = Number(parsed.y || 0);
      this.$refs.productsPageRef?.restoreVisibleCount?.(parsed.visibleCount);
      sessionStorage.removeItem(PRODUCTS_SCROLL_KEY);
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
      });
    },
  },
};
</script>
