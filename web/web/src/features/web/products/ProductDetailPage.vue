<template>
  <div>
    <BaseHeader
      :title="headerTitle"
      :description="headerDescription"
      :image="headerImage"
      :actions="headerActions"
      title-size="compact"
    />

    <section v-if="!product" class="bg-white py-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="rounded-2xl border border-black/10 bg-light p-8 text-center">
          <h2 class="font-display text-2xl font-semibold text-heading">Produkt nebol nájdený</h2>
          <p class="mt-3 text-dark/70">Skúste sa vrátiť do zoznamu produktov.</p>
          <div class="mt-6">
            <BaseButton to="/produkty" variant="darkSolid">Späť na produkty</BaseButton>
          </div>
        </div>
      </div>
    </section>

    <template v-else>
      <section v-if="!hasDetailContent" class="bg-white py-16">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="rounded-2xl border border-black/10 bg-light p-8 text-center">
            <h2 class="font-display text-2xl font-semibold text-heading">Detail produktu pripravujeme</h2>
            <p class="mt-3 text-dark/70">
              Obsah pre tento produkt doplníme čoskoro. Medzitým nás môžete kontaktovať pre cenovú ponuku alebo
              konzultáciu.
            </p>
            <div class="mt-6 flex flex-wrap justify-center gap-3">
              <BaseButton to="/kontakt" variant="primary">Kontaktujte nás</BaseButton>
              <BaseButton to="/produkty" variant="darkSolid">Späť na produkty</BaseButton>
            </div>
          </div>
        </div>
      </section>

      <section v-if="product.intro" class="bg-white py-16">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <article class="rounded-2xl border border-black/10 bg-light p-6 sm:p-8">
            <p
              v-for="(paragraph, index) in product.intro.paragraphs"
              :key="`${product.slug}-intro-${index}`"
              class="text-base sm:text-lg leading-relaxed text-dark/80"
              :class="{ 'mt-5': index > 0 }"
            >
              {{ paragraph }}
            </p>
          </article>

          <div class="rounded-2xl border border-black/10 bg-white p-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <img
              class="w-full rounded-xl object-cover max-h-[520px]"
              :src="product.intro.image"
              :alt="`${product.title} - úvod`"
            />
          </div>
        </div>
      </section>

      <section v-if="product.benefits?.items?.length" class="bg-white pb-16">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <BaseSectionTitle :title="product.benefits.title" align="left" />

          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <article
              v-for="(benefit, index) in product.benefits.items"
              :key="`${product.slug}-benefit-${index}`"
              class="rounded-2xl border border-black/10 bg-light p-5"
            >
              <h3 class="font-display text-xl font-semibold text-heading">
                {{ benefit.title }}
              </h3>
              <p class="mt-2 text-sm sm:text-base text-dark/75 leading-relaxed">
                {{ benefit.description }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="product.gallery?.images?.length" class="bg-light py-16">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <BaseSectionTitle :title="product.gallery.title" align="left" />

          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
            <article
              v-for="(image, index) in product.gallery.images"
              :key="`${product.slug}-gallery-${index}`"
              class="overflow-hidden rounded-2xl border border-black/10 bg-white"
            >
              <img
                class="h-56 sm:h-64 md:h-72 w-full object-cover"
                :src="image"
                :alt="`${product.title} - galéria ${index + 1}`"
              />
            </article>
          </div>
        </div>
      </section>

      <section v-if="product.installation" class="bg-white py-16">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-10 lg:items-stretch">
          <div class="h-full rounded-2xl border border-black/10 bg-white p-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <img
              class="h-full min-h-[320px] w-full rounded-xl object-cover"
              :src="product.installation.image"
              :alt="`${product.title} - montáž`"
            />
          </div>

          <article class="h-full rounded-2xl border border-black/10 bg-light p-6 sm:p-8">
            <h2 class="font-display font-semibold text-3xl sm:text-4xl text-heading">
              {{ product.installation.title }}
            </h2>

            <div class="mt-6 space-y-6">
              <div
                v-for="(step, index) in product.installation.steps"
                :key="`${product.slug}-step-${index}`"
              >
                <h3 class="font-display text-2xl font-semibold text-heading">
                  {{ index + 1 }}. {{ step.title }}
                </h3>
                <p class="mt-2 text-base sm:text-lg leading-relaxed text-dark/80">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section v-if="product.cta" class="bg-white">
        <div class="relative overflow-hidden min-h-[360px] sm:min-h-[420px] lg:min-h-[500px]">
          <div
            class="absolute inset-0 bg-bottom bg-cover"
            :style="{ backgroundImage: `url(${product.cta.image})` }"
          ></div>
          <div class="absolute inset-0 bg-black/35"></div>

          <div
            class="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[500px] z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 flex flex-col items-center justify-center text-center"
          >
            <h2 class="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl text-white!">
              {{ product.cta.title }}
            </h2>
            <p v-if="product.cta.text" class="mt-4 max-w-3xl text-base sm:text-lg text-white/90">
              {{ product.cta.text }}
            </p>
            <div v-if="product.cta.actions?.length" class="mt-6 flex flex-wrap justify-center gap-3">
              <BaseButton
                v-for="(action, index) in product.cta.actions"
                :key="`${product.slug}-cta-action-${index}`"
                :variant="action.variant || 'primary'"
                :to="action.to"
                :href="action.href"
              >
                {{ action.label }}
              </BaseButton>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white py-16">
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <BaseSectionTitle :title="relatedTitle" align="left" />

          <div v-if="relatedRealizations.length" class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <RealizationCard
              v-for="item in relatedRealizations"
              :key="item.id"
              :id="item.id"
              :slug="item.slug"
              :title="item.title"
              :date="item.dateLabel || formatDate(item.date)"
              :image="item.coverImage"
            />
          </div>

          <div v-else class="mt-8 rounded-2xl border border-black/10 bg-light p-8 text-center">
            <p class="text-base sm:text-lg text-dark/75">
              {{ relatedEmptyText }}
            </p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import BaseHeader from "@/components/commons/section/BaseHeader.vue";
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";
import BaseButton from "@/components/commons/button/BaseButton.vue";
import RealizationCard from "@/features/web/home/RealizationCard.vue";
import productsData from "@/data/products.json";
import realizationsData from "@/data/realizations.json";

export default {
  name: "ProductDetailPage",
  components: {
    BaseHeader,
    BaseSectionTitle,
    BaseButton,
    RealizationCard,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  computed: {
    product() {
      const items = productsData.products || [];
      const bySlug = items.find((item) => item.slug === this.slug);
      if (bySlug) return bySlug;
      return items.find((item) => String(item.id) === String(this.id)) || null;
    },
    headerTitle() {
      return this.product?.hero?.title || this.product?.title || "PRODUKT";
    },
    headerDescription() {
      return this.product?.hero?.description || this.product?.description || "";
    },
    headerImage() {
      return this.product?.hero?.image || "/img/products/parkety/hero.jpg";
    },
    headerActions() {
      return this.product?.hero?.actions || [];
    },
    relatedTitle() {
      return this.product?.relatedRealizations?.title || "SÚVISIACE REALIZÁCIE";
    },
    relatedEmptyText() {
      return (
        this.product?.relatedRealizations?.emptyText ||
        "Zatiaľ neboli zverejnené žiadne realizácie tohto produktu."
      );
    },
    relatedRealizations() {
      if (!this.product) return [];

      const normalizedTags = (this.product.relatedRealizations?.tags || []).map((tag) =>
        this.normalizeText(tag)
      );
      if (!normalizedTags.length) return [];

      return (realizationsData.realizations || [])
        .filter((item) => {
          const itemTags = (item.tags || []).map((tag) => this.normalizeText(tag));
          return normalizedTags.some((tag) => itemTags.includes(tag));
        })
        .slice(0, 6);
    },
    hasDetailContent() {
      if (!this.product) return false;
      return Boolean(
        this.product.intro ||
          this.product.benefits?.items?.length ||
          this.product.gallery?.images?.length ||
          this.product.installation ||
          this.product.cta
      );
    },
  },
  methods: {
    normalizeText(value) {
      return (value || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    },
    formatDate(dateValue) {
      if (!dateValue) return "";
      const parsed = new Date(dateValue);
      if (Number.isNaN(parsed.getTime())) return dateValue;
      return new Intl.DateTimeFormat("sk-SK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(parsed);
    },
  },
};
</script>
