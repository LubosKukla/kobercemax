<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseSectionTitle title="PREČO SA OPLATÍ PRÍSŤ DO SHOWROOMU?" align="left" />

      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <BaseInfoBox
          title="Vidíte rozdiel na vlastné oči"
          description="Farby, textúry a povrchové úpravy vyzerajú v skutočnosti inak než na fotkách. Showroom vám pomôže urobiť správne rozhodnutie."
          tone="light"
        />
        <BaseInfoBox
          title="Poradíme vám osobne"
          description="Naši odborníci vám odporučia vhodné materiály, typ pokládky aj riešenie, ktoré bude fungovať vo vašom priestore."
          tone="light"
        />
        <BaseInfoBox
          title="Vzorky, ktoré si môžete odniesť"
          description="Zapôžičáme vzorky podláh, kobercov aj rohoží, aby ste si ich mohli pozrieť doma pri reálnom svetle."
          tone="light"
        />
        <BaseInfoBox
          title="Inšpirácie pre každý štýl"
          description="Moderné, klasické, minimalistické aj luxusné interiéry — máme riešenia pre všetkých."
          tone="light"
        />
        <BaseInfoBox
          title="Reálne ukážky montáže a detailov"
          description="Uvidíte typy soklových líšt, prechodov, podložiek aj detaily, ktoré rozhodujú o výsledku."
          tone="light"
        />
      </div>

      <div class="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div class="text-base md:text-lg text-dark/80 leading-relaxed space-y-6">
          <p>
            V našom showroome nájdete starostlivo vybraný výber
            <strong>podláh, kobercov, rohoží a interiérových riešení</strong>, ktoré si môžete
            pozrieť, dotknúť sa ich a porovnať v reálnom svetle. Všetko, čo predávame a montujeme,
            máme k dispozícii aj fyzicky – aby ste sa mohli rozhodnúť s istotou.
          </p>
          <p>
            U nás nejde len o vzorky.
            <strong>Ide o osobný prístup, odborné poradenstvo a reálne skúsenosti</strong> z
            montáží, ktoré vám dokážu ušetriť čas, peniaze aj starosti. Či riešite jeden byt, celý
            dom alebo komerčný priestor, v showroome získate jasnú predstavu o tom, ktorý materiál
            bude fungovať presne pre vás.
          </p>
        </div>
        <div class="rounded-2xl border border-black/10 p-3 bg-white">
          <img class="w-full h-auto rounded-xl object-cover" :src="image" alt="Showroom" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";
import BaseInfoBox from "@/components/commons/box/BaseInfoBox.vue";
import image from "@/assets/img/hero-showroom.png";

export default {
  name: "ShowroomWhy",
  components: {
    BaseSectionTitle,
    BaseInfoBox,
  },
  data() {
    return {
      image,
    };
  },
};
</script>

