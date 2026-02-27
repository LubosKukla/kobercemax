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
import realizationsData from "@/data/realizations.json";

export default {
  name: "RealizationsPage",
  components: {
    BaseHeaderOnlyTitle,
    RealizationCard,
  },
  computed: {
    items() {
      return (realizationsData.realizations || []).map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        date: item.dateLabel || this.formatDate(item.date),
        image: item.coverImage,
      }));
    },
  },
  methods: {
    formatDate(dateValue) {
      if (!dateValue) return "";
      const parsed = new Date(dateValue);
      if (Number.isNaN(parsed.getTime())) return dateValue;
      return new Intl.DateTimeFormat("sk-SK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(parsed);
    },
  },
};
</script>
