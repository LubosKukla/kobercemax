<template>
  <footer class="border-t border-light bg-light footer-links">
    <div class="max-w-6xl mx-auto px-6 py-10">
      <div class="grid gap-8 md:grid-cols-3 text-sm text-dark">
        <div class="space-y-1 footer-text-links">
          <a class="block" href="#">Podmienky používania</a>
          <a class="block" href="#">Podmienky ochrany súkromia</a>
          <a class="block" href="#">Pravidlá používania súborov Cookies</a>
          <a class="block" href="#">Nastavenia cookies</a>
        </div>
        <div class="space-y-1 text-heading/80">
          <p class="font-medium text-heading">KOBERCE MAX, s.r.o.</p>
          <p>Plavisko 7, 034 01 Ružomberok</p>
          <div class="pt-2">
            <p>IČO: 31636632</p>
            <p>IČ DPH: SK 2020431105</p>
          </div>
        </div>
        <div class="flex flex-col gap-4 md:items-end">
          <nav class="flex flex-wrap gap-x-6 gap-y-2 text-sm footer-text-links">
            <router-link to="/o-nas">O nás</router-link>
            <router-link to="/produkty">Produkty</router-link>
            <router-link to="/sluzby">Služby</router-link>
            <router-link to="/realizacie">Realizácie</router-link>
            <router-link to="/showroom">Showroom</router-link>
            <router-link to="/kontakt">Kontakt</router-link>
          </nav>
          <div class="inline-flex items-center gap-2 rounded-full bg-light px-3 py-2">
            <a
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-heading transition-all duration-200 hover:bg-brand hover:text-white"
              href="https://www.facebook.com/kobercemax"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <font-awesome-icon :icon="['fab', 'facebook-f']" />
            </a>
            <a
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-heading transition-all duration-200 hover:bg-brand hover:text-white"
              href="https://www.instagram.com/kobercemax"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <font-awesome-icon :icon="['fab', 'instagram']" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-light">
      <div class="max-w-6xl mx-auto px-6">
        <img
          class="w-full h-auto"
          src="@/assets/img/footer-logo.png"
          alt="Koberce Max"
        >
      </div>
    </div>
    <AuthorFooter />
  </footer>
</template>

<script>
import AuthorFooter from "./AuthorFooter.vue";

export default {
  name: "AppFooter",
  components: {
    AuthorFooter,
  },
};
</script>