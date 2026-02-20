<template>
  <section class="bg-white pb-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 grid gap-10 lg:grid-cols-[1fr_1.05fr] items-center">
      <div>
        <BaseSectionTitle title="NAŠA FILOZOFIA" align="left" />
        <div class="mt-6 rounded-3xl bg-light p-6 sm:p-8 text-dark border border-black/5">
          <div class="space-y-5 text-sm sm:text-base text-dark/80">
            <div>
              <p class="font-semibold text-heading">Kvalita bez kompromisov</p>
              <p>Vyberáme len overené materiály a dodávateľov.</p>
            </div>
            <div>
              <p class="font-semibold text-heading">Montáž na profesionálnej úrovni</p>
              <p>Naši podlahári pracujú čisto, precízne a spoľahlivo.</p>
            </div>
            <div>
              <p class="font-semibold text-heading">Individuálny prístup</p>
              <p>Každý priestor je iný, preto navrhujeme riešenia na mieru.</p>
            </div>
            <div>
              <p class="font-semibold text-heading">Dlhodobá spokojnosť</p>
              <p>Záleží nám na tom, aby vám podlaha slúžila roky, nie mesiace.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-3xl overflow-hidden border border-black/10 shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
        <img class="w-full h-full object-cover" :src="images.right" alt="Koberce Max detail" />
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
    };
  },
};
</script>
