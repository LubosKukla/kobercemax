<template>
  <section class="max-w-6xl mx-auto px-6 py-12">
    <h1 class="text-3xl mb-4">Detail realizácie</h1>
    <p>ID: {{ id }}</p>
    <p>Názov: {{ slug }}</p>
  </section>
</template>

<script>
export default {
  name: "RealizationDetailView",
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
