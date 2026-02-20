<template>
  <div
    class="relative flex flex-col lg:flex-row justify-evenly my-12 min-h-[520px] sm:min-h-[600px] lg:min-h-[620px] w-full border border-black/10 shadow-[0_16px_36px_rgba(0,0,0,0.1)]"
  >
    <img
      class="absolute inset-0 h-full w-full object-cover object-bottom"
      :src="image"
      alt="Kontakt CTA"
    />
    <div class="absolute inset-0 bg-black/35"></div>
    <div class="relative z-10 -my-12 px-4 sm:px-6 lg:px-0">
      <ContactForm />
    </div>

    <div
      class="relative z-10 flex min-h-[520px] sm:min-h-[600px] lg:min-h-[620px] items-center justify-center text-center px-6"
    >
      <div class="flex flex-col items-center justify-center w-full max-w-lg lg:max-w-none lg:w-[35vw]">
        <h3
          class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white! leading-tight"
        >
          OD PODKLADU AŽ PO POSLEDNÚ LIŠTU — VŠETKO NA JEDNOM MIESTE.
        </h3>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <BaseButton variant="primary" to="/kontakt">Dohodnite si meranie</BaseButton>
          <BaseButton variant="soft" href="tel:+421444323884">Zavolajte nám</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";
import ContactForm from "./ContactForm.vue";

const image = require("@/assets/img/homepage-bg-CTA.jpg");

export default {
  name: "ContactCtaImage",
  components: {
    BaseButton,
    ContactForm,
  },
  data() {
    return {
      image,
    };
  },
};
</script>
