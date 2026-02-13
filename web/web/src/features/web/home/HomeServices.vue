<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="text-2xl text-dark/90">Služby</div>
      <BaseSectionTitle
        title="VYLEPŠITE SVOJ PRIESTOR S PROFESIONÁLNYMI PODLAHOVÝMI SLUŽBAMI A MNOHO INÉHO"
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
      chips: ["Všetko", "Montáž", "Podlahy", "Koberce", "Interiér", "Exteriér", "Doplnky"],
      activeChip: "Všetko",
      services: [
        {
          id: 1,
          title: "Predaj a Montáž Kobercov",
          description:
            "Kompletná starostlivosť o koberce – od výberu až po profesionálnu pokládku.\nPonúkame bytové, komerčné, kusové koberce aj behúne s precíznym obšívaním a možnosťou výroby na mieru.",
          categories: ["Montáž", "Koberce"],
          to: "/produkty/5/koberce",
        },
        {
          id: 2,
          title: "Koberce na Mieru",
          description:
            "Výroba koberca presne podľa vašich potrieb.\nLuxusné, dizajnové aj praktické riešenia so slobodou vo výbere farby, rozmeru, vzoru a typu vlákna.",
          categories: ["Koberce", "Interiér"],
          to: "/produkty/5/koberce",
        },
        {
          id: 3,
          title: "PVC Podlahy (Bytové & Komerčné)",
          description:
            "Odolné riešenia pre domácnosti aj prevádzky s vysokou záťažou.\nMontáž, úprava podkladu a široký výber PVC v moderných dekoroch.",
          categories: ["Podlahy", "Interiér"],
          to: "/produkty/2/plavajuce-podlahy",
        },
        {
          id: 4,
          title: "Vinyl, Laminát & Kompozitné Podlahy",
          description:
            "Moderné podlahy pre každý typ interiéru.\nLepený vinyl, klik systém, laminát a kompozity vrátane podložiek a kompletného príslušenstva.",
          categories: ["Podlahy", "Interiér"],
          to: "/produkty/2/plavajuce-podlahy",
        },
        {
          id: 5,
          title: "Drevené a Terasové Podlahy",
          description:
            "Prírodná elegancia a dlhodobá odolnosť.\nMontáž interiérových drevených podláh aj exteriérových terás podľa najvyšších štandardov.",
          categories: ["Podlahy", "Exteriér"],
          to: "/produkty/4/terasove-dosky",
        },
        {
          id: 6,
          title: "Umelé Trávy & Športové Povrchy",
          description:
            "Bezúdržbové riešenia pre záhrady aj športoviská.\nVýber a montáž umelých tráv, povrchov pre fitness, sklady, garáže a ďalšie prevádzky.",
          categories: ["Exteriér", "Doplnky"],
          to: "/produkty/4/terasove-dosky",
        },
        {
          id: 7,
          title: "Rohože & Čistiace Zóny",
          description:
            "Komerčné aj bytové rohože na mieru.\nInteriérové aj exteriérové rohože, presne vyrobené pre vstupné priestory.",
          categories: ["Doplnky"],
          to: "/produkty/3/dlazby",
        },
        {
          id: 8,
          title: "Soklové, Prechodové a Kobercové Lišty",
          description:
            "Perfektné zakončenie každej podlahy.\nŠiroký výber líšt vrátane profesionálnej montáže.",
          categories: ["Doplnky"],
          to: "/produkty/5/koberce",
        },
        {
          id: 9,
          title: "Montáž Schodov, Vinylu a Kobercov",
          description:
            "Precízna montáž na akékoľvek schodisko alebo podklad.\nLepený vinyl, celoplošné lepenie kobercov aj zakrytie schodových hrán.",
          categories: ["Montáž", "Podlahy"],
          to: "/produkty/2/plavajuce-podlahy",
        },
        {
          id: 10,
          title: "Akustické & Obkladové Panely MEO / Modee",
          description:
            "Moderný dizajn so zvukovou absorpciou.\nMontáž akustických panelov a dekoratívnych obkladov pre domy, kancelárie aj štúdiá.",
          categories: ["Interiér", "Doplnky"],
          to: "/produkty/2/plavajuce-podlahy",
        },
        {
          id: 11,
          title: "Interiérové & Vchodové Dvere",
          description:
            "Dvere, ktoré dotvoria váš domov.\nInteriérové a bezpečnostné vchodové dvere, aj výroba na mieru + montáž vrátane dverových púzdier Eclisse.",
          categories: ["Interiér"],
          to: "/produkty/6/dvere",
        },
        {
          id: 12,
          title: "Návrh Interiéru",
          description:
            "Profesionálny návrh od architektov a dizajnérov.\nKompletné návrhy interiérov, ladenie farieb, materiálov a optimálneho riešenia priestoru.",
          categories: ["Interiér"],
          to: "/produkty/6/dvere",
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
