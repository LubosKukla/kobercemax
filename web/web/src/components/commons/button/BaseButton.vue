<template>
  <component
    :is="tag"
    :to="to || null"
    :href="href || null"
    :type="tag === 'button' ? type : null"
    :disabled="tag === 'button' ? disabled : null"
    :class="[baseClasses, variantClasses]"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    type: {
      type: String,
      default: "button",
    },
    variant: {
      type: String,
      default: "primary",
      validator: (value) =>
        ["primary", "dark", "outline", "ghost", "glass"].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: "",
    },
    href: {
      type: String,
      default: "",
    },
  },
  computed: {
    tag() {
      if (this.to) return "router-link";
      if (this.href) return "a";
      return "button";
    },
    baseClasses() {
      return [
        "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium !font-display transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        "disabled:opacity-60 disabled:cursor-not-allowed",
      ].join(" ");
    },
    variantClasses() {
      if (this.variant === "dark") {
        return this.disabled
          ? "bg-black/30 text-white/70"
          : "bg-black/40 text-white hover:bg-black/50";
      }
      if (this.variant === "outline") {
        return this.disabled
          ? "border border-white/30 text-white/70"
          : "border border-white/60 text-white hover:border-white";
      }
      if (this.variant === "ghost") {
        return this.disabled
          ? "bg-transparent text-white/60"
          : "bg-transparent text-white hover:text-white/80";
      }
      if (this.variant === "glass") {
        return this.disabled
          ? "bg-white/10 text-white/70 border border-white/20 backdrop-blur-md"
          : "bg-white/10 text-white border border-white/40 backdrop-blur-md hover:bg-white/20";
      }
      return this.disabled
        ? "bg-brand/70 text-white"
        : "bg-brand text-white hover:bg-brand/90";
    },
  },
};
</script>
