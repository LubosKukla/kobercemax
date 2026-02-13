<template>
  <section class="relative overflow-hidden min-h-[360px] sm:min-h-[420px] lg:min-h-[500px]">
    <div
      class="absolute inset-0 bg-bottom bg-cover"
      :style="{ backgroundImage: `url(${image})` }"
    ></div>
    <div class="absolute inset-0 bg-black/35"></div>

    <div
      class="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[500px] flex flex-col justify-center z-10 h-max m-auto max-w-6xl px-4 sm:px-6 py-24 text-center"
    >
      <h2 class="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl text-white!">
        {{ title }}
      </h2>
      <div v-if="actions.length" class="mt-6 flex flex-wrap justify-center gap-3">
        <BaseButton
          v-for="(action, index) in actions"
          :key="index"
          :variant="action.variant || 'primary'"
          :to="action.to"
          :href="action.href"
        >
          {{ action.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";

export default {
  name: "CtaBanner",
  components: {
    BaseButton,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

