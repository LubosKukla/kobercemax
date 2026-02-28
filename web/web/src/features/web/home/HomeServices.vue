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
          title: "Parkety a drevené podlahy",
          description:
            "Masívne aj viacvrstvové parkety, návrh dekoru, odborná montáž a čisté detaily ukončenia.",
          categories: ["Podlahy"],
          to: "/produkty/1/parkety",
        },
        {
          id: 2,
          title: "Plávajúce podlahy",
          description:
            "Plávajúce systémy pre byty aj firmy vrátane podložiek, líšt a profesionálnej realizácie.",
          categories: ["Podlahy"],
          to: "/produkty/2/plavajuce-podlahy",
        },
        {
          id: 3,
          title: "Vinylové podlahy",
          description:
            "Lepený aj click vinyl pre domácnosti a komerčné priestory, vrátane montáže a detailov.",
          categories: ["Podlahy"],
          to: "/produkty/7/vinylove-podlahy",
        },
        {
          id: 4,
          title: "PVC podlahy",
          description:
            "Bytové aj komerčné PVC riešenia s dôrazom na odolnosť, hygienu a jednoduchú údržbu.",
          categories: ["Podlahy"],
          to: "/produkty/13/pvc-podlahy",
        },
        {
          id: 5,
          title: "Komerčné podlahy",
          description:
            "Podlahy pre prevádzky, kancelárie a verejné priestory s vysokou záťažou a dlhou životnosťou.",
          categories: ["Podlahy"],
          to: "/produkty/8/komercne-podlahy",
        },
        {
          id: 6,
          title: "Dlažby",
          description:
            "Interiérové aj exteriérové dlažby, ktoré spájajú praktickosť, odolnosť a čistý finálny vzhľad.",
          categories: ["Podlahy"],
          to: "/produkty/3/dlazby",
        },
        {
          id: 7,
          title: "Terasové dosky",
          description:
            "Exteriérové terasové riešenia s dôrazom na stabilnú konštrukciu, bezpečný povrch a dlhú výdrž.",
          categories: ["Podlahy"],
          to: "/produkty/4/terasove-dosky",
        },
        {
          id: 8,
          title: "Koberce",
          description:
            "Bytové aj komerčné koberce, kusové riešenia, behúne a profesionálna pokládka.",
          categories: ["Koberce", "Montáž"],
          to: "/produkty/5/koberce",
        },
        {
          id: 9,
          title: "Koberce na mieru",
          description:
            "Výroba kobercov podľa rozmeru priestoru vrátane výberu materiálu, obšívania a finalizácie.",
          categories: ["Koberce", "Návrh"],
          to: "/produkty/12/koberce-na-mieru",
        },
        {
          id: 10,
          title: "Športové podlahy",
          description:
            "Povrchy pre športové priestory so správnym došľapom, bezpečnosťou a jednoduchým servisom.",
          categories: ["Podlahy"],
          to: "/produkty/18/sportove-podlahy",
        },
        {
          id: 11,
          title: "Fitká, sklady a garáže",
          description:
            "Odolné riešenia pre technicky náročné priestory s vysokou prevádzkovou záťažou.",
          categories: ["Podlahy"],
          to: "/produkty/19/podlahy-pre-fitka-a-sklady",
        },
        {
          id: 12,
          title: "Umelé trávy",
          description:
            "Bezúdržbové riešenia pre záhrady, terasy aj oddychové zóny s prirodzeným vzhľadom.",
          categories: ["Doplnky"],
          to: "/produkty/17/umele-travy",
        },
        {
          id: 13,
          title: "Rohože a vstupné čistiace zóny",
          description:
            "Interiérové aj exteriérové rohože vrátane komerčných vstupných zón na mieru.",
          categories: ["Doplnky"],
          to: "/produkty/9/rohoze-vstupne-zony",
        },
        {
          id: 14,
          title: "Lišty a podložky",
          description:
            "Prechodové, soklové aj kobercové lišty a podložky pod podlahy pre čisté ukončenie realizácie.",
          categories: ["Doplnky"],
          to: "/produkty/14/listy-a-podlozky",
        },
        {
          id: 15,
          title: "Podlahárska chémia",
          description:
            "Penetrácie, lepidlá a profesionálna chémia pre spoľahlivú montáž a dlhú životnosť podlahy.",
          categories: ["Doplnky", "Montáž"],
          to: "/produkty/15/podlaharska-chemia",
        },
        {
          id: 16,
          title: "Akustické panely",
          description:
            "Riešenia na zníženie ozveny a zlepšenie komfortu priestoru bez kompromisu v dizajne.",
          categories: ["Panely"],
          to: "/produkty/10/akusticke-panely",
        },
        {
          id: 17,
          title: "Obkladové panely",
          description:
            "Dekoratívne stenové panely, ktoré rýchlo a čisto menia vzhľad interiéru.",
          categories: ["Panely", "Doplnky"],
          to: "/produkty/16/obkladove-panely",
        },
        {
          id: 18,
          title: "Dvere",
          description:
            "Interiérové, vchodové aj exteriérové dvere s odborným zameraním a presným osadením.",
          categories: ["Dvere"],
          to: "/produkty/6/dvere",
        },
        {
          id: 19,
          title: "Dverové systémy a kľučky",
          description:
            "Posuvné systémy, puzdrá, kovanie a kľučky vrátane montáže a doladenia detailov.",
          categories: ["Dvere", "Doplnky"],
          to: "/produkty/20/dverove-systemy-a-klucky",
        },
        {
          id: 20,
          title: "Montáž a realizácia",
          description:
            "Montáž kobercov, lepeného vinylu, schodov aj kompletných podlahových systémov.",
          categories: ["Montáž", "Podlahy"],
          to: "/produkty/11/montaz-realizacia",
        },
        {
          id: 21,
          title: "Príprava podkladu",
          description:
            "Nivelizácia, brúsenie a penetrovanie ako pevný základ pre kvalitnú a trvácnu podlahu.",
          categories: ["Montáž"],
          to: "/produkty/21/priprava-podkladu",
        },
        {
          id: 22,
          title: "Návrh interiéru",
          description:
            "Spolupráca s architektmi a dizajnérmi pri návrhu funkčných a estetických riešení.",
          categories: ["Návrh"],
          to: "/produkty/22/navrh-interieru",
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
