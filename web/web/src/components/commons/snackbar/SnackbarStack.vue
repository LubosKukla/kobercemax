<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-0 bottom-4 sm:bottom-6 flex justify-end px-4 sm:px-6"
      style="z-index: 9999"
    >
      <transition-group
        v-if="orderedSnackbars.length"
        name="snackbar"
        tag="div"
        class="relative flex flex-col items-end"
      >
        <article
          v-for="(snackbar, index) in orderedSnackbars"
          :key="snackbar.renderKey"
          class="pointer-events-auto w-[min(380px,calc(100vw-2rem))] rounded-2xl border bg-white px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition-all duration-200"
          :class="itemClass(snackbar.variant)"
          :style="itemStyle(index, orderedSnackbars.length)"
          @click="dismiss(snackbar.id)"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
        >
          <div class="flex items-center gap-3">
            <span
              class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
              :class="iconClass(snackbar.variant)"
            >
              <FontAwesomeIcon :icon="iconFor(snackbar.variant, snackbar.icon)" />
            </span>
            <p class="text-sm font-semibold text-dark leading-snug">
              {{ snackbar.message }}
            </p>
          </div>
        </article>
      </transition-group>
    </div>
  </Teleport>
</template>

<script>
import { computed, onBeforeUnmount, ref } from "vue";
import useSnackbar from "@/composables/useSnackbar";

const ICON_MAP = {
  success: ["fas", "check"],
  info: ["fas", "circle-info"],
  warning: ["fas", "triangle-exclamation"],
  error: ["fas", "circle-xmark"],
  default: ["fas", "circle-info"],
};

export default {
  name: "SnackbarStack",
  setup() {
    const { snackbars, dismiss, pauseAll, resumeAll } = useSnackbar();
    const orderedSnackbars = computed(() => [...snackbars].reverse());
    const hoverTimeout = ref(null);

    const itemClass = (variant) => {
      const classes = {
        success: "border-brand/35",
        info: "border-black/10",
        warning: "border-brand/35",
        error: "border-black/20",
      };
      return classes[variant] || classes.info;
    };

    const iconClass = (variant) => {
      const classes = {
        success: "bg-brand",
        info: "bg-heading",
        warning: "bg-brand",
        error: "bg-dark",
      };
      return classes[variant] || classes.info;
    };

    const iconFor = (variant, explicitIcon) => {
      if (explicitIcon && ICON_MAP[explicitIcon]) return ICON_MAP[explicitIcon];
      return ICON_MAP[variant] || ICON_MAP.default;
    };

    const itemStyle = (index, total) => {
      const depthFromBottom = total - index - 1;
      const depth = Math.min(depthFromBottom, 4);
      const overlap = 16;
      const scale = Math.max(0.82, 1 - depth * 0.05);
      const opacity = Math.max(0.55, 1 - depth * 0.12);

      return {
        marginTop: index === 0 ? "0px" : "-8px",
        transform: `translateY(${depth * overlap}px) scale(${scale.toFixed(2)})`,
        opacity: opacity.toFixed(2),
        zIndex: `${90 - depth}`,
      };
    };

    const onMouseEnter = () => {
      if (hoverTimeout.value) {
        clearTimeout(hoverTimeout.value);
        hoverTimeout.value = null;
      }
      pauseAll();
    };

    const onMouseLeave = () => {
      if (hoverTimeout.value) {
        clearTimeout(hoverTimeout.value);
      }
      hoverTimeout.value = setTimeout(() => {
        resumeAll();
        hoverTimeout.value = null;
      }, 80);
    };

    onBeforeUnmount(() => {
      if (hoverTimeout.value) {
        clearTimeout(hoverTimeout.value);
      }
      resumeAll();
    });

    return {
      orderedSnackbars,
      dismiss,
      itemClass,
      iconClass,
      iconFor,
      itemStyle,
      onMouseEnter,
      onMouseLeave,
    };
  },
};
</script>

<style scoped>
.snackbar-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.95);
}

.snackbar-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}

.snackbar-enter-active,
.snackbar-leave-active {
  transition: all 0.35s ease;
}

.snackbar-leave-active {
  position: absolute;
}

.snackbar-move {
  transition: transform 0.35s ease;
}
</style>
