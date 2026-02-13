<template>
  <div>
    <HomeHero />
    <HomePartners />
    <HomeProducts />
    <HomeServices />
  </div>
</template>

<script>
import HomeHero from "@/features/web/home/HomeHero.vue";
import HomePartners from "@/features/web/home/HomePartners.vue";
import HomeProducts from "@/features/web/home/HomeProducts.vue";
import HomeServices from "@/features/web/home/HomeServices.vue";

export default {
  name: "HomeView",
  components: {
    HomeHero,
    HomePartners,
    HomeProducts,
    HomeServices,
  },
};
</script>
