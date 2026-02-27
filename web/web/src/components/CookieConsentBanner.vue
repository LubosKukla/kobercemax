<template>
  <transition name="cookie-fade">
    <div
      v-if="isVisible"
      class="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-6 sm:pb-6 pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div
        class="mx-auto w-full max-w-5xl rounded-2xl border border-black/10 bg-white shadow-[0_16px_36px_rgba(0,0,0,0.1)] p-4 sm:p-6 pointer-events-auto"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-2 max-w-3xl">
            <h2 id="cookie-consent-title" class="text-heading text-xl sm:text-2xl font-semibold">
              Súhlas s analytickými cookies
            </h2>
            <p class="text-dark/80 text-sm sm:text-base leading-relaxed">
              Na meranie návštevnosti používame Google Analytics. Dáta sa začnú odosielať až po
              vašom potvrdení súhlasu.
            </p>
            <p class="text-dark/70 text-sm">
              Viac informácií nájdete v
              <router-link class="underline underline-offset-2 hover:text-brand" to="/cookies"
                >zásadách cookies</router-link
              >
              a
              <router-link
                class="underline underline-offset-2 hover:text-brand"
                to="/zasady-ochrany-sukromia"
                >zásadách ochrany súkromia</router-link
              >.
            </p>
          </div>

          <div class="flex flex-col items-start gap-2 sm:gap-3 lg:items-end">
            <div class="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium border border-black/10 text-heading hover:bg-light/30 transition-colors"
                @click="acceptNecessaryOnly"
              >
                Len nevyhnutné
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium bg-brand text-white hover:bg-brand/90 transition-colors"
                @click="acceptAnalytics"
              >
                Súhlasím
              </button>
            </div>
            <a
              href="#cookie-consent-reject"
              class="text-sm text-dark/70 underline underline-offset-2 hover:text-brand"
              @click.prevent="acceptNecessaryOnly"
            >
              Nesúhlasím
            </a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { initGoogleAnalytics } from "@/services/analytics";
import { getCookieConsent, setCookieConsent } from "@/services/cookieConsent";

export default {
  name: "CookieConsentBanner",
  data() {
    return {
      isVisible: false,
    };
  },
  mounted() {
    const consent = getCookieConsent();

    if (!consent) {
      this.isVisible = true;
      return;
    }

    if (consent.analytics) {
      initGoogleAnalytics();
    }
  },
  methods: {
    acceptAnalytics() {
      setCookieConsent({ analytics: true });
      initGoogleAnalytics();
      this.isVisible = false;
    },
    acceptNecessaryOnly() {
      setCookieConsent({ analytics: false });
      this.isVisible = false;
    },
  },
};
</script>

<style scoped>
.cookie-fade-enter-active,
.cookie-fade-leave-active {
  transition: opacity 0.2s ease;
}

.cookie-fade-enter-from,
.cookie-fade-leave-to {
  opacity: 0;
}
</style>
