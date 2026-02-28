<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseHeaderOnlyTitle title="REALIZÁCIE" />
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <RealizationCard
        v-for="item in visibleItems"
        :key="item.id"
        :id="item.id"
        :title="item.title"
        :date="item.date"
        :image="item.image"
      />
    </div>

    <div v-if="isLoading" class="mx-auto max-w-6xl px-4 sm:px-6 mt-6 text-center text-dark/70">
      Načítavam realizácie...
    </div>
    <div
      v-if="errorMessage"
      class="mx-auto max-w-6xl px-4 sm:px-6 mt-6 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-dark"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="!isLoading && !errorMessage && !allItems.length"
      class="mx-auto max-w-6xl px-4 sm:px-6 mt-6 text-center text-dark/70"
    >
      Zatiaľ neboli zverejnené žiadne realizácie.
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 mt-8 flex justify-center">
      <BaseButton v-if="hasMore" variant="darkSolid" @click="loadMore">Načítať ďalšie realizácie</BaseButton>
    </div>

    <div v-if="hasMore" ref="sentinelRef" class="h-1 w-full"></div>
  </section>
</template>

<script>
import BaseHeaderOnlyTitle from "@/components/commons/section/BaseHeaderOnlyTitle.vue";
import BaseButton from "@/components/commons/button/BaseButton.vue";
import RealizationCard from "@/features/web/home/RealizationCard.vue";
import { resolvePublicAssetPath } from "@/utils/publicAssetPath";
import { fetchPublicRealizations } from "@/services/realizationsApi";

const INITIAL_VISIBLE_COUNT = 12;
const BATCH_SIZE = 12;

export default {
  name: "RealizationsPage",
  components: {
    BaseHeaderOnlyTitle,
    BaseButton,
    RealizationCard,
  },
  data() {
    return {
      visibleCount: INITIAL_VISIBLE_COUNT,
      allItemsData: [],
      isLoading: false,
      errorMessage: "",
      observer: null,
    };
  },
  created() {
    this.loadRealizations();
  },
  computed: {
    allItems() {
      return this.allItemsData.map((item) => ({
        id: item.id,
        title: item.title,
        date: this.formatDate(item.date),
        image: resolvePublicAssetPath(item.coverImage),
      }));
    },
    visibleItems() {
      return this.allItems.slice(0, this.visibleCount);
    },
    hasMore() {
      return this.visibleCount < this.allItems.length;
    },
  },
  mounted() {
    this.setupObserver();
    this.ensureViewportFilled();
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onScroll, { passive: true });
  },
  beforeUnmount() {
    this.disconnectObserver();
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onScroll);
  },
  methods: {
    async loadRealizations() {
      this.isLoading = true;
      this.errorMessage = "";
      try {
        this.allItemsData = await fetchPublicRealizations();
      } catch (error) {
        this.errorMessage = error?.message || "Nepodarilo sa načítať realizácie.";
        this.allItemsData = [];
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.setupObserver();
          this.ensureViewportFilled();
        });
      }
    },
    getVisibleCount() {
      return this.visibleCount;
    },
    restoreVisibleCount(count) {
      const parsed = Number(count);
      if (!Number.isFinite(parsed) || parsed <= 0) return;
      this.visibleCount = Math.max(INITIAL_VISIBLE_COUNT, parsed);
      this.$nextTick(() => {
        this.setupObserver();
        this.ensureViewportFilled();
      });
    },
    loadMore() {
      if (!this.hasMore) return;
      this.visibleCount = Math.min(this.allItems.length, this.visibleCount + BATCH_SIZE);
      this.$nextTick(() => {
        this.setupObserver();
        this.ensureViewportFilled();
      });
    },
    onScroll() {
      this.ensureViewportFilled();
    },
    ensureViewportFilled() {
      if (!this.hasMore || typeof window === "undefined") return;
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY + 280 >= doc.scrollHeight) {
        this.loadMore();
      }
    },
    setupObserver() {
      if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
      if (!this.$refs.sentinelRef) return;
      this.disconnectObserver();
      this.observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (!entry?.isIntersecting) return;
          this.loadMore();
        },
        {
          rootMargin: "320px 0px",
          threshold: 0.01,
        }
      );
      this.observer.observe(this.$refs.sentinelRef);
    },
    disconnectObserver() {
      if (!this.observer) return;
      this.observer.disconnect();
      this.observer = null;
    },
    formatDate(dateValue) {
      if (!dateValue) return "";
      const parsed = new Date(dateValue);
      if (Number.isNaN(parsed.getTime())) return dateValue;
      return new Intl.DateTimeFormat("sk-SK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(parsed);
    },
  },
};
</script>
