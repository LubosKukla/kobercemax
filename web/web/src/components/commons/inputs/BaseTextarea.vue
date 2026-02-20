<template>
  <div class="space-y-2 p-2">
    <label
      v-if="label"
      :for="name || textareaId"
      class="text-sm font-semibold text-heading flex items-center gap-1"
    >
      {{ label }}
      <span v-if="required" class="text-brand text-xs font-semibold">*</span>
    </label>
    <div class="relative">
      <textarea
        :id="name || textareaId"
        :name="name"
        :placeholder="placeholder"
        :rows="rows"
        :maxlength="maxlength"
        :required="required"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :value="modelValue"
        :aria-label="ariaLabel"
        :aria-invalid="hasError"
        v-bind="textareaAttrs"
        :class="textareaClasses"
        @input="onInput"
      ></textarea>
    </div>
    <p v-if="hasError" class="text-xs font-semibold text-brand px-2">
      {{ error }}
    </p>
  </div>
</template>

<script>
let textareaUid = 0;

export default {
  name: "BaseTextarea",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    rows: {
      type: [String, Number],
      default: 4,
    },
    maxlength: {
      type: [String, Number],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: "off",
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
      textareaId: `base-textarea-${textareaUid++}`,
    };
  },
  computed: {
    textareaAttrs() {
      return this.$attrs;
    },
    ariaLabel() {
      return this.label || this.placeholder || this.name || "Textové pole";
    },
    hasError() {
      return Boolean(this.error);
    },
    textareaClasses() {
      const base =
        "w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-dark placeholder:text-dark/40 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-50 resize-none";
      const stateClass = this.hasError
        ? "focus:ring-2 focus:ring-brand/20"
        : "focus:ring-2 focus:ring-brand/20";
      return [base, stateClass].join(" ");
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
