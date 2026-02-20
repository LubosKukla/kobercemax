<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseSectionTitle title="GALÉRIA" />
    </div>

    <div class="mx-auto mt-8 grid grid-cols-1 md:grid-cols-3">
      <div v-for="(img, i) in images" :key="img" class="overflow-hidden">
        <img
          class="w-full object-cover cursor-pointer max-h-96"
          :src="img"
          :alt="`Showroom ${i + 1}`"
          @click="open(i)"
        />
      </div>
    </div>

    <ImageOverlay
      v-if="isOpen"
      :src="images[currentIndex]"
      :alt="`Showroom ${currentIndex + 1}`"
      @close="close"
      @next="next"
      @prev="prev"
    />
  </section>
</template>

<script>
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";
import ImageOverlay from "@/components/commons/overlay/ImageOverlay.vue";

export default {
  name: "ShowroomGallery",
  components: {
    BaseSectionTitle,
    ImageOverlay,
  },
  data() {
    return {
      images: [
        require("@/assets/img/showroom-gallery/1.png"),
        require("@/assets/img/showroom-gallery/2.png"),
        require("@/assets/img/showroom-gallery/3.png"),
      ],
      isOpen: false,
      currentIndex: 0,
    };
  },
  methods: {
    open(index) {
      this.currentIndex = index;
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
  },
};
</script>

