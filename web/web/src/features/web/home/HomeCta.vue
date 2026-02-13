<template>
  <CtaBanner :title="title" :image="image" :actions="actions" />
</template>

<script>
import CtaBanner from "@/components/commons/section/CtaBanner.vue";
import ctaImage from "@/assets/img/homepage-bg-CTA.jpg";

export default {
  name: "HomeCta",
  components: {
    CtaBanner,
  },
  data() {
    return {
      title: "OD PODKLADU AŽ PO POSLEDNÚ LIŠTU — VŠETKO NA JEDNOM MIESTE.",
      image: ctaImage,
      actions: [
        { label: "Dohodnite si meranie", variant: "primary", to: "/kontakt" },
        { label: "Zavolajte nám", variant: "glass", to: "/kontakt" },
      ],
    };
  },
};
</script>
