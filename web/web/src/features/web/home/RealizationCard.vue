<template>
  <router-link :to="cardLink" class="group block">
    <div class="overflow-hidden">
      <img
        class="w-full h-[260px] sm:h-[480px] object-cover transition-transform duration-500 group-hover:scale-105"
        :src="image"
        :alt="title"
      />
    </div>
    <div class="mt-3 flex items-center justify-between gap-3">
      <h3 class="text-lg font-semibold text-dark leading-snug">
        {{ title }}
      </h3>
      <span class="text-xs text-dark/60 whitespace-nowrap">{{ date }}</span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "RealizationCard",
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  computed: {
    cardLink() {
      return `/realizacie/${this.id}/${this.slug}`;
    },
  },
};
</script>

