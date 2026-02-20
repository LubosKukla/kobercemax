<template>
  <CtaBanner :title="title" :image="image" :actions="actions" :logo="logo" />
</template>

<script>
import CtaBanner from "@/components/commons/section/CtaBanner.vue";
import image from "@/assets/img/showroom-gallery/cta-sekcia.png";
import logo from "@/assets/img/logo.png";

export default {
  name: "ShowroomCta",
  components: {
    CtaBanner,
  },
  data() {
    return {
      image,
      logo,
      title: "OD PODKLADU AŽ PO POSLEDNÚ LIŠTU — VŠETKO NA JEDNOM MIESTE.",
      actions: [
        { label: "Dohodnite si meranie", variant: "primary", to: "/kontakt" },
        { label: "Zavolajte nám", variant: "soft", href: "tel:0444323884" },
      ],
    };
  },
};
</script>