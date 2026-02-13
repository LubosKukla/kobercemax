<template>
  <div>
    <HomeHero />
    <HomePartners />
  </div>
</template>

<script>
import HomeHero from "@/features/web/home/HomeHero.vue";
import HomePartners from "@/features/web/home/HomePartners.vue";

export default {
  name: "HomeView",
  components: {
    HomeHero,
    HomePartners,
  },
};
</script>
