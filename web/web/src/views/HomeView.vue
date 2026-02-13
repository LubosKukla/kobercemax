<template>
  <div>
    <HomeHero />
    <HomePartners />
    <HomeProducts />
  </div>
</template>

<script>
import HomeHero from "@/features/web/home/HomeHero.vue";
import HomePartners from "@/features/web/home/HomePartners.vue";
import HomeProducts from "@/features/web/home/HomeProducts.vue";

export default {
  name: "HomeView",
  components: {
    HomeHero,
    HomePartners,
    HomeProducts,
  },
};
</script>
