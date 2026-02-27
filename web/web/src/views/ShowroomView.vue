<template>
  <div>
    <BaseHeader title="SHOWROOM" :description="description" :image="image" :actions="actions" />
    <ShowroomWhy />
    <BaseDeferredSection wrapper-class="min-h-[460px]">
      <ShowroomGallery />
    </BaseDeferredSection>
    <BaseDeferredSection wrapper-class="min-h-[460px]">
      <ShowroomWhatYouFind />
    </BaseDeferredSection>
    <ShowroomCta />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import BaseHeader from "@/components/commons/section/BaseHeader.vue";
import BaseDeferredSection from "@/components/commons/base/BaseDeferredSection.vue";
import ShowroomWhy from "@/features/web/showroom/ShowroomWhy.vue";
import image from "@/assets/img/showroom-gallery/title-bg-showroom.png";

const ShowroomGallery = defineAsyncComponent(() =>
  import("@/features/web/showroom/ShowroomGallery.vue")
);
const ShowroomWhatYouFind = defineAsyncComponent(() =>
  import("@/features/web/showroom/ShowroomWhatYouFind.vue")
);
const ShowroomCta = defineAsyncComponent(() => import("@/features/web/showroom/ShowroomCta.vue"));

export default {
  name: "ShowroomView",
  components: {
    BaseHeader,
    BaseDeferredSection,
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
