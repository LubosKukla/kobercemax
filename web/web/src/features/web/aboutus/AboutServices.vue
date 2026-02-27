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
          title: "Koberce na mieru aj sériové riešenia",
          description:
            "Bytové, komerčné, kusové, behúne aj výroba kobercov na mieru s vlastným dizajnom. Zabezpečujeme aj obšívanie kobercov.",
        },
        {
          title: "Vinyl, PVC a laminátové podlahy",
          description:
            "Kompozitné, lepené aj plávajúce systémy pre domácnosti aj komerčné priestory. Dodanie aj odborná montáž.",
        },
        {
          title: "Drevené a terasové podlahy",
          description:
            "Masívne aj viacvrstvové drevené podlahy vrátane realizácie terás.",
        },
        {
          title: "Športové a záťažové podlahy",
          description:
            "Podlahy pre fitká, sklady, garáže aj športové priestory s vysokou odolnosťou.",
        },
        {
          title: "Rohože a vstupné čistiace zóny",
          description:
            "Exteriérové aj interiérové rohože vrátane výroby komerčných vstupných zón na mieru.",
        },
        {
          title: "Akustické a obkladové panely",
          description:
            "Panely značiek MEO a Modee pre zlepšenie akustiky a moderný dizajn interiéru.",
        },
        {
          title: "Dvere a dverové systémy",
          description:
            "Interiérové, vchodové aj exteriérové dvere, dverové puzdrá (napr. Eclisse), kľučky a montáž.",
        },
        {
          title: "Lišty, podložky a podlahárska chémia",
          description:
            "Prechodové, soklové a kobercové lišty, podložky pod podlahy a profesionálna podlahárska chémia.",
        },
        {
          title: "Príprava podkladu",
          description:
            "Nivelizácia, brúsenie, penetrovanie a kompletná príprava povrchu pre kvalitnú montáž.",
        },
        {
          title: "Montáž a realizácia",
          description:
            "Montáž kobercov, lepeného vinylu, schodov aj kompletných podlahových systémov.",
        },
        {
          title: "Návrh interiéru",
          description:
            "Spolupracujeme s architektmi a dizajnérmi na návrhu funkčných a estetických riešení.",
        },
      ],
    };
  },
};
</script>
