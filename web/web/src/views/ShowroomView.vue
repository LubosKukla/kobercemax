<template>
  <div>
    <BaseHeader title="SHOWROOM" :description="description" :image="image" :actions="actions" />
    <ShowroomWhy />
    <ShowroomGallery />
    <ShowroomWhatYouFind />
    <ShowroomCta />
  </div>
</template>

<script>
import BaseHeader from "@/components/commons/section/BaseHeader.vue";
import ShowroomWhy from "@/features/web/showroom/ShowroomWhy.vue";
import ShowroomGallery from "@/features/web/showroom/ShowroomGallery.vue";
import ShowroomWhatYouFind from "@/features/web/showroom/ShowroomWhatYouFind.vue";
import ShowroomCta from "@/features/web/showroom/ShowroomCta.vue";
import image from "@/assets/img/showroom-gallery/title-bg-showroom.png";

export default {
  name: "ShowroomView",
  components: {
    BaseHeader,
    ShowroomWhy,
    ShowroomGallery,
    ShowroomWhatYouFind,
    ShowroomCta,
  },
  data() {
    return {
      image,
      description:
        "Príďte si pozrieť, ohmatať a porovnať materiály, farby aj dekory vo vzorkovníku Kobercemax. Radi vám poradíme a pomôžeme vybrať riešenie presne pre váš priestor.",
      actions: [
        { label: "Zobraziť na mape", variant: "primary", href: "https://maps.google.com" },
        { label: "Zavolajte nám", variant: "glass", href: "tel:0444323884" },
      ],
    };
  },
};
</script>