const GA_MEASUREMENT_ID = "G-B3DJNHWFS8";
const GA_SCRIPT_ID = "km-gtag-script";
const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

function appendScript() {
  if (document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = GA_SCRIPT_SRC;
  document.head.appendChild(script);
}

function canTrack() {
  return isBrowser() && window.__kmGaInitialized && typeof window.gtag === "function";
}

function normalizeLabel(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function currentPath() {
  if (!isBrowser()) return "/";
  return `${window.location.pathname || "/"}${window.location.search || ""}`;
}

function currentLocation() {
  if (!isBrowser()) return "";
  return window.location.href || "";
}

export function initGoogleAnalytics() {
  if (!isBrowser()) return;
  if (window.__kmGaInitialized) return;

  ensureDataLayer();
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });
  appendScript();

  window.__kmGaInitialized = true;
  trackPageView();
}

export function trackEvent(name, params = {}) {
  if (!canTrack()) return;

  window.gtag("event", name, params);
}

export function trackPageView({ path, title, location } = {}) {
  if (!canTrack()) return;

  window.gtag("event", "page_view", {
    page_path: path || currentPath(),
    page_title: normalizeLabel(title || document.title),
    page_location: location || currentLocation(),
  });
}

export function trackCtaClick({ label, destination, destinationType } = {}) {
  trackEvent("cta_click", {
    cta_label: normalizeLabel(label) || "Neznama CTA",
    destination: destination || "",
    destination_type: destinationType || "unknown",
    page_path: currentPath(),
  });
}

export function trackPhoneClick({ label, phone, destination } = {}) {
  trackEvent("phone_click", {
    cta_label: normalizeLabel(label) || "Telefonat",
    phone_number: phone || "",
    destination: destination || "",
    page_path: currentPath(),
  });
}

export function trackContactLead() {
  trackEvent("generate_lead", {
    form_name: "contact_form",
    method: "website_form",
    page_path: currentPath(),
  });
}

export function trackContactFormError() {
  trackEvent("contact_form_error", {
    form_name: "contact_form",
    page_path: currentPath(),
  });
}
