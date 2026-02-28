import { reactive, readonly } from "vue";

const DEFAULT_DURATION = 4200;
const MAX_STACK = 4;

const stack = reactive([]);
const timers = new Map();

let idSeed = 0;
let renderSeed = 0;
let isPaused = false;

function nextRenderKey() {
  renderSeed += 1;
  return renderSeed;
}

function createPayload(messageOrPayload, maybeOptions = {}) {
  if (typeof messageOrPayload === "string") {
    return {
      message: messageOrPayload,
      ...maybeOptions,
    };
  }

  return { ...messageOrPayload };
}

function dismiss(id) {
  const index = stack.findIndex((item) => item.id === id);
  if (index === -1) return;

  stack.splice(index, 1);

  const timer = timers.get(id);
  if (timer?.timeoutId) {
    clearTimeout(timer.timeoutId);
  }
  timers.delete(id);
}

function schedule(snackbar, overrideDuration) {
  const duration =
    typeof overrideDuration === "number"
      ? overrideDuration
      : snackbar.duration || DEFAULT_DURATION;

  const existing = timers.get(snackbar.id);
  if (existing?.timeoutId) {
    clearTimeout(existing.timeoutId);
  }

  if (isPaused) {
    timers.set(snackbar.id, {
      timeoutId: null,
      remaining: duration,
    });
    return;
  }

  const endTime = Date.now() + duration;
  const timeoutId = setTimeout(() => {
    timers.delete(snackbar.id);
    dismiss(snackbar.id);
  }, duration);

  timers.set(snackbar.id, {
    timeoutId,
    endTime,
    remaining: null,
  });
}

function notify(messageOrPayload, maybeOptions = {}) {
  const payload = createPayload(messageOrPayload, maybeOptions);
  const snackbar = {
    id: ++idSeed,
    message: payload.message || "",
    variant: payload.variant || "info",
    icon: payload.icon || "",
    duration:
      typeof payload.duration === "number" ? payload.duration : DEFAULT_DURATION,
    renderKey: nextRenderKey(),
  };

  if (stack.length >= MAX_STACK && stack[stack.length - 1]) {
    dismiss(stack[stack.length - 1].id);
  }

  stack.unshift(snackbar);
  schedule(snackbar, snackbar.duration);

  return snackbar.id;
}

function clearAll() {
  stack.splice(0, stack.length);
  timers.forEach((meta) => {
    if (meta?.timeoutId) {
      clearTimeout(meta.timeoutId);
    }
  });
  timers.clear();
}

function pauseAll() {
  if (isPaused) return;
  isPaused = true;

  timers.forEach((meta, id) => {
    if (!meta) return;
    if (meta.timeoutId) {
      const remaining = Math.max(0, meta.endTime - Date.now());
      clearTimeout(meta.timeoutId);
      timers.set(id, {
        timeoutId: null,
        remaining,
      });
    }
  });
}

function resumeAll() {
  if (!isPaused) return;
  isPaused = false;

  timers.forEach((meta, id) => {
    const snackbar = stack.find((item) => item.id === id);
    if (!snackbar) {
      timers.delete(id);
      return;
    }

    const remaining =
      typeof meta?.remaining === "number"
        ? meta.remaining
        : snackbar.duration || DEFAULT_DURATION;
    schedule(snackbar, remaining);
  });
}

function success(message, options = {}) {
  return notify(message, { variant: "success", ...options });
}

function error(message, options = {}) {
  return notify(message, { variant: "error", ...options });
}

function info(message, options = {}) {
  return notify(message, { variant: "info", ...options });
}

function warning(message, options = {}) {
  return notify(message, { variant: "warning", ...options });
}

export function useSnackbar() {
  return {
    snackbars: readonly(stack),
    notify,
    success,
    error,
    info,
    warning,
    dismiss,
    clearAll,
    pauseAll,
    resumeAll,
  };
}

export default useSnackbar;
