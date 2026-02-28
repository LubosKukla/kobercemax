<template>
  <div>
    <BaseHeader
      :title="headerTitle"
      :description="headerDescription"
      :image="headerImage"
      :actions="headerActions"
      title-size="compact"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          v-if="realization"
          class="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8 lg:gap-10 items-start"
        >
          <article
            class="rounded-2xl border border-black/10 bg-light p-6 sm:p-8"
          >
            <h2
              class="font-display font-light text-2xl sm:text-3xl text-heading"
            >
              Detail realizacie
            </h2>

            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="tag in displayTags"
                :key="tag"
                class="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-dark/80"
              >
                {{ tag }}
              </span>
            </div>

            <p class="mt-4 text-sm text-dark/60">
              Galeria: {{ galleryCountLabel }}
            </p>

            <p class="mt-5 text-base leading-relaxed text-dark/75">
              {{ detailText }}
            </p>

            <div class="mt-7 flex flex-wrap gap-3">
              <BaseButton to="/realizacie" variant="darkSolid"
                >Spat na realizacie</BaseButton
              >
              <BaseButton to="/kontakt" variant="primary"
                >Kontaktujte nas</BaseButton
              >
            </div>
          </article>

          <div
            class="rounded-2xl border border-black/10 bg-white p-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          >
            <img
              class="w-full rounded-xl object-cover max-h-[560px]"
              :src="headerImage"
              :alt="realization.title"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div
          v-else
          class="rounded-2xl border border-black/10 bg-light p-8 text-center"
        >
          <h2 class="font-display text-2xl font-semibold text-heading">
            Realizacia nebola najdena
          </h2>
          <p class="mt-3 text-dark/70">
            Pozadovany zaznam sa nenasiel. Skuste zoznam realizacii.
          </p>
          <div class="mt-6">
            <BaseButton to="/realizacie" variant="darkSolid"
              >Zobrazit realizacie</BaseButton
            >
          </div>
        </div>
      </div>
    </section>

    <BaseDeferredSection
      v-if="realization && galleryImages.length"
      wrapper-class="bg-white pb-16 min-h-[420px]"
    >
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <BaseSectionTitle title="GALERIA REALIZACIE" align="left" />

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="(img, index) in galleryImages"
            :key="img"
            type="button"
            class="group overflow-hidden rounded-2xl border border-black/10 bg-light"
            @click="open(index)"
          >
            <img
              class="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              :src="img"
              :alt="`${realization.title} - ${index + 1}`"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </div>
    </BaseDeferredSection>

    <!-- <section
      v-if="realization && relatedProducts.length"
      class="bg-white pb-16"
    >
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <BaseSectionTitle title="SÚVISIACE PRODUKTY" align="left" />

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <article
            v-for="item in relatedProducts"
            :key="`related-product-${item.id}`"
            class="rounded-2xl border border-black/10 bg-light p-5"
          >
            <h3 class="font-display text-xl font-semibold text-heading">
              {{ item.title }}
            </h3>
            <p class="mt-2 text-sm sm:text-base text-dark/75 leading-relaxed">
              {{ item.description }}
            </p>
            <div class="mt-4">
              <BaseButton :to="item.to" variant="darkSolid"
                >Pozrieť detail produktu</BaseButton
              >
            </div>
          </article>
        </div>
      </div>
    </section> -->

    <BaseCTA
      v-if="realization"
      title="Mate podobny projekt?"
      text="Radi vam poradime s vyberom materialov, pripravou podkladu aj kompletnou montazou."
      :actions="ctaActions"
    />

    <ImageOverlay
      v-if="isOpen && realization && galleryImages.length"
      :src="galleryImages[currentIndex]"
      :alt="`${realization.title} - ${currentIndex + 1}`"
      @close="close"
      @next="next"
      @prev="prev"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import BaseDeferredSection from "@/components/commons/base/BaseDeferredSection.vue";
import BaseHeader from "@/components/commons/section/BaseHeader.vue";
import BaseSectionTitle from "@/components/commons/section/BaseSectionTitle.vue";
import BaseButton from "@/components/commons/button/BaseButton.vue";
import BaseCTA from "@/components/commons/base/BaseCTA.vue";
import productsData from "@/data/products.json";
import realizationsData from "@/data/realizations.json";
import fallbackCover from "@/assets/img/realization/podlahy.png";
import { resolvePublicAssetPath } from "@/utils/publicAssetPath";

const ImageOverlay = defineAsyncComponent(() =>
  import("@/components/commons/overlay/ImageOverlay.vue"),
);

export default {
  name: "RealizationDetailPage",
  components: {
    BaseDeferredSection,
    BaseHeader,
    BaseSectionTitle,
    BaseButton,
    BaseCTA,
    ImageOverlay,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
      currentIndex: 0,
    };
  },
  computed: {
    realization() {
      const items = realizationsData.realizations || [];
      return items.find((item) => String(item.id) === String(this.id)) || null;
    },
    headerTitle() {
      return this.realization?.title || "REALIZACIA";
    },
    headerDescription() {
      if (!this.realization) return "";
      return this.realization.excerpt || "Fotodokumentacia realizacie.";
    },
    headerImage() {
      return (
        resolvePublicAssetPath(this.realization?.coverImage) || fallbackCover
      );
    },
    headerActions() {
      return [
        { label: "Spat na realizacie", variant: "primary", to: "/realizacie" },
        { label: "Kontaktujte nas", variant: "glass", to: "/kontakt" },
      ];
    },
    galleryImages() {
      if (!this.realization) return [];
      if (
        Array.isArray(this.realization.gallery) &&
        this.realization.gallery.length
      ) {
        return this.realization.gallery.map((img) =>
          resolvePublicAssetPath(img),
        );
      }
      return this.realization.coverImage
        ? [resolvePublicAssetPath(this.realization.coverImage)]
        : [];
    },
    formattedDate() {
      if (!this.realization) return "";
      if (this.realization.dateLabel) return this.realization.dateLabel;
      return this.formatDate(this.realization.date);
    },
    detailText() {
      if (!this.realization) return "";
      return (
        this.realization.summary ||
        "K tejto realizacii postupne doplnime podrobnejsi technicky popis, pouzite materialy a priebeh montaze."
      );
    },
    galleryCountLabel() {
      const count = this.galleryImages.length;
      return `${count} ${
        count === 1 ? "fotka" : count >= 2 && count <= 4 ? "fotky" : "fotiek"
      }`;
    },
    displayTags() {
      if (!this.realization) return [];
      const tags = Array.isArray(this.realization.tags)
        ? [...this.realization.tags]
        : [];
      if (!tags.includes(this.formattedDate) && this.formattedDate) {
        tags.push(this.formattedDate);
      }
      return tags;
    },
    ctaActions() {
      return [
        { label: "Dohodnite si meranie", variant: "primary", to: "/kontakt" },
        { label: "Pozriet v showroome", variant: "dark", to: "/showroom" },
      ];
    },
    relatedProducts() {
      if (!this.realization) return [];

      const realizationTags = (this.realization.tags || []).map((tag) =>
        this.normalizeText(tag),
      );
      if (!realizationTags.length) return [];

      return (productsData.products || [])
        .filter((product) => {
          const productTags = [
            ...(Array.isArray(product.categoryTags)
              ? product.categoryTags
              : []),
            product.title,
            product.slug,
          ].map((value) => this.normalizeText(value));

          return productTags.some((tag) => realizationTags.includes(tag));
        })
        .slice(0, 4)
        .map((product) => ({
          id: product.id,
          title: product.title,
          description:
            product.description ||
            "Detail produktu doplnime coskoro. Radi vam poradime s vhodnym riesenim.",
          to: `/produkty/${product.id}/${product.slug}`,
        }));
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
    open(index) {
      this.currentIndex = index;
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.galleryImages.length;
    },
    prev() {
      this.currentIndex =
        (this.currentIndex - 1 + this.galleryImages.length) %
        this.galleryImages.length;
    },
  },
};
</script>
