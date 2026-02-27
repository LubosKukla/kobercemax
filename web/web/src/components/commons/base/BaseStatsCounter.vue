<template>
  <section ref="sectionRef" class="pt-14">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div
        class="rounded-3xl px-6 py-8 sm:px-10 sm:py-10"
        :class="containerClass"
      >
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="(item, index) in normalizedItems"
            :key="`${item.label}-${index}`"
            class="text-center xl:text-left"
            :class="itemClass(index)"
          >
            <p
              class="font-display text-5xl sm:text-6xl font-bold leading-none"
              :class="valueClass"
            >
              {{ formattedValue(displayValues[index], item) }}
            </p>
            <p
              class="mt-3 text-lg font-semibold leading-tight"
              :class="labelClass"
            >
              {{ item.label }}
            </p>
            <p v-if="item.text" class="mt-1 text-sm" :class="textClass">
              {{ item.text }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "BaseStatsCounter",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    duration: {
      type: Number,
      default: 1400,
    },
    once: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: "dark",
      validator: (value) => ["light", "dark"].includes(value),
    },
  },
  data() {
    return {
      displayValues: [],
      hasAnimated: false,
      observer: null,
      rafIds: [],
    };
  },
  computed: {
    normalizedItems() {
      return this.items
        .map((item) => ({
          value: Number(item.value) || 0,
          label: item.label || "",
          text: item.text || "",
          prefix: item.prefix || "",
          suffix: item.suffix || "",
          decimals: Number.isInteger(item.decimals) ? item.decimals : 0,
        }))
        .filter((item) => item.label);
    },
    isDark() {
      return this.theme === "dark";
    },
    containerClass() {
      return this.isDark
        ? "border border-white/10 bg-dark"
        : "border border-black/10 bg-light";
    },
    valueClass() {
      return this.isDark ? "text-white" : "text-heading";
    },
    labelClass() {
      return this.isDark ? "text-white" : "text-heading";
    },
    textClass() {
      return this.isDark ? "text-white/75" : "text-dark/70";
    },
  },
  watch: {
    normalizedItems: {
      immediate: true,
      handler(items) {
        this.displayValues = items.map(() => 0);
        this.hasAnimated = false;
      },
    },
  },
  mounted() {
    if (!this.normalizedItems.length) return;

    if (!("IntersectionObserver" in window)) {
      this.startAnimation();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersect(entries),
      {
        threshold: 0.25,
      },
    );

    if (this.$refs.sectionRef) {
      this.observer.observe(this.$refs.sectionRef);
    }
  },
  beforeUnmount() {
    this.disconnectObserver();
    this.cancelAnimations();
  },
  methods: {
    handleIntersect(entries) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        this.startAnimation();
        if (this.once) {
          this.disconnectObserver();
        }
      });
    },
    startAnimation() {
      if (this.hasAnimated && this.once) return;
      this.hasAnimated = true;
      this.cancelAnimations();

      this.normalizedItems.forEach((item, index) => {
        const startTime = performance.now();
        const target = item.value;
        const animate = (now) => {
          const progress = Math.min((now - startTime) / this.duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          this.displayValues[index] = target * eased;

          if (progress < 1) {
            this.rafIds[index] = requestAnimationFrame(animate);
          } else {
            this.displayValues[index] = target;
          }
        };

        this.rafIds[index] = requestAnimationFrame(animate);
      });
    },
    cancelAnimations() {
      this.rafIds.forEach((id) => cancelAnimationFrame(id));
      this.rafIds = [];
    },
    disconnectObserver() {
      if (!this.observer) return;
      this.observer.disconnect();
      this.observer = null;
    },
    itemClass(index) {
      if (index === 0) return "";
      return this.isDark
        ? "xl:border-l xl:border-white/20 xl:pl-6"
        : "xl:border-l xl:border-brand/30 xl:pl-6";
    },
    formattedValue(value, item) {
      const decimals = item.decimals || 0;
      const safeValue = Number(value) || 0;
      const formatted = safeValue.toLocaleString("sk-SK", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: false,
      });
      return `${item.prefix}${formatted}${item.suffix}`;
    },
  },
};
</script>
