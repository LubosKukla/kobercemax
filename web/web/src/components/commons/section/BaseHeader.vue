<template>
  <section
    class="flex items-center relative overflow-hidden min-h-[420px] sm:min-h-[520px] lg:min-h-[600px]"
  >
    <div
      class="absolute inset-0 bg-center bg-cover"
      :style="{ backgroundImage: `url(${image})` }"
    ></div>
    <div class="absolute inset-0 bg-black/55"></div>

    <div class="relative z-10 h-full w-full">
      <div
        class="mx-auto max-w-6xl px-4 sm:px-6 h-max flex items-center justify-center text-center"
      >
        <div class="max-w-3xl">
          <h1 class="font-display font-bold text-4xl sm:text-8xl lg:text-9xl text-white!">
            {{ title }}
          </h1>
          <p v-if="description" class="mt-4 text-base sm:text-lg text-white">
            {{ description }}
          </p>
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
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";

export default {
  name: "BaseHeader",
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
      default: "",
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
