<template>
  <RealizationDetailPage :id="id" :slug="slug" />
</template>

<script>
import RealizationDetailPage from "@/features/web/realizations/RealizationDetailPage.vue";

export default {
  name: "RealizationDetailView",
  components: {
    RealizationDetailPage,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
};
</script>
