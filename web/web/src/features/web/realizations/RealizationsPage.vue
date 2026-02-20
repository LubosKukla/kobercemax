<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseHeaderOnlyTitle title="REALIZÁCIE" />
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <RealizationCard
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :slug="item.slug"
        :title="item.title"
        :date="item.date"
        :image="item.image"
      />
    </div>
  </section>
</template>

<script>
import BaseHeaderOnlyTitle from "@/components/commons/section/BaseHeaderOnlyTitle.vue";
import RealizationCard from "@/features/web/home/RealizationCard.vue";

const images = {
  podlahy: require("@/assets/img/realization/podlahy.png"),
  koberec: require("@/assets/img/realization/koberec.jpg"),
  schody: require("@/assets/img/realization/schody.jpg"),
  lepeny: require("@/assets/img/realization/lepeny vinyl.png"),
};

export default {
  name: "RealizationsPage",
  components: {
    BaseHeaderOnlyTitle,
    RealizationCard,
  },
  data() {
    return {
      items: [
        {
          id: 1,
          slug: "malino-brdo-pokladka-podlahy",
          title: "Malino Brdo – pokládka podlahy",
          date: "2. februára 2025",
          image: images.podlahy,
        },
        {
          id: 2,
          slug: "realizacia-vinyl-tarkett-koberec-lano",
          title: "Realizácia vinyl Tarkett & koberec Lano",
          date: "24. februára 2025",
          image: images.koberec,
        },
        {
          id: 3,
          slug: "schody-z-vinylu-objectflor",
          title: "Schody z vinylu Objectflor",
          date: "2. februára 2025",
          image: images.schody,
        },
        {
          id: 4,
          slug: "lepeny-vinyl-expona-design",
          title: "Lepený vinyl Expona design",
          date: "24. februára 2025",
          image: images.lepeny,
        },
      ],
    };
  },
};
</script>

