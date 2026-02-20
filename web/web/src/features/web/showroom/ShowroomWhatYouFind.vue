<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseSectionTitle title="ČO NÁJDETE V NAŠOM SHOWROOME" align="left" />

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div class="rounded-2xl border border-black/10 p-3 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <img
            class="w-full h-auto rounded-xl object-cover"
            :src="image"
            alt="Showroom výber"
          />
        </div>

        <div class="rounded-2xl bg-light border border-black/5 p-6">
          <div class="space-y-6 text-dark/80">
            <div>
              <h3 class="text-lg font-semibold text-dark">Podlahy</h3>
              <ul class="mt-2 list-disc list-inside space-y-1 text-sm">
                <li>vinyl v rôznych prevedeniach</li>
                <li>laminát a kompozitné podlahy</li>
                <li>drevené parkety a veľkoformátové dosky</li>
                <li>PVC pre domácnosti aj komerčné priestory</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-dark">Koberce</h3>
              <ul class="mt-2 list-disc list-inside space-y-1 text-sm">
                <li>bytové koberce</li>
                <li>komerčné koberce</li>
                <li>kusové koberce a behúne</li>
                <li>výrobu kobercov na mieru</li>
                <li>profesionálne obšívanie</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-dark">Rohože a čistiace zóny</h3>
              <ul class="mt-2 list-disc list-inside space-y-1 text-sm">
                <li>interiérové aj exteriérové rohože</li>
                <li>komerčné rohože na mieru</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-dark">Akustické panely a obklady</h3>
              <ul class="mt-2 list-disc list-inside space-y-1 text-sm">
                <li>panely MEO, MODEE</li>
                <li>vzorové inštalácie</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-dark">Dvere a dizajnové prvky</h3>
              <ul class="mt-2 list-disc list-inside space-y-1 text-sm">
                <li>interiérové a vchodové dvere</li>
                <li>dverové púzdra (napr. Eclisse)</li>
                <li>kľučky a doplnky</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-dark">Podlahárska chémia a príslušenstvo</h3>
              <ul class="mt-2 list-disc list-inside space-y-1 text-sm">
                <li>podložky pod podlahy</li>
                <li>lepidlá, penetrácie, nivelizácie</li>
                <li>soklové a prechodové lišty</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";
import image from "@/assets/img/showroom-gallery/co-najdete-sekcia.png";

export default {
  name: "ShowroomWhatYouFind",
  components: {
    BaseSectionTitle,
  },
  data() {
    return {
      image,
    };
  },
};
</script>