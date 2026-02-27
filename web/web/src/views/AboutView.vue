<template>
  <div>
    <AboutHero />
    <AboutIntro />
    <AboutPhilosophy />
    <AboutServices />
    <AboutRealizations />
    <BaseCTA :title="cta.title" :text="cta.text" :actions="cta.actions" />
  </div>
</template>

<script>
import AboutHero from "@/features/web/aboutus/AboutHero.vue";
import AboutIntro from "@/features/web/aboutus/AboutIntro.vue";
import AboutPhilosophy from "@/features/web/aboutus/AboutPhilosophy.vue";
import AboutServices from "@/features/web/aboutus/AboutServices.vue";
import AboutRealizations from "@/features/web/aboutus/AboutRealizations.vue";
import BaseCTA from "@/components/commons/base/BaseCTA.vue";

export default {
  name: "AboutView",
  components: {
    AboutHero,
    AboutIntro,
    AboutPhilosophy,
    AboutServices,
    AboutRealizations,
    BaseCTA,
  },
  data() {
    return {
      cta: {
        title: "Potrebujete novú podlahu alebo koberec?",
        text: "Kontaktujte nás a radi vám pomôžeme s výberom aj realizáciou. Dohodnite si zameranie alebo nás kontaktujte v showroome.",
        actions: [
          { label: "Kontaktovať", to: "/kontakt", variant: "primary" },
          { label: "Do showroomu", to: "/showroom", variant: "dark" },
        ],
      },
    };
  },
};
</script>
