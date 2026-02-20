<template>
  <div class="space-y-2 p-2">
    <label
      v-if="label"
      :for="name || inputId"
      class="text-sm font-bold text-deep flex items-center gap-1"
    >
      {{ label }}
      <span v-if="required" class="text-danger text-xs font-semibold">*</span>
    </label>
    <div class="relative">
      <input
        :id="name || inputId"
        type="date"
        :name="name"
        :required="required"
        :disabled="disabled"
        :value="modelValue"
        :aria-label="ariaLabel"
        :aria-invalid="hasError"
        v-bind="inputAttrs"
        :class="inputClasses"
        @input="onInput"
      />
    </div>
    <p v-if="hasError" class="text-xs font-semibold text-danger px-2">
      {{ error }}
    </p>
  </div>
</template>

<script>
let uid = 0;

export default {
  name: "BaseDatePicker",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      inputId: `base-date-${uid++}`,
    };
  },
  computed: {
    inputAttrs() {
      return this.$attrs;
    },
    ariaLabel() {
      return this.label || this.name || "Dátum";
    },
    hasError() {
      return Boolean(this.error);
    },
    inputClasses() {
      const base =
        "w-full rounded-xl bg-light py-2 text-sm font-semibold text-black/80 placeholder:text-muted focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-50";
      const stateClass = this.hasError
        ? "focus:ring-2 focus:ring-danger/20"
        : "focus:ring-2 focus:ring-brand/10";
      const padding = "px-4";
      return [base, stateClass, padding].join(" ");
    },
  },
  methods: {
    onInput(event) {
      this.$emit("update:modelValue", event.target.value);
      this.$emit("input", event.target.value);
    },
  },
};
</script>
