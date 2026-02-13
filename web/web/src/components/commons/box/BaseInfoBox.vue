<template>
  <div class="rounded-2xl p-6 flex flex-col min-h-40" :class="boxClass">
    <h3 class="text-lg font-semibold" :class="titleClass">{{ title }}</h3>
    <p class="mt-2 text-sm" :class="descClass">
      {{ description }}
    </p>
    <div v-if="to" class="mt-auto">
      <BaseButton class="p-0!" variant="link" :to="to" :class="linkClass" icon="arrow-right">
        zobraziť viac
      </BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";

export default {
  name: "BaseInfoBox",
  components: {
    BaseButton,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      default: "",
    },
    tone: {
      type: String,
      default: "light",
      validator: (value) => ["light", "dark"].includes(value),
    },
  },
  computed: {
    boxClass() {
      return this.tone === "dark"
        ? "bg-dark text-white border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
        : "bg-light text-dark border border-black/5 shadow-[0_10px_20px_rgba(0,0,0,0.06)]";
    },
    titleClass() {
      return this.tone === "dark" ? "text-white" : "text-dark";
    },
    descClass() {
      return this.tone === "dark" ? "text-white/70" : "text-dark/70";
    },
    linkClass() {
      return this.tone === "dark" ? "text-white/80 hover:text-white" : "";
    },
  },
};
</script>

