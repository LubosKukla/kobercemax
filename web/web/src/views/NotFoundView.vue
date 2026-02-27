<template>
  <section class="bg-white py-16 sm:py-24">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="rounded-3xl border border-black/10 bg-light p-8 sm:p-12 text-center">
        <p class="font-display text-sm tracking-[0.2em] text-dark/60">CHYBA 404</p>
        <h1 class="mt-3 font-display text-4xl sm:text-5xl font-bold text-heading">Ups, stránka ušla</h1>
        <p class="mt-5 text-base sm:text-lg text-dark/80 max-w-2xl mx-auto">
          Vaša stránka sa nestihla vyrolovať ako kvalitný koberec.
        </p>
        <p class="mt-2 text-sm sm:text-base text-dark/70 max-w-2xl mx-auto">
          Pravdepodobne sa niekde zasekla na hrane lišty. Skúste sa vrátiť na hlavnú stránku alebo zájsť do showroomu.
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <BaseButton to="/" variant="darkSolid">Späť na domov</BaseButton>
          <BaseButton to="/showroom" variant="primary">Do showroomu</BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";

export default {
  name: "NotFoundView",
  components: {
    BaseButton,
  },
};
</script>
