<template>
  <div>
    <AboutHero />
    <AboutIntro />
    <AboutPhilosophy />
    <AboutServices />
    <AboutRealizations />
  </div>
</template>

<script>
import AboutHero from "@/features/web/aboutus/AboutHero.vue";
import AboutIntro from "@/features/web/aboutus/AboutIntro.vue";
import AboutPhilosophy from "@/features/web/aboutus/AboutPhilosophy.vue";
import AboutServices from "@/features/web/aboutus/AboutServices.vue";
import AboutRealizations from "@/features/web/aboutus/AboutRealizations.vue";

export default {
  name: "AboutView",
  components: {
    AboutHero,
    AboutIntro,
    AboutPhilosophy,
    AboutServices,
    AboutRealizations,
  },
};
</script>
