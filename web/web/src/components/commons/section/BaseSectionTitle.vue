<template>
  <div :class="wrapperClass">
    <h2 class="font-display font-semibold text-3xl sm:text-4xl text-heading">{{ title }}</h2>
    <p v-if="description" class="mt-2 text-sm sm:text-base text-dark/70">
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
  },
  computed: {
    wrapperClass() {
      return this.align === "left" ? "text-left" : "text-center";
    },
  },
};
</script>

