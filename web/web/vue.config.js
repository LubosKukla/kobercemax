const { defineConfig } = require("@vue/cli-service");
const fs = require("fs");
const path = require("path");
const productsData = require("./src/data/products.json");
const prerenderRoutesPath = path.join(__dirname, "public", "prerender-routes.json");

let PrerenderPlugin = null;

try {
  PrerenderPlugin = require("@prerenderer/webpack-plugin");
} catch (error) {
  // Packages are optional in dev. Install them to enable production prerender.
}

function getPrerenderRoutes() {
  if (fs.existsSync(prerenderRoutesPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(prerenderRoutesPath, "utf8"));
      if (Array.isArray(parsed) && parsed.length) {
        return Array.from(new Set(parsed.map((route) => String(route || "").trim()).filter(Boolean)));
      }
    } catch (_error) {
      // Ignore malformed file and fallback below.
    }
  }

  const staticRoutes = ["/", "/o-nas", "/produkty", "/realizacie", "/showroom", "/kontakt", "/zasady-ochrany-sukromia", "/cookies"];

  const productRoutes = (productsData.products || []).map(
    (item) => `/produkty/${item.id}/${item.slug}`
  );

  return Array.from(new Set([...staticRoutes, ...productRoutes]));
}

function createPrerenderPlugin() {
  if (process.env.NODE_ENV !== "production") return null;
  if (!PrerenderPlugin) return null;

  return new PrerenderPlugin({
    routes: getPrerenderRoutes(),
    renderer: "@prerenderer/renderer-puppeteer",
    rendererOptions: {
      headless: true,
      renderAfterDocumentEvent: "render-event",
      maxConcurrentRoutes: 4,
      timeout: 20000,
    },
  });
}

const prerenderPlugin = createPrerenderPlugin();

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/",
  devServer: {
    // Prevent full-page reload when backend writes uploaded images into /public.
    // HMR for source code stays active.
    liveReload: false,
  },
  configureWebpack: {
    plugins: prerenderPlugin ? [prerenderPlugin] : [],
  },
  chainWebpack: (config) => {
    config.plugins.delete("pwa");
    config.plugins.delete("workbox");
  },
});
