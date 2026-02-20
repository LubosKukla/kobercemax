<template>
  <header class="absolute top-0 left-0 right-0 z-50">
    <div
      class="mx-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-[max-content,1fr,max-content] items-center gap-4"
    >
      <router-link class="shrink-0 justify-self-start col-start-1 row-start-1 my-auto" to="/">
        <img
          class="h-auto w-lg max-w-4/5 md:max-w-xs lg:max-w-48 xl:max-w-3xs"
          src="@/assets/img/logo.png"
          alt="Koberce Max"
        />
      </router-link>

      <nav
        class="max-w-min hidden lg:flex justify-self-end col-start-2 row-start-1 items-center justify-center gap-2 lg:gap-2 xl:gap-5 px-4 xl:px-5 py-1.5 rounded-full text-sm font-normal font-display shadow-[0_10px_30px_rgba(0,0,0,0.08)] border backdrop-blur-md min-[1240px]:absolute min-[1240px]:left-1/2 min-[1240px]:-translate-x-1/2"
        :class="navClass"
      >
        <router-link :active-class="activeClass" :class="linkClass" to="/o-nas">O nás</router-link>
        <router-link :active-class="activeClass" :class="linkClass" to="/produkty"
          >Produkty</router-link
        >
        <router-link :active-class="activeClass" :class="linkClass" to="/realizacie"
          >Realizácie</router-link
        >
        <router-link :active-class="activeClass" :class="linkClass" to="/showroom"
          >Showroom</router-link
        >
        <router-link :active-class="activeClass" :class="linkClass" to="/kontakt"
          >Kontakt</router-link
        >
      </nav>

      <div class="flex items-center gap-2 justify-self-end col-start-3 row-start-1">
        <div
          class="hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border backdrop-blur-md"
          :class="socialClass"
        >
          <a
            class="inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:bg-brand hover:text-white"
            :class="iconBaseClass"
            href="https://www.facebook.com/kobercemax"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <font-awesome-icon :icon="['fab', 'facebook-f']" />
          </a>
          <a
            class="inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:bg-brand hover:text-white"
            :class="iconBaseClass"
            href="https://www.instagram.com/kobercemax"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <font-awesome-icon :icon="['fab', 'instagram']" />
          </a>
        </div>

        <button
          class="lg:hidden inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"
          :class="socialClass"
          type="button"
          @click="toggleMenu"
          aria-label="Menu"
        >
          <font-awesome-icon :icon="['fas', isMenuOpen ? 'xmark' : 'bars']" />
        </button>
      </div>
    </div>

    <div v-if="isMenuOpen" class="lg:hidden px-4 sm:px-6">
      <div
        class="mt-2 rounded-2xl px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border backdrop-blur-md"
        :class="navClass"
      >
        <nav class="grid gap-2 text-sm font-medium">
          <router-link
            class="px-3 py-2 rounded-full"
            :active-class="activeClass"
            :class="linkClass"
            to="/o-nas"
            @click="closeMenu"
            >O nás</router-link
          >
          <router-link
            class="px-3 py-2 rounded-full"
            :active-class="activeClass"
            :class="linkClass"
            to="/produkty"
            @click="closeMenu"
            >Produkty</router-link
          >
          <router-link
            class="px-3 py-2 rounded-full"
            :active-class="activeClass"
            :class="linkClass"
            to="/realizacie"
            @click="closeMenu"
            >Realizácie</router-link
          >
          <router-link
            class="px-3 py-2 rounded-full"
            :active-class="activeClass"
            :class="linkClass"
            to="/showroom"
            @click="closeMenu"
            >Showroom</router-link
          >
          <router-link
            class="px-3 py-2 rounded-full"
            :active-class="activeClass"
            :class="linkClass"
            to="/kontakt"
            @click="closeMenu"
            >Kontakt</router-link
          >
        </nav>

        <div class="mt-4 flex items-center gap-2">
          <a
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:bg-brand hover:text-white"
            :class="iconBaseClass"
            href="https://www.facebook.com/kobercemax"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <font-awesome-icon :icon="['fab', 'facebook-f']" />
          </a>
          <a
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:bg-brand hover:text-white"
            :class="iconBaseClass"
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
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      isMenuOpen: false,
    };
  },
  computed: {
    isLightHeader() {
      return this.$route.path === "/realizacie" || this.$route.path === "/kontakt";
    },
    navClass() {
      return this.isLightHeader
        ? "bg-black/10 text-heading border-white/10"
        : "bg-black/10 text-white border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_55%)]";
    },
    socialClass() {
      return this.isLightHeader
        ? "bg-black/10 text-heading border-white/10"
        : "bg-black/10 text-white border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_55%)]";
    },
    linkClass() {
      return this.isLightHeader
        ? "text-sm xl:text-base inline-flex items-center justify-center px-4 py-2.5 rounded-full whitespace-nowrap leading-none transition-colors border border-transparent text-heading hover:bg-white/30 hover:text-heading hover:border-white/60"
        : "text-sm xl:text-base inline-flex items-center justify-center px-4 py-2.5 rounded-full whitespace-nowrap leading-none transition-colors border border-transparent text-white hover:bg-white/5 hover:text-white hover:border-white/10";
    },
    activeClass() {
      return this.isLightHeader
        ? "bg-white/60 text-heading border border-white"
        : "bg-white/10 text-white border border-white";
    },
    iconBaseClass() {
      return this.isLightHeader ? "text-heading" : "text-white";
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
  },
  watch: {
    $route() {
      this.isMenuOpen = false;
    },
  },
};
</script>
