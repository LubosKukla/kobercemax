<template>
  <div class="space-y-2">
    <label v-if="label" :for="inputId" class="text-sm font-bold text-deep">
      {{ label }}
    </label>
    <div class="border border-ink rounded-2xl my-2">
      <input
        :id="inputId"
        ref="fileInput"
        type="file"
        class="sr-only"
        :accept="accept"
        :disabled="disabled"
        @change="onFileChange"
      />
      <button
        type="button"
        class="flex w-full cursor-pointer items-center justify-between rounded-xl border border-ink/20 bg-ink/5 px-4 py-3 text-sm font-semibold text-deep transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="disabled"
        @click="triggerInput"
      >
        <span class="flex items-center gap-2">
          <font-awesome-icon :icon="faUpload" class="text-deep/70" />
          <span>{{ fileName || placeholder }}</span>
        </span>
        <span class="text-xs text-deep/60">Vybrať</span>
      </button>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

let uid = 0;

export default {
  name: 'BaseUpload',
  components: { FontAwesomeIcon },
  props: {
    modelValue: {
      type: [File, Object, String, null],
      default: null,
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Nahrať súbor',
    },
    accept: {
      type: String,
      default: 'image/*',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputId: `base-upload-${uid++}`,
      faUpload,
    };
  },
  computed: {
    fileName() {
      if (!this.modelValue) return '';
      if (typeof this.modelValue === 'string') return this.modelValue;
      if (this.modelValue.name) return this.modelValue.name;
      return '';
    },
  },
  methods: {
    triggerInput() {
      if (this.disabled) return;
      this.$refs.fileInput?.click();
    },
    onFileChange(event) {
      const file = event.target.files?.[0] || null;
      this.$emit('update:modelValue', file);
      this.$emit('change', file);
    },
  },
};
</script>
