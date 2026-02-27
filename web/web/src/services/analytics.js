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

export function initGoogleAnalytics() {
  if (!isBrowser()) return;
  if (window.__kmGaInitialized) return;

  ensureDataLayer();
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
  appendScript();

  window.__kmGaInitialized = true;
}
