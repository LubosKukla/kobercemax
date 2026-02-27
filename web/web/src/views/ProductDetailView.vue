<template>
  <ProductDetailPage :id="id" :slug="slug" />
</template>

<script>
import ProductDetailPage from "@/features/web/products/ProductDetailPage.vue";

export default {
  name: "ProductDetailView",
  components: {
    ProductDetailPage,
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
