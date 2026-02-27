<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
    <CookieConsentBanner />
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import CookieConsentBanner from "../components/CookieConsentBanner.vue";

export default {
  name: "MainLayout",
  components: {
    AppHeader,
    AppFooter,
    CookieConsentBanner,
  },
};
</script>
