const STORAGE_KEY = "km_cookie_consent_v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getCookieConsent() {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.analytics !== "boolean") {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
}

export function setCookieConsent({ analytics }) {
  if (!isBrowser()) return;

  const consent = {
    analytics: Boolean(analytics),
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}
