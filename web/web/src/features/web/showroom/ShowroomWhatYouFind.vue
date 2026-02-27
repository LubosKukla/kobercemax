<template>
  <section class="bg-white py-16 overflow-x-hidden">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseSectionTitle title="ČO NÁJDETE V NAŠOM SHOWROOME" align="left" />
      <p class="mt-3 max-w-4xl text-sm sm:text-base text-dark/70 leading-relaxed">
        V showroome si všetko pozriete naživo, porovnáte dekory a vyberiete riešenie, ktoré bude
        fungovať vo vašom priestore aj pri reálnom používaní.
      </p>

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div class="rounded-2xl border border-black/10 p-3 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <img class="w-full h-auto rounded-xl object-cover" :src="image" alt="Showroom výber" />
        </div>

        <div class="rounded-2xl bg-light border border-black/5 p-5 sm:p-7">
          <div class="grid gap-4">
            <article
              v-for="(section, index) in sections"
              :key="`${section.title}-${index}`"
              class="rounded-xl bg-white border border-black/10 p-4 overflow-hidden"
            >
              <h3 class="text-base sm:text-lg font-semibold text-dark break-words">
                {{ section.title }}
              </h3>
              <p class="mt-2 text-sm text-dark/70 leading-relaxed break-words">
                {{ section.description }}
              </p>
              <ul v-if="section.items?.length" class="mt-3 space-y-1.5 text-sm text-dark/75">
                <li
                  v-for="(item, itemIndex) in section.items"
                  :key="`${item}-${itemIndex}`"
                  class="flex gap-2"
                >
                  <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand/80 shrink-0"></span>
                  <span class="break-words">{{ item }}</span>
                </li>
              </ul>
            </article>
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
      sections: [
        {
          title: "Podlahy pre dom aj firmu",
          description: "Porovnáte materiály, dekory aj povrchy a vyberiete správny typ pokládky.",
          items: ["vinyl, laminát, kompozit", "drevené podlahy", "PVC bytové aj komerčné"],
        },
        {
          title: "Koberce na mieru aj sériové",
          description: "Od bytových kobercov až po komerčné riešenia vrátane výroby na mieru.",
          items: ["kusové koberce a behúne", "vlastný dizajn koberca", "obšívanie kobercov"],
        },
        {
          title: "Rohože a vstupné zóny",
          description: "Funkčné riešenia pre čistotu a bezpečný vstup do domácností aj prevádzok.",
          items: ["interiérové a exteriérové rohože", "komerčné vstupné zóny na mieru"],
        },
        {
          title: "Akustické a obkladové panely",
          description: "Panely, ktoré zlepšia akustiku a zároveň dotvoria moderný interiér.",
          items: ["akustické panely MEO", "obkladové panely MEO a Modee"],
        },
        {
          title: "Dvere a dverové systémy",
          description: "Kompletné riešenie od výberu až po montáž, vrátane detailov.",
          items: ["interiérové, vchodové aj exteriérové dvere", "dverové puzdrá (napr. Eclisse)", "kľučky a kovania"],
        },
        {
          title: "Príslušenstvo a príprava podkladu",
          description: "Všetko potrebné pre kvalitnú realizáciu a dlhú životnosť podlahy.",
          items: ["podložky, lepidlá a podlahárska chémia", "prechodové, soklové a kobercové lišty", "nivelizácia, brúsenie, penetrovanie"],
        },
      ],
    };
  },
};
</script>
