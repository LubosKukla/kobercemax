<template>
  <section class="bg-white pb-16">
    <div
      class="mx-auto max-w-6xl px-4 sm:px-6 grid gap-10 lg:grid-cols-[1fr_1.05fr] items-center"
    >
      <div>
        <BaseSectionTitle title="PREČO KOBERCE MAX?" align="left" />
        <div
          class="mt-6 rounded-3xl bg-light p-6 sm:p-8 text-dark border border-black/5"
        >
          <div class="space-y-5 text-sm sm:text-base text-dark/80">
            <div v-for="item in items" :key="item.title">
              <p class="font-semibold text-heading">{{ item.title }}</p>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="rounded-3xl overflow-hidden border border-black/10 shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
      >
        <img
          class="w-full h-full object-cover"
          :src="images.right"
          alt="Koberce Max detail"
        />
      </div>
    </div>
  </section>
</template>

<script>
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";

const images = {
  right: require("@/assets/img/o-nas/o-nas-pravo.png"),
};

export default {
  name: "AboutPhilosophy",
  components: {
    BaseSectionTitle,
  },
  data() {
    return {
      images,
      items: [
        {
          title: "30+ rokov skúseností",
          description:
            "Každý priestor má svoje špecifiká. Vieme odporučiť riešenie podľa typu miestnosti aj záťaže.",
        },
        {
          title: "Kompletný servis",
          description:
            "Od výberu materiálu až po finálnu montáž. Nemusíte riešiť viacerých dodávateľov.",
        },
        {
          title: "Odborné poradenstvo",
          description:
            "Pomôžeme vám vybrať podlahu podľa rozpočtu, dizajnu aj praktických požiadaviek.",
        },
        {
          title: "Precízna montáž",
          description: "Naši podlahári pracujú čisto, presne a spoľahlivo.",
        },
        {
          title: "Overené materiály",
          description:
            "Spolupracujeme s overenými dodávateľmi a používame materiály vhodné pre domácnosti aj komerčné priestory.",
        },
      ],
    };
  },
};
</script>
