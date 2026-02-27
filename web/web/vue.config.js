const { defineConfig } = require("@vue/cli-service");
const productsData = require("./src/data/products.json");
const realizationsData = require("./src/data/realizations.json");

let PrerenderPlugin = null;

try {
  PrerenderPlugin = require("@prerenderer/webpack-plugin");
} catch (error) {
  // Packages are optional in dev. Install them to enable production prerender.
}

function getPrerenderRoutes() {
  const staticRoutes = [
    "/",
    "/o-nas",
    "/produkty",
    "/realizacie",
    "/showroom",
    "/kontakt",
    "/zasady-ochrany-sukromia",
    "/cookies",
  ];

  const productRoutes = (productsData.products || []).map(
    (item) => `/produkty/${item.id}/${item.slug}`
  );

  const realizationRoutes = (realizationsData.realizations || []).map(
    (item) => `/realizacie/${item.id}/${item.slug}`
  );

  return Array.from(new Set([...staticRoutes, ...productRoutes, ...realizationRoutes]));
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
  configureWebpack: {
    plugins: prerenderPlugin ? [prerenderPlugin] : [],
  },
  chainWebpack: (config) => {
    config.plugins.delete("pwa");
    config.plugins.delete("workbox");
  },
});
