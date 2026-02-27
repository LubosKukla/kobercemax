<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="rounded-3xl bg-light p-8 sm:p-10 border border-black/5 text-center">
        <h2 class="font-display font-bold text-2xl sm:text-3xl text-heading">
          {{ title }}
        </h2>
        <p v-if="text" class="mt-3 text-sm sm:text-base text-dark/70">
          {{ text }}
        </p>
        <div v-if="actions?.length" class="mt-6 flex flex-wrap justify-center gap-3">
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
  </section>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";

export default {
  name: "CTA",
  components: {
    BaseButton,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
