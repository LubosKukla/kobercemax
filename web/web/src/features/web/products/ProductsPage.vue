<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseHeaderOnlyTitle title="PRODUKTY" />
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProductCardLarge
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :slug="item.slug"
        :title="item.title"
        :image="item.image"
      />
    </div>
  </section>
</template>

<script>
import BaseHeaderOnlyTitle from "@/components/commons/section/BaseHeaderOnlyTitle.vue";
import ProductCardLarge from "@/features/web/products/ProductCardLarge.vue";

const images = {
  parkety: require("@/assets/img/products/parkety.jpg"),
  plavajuce: require("@/assets/img/products/plavajucePodlahy.jpg"),
  dlazby: require("@/assets/img/products/dlazby.jpg"),
  terasove: require("@/assets/img/products/terasoveDosky.jpg"),
  koberce: require("@/assets/img/products/koberce.jpg"),
  dvere: require("@/assets/img/products/dvere.jpg"),
};

export default {
  name: "ProductsPage",
  components: {
    BaseHeaderOnlyTitle,
    ProductCardLarge,
  },
  data() {
    return {
      items: [
        {
          id: 1,
          slug: "parkety",
          title: "PARKETY",
          image: images.parkety,
        },
        {
          id: 2,
          slug: "plavajuce-podlahy",
          title: "PLÁVAJÚCE\nPODLAHY",
          image: images.plavajuce,
        },
        {
          id: 3,
          slug: "dlazby",
          title: "DLAŽBY",
          image: images.dlazby,
        },
        {
          id: 4,
          slug: "terasove-dosky",
          title: "TERASOVÉ\nDOSKY",
          image: images.terasove,
        },
        {
          id: 5,
          slug: "koberce",
          title: "KOBERCE",
          image: images.koberce,
        },
        {
          id: 6,
          slug: "dvere",
          title: "DVERE",
          image: images.dvere,
        },
      ],
    };
  },
};
</script>
