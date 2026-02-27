<template>
  <div>
    <RealizationsPage ref="realizationsPageRef" />
  </div>
</template>

<script>
import RealizationsPage from "@/features/web/realizations/RealizationsPage.vue";

const REALIZATIONS_SCROLL_KEY = "realizations:list-scroll";

export default {
  name: "RealizationsView",
  components: {
    RealizationsPage,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.restoreScrollAfterDetail(from);
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "realization-detail") {
      const payload = {
        y: window.scrollY || 0,
        detailId: String(to.params?.id || ""),
        visibleCount: this.$refs.realizationsPageRef?.getVisibleCount?.() || null,
      };
      sessionStorage.setItem(REALIZATIONS_SCROLL_KEY, JSON.stringify(payload));
    }
    next();
  },
  methods: {
    restoreScrollAfterDetail(fromRoute) {
      if (fromRoute?.name !== "realization-detail") return;

      const raw = sessionStorage.getItem(REALIZATIONS_SCROLL_KEY);
      if (!raw) return;

      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        sessionStorage.removeItem(REALIZATIONS_SCROLL_KEY);
        return;
      }

      const expectedDetailId = String(fromRoute.params?.id || "");
      if (!parsed || String(parsed.detailId || "") !== expectedDetailId) {
        return;
      }

      const targetY = Number(parsed.y || 0);
      this.$refs.realizationsPageRef?.restoreVisibleCount?.(parsed.visibleCount);
      sessionStorage.removeItem(REALIZATIONS_SCROLL_KEY);
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
      });
    },
  },
};
</script>
