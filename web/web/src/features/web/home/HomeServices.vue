<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="text-2xl text-dark/90">Služby</div>
      <BaseSectionTitle
        title="KOMPLETNÉ RIEŠENIA PRE PODLAHY A INTERIÉR"
        align="left"
      />

      <div class="mt-6 flex flex-wrap gap-2">
        <CategoryChip
          v-for="chip in chips"
          :key="chip"
          :label="chip"
          :active="activeChip === chip"
          @click="setChip(chip)"
        />
      </div>
    </div>

    <div
      class="mx-auto max-w-6xl px-4 sm:px-6 mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <BaseInfoBox
        v-for="service in filteredServices"
        :key="service.id"
        :title="service.title"
        :description="service.description"
        :to="service.to"
        tone="light"
      />
    </div>
  </section>
</template>

<script>
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";
import CategoryChip from "@/components/commons/category/CategoryChip.vue";
import BaseInfoBox from "@/components/commons/box/BaseInfoBox.vue";

export default {
  name: "HomeServices",
  components: {
    BaseSectionTitle,
    CategoryChip,
    BaseInfoBox,
  },
  data() {
    return {
      chips: ["Všetko", "Podlahy", "Koberce", "Montáž", "Dvere", "Panely", "Doplnky", "Návrh"],
      activeChip: "Všetko",
      services: [
        {
          id: 1,
          title: "Predaj a montáž kobercov",
          description:
            "Bytové aj komerčné koberce, kusové riešenia, behúne a profesionálna pokládka od zamerania po finálne detaily.",
          categories: ["Montáž", "Koberce"],
          to: "/produkty/5/koberce",
        },
        {
          id: 2,
          title: "Koberce na mieru",
          description:
            "Výroba kobercov s vlastným dizajnom, výberom vlákna, farby a rozmeru vrátane obšívania.",
          categories: ["Koberce", "Návrh"],
          to: "/produkty/12/koberce-na-mieru",
        },
        {
          id: 3,
          title: "Vinyl, laminát a kompozity",
          description:
            "Lepené aj plávajúce systémy pre domácnosti a firmy vrátane podložiek a kompletného príslušenstva.",
          categories: ["Podlahy"],
          to: "/produkty/7/vinylove-podlahy",
        },
        {
          id: 4,
          title: "PVC podlahy (bytové aj komerčné)",
          description:
            "Odolné riešenie pre domácnosti, prevádzky aj priestory s vyššou záťažou.",
          categories: ["Podlahy"],
          to: "/produkty/13/pvc-podlahy",
        },
        {
          id: 5,
          title: "Drevené a terasové podlahy",
          description:
            "Masívne aj viacvrstvové drevené podlahy a realizácia terás s dôrazom na detail a životnosť.",
          categories: ["Podlahy"],
          to: "/produkty/4/terasove-dosky",
        },
        {
          id: 6,
          title: "Športové podlahy a záťažové priestory",
          description:
            "Riešenia pre fitká, sklady, garáže a športové prevádzky s vysokou odolnosťou.",
          categories: ["Podlahy", "Doplnky"],
          to: "/produkty/19/podlahy-pre-fitka-a-sklady",
        },
        {
          id: 7,
          title: "Umelé trávy",
          description:
            "Bezúdržbové riešenia pre záhrady, terasy aj oddychové zóny s prirodzeným vzhľadom.",
          categories: ["Doplnky"],
          to: "/produkty/17/umele-travy",
        },
        {
          id: 8,
          title: "Rohože a vstupné čistiace zóny",
          description:
            "Interiérové aj exteriérové rohože vrátane komerčných vstupných zón na mieru.",
          categories: ["Doplnky"],
          to: "/produkty/9/rohoze-vstupne-zony",
        },
        {
          id: 9,
          title: "Lišty, podložky a podlahárska chémia",
          description:
            "Prechodové, soklové aj kobercové lišty, podložky pod podlahy a profesionálna chémia.",
          categories: ["Doplnky"],
          to: "/produkty/14/listy-a-podlozky",
        },
        {
          id: 10,
          title: "Montáž a realizácia",
          description:
            "Montáž kobercov, lepeného vinylu, schodov aj kompletných podlahových systémov.",
          categories: ["Montáž", "Podlahy"],
          to: "/produkty/11/montaz-realizacia",
        },
        {
          id: 11,
          title: "Akustické a obkladové panely",
          description:
            "Panely značiek MEO a Modee pre lepšiu akustiku a moderný vzhľad interiéru.",
          categories: ["Panely", "Doplnky"],
          to: "/produkty/10/akusticke-panely",
        },
        {
          id: 12,
          title: "Dvere, puzdrá a kľučky",
          description:
            "Interiérové, vchodové aj exteriérové dvere, dverové puzdrá (Eclisse) a doplnky s montážou.",
          categories: ["Dvere"],
          to: "/produkty/20/dverove-systemy-a-klucky",
        },
        {
          id: 13,
          title: "Príprava podkladu a návrh interiéru",
          description:
            "Nivelizácia, brúsenie, penetrovanie a konzultácie s architektmi a dizajnérmi.",
          categories: ["Montáž", "Návrh"],
          to: "/produkty/21/priprava-podkladu",
        },
      ],
    };
  },
  computed: {
    filteredServices() {
      if (this.activeChip === "Všetko") return this.services;
      return this.services.filter((s) => s.categories.includes(this.activeChip));
    },
  },
  methods: {
    setChip(chip) {
      this.activeChip = chip;
    },
  },
};
</script>
