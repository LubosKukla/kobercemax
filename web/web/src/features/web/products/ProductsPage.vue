<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseHeaderOnlyTitle title="PRODUKTY" />
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProductCardLarge
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :slug="item.slug"
        :title="item.title"
        :image="item.image"
      />
    </div>
  </section>
</template>

<script>
import BaseHeaderOnlyTitle from "@/components/commons/section/BaseHeaderOnlyTitle.vue";
import ProductCardLarge from "@/features/web/products/ProductCardLarge.vue";

const images = {
  parkety: require("@/assets/img/products/parkety.jpg"),
  plavajuce: require("@/assets/img/products/plavajucePodlahy.jpg"),
  dlazby: require("@/assets/img/products/dlazby.jpg"),
  terasove: require("@/assets/img/products/terasoveDosky.jpg"),
  koberce: require("@/assets/img/products/koberce.jpg"),
  dvere: require("@/assets/img/products/dvere.jpg"),
  vinylove: require("@/assets/img/products/vinylovePodlahy.jpg"),
  komercne: require("@/assets/img/products/komercnePodlahy.jpg"),
  rohoze: require("@/assets/img/products/rohozeVstupneZony.jpg"),
  akusticke: require("@/assets/img/products/akustickePanelySlat.jpg"),
  montaz: require("@/assets/img/products/montazRealizacia.jpg"),
  koberceMieru: require("@/assets/img/products/koberceNaMieru.jpg"),
  pvc: require("@/assets/img/products/pvcPodlahy.jpg"),
  listyPodlozky: require("@/assets/img/products/listyAPodlozky.jpg"),
  chemia: require("@/assets/img/products/podlaharskaChemia.jpg"),
  obkladove: require("@/assets/img/products/obkladovePanely.jpg"),
  travy: require("@/assets/img/products/umeleTravy.jpg"),
  sportove: require("@/assets/img/products/sportovePodlahy.jpg"),
  fitkaSklady: require("@/assets/img/products/fitkaSkladyGaraze.jpg"),
  dveroveSystemy: require("@/assets/img/products/dveroveSystemyKlucky.jpg"),
  priprava: require("@/assets/img/products/pripravaPodkladu.jpg"),
  navrh: require("@/assets/img/products/navrhInterieruDigital.jpg"),
};

export default {
  name: "ProductsPage",
  components: {
    BaseHeaderOnlyTitle,
    ProductCardLarge,
  },
  data() {
    return {
      items: [
        {
          id: 1,
          slug: "parkety",
          title: "PARKETY",
          image: images.parkety,
        },
        {
          id: 2,
          slug: "plavajuce-podlahy",
          title: "PLÁVAJÚCE\nPODLAHY",
          image: images.plavajuce,
        },
        {
          id: 3,
          slug: "dlazby",
          title: "DLAŽBY",
          image: images.dlazby,
        },
        {
          id: 4,
          slug: "terasove-dosky",
          title: "TERASOVÉ\nDOSKY",
          image: images.terasove,
        },
        {
          id: 5,
          slug: "koberce",
          title: "KOBERCE",
          image: images.koberce,
        },
        {
          id: 6,
          slug: "dvere",
          title: "DVERE",
          image: images.dvere,
        },
        {
          id: 7,
          slug: "vinylove-podlahy",
          title: "VINYLOVÉ\nPODLAHY",
          image: images.vinylove,
        },
        {
          id: 8,
          slug: "komercne-podlahy",
          title: "KOMERČNÉ\nPODLAHY",
          image: images.komercne,
        },
        {
          id: 9,
          slug: "rohoze-vstupne-zony",
          title: "ROHOŽE A VSTUPNÉ\nZÓNY",
          image: images.rohoze,
        },
        {
          id: 10,
          slug: "akusticke-panely",
          title: "AKUSTICKÉ\nPANELY",
          image: images.akusticke,
        },
        {
          id: 11,
          slug: "montaz-realizacia",
          title: "MONTÁŽ A\nREALIZÁCIA",
          image: images.montaz,
        },
        {
          id: 12,
          slug: "koberce-na-mieru",
          title: "KOBERCE\nNA MIERU",
          image: images.koberceMieru,
        },
        {
          id: 13,
          slug: "pvc-podlahy",
          title: "PVC\nPODLAHY",
          image: images.pvc,
        },
        {
          id: 14,
          slug: "listy-a-podlozky",
          title: "LIŠTY A\nPODLOŽKY",
          image: images.listyPodlozky,
        },
        {
          id: 15,
          slug: "podlaharska-chemia",
          title: "PODLAHÁRSKA\nCHÉMIA",
          image: images.chemia,
        },
        {
          id: 16,
          slug: "obkladove-panely",
          title: "OBKLADOVÉ\nPANELY",
          image: images.obkladove,
        },
        {
          id: 17,
          slug: "umele-travy",
          title: "UMELÉ\nTRÁVY",
          image: images.travy,
        },
        {
          id: 18,
          slug: "sportove-podlahy",
          title: "ŠPORTOVÉ\nPODLAHY",
          image: images.sportove,
        },
        {
          id: 19,
          slug: "podlahy-pre-fitka-a-sklady",
          title: "FITKÁ, SKLADY\nA GARÁŽE",
          image: images.fitkaSklady,
        },
        {
          id: 20,
          slug: "dverove-systemy-a-klucky",
          title: "DVEROVÉ SYSTÉMY\nA KĽUČKY",
          image: images.dveroveSystemy,
        },
        {
          id: 21,
          slug: "priprava-podkladu",
          title: "PRÍPRAVA\nPODKLADU",
          image: images.priprava,
        },
        {
          id: 22,
          slug: "navrh-interieru",
          title: "NÁVRH\nINTERIÉRU",
          image: images.navrh,
        },
      ],
    };
  },
};
</script>
