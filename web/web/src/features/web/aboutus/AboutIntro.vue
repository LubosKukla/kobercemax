<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] items-center">
      <div class="rounded-3xl overflow-hidden border border-black/10 shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
        <img class="w-full h-full object-cover" :src="images.left" alt="Showroom Koberce Max" />
      </div>
      <div class="text-dark/80 text-sm sm:text-base leading-relaxed space-y-4">
        <p class="text-heading font-semibold text-lg sm:text-xl">
          Už viac než <span class="text-heading font-bold">25 rokov</span> prinášame do
          slovenských domácností a firiem kvalitné koberce a podlahové riešenia.
        </p>
        <p>
          V našej predajni v Ružomberku nájdete široký výber – od moderných vinylových
          podláh, PVC a laminátu až po tradičné koberce a interiérové doplnky.
        </p>
        <p>
          Okrem predaja vám ponúkame aj odborné poradenstvo a kompletnú montáž, aby ste mali
          podlahu, ktorá je krásna, praktická a vydrží roky.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
const images = {
  left: require("@/assets/img/o-nas/o-nas-lavo.png"),
};

export default {
  name: "AboutIntro",
  data() {
    return {
      images,
    };
  },
};
</script>
