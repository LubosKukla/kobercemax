<template>
  <section :class="sectionClass">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-8">
      <BaseSectionTitle
        title="PRODUKTY"
        :description="description"
        :tone="theme === 'dark' ? 'light' : 'dark'"
        align="center"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :id="product.id"
        :slug="product.slug"
        :title="product.title"
        :image="product.image"
      />
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex justify-center">
      <BaseButton variant="dark" to="/produkty">Zobraziť všetky produkty</BaseButton>
    </div>
  </section>
</template>

<script>
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";
import BaseButton from "@/components/commons/button/BaseButton.vue";
import ProductCard from "./ProductCard.vue";

const images = {
  parkety: require("@/assets/img/products/parkety.jpg"),
  plavajuce: require("@/assets/img/products/plavajucePodlahy.jpg"),
  dlazby: require("@/assets/img/products/dlazby.jpg"),
  terasy: require("@/assets/img/products/terasoveDosky.jpg"),
  koberce: require("@/assets/img/products/koberce.jpg"),
  dvere: require("@/assets/img/products/dvere.jpg"),
};

export default {
  name: "HomeProducts",
  components: {
    BaseSectionTitle,
    BaseButton,
    ProductCard,
  },
  props: {
    theme: {
      type: String,
      default: "light",
      validator: (value) => ["light", "dark"].includes(value),
    },
  },
  data() {
    return {
      description: "Vyberte si z kategórií, ktoré pre vás vieme dodať a realizovať.",
      products: [
        { id: 1, slug: "parkety", title: "PARKETY", image: images.parkety },
        {
          id: 2,
          slug: "plavajuce-podlahy",
          title: "PLÁVAJÚCE\nPODLAHY",
          image: images.plavajuce,
        },
        { id: 3, slug: "dlazby", title: "DLAŽBY", image: images.dlazby },
        {
          id: 4,
          slug: "terasove-dosky",
          title: "TERASOVÉ\nDOSKY",
          image: images.terasy,
        },
        { id: 5, slug: "koberce", title: "KOBERCE", image: images.koberce },
        { id: 6, slug: "dvere", title: "DVERE", image: images.dvere },
      ],
    };
  },
  computed: {
    sectionClass() {
      return this.theme === "dark" ? "bg-dark text-white" : "bg-white text-dark";
    },
  },
};
</script>