<template>
  <section class="bg-white pb-8">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseSectionTitle title="ČO ROBÍME" align="left" />
      <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BaseInfoBox
          v-for="item in services"
          :key="item.title"
          :title="item.title"
          :description="item.description"
          tone="light"
        />
      </div>
    </div>
  </section>
</template>

<script>
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";
import BaseInfoBox from "@/components/commons/box/BaseInfoBox.vue";

export default {
  name: "AboutServices",
  components: {
    BaseSectionTitle,
    BaseInfoBox,
  },
  data() {
    return {
      services: [
        {
          title: "Predaj a montáž podláh",
          description:
            "Vinyl, laminát, kompozity, PVC, drevené podlahy, terasové dosky.",
        },
        {
          title: "Koberce bytové aj komerčné",
          description:
            "Kusové koberce, behúne, obšívanie a výroba kobercov na mieru.",
        },
        {
          title: "Špeciálne rohože a čistiace zóny",
          description: "Interiérové aj exteriérové, komerčné riešenia na mieru.",
        },
        {
          title: "Akustické a obkladové panely",
          description: "Moderný dizajn pre domácnosti, kancelárie aj prevádzky.",
        },
        {
          title: "Interiérové a vchodové dvere",
          description: "Dodávka, montáž, dverové púzdra a atypické riešenia.",
        },
        {
          title: "Príprava podkladu",
          description: "Nivelizácia, brúsenie, penetrácia a podlahárska chémia.",
        },
      ],
    };
  },
};
</script>
