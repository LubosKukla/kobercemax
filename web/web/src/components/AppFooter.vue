<template>
  <footer class="border-t border-light">
    <div class="max-w-6xl mx-auto px-6 py-6 text-sm text-dark">
      <p>© {{ year }} Koberce Max</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>
