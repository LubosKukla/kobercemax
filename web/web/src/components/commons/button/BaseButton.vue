<template>
  <component
    :is="tag"
    :to="to || null"
    :href="href || null"
    :type="tag === 'button' ? type : null"
    :disabled="tag === 'button' ? disabled : null"
    :class="[baseClasses, variantClasses]"
  >
    <span class="flex items-center gap-2">
      <slot />
      <font-awesome-icon v-if="iconComponent" :icon="iconComponent" class="text-xs" />
    </span>
  </component>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ICONS = {
  "arrow-right": faArrowRight,
};

export default {
  name: "BaseButton",
  components: { FontAwesomeIcon },
  props: {
    type: {
      type: String,
      default: "button",
    },
    variant: {
      type: String,
      default: "primary",
      validator: (value) =>
        ["primary", "dark", "outline", "ghost", "glass", "soft", "link"].includes(
          value
        ),
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
    icon: {
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
    iconComponent() {
      if (!this.icon) return null;
      return ICONS[this.icon] || null;
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
          ? "bg-black/60 text-white/70"
          : "bg-black/85 text-white hover:bg-black";
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
      if (this.variant === "soft") {
        return this.disabled
          ? "bg-white/20 text-white/70 border border-white/10 backdrop-blur-sm"
          : "bg-white/25 text-white border border-white/20 backdrop-blur-sm hover:bg-white/35";
      }
      if (this.variant === "link") {
        return this.disabled
          ? "bg-transparent text-dark/40"
          : "bg-transparent text-dark/70 hover:text-brand";
      }
      return this.disabled ? "bg-brand/70 text-white" : "bg-brand text-white hover:bg-brand/90";
    },
  },
};
</script>
