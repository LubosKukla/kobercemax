<template>
  <div class="space-y-2 p-2">
    <label v-if="label" :for="name || inputId" class="text-sm font-bold text-deep">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="name || inputId"
        type="time"
        :name="name"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :value="modelValue"
        :aria-label="ariaLabel"
        v-bind="inputAttrs"
        class="w-full appearance-none rounded-xl border border-surface/10 bg-ink px-6 py-2 pr-16 text-sm font-semibold text-deep tabular-nums placeholder:text-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:hidden"
        @input="onInput"
      />
      <div
        class="pointer-events-none absolute inset-y-0 right-2 flex items-center justify-center rounded-full p-2 text-deep/60"
      >
        <font-awesome-icon :icon="faClock" class="h-5 w-5" />
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

let uid = 0;

export default {
  name: 'BaseTimePicker',
  components: {
    FontAwesomeIcon,
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '--:--',
    },
    min: {
      type: String,
      default: '',
    },
    max: {
      type: String,
      default: '',
    },
    step: {
      type: [String, Number],
      default: 60,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputId: `base-time-${uid++}`,
      faClock,
    };
  },
  computed: {
    inputAttrs() {
      return this.$attrs;
    },
    ariaLabel() {
      return this.label || this.placeholder || this.name || 'Výber času';
    },
  },
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.value);
      this.$emit('input', event.target.value);
    },
  },
};
</script>
