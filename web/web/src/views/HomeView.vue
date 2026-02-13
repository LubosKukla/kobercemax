<template>
  <div>
    <HomeHero />
    <HomePartners />
    <HomeProducts />
    <HomeServices />
    <HomeCta />
    <HomeRealizations />
  </div>
</template>

<script>
import HomeHero from "@/features/web/home/HomeHero.vue";
import HomePartners from "@/features/web/home/HomePartners.vue";
import HomeProducts from "@/features/web/home/HomeProducts.vue";
import HomeServices from "@/features/web/home/HomeServices.vue";
import HomeRealizations from "@/features/web/home/HomeRealizations.vue";
import HomeCta from "@/features/web/home/HomeCta.vue";

export default {
  name: "HomeView",
  components: {
    HomeHero,
    HomePartners,
    HomeProducts,
    HomeServices,
    HomeRealizations,
    HomeCta,
  },
};
</script>

