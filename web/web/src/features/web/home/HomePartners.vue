<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseSectionTitle
        title="NAŠI PARTNERI"
        description="Spolupracujeme s overenými značkami, aby sme vám priniesli kvalitu, ktorú očakávate."
      />

      <div
        ref="scroller"
        class="mt-10 overflow-x-auto overflow-y-hidden partners-scroll"
        @mouseenter="stopAutoScroll"
        @mouseleave="startAutoScroll"
      >
        <div class="flex gap-2 w-max">
          <a
            v-for="(partner, index) in loopPartners"
            :key="`${partner.name}-${index}`"
            class="w-[150px] shrink-0 rounded-2xl p-2 transition-transform hover:-translate-y-1"
            :href="partner.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="h-16 w-full flex items-center justify-center">
              <img
                class="max-h-14 w-auto object-contain"
                :src="partner.logo"
                :alt="partner.name"
                loading="lazy"
              />
            </div>
            <div class="mt-4 text-center">
              <!-- <div class="text-sm font-display text-heading">{{ partner.name }}</div> -->
              <div class="mt-1 text-[11px] text-black/50">{{ partner.category }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";

const logos = {
  altro: require("@/assets/img/partners/altro.jpg"),
  anticoe: require("@/assets/img/partners/anticoe.jpg"),
  arbiton: require("@/assets/img/partners/arbiton.jpg"),
  arc: require("@/assets/img/partners/arc.jpg"),
  artelit: require("@/assets/img/partners/artelit.jpg"),
  artigo: require("@/assets/img/partners/artigo.jpg"),
  associated: require("@/assets/img/partners/associated.jpg"),
  balta: require("@/assets/img/partners/balta.jpg"),
  balterio: require("@/assets/img/partners/balterio.jpg"),
  berry: require("@/assets/img/partners/berry.jpg"),
  betap: require("@/assets/img/partners/betap.jpg"),
  bohemia: require("@/assets/img/partners/bohemia.jpg"),
  bona: require("@/assets/img/partners/bona.jpg"),
  classen: require("@/assets/img/partners/classen.jpg"),
  debomat: require("@/assets/img/partners/debomat.jpg"),
  desso: require("@/assets/img/partners/desso.jpg"),
  dlh: require("@/assets/img/partners/dlh.jpg"),
  dlw: require("@/assets/img/partners/dlw.jpg"),
  dollken: require("@/assets/img/partners/dollken.jpg"),
  drshutz: require("@/assets/img/partners/drshutz.jpg"),
  edel: require("@/assets/img/partners/edel.jpg"),
  egger: require("@/assets/img/partners/egger.jpg"),
  eps: require("@/assets/img/partners/eps.jpg"),
  erkado: require("@/assets/img/partners/erkado.jpg"),
  fatra: require("@/assets/img/partners/fatra.jpg"),
  forbo: require("@/assets/img/partners/forbo.jpg"),
  fortelock: require("@/assets/img/partners/fortelock.jpg"),
  gerflor: require("@/assets/img/partners/gerflor.jpg"),
  girloon: require("@/assets/img/partners/girloon.jpg"),
  grabo: require("@/assets/img/partners/grabo.jpg"),
  infloor: require("@/assets/img/partners/infloor.jpg"),
  jacaranda: require("@/assets/img/partners/jacaranda.jpg"),
  juteks: require("@/assets/img/partners/juteks.jpg"),
  korner: require("@/assets/img/partners/korner.jpg"),
  krono: require("@/assets/img/partners/krono.jpg"),
  lalee: require("@/assets/img/partners/lalee.jpg"),
  lano: require("@/assets/img/partners/lano.jpg"),
  milliken: require("@/assets/img/partners/milliken.jpg"),
  modulyss: require("@/assets/img/partners/modulyss.jpg"),
  mp: require("@/assets/img/partners/mp.jpg"),
  object: require("@/assets/img/partners/object.jpg"),
  osta: require("@/assets/img/partners/osta.jpg"),
  parador: require("@/assets/img/partners/parador.jpg"),
  parky: require("@/assets/img/partners/parky.jpg"),
  polskone: require("@/assets/img/partners/polskone.jpg"),
  quickstep: require("@/assets/img/partners/quick-step.png"),
  setto: require("@/assets/img/partners/setto.jpg"),
  sitincz: require("@/assets/img/partners/sitincz.jpg"),
  tarkett: require("@/assets/img/partners/tarkett.jpg"),
  vddorava: require("@/assets/img/partners/vddorava.jpg"),
  vorwerk: require("@/assets/img/partners/vorwerk.jpg"),
  voster: require("@/assets/img/partners/voster.jpg"),
  woodlook: require("@/assets/img/partners/woodlook.jpg"),
};

export default {
  name: "HomePartners",
  components: {
    BaseSectionTitle,
  },
  data() {
    return {
      timer: null,
      partners: [
        {
          name: "Berry Alloc",
          url: "https://www.berryalloc.com",
          category: "Laminát, podlahy",
          logo: logos.berry,
        },
        {
          name: "Korner",
          url: "https://www.korner.eu",
          category: "Doplnkový tovar",
          logo: logos.korner,
        },
        {
          name: "Arbiton",
          url: "https://www.arbiton.com",
          category: "Doplnkový tovar",
          logo: logos.arbiton,
        },
        {
          name: "Döllken",
          url: "https://www.doellken-profiles.com",
          category: "Doplnkový tovar",
          logo: logos.dollken,
        },
        {
          name: "Bohemia Profil",
          url: "https://www.bohemiaprofil.cz",
          category: "Doplnkový tovar",
          logo: logos.bohemia,
        },
        {
          name: "EPS",
          url: "https://www.eps-system.pl",
          category: "Doplnkový tovar",
          logo: logos.eps,
        },
        {
          name: "Dr. Schutz",
          url: "https://www.dr-schutz.com",
          category: "Čistiace zóny",
          logo: logos.drshutz,
        },
        {
          name: "Bona",
          url: "https://www.bona.com",
          category: "Podlahárska chémia",
          logo: logos.bona,
        },
        {
          name: "Forbo",
          url: "https://www.forbo.com",
          category: "Čistiace zóny / linoleum",
          logo: logos.forbo,
        },
        {
          name: "Debomat",
          url: "https://www.debomat.com",
          category: "Čistiace zóny",
          logo: logos.debomat,
        },
        {
          name: "Sit-in",
          url: "https://www.sit-in.cz",
          category: "Umelé trávy / koberce",
          logo: logos.sitincz,
        },
        {
          name: "Juteks",
          url: "https://www.juteks.cz",
          category: "PVC / umelé trávy",
          logo: logos.juteks,
        },
        {
          name: "MP Kovania",
          url: "https://www.mpkovania.sk",
          category: "Kovania",
          logo: logos.mp,
        },
        {
          name: "Vorwerk",
          url: "https://www.vorwerk.com",
          category: "Vysávače",
          logo: logos.vorwerk,
        },
        {
          name: "Artelit",
          url: "https://www.artelit.it",
          category: "Podlahárska chémia",
          logo: logos.artelit,
        },
        {
          name: "Quick-Step",
          url: "https://www.quick-step.com",
          category: "Laminát / vinyl",
          logo: logos.quickstep,
        },
        {
          name: "Krono Original",
          url: "https://www.krono-original.com",
          category: "Laminát / vinyl",
          logo: logos.krono,
        },
        {
          name: "Parador",
          url: "https://www.parador.de",
          category: "Laminát / vinyl",
          logo: logos.parador,
        },
        {
          name: "objectflor",
          url: "https://www.objectflor.de",
          category: "Vinylové dielce",
          logo: logos.object,
        },
        {
          name: "Tarkett",
          url: "https://www.tarkett.com",
          category: "Vinyl / drevo / linoleum",
          logo: logos.tarkett,
        },
        {
          name: "Woodlook",
          url: "https://www.woodlook.sk",
          category: "Terasové dosky",
          logo: logos.woodlook,
        },
        {
          name: "DLH",
          url: "https://www.dlh.cz",
          category: "Drevené podlahy / terasy",
          logo: logos.dlh,
        },
        {
          name: "DLW",
          url: "https://www.dlwflooring.com",
          category: "PVC podlahy",
          logo: logos.dlw,
        },
        {
          name: "Graboplast",
          url: "https://www.graboplast.com",
          category: "Športové povrchy",
          logo: logos.grabo,
        },
        {
          name: "Gerflor",
          url: "https://www.gerflor.com",
          category: "Športové povrchy / PVC",
          logo: logos.gerflor,
        },
        {
          name: "Fortelock",
          url: "https://www.fortelock.com",
          category: "PVC podlahy",
          logo: logos.fortelock,
        },
        {
          name: "Fatra",
          url: "https://www.fatra.cz",
          category: "PVC podlahy",
          logo: logos.fatra,
        },
        {
          name: "Altro",
          url: "https://www.altro.com",
          category: "PVC podlahy",
          logo: logos.altro,
        },
        {
          name: "Balterio",
          url: "https://www.balterio.com",
          category: "Laminát, podlahy",
          logo: logos.balterio,
        },
        {
          name: "Egger",
          url: "https://www.egger.com",
          category: "Laminát, podlahy",
          logo: logos.egger,
        },
        {
          name: "Classen",
          url: "https://www.classen.com",
          category: "Laminát, podlahy",
          logo: logos.classen,
        },
        {
          name: "Lano",
          url: "https://www.lano.com",
          category: "Koberce",
          logo: logos.lano,
        },
        {
          name: "Betap",
          url: "https://www.betap.com",
          category: "Koberce",
          logo: logos.betap,
        },
        {
          name: "Lalee",
          url: "https://www.lalee.com",
          category: "Koberce",
          logo: logos.lalee,
        },
        {
          name: "Osta",
          url: "https://www.ostacarpets.com",
          category: "Koberce",
          logo: logos.osta,
        },
        {
          name: "Jacaranda",
          url: "https://www.jacarandacarpets.com",
          category: "Koberce",
          logo: logos.jacaranda,
        },
        {
          name: "Balta",
          url: "https://www.balta.be",
          category: "Koberce",
          logo: logos.balta,
        },
        {
          name: "Garloon",
          url: "https://www.girloon.de",
          category: "Koberce",
          logo: logos.girloon,
        },
        {
          name: "Infloor",
          url: "https://www.infloor.de",
          category: "Koberce",
          logo: logos.infloor,
        },
        {
          name: "Associated Weavers",
          url: "https://www.associated-weavers.com",
          category: "Koberce",
          logo: logos.associated,
        },
        {
          name: "Edel",
          url: "https://www.edelcarpets.com",
          category: "Kobercové štvorce",
          logo: logos.edel,
        },
        {
          name: "Milliken",
          url: "https://www.milliken.com",
          category: "Kobercové štvorce",
          logo: logos.milliken,
        },
        {
          name: "Modulyss",
          url: "https://www.modulyss.com",
          category: "Koberce",
          logo: logos.modulyss,
        },
        {
          name: "Parky",
          url: "https://www.parky.com",
          category: "Drevené podlahy",
          logo: logos.parky,
        },
        {
          name: "Anticoe",
          url: "https://www.anticoe.com",
          category: "Drevené podlahy",
          logo: logos.anticoe,
        },
        {
          name: "Pol-Skone",
          url: "https://www.pol-skone.pl",
          category: "Interiér, dvere",
          logo: logos.polskone,
        },
        {
          name: "Voster",
          url: "https://www.voster.pl",
          category: "Interiér, dvere",
          logo: logos.voster,
        },
        {
          name: "VDD Orava",
          url: "https://www.vddorava.sk",
          category: "Interiér, dvere",
          logo: logos.vddorava,
        },
        {
          name: "Erkado",
          url: "https://www.erkado.pl",
          category: "Interiér, dvere",
          logo: logos.erkado,
        },
        {
          name: "Setto",
          url: "https://www.setto.cz",
          category: "Interiér, dvere",
          logo: logos.setto,
        },
        {
          name: "Arc Edition",
          url: "https://www.arcedition.com",
          category: "Koberce",
          logo: logos.arc,
        },
        {
          name: "Artigo",
          url: "https://www.artigo.com",
          category: "Kaučuk",
          logo: logos.artigo,
        },
        {
          name: "Desso",
          url: "https://www.desso.com",
          category: "Kobercové štvorce",
          logo: logos.desso,
        },
      ],
    };
  },
  computed: {
    loopPartners() {
      return [...this.partners, ...this.partners];
    },
  },
  methods: {
    startAutoScroll() {
      const scroller = this.$refs.scroller;
      if (!scroller) return;
      this.timer = setInterval(() => {
        scroller.scrollLeft += 1;
        const max = scroller.scrollWidth - scroller.clientWidth;
        if (scroller.scrollLeft >= max) {
          scroller.scrollLeft = 0;
        }
      }, 20);
    },
    stopAutoScroll() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  },
  mounted() {
    this.startAutoScroll();
  },
  beforeUnmount() {
    this.stopAutoScroll();
  },
};
</script>

<style scoped>
.partners-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
}

.partners-scroll::-webkit-scrollbar {
  height: 8px;
}

.partners-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.partners-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
</style>

