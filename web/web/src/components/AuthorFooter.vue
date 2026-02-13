<template>
  <div class="bg-light/75 text-center border-t border-black/5">
    <div
      class="mx-auto max-w-6xl px-4 py-3 text-xs text-black/70 flex flex-row flex-wrap items-center justify-center gap-1 sm:gap-2"
    >
      <span>© {{ currentYear }} KOBERCE MAX</span>
      <span class="hidden sm:inline text-black/30">•</span>
      <a
        href="https://luboskukla.sk"
        target="_blank"
        rel="noopener noreferrer"
        class="transition-colors"
      >
        <span class="text-black/70">Web by </span>
        <span class="font-semibold hover:text-brand hover:underline">Web K</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthorFooter",
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

