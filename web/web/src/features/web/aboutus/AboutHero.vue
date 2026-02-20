<template>
  <BaseHeader :title="hero.title" :description="hero.description" :image="hero.image" />
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
          "Koberce Max – kvalitné podlahy, koberce a odborná montáž na jednom mieste.",
        image: images.hero,
      },
    };
  },
};
</script>
