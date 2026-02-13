<template>
  <header class="border-b border-light">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <router-link class="font-display text-xl text-heading" to="/">
        Koberce Max
      </router-link>
      <nav class="flex gap-4 text-sm">
        <router-link to="/o-nas">O nás</router-link>
        <router-link to="/produkty">Produkty</router-link>
        <router-link to="/sluzby">Služby</router-link>
        <router-link to="/realizacie">Realizácie</router-link>
        <router-link to="/showroom">Showroom</router-link>
        <router-link to="/kontakt">Kontakt</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>
