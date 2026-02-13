<template>
  <button
    type="button"
    class="px-4 py-2 rounded-full text-sm border transition"
    :class="chipClass"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<script>
export default {
  name: "CategoryChip",
  emits: ["click"],
  props: {
    label: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    chipClass() {
      return this.active
        ? "bg-brand text-white border-brand"
        : "bg-white text-dark border-black/10 hover:border-brand/40 hover:text-brand";
    },
  },
};
</script>
