<template>
  <div class="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center" @click="emitClose">
    <button
      class="absolute left-4 sm:left-8 text-white/80 hover:text-white text-3xl"
      type="button"
      @click.stop="emitPrev"
      aria-label="Predchádzajúci obrázok"
    >
      ‹
    </button>
    <img class="max-h-[85vh] max-w-[90vw] object-contain" :src="src" :alt="alt" />
    <button
      class="absolute right-4 sm:right-8 text-white/80 hover:text-white text-3xl"
      type="button"
      @click.stop="emitNext"
      aria-label="Ďalší obrázok"
    >
      ›
    </button>
  </div>
</template>

<script>
export default {
  name: "ImageOverlay",
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "",
    },
  },
  emits: ["close", "next", "prev"],
  methods: {
    emitClose() {
      this.$emit("close");
    },
    emitNext() {
      this.$emit("next");
    },
    emitPrev() {
      this.$emit("prev");
    },
    onKeydown(event) {
      if (event.key === "Escape") {
        this.emitClose();
      } else if (event.key === "ArrowRight") {
        this.emitNext();
      } else if (event.key === "ArrowLeft") {
        this.emitPrev();
      }
    },
  },
  mounted() {
    window.addEventListener("keydown", this.onKeydown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeydown);
  },
};
</script>
