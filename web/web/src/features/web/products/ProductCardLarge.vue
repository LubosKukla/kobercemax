<template>
  <router-link
    :to="productLink"
    class="group relative block overflow-hidden rounded-none h-[260px] sm:h-[340px] md:h-[420px] lg:h-[520px]"
  >
    <img
      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      :src="image"
      :alt="title"
    />
    <div class="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40"></div>
    <div class="absolute inset-0 flex flex-col items-center text-center p-4">
      <div class="flex-1 flex items-center justify-center">
        <div
          class="text-3xl sm:text-4xl md:text-5xl font-bold font-display leading-tight whitespace-pre-line"
          :class="titleClass"
        >
          {{ title }}
        </div>
      </div>
      <div class="pb-6">
        <BaseButton variant="soft">Zobraziť viac</BaseButton>
      </div>
    </div>
  </router-link>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";

export default {
  name: "ProductCardLarge",
  components: {
    BaseButton,
  },
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
    image: {
      type: String,
      required: true,
    },
  },
  computed: {
    productLink() {
      return `/produkty/${this.id}/${this.slug}`;
    },
    titleClass() {
      return this.title.toLowerCase().includes("koberce") ? "text-black" : "text-white";
    },
  },
};
</script>
