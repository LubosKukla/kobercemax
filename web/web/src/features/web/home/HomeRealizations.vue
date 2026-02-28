<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseSectionTitle title="REALIZÁCIE" align="center" />
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <RealizationCard
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :title="item.title"
        :date="item.date"
        :image="item.image"
      />
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex justify-center">
      <BaseButton variant="dark" to="/realizacie">zobraziť všetky realizácie</BaseButton>
    </div>
  </section>
</template>

<script>
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";
import BaseButton from "@/components/commons/button/BaseButton.vue";
import RealizationCard from "./RealizationCard.vue";
import { resolvePublicAssetPath } from "@/utils/publicAssetPath";
import { fetchPublicRealizations } from "@/services/realizationsApi";

export default {
  name: "HomeRealizations",
  components: {
    BaseSectionTitle,
    BaseButton,
    RealizationCard,
  },
  data() {
    return {
      items: [],
    };
  },
  async created() {
    try {
      const rows = await fetchPublicRealizations();
      this.items = rows.slice(0, 4).map((item) => ({
        id: item.id,
        title: item.title,
        date: this.formatDate(item.date),
        image: resolvePublicAssetPath(item.coverImage),
      }));
    } catch (_error) {
      this.items = [];
    }
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
