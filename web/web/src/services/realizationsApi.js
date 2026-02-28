const API_BASE_URL = (process.env.VUE_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(
  /\/$/,
  ""
);
const realizationsCache = new Map();
let realizationsListCache = null;
let realizationsListPromise = null;

function cacheRealization(item) {
  if (!item || typeof item.id === "undefined" || item.id === null) return item;
  realizationsCache.set(String(item.id), item);
  return item;
}

function cacheRealizations(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => cacheRealization(item));
}

function parseApiError(error, fallbackMessage = "Operacia zlyhala.") {
  const status = error?.response?.status || error?.status || 500;
  const payload = error?.response?.data || error?.payload || {};

  return {
    status,
    message: payload?.message || fallbackMessage,
  };
}

function mapRealization(item = {}) {
  return {
    id: item.id,
    slug: item.slug || "",
    title: item.title || "",
    date: item.date || "",
    excerpt: item.excerpt || "",
    summary: item.summary || "",
    coverImage: item.cover_image || item.coverImage || "",
    gallery: Array.isArray(item.gallery) ? item.gallery : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    isPublished: Boolean(item.is_published),
    createdAt: item.created_at || "",
    updatedAt: item.updated_at || "",
  };
}

export async function fetchPublicRealizations() {
  if (Array.isArray(realizationsListCache)) {
    return [...realizationsListCache];
  }

  if (realizationsListPromise) {
    return realizationsListPromise;
  }

  realizationsListPromise = (async () => {
  const response = await fetch(`${API_BASE_URL}/api/realizations`, {
    headers: {
      Accept: "application/json",
    },
  }).catch((error) => {
    throw parseApiError(error, "Nepodarilo sa nacitat realizacie.");
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload?.message || "Nepodarilo sa nacitat realizacie.");
    error.status = response.status;
    error.payload = payload;
    throw parseApiError(error, "Nepodarilo sa nacitat realizacie.");
  }

  const items = Array.isArray(payload?.realizations) ? payload.realizations : [];
    const mapped = cacheRealizations(items.map(mapRealization));
    realizationsListCache = [...mapped];
    return mapped;
  })();

  try {
    return await realizationsListPromise;
  } finally {
    realizationsListPromise = null;
  }
}

export async function fetchPublicRealizationById(id) {
  const cached = getCachedPublicRealizationById(id);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/api/realizations/${id}`, {
    headers: {
      Accept: "application/json",
    },
  }).catch((error) => {
    throw parseApiError(error, "Nepodarilo sa nacitat detail realizacie.");
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload?.message || "Nepodarilo sa nacitat detail realizacie.");
    error.status = response.status;
    error.payload = payload;
    throw parseApiError(error, "Nepodarilo sa nacitat detail realizacie.");
  }

  return cacheRealization(mapRealization(payload));
}

export function getCachedPublicRealizationById(id) {
  const normalizedId = String(id || "").trim();
  if (!normalizedId) return null;
  return realizationsCache.get(normalizedId) || null;
}

export function getCachedPublicRealizations() {
  if (!Array.isArray(realizationsListCache)) return [];
  return [...realizationsListCache];
}

export function clearPublicRealizationsCache() {
  realizationsCache.clear();
  realizationsListCache = null;
  realizationsListPromise = null;
}
