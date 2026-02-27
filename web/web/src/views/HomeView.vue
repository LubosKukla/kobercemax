<template>
  <div>
    <HomeHero />
    <HomeStats />
    <BaseDeferredSection wrapper-class="min-h-[420px]">
      <HomePartners />
    </BaseDeferredSection>
    <HomeProducts />
    <HomeServices />
    <HomeCta />
    <BaseDeferredSection wrapper-class="min-h-[420px]">
      <HomeRealizations />
    </BaseDeferredSection>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import BaseDeferredSection from "@/components/commons/base/BaseDeferredSection.vue";
import HomeHero from "@/features/web/home/HomeHero.vue";
import HomeStats from "@/features/web/home/HomeStats.vue";
import HomeProducts from "@/features/web/home/HomeProducts.vue";
import HomeServices from "@/features/web/home/HomeServices.vue";
import HomeCta from "@/features/web/home/HomeCta.vue";

const HomePartners = defineAsyncComponent(() => import("@/features/web/home/HomePartners.vue"));
const HomeRealizations = defineAsyncComponent(() =>
  import("@/features/web/home/HomeRealizations.vue")
);

export default {
  name: "HomeView",
  components: {
    BaseDeferredSection,
    HomeHero,
    HomeStats,
    HomePartners,
    HomeProducts,
    HomeServices,
    HomeRealizations,
    HomeCta,
  },
};
</script>
