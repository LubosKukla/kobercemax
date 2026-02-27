<template>
  <BaseHeader
    :title="hero.title"
    :description="hero.description"
    :image="hero.image"
    :actions="hero.actions"
  />
</template>

<script>
import BaseHeader from "@/components/commons/section/BaseHeader.vue";

const images = {
  hero: require("@/assets/img/o-nas/hero-onas.png"),
};

export default {
  name: "AboutHero",
  components: {
    BaseHeader,
  },
  data() {
    return {
      hero: {
        title: "O NÁS",
        description:
          "Predaj, odborné poradenstvo a profesionálna montáž. Pomáhame domácnostiam aj firmám vybrať riešenie, ktoré je praktické, odolné a esteticky nadčasové.",
        image: images.hero,
        actions: [
          { label: "Kontaktujte nás", variant: "primary", href: "/kontakt" },
          { label: "Zavolajte nám", variant: "glass", href: "tel:0444323884" },
        ],
      },
    };
  },
};
</script>

