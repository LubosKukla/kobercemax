<template>
  <div :class="wrapperClass">
    <h2 class="font-display font-bold text-2xl sm:text-3xl lg:text-5xl" :class="titleClass">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-2 text-sm sm:text-base" :class="descClass">
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  name: "BaseSectionTitle",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    align: {
      type: String,
      default: "center",
      validator: (value) => ["left", "center"].includes(value),
    },
    tone: {
      type: String,
      default: "dark",
      validator: (value) => ["dark", "light"].includes(value),
    },
  },
  computed: {
    wrapperClass() {
      return this.align === "left" ? "text-left" : "text-center";
    },
    titleClass() {
      return this.tone === "light" ? "text-white" : "text-heading";
    },
    descClass() {
      return this.tone === "light" ? "text-white/70" : "text-dark/70";
    },
  },
};
</script>

