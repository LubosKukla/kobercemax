<template>
  <section ref="rootRef" :class="wrapperClass">
    <slot v-if="isVisible" />
  </section>
</template>

<script>
export default {
  name: "BaseDeferredSection",
  props: {
    rootMargin: {
      type: String,
      default: "300px 0px",
    },
    threshold: {
      type: Number,
      default: 0.01,
    },
    wrapperClass: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isVisible: false,
      observer: null,
    };
  },
  mounted() {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      this.isVisible = true;
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        this.isVisible = true;
        this.disconnectObserver();
      },
      {
        rootMargin: this.rootMargin,
        threshold: this.threshold,
      }
    );

    if (this.$refs.rootRef) {
      this.observer.observe(this.$refs.rootRef);
    }
  },
  beforeUnmount() {
    this.disconnectObserver();
  },
  methods: {
    disconnectObserver() {
      if (!this.observer) return;
      this.observer.disconnect();
      this.observer = null;
    },
  },
};
</script>
