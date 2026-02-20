<template>
  <label class="inline-flex items-center gap-3 select-none">
    <span
      class="relative inline-flex h-5 w-9 shrink-0 rounded-full transition cursor-pointer disabled:cursor-not-allowed"
      :class="trackClasses"
    >
      <input
        type="checkbox"
        class="sr-only"
        :checked="modelValue"
        :disabled="disabled"
        :name="name"
        :aria-checked="modelValue.toString()"
        :aria-label="ariaLabel"
        @change="onToggle"
      />
      <span
        class="absolute top-[.06rem] h-[1.1rem] w-[1.1rem] rounded-full bg-white shadow-sm transition"
        :class="{ 'left-[.06rem]': modelValue, 'right-[.06rem]': !modelValue }"
      ></span>
    </span>
    <span class="text-sm font-semibold text-deep">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
export default {
  name: 'BaseToggle',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    trackClasses() {
      if (this.disabled) {
        return !this.modelValue ? 'bg-primary/60 opacity-60 ' : ' bg-surface/10 opacity-60';
      }
      return !this.modelValue ? 'bg-primary' : 'bg-surface/40';
    },
    ariaLabel() {
      return this.label || this.name || 'Prepínač';
    },
  },
  methods: {
    onToggle(event) {
      const value = event.target.checked;
      this.$emit('update:modelValue', value);
      this.$emit('change', value);
    },
  },
};
</script>
