<template>
  <section class="relative min-h-130 sm:min-h-155 lg:min-h-180">
    <div
      class="absolute inset-0 bg-center bg-cover"
      :style="{ backgroundImage: `url(${heroImage})` }"
    ></div>
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-black/00"></div>

    <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-32 sm:pt-48">
      <div class="mx-auto max-w-5xl text-center font-display">
        <h1 class="text-2xl sm:text-5xl lg:text-6xl text-white! font-semibold leading-tight">
          PREDAJ A MONTÁŽ
          <br />
          PRE VAŠU PODLAHU A INTERIÉR
        </h1>
        <p class="mt-4 text-sm md:text-base text-white font-sans">
          Vyberte si podlahy, dvere či 3D panely a my zariadime zvyšok – meranie, návrh, montáž. S
          nami je to jednoduché.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <BaseButton variant="primary" to="/kontakt">Dohodnite si meranie</BaseButton>
          <BaseButton variant="glass" to="/produkty">Ponúkame</BaseButton>
        </div>
      </div>
    </div>

    <div class="relative z-10 mx-auto px-4 sm:px-6 pb-10">
      <div class="mt-12 flex justify-end">
        <ShowroomCard />
      </div>
    </div>
  </section>
</template>

<script>
import heroImage from "@/assets/img/hero-background.jpg";
import ShowroomCard from "./ShowroomCard.vue";
import BaseButton from "@/components/commons/button/BaseButton.vue";

export default {
  name: "HomeHero",
  components: {
    ShowroomCard,
    BaseButton,
  },
  data() {
    return {
      heroImage,
    };
  },
};
</script>

