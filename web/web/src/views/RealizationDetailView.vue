<template>
  <RealizationDetailPage :id="id" />
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
  },
};
</script>
