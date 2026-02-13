<template>
  <div class="w-[320px] sm:w-[420px] relative border border-white/20 rounded-2xl p-2">
    <div class="overflow-hidden rounded-xl">
      <img class="w-full aspect-[16/12] object-cover" :src="imageSrc" alt="Showroom" />
    </div>
    <div class="mt-3 flex items-center justify-end absolute bottom-4 right-4">
      <BaseButton variant="glass" :to="showroomLink">Showroom Ružomberok</BaseButton>
    </div>
  </div>
</template>

<script>
import showroomImage from "@/assets/img/hero-showroom.png";
import BaseButton from "@/components/commons/button/BaseButton.vue";

export default {
  name: "ShowroomCard",
  components: {
    BaseButton,
  },
  props: {
    image: {
      type: String,
      default: "",
    },
    showroomLink: {
      type: String,
      default: "/showroom",
    },
  },
  computed: {
    imageSrc() {
      return this.image || showroomImage;
    },
  },
};
</script>