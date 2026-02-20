<template>
  <div class="space-y-2 p-2" ref="dropdownRef">
    <label
      v-if="label"
      :for="name || selectId"
      class="text-sm font-bold text-deep flex items-center gap-1"
    >
      {{ label }}
      <span v-if="required" class="text-danger text-xs font-semibold">*</span>
    </label>
    <div class="relative">
      <input type="hidden" :name="name" :value="modelValue" />
      <button
        :id="name || selectId"
        type="button"
        :aria-haspopup="'listbox'"
        :aria-expanded="isOpen.toString()"
        :aria-labelledby="name || selectId"
        :disabled="disabled"
        :aria-invalid="hasError"
        :class="[buttonClasses, hasError ? errorClasses : focusClasses]"
        v-bind="selectAttrs"
        @click="toggleDropdown"
        @keydown="onKeydown"
      >
        <span class="truncate" :class="{ 'text-deep/60': !displayLabel }">
          {{ displayLabel || placeholder || "Vyberte možnosť" }}
        </span>
        <svg
          class="h-4 w-4 text-deep/60 transition"
          :class="{ 'rotate-180': isOpen }"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        >
          <path
            d="m6 8 4 4 4-4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <transition name="fade">
        <ul
          v-if="isOpen"
          role="listbox"
          class="absolute left-0 right-0 z-20 mt-2 max-h-60 overflow-auto rounded-xl border border-deep/20 bg-white shadow-lg ring-1 ring-deep/3"
        >
          <li
            v-for="(option, index) in options"
            :key="optionKey(option)"
            role="option"
            :aria-selected="isSelected(option)"
            @click="selectByIndex(index)"
            @mouseenter="highlightedIndex = index"
            class="cursor-pointer px-4 py-2 text-sm text-deep transition hover:bg-light/30"
            :class="{
              'bg-light/40': highlightedIndex === index,
              'font-semibold text-primary': isSelected(option),
            }"
          >
            {{ optionLabel(option) }}
          </li>
          <li v-if="!options.length" class="px-4 py-3 text-sm text-deep/60">
            Žiadne možnosti
          </li>
        </ul>
      </transition>
    </div>
    <p v-if="hasError" class="text-xs font-semibold text-danger px-2">
      {{ error }}
    </p>
  </div>
</template>

<script>
let selectUid = 0;

export default {
  name: "BaseSelect",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Boolean, Object],
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Vyberte možnosť",
    },
    optionLabelKey: {
      type: String,
      default: "label",
    },
    optionValueKey: {
      type: String,
      default: "value",
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
      selectId: `base-select-${selectUid++}`,
      isOpen: false,
      highlightedIndex: -1,
    };
  },
  computed: {
    selectAttrs() {
      return this.$attrs;
    },
    ariaLabel() {
      return this.label || this.placeholder || this.name || "Výberová ponuka";
    },
    selectedIndex() {
      return this.options.findIndex(
        (option) => this.optionValue(option) === this.modelValue
      );
    },
    displayLabel() {
      const selected = this.options[this.selectedIndex];
      return selected ? this.optionLabel(selected) : "";
    },
    hasError() {
      return Boolean(this.error);
    },
    buttonClasses() {
      return "flex w-full items-center justify-between rounded-xl border bg-light px-4 py-2 text-left text-sm font-semibold text-deep placeholder:text-deep/60 transition disabled:cursor-not-allowed disabled:opacity-50";
    },
    focusClasses() {
      return "border-deep/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 focus:border-primary focus:bg-white";
    },
    errorClasses() {
      return "border-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/15 focus:border-danger focus:bg-white";
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    optionLabel(option) {
      if (typeof option === "string" || typeof option === "number")
        return option;
      return option[this.optionLabelKey];
    },
    optionValue(option) {
      if (typeof option === "string" || typeof option === "number")
        return option;
      return option[this.optionValueKey];
    },
    optionKey(option) {
      return `${this.optionValue(option)}-${this.optionLabel(option)}`;
    },
    isSelected(option) {
      return this.optionValue(option) === this.modelValue;
    },
    toggleDropdown() {
      if (this.disabled) return;
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.highlightedIndex =
          this.selectedIndex !== -1 ? this.selectedIndex : 0;
      }
    },
    selectByIndex(index) {
      if (index < 0 || index >= this.options.length) return;
      const option = this.options[index];
      const value = this.optionValue(option);
      this.$emit("update:modelValue", value);
      this.$emit("change", value);
      this.isOpen = false;
    },
    onKeydown(event) {
      const actionableKeys = ["ArrowDown", "ArrowUp", "Enter", " ", "Escape"];
      if (!actionableKeys.includes(event.key)) return;
      event.preventDefault();

      if (
        !this.isOpen &&
        (event.key === "ArrowDown" || event.key === "ArrowUp")
      ) {
        this.toggleDropdown();
        return;
      }

      switch (event.key) {
        case "ArrowDown":
          if (this.highlightedIndex < this.options.length - 1)
            this.highlightedIndex += 1;
          break;
        case "ArrowUp":
          if (this.highlightedIndex > 0) this.highlightedIndex -= 1;
          break;
        case "Enter":
        case " ":
          this.selectByIndex(this.highlightedIndex);
          break;
        case "Escape":
          this.isOpen = false;
          break;
        default:
          break;
      }
    },
    handleClickOutside(event) {
      const root = this.$refs.dropdownRef;
      if (root && !root.contains(event.target)) {
        this.isOpen = false;
      }
    },
  },
};
</script>
