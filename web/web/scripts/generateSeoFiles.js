const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const PRODUCTS_DATA_PATH = path.join(ROOT_DIR, "src", "data", "products.json");
const PRERENDER_ROUTES_PATH = path.join(PUBLIC_DIR, "prerender-routes.json");

const SITE_URL = (
  process.env.SITE_URL ||
  process.env.VUE_APP_SITE_URL ||
  "https://www.kobercemax.sk"
).replace(/\/+$/, "");
const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.VUE_APP_API_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(dateValue) {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split("T")[0];
}

async function fetchRealizationsForSeo() {
  if (typeof fetch !== "function") {
    return [];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/realizations`, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return [];

    const items = Array.isArray(payload?.realizations) ? payload.realizations : [];
    return items.map((item) => ({
      id: item.id,
      date: item.updated_at || item.date || null,
    }));
  } catch (_error) {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function buildRoutes() {
  const staticRoutes = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/o-nas", changefreq: "monthly", priority: "0.8" },
    { path: "/produkty", changefreq: "weekly", priority: "0.9" },
    { path: "/realizacie", changefreq: "weekly", priority: "0.9" },
    { path: "/showroom", changefreq: "monthly", priority: "0.8" },
    { path: "/kontakt", changefreq: "monthly", priority: "0.8" },
    { path: "/zasady-ochrany-sukromia", changefreq: "yearly", priority: "0.4" },
    { path: "/cookies", changefreq: "yearly", priority: "0.4" },
  ];

  const products = readJson(PRODUCTS_DATA_PATH).products || [];
  const productRoutes = products.map((item) => ({
    path: `/produkty/${item.id}/${item.slug}`,
    changefreq: "monthly",
    priority: "0.8",
  }));

  const realizations = await fetchRealizationsForSeo();
  const realizationRoutes = realizations.map((item) => ({
    path: `/realizacie/${item.id}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: formatDate(item.date || null),
  }));

  const allRoutes = [...staticRoutes, ...productRoutes, ...realizationRoutes];

  const deduped = [];
  const seen = new Set();
  for (const route of allRoutes) {
    if (seen.has(route.path)) continue;
    seen.add(route.path);
    deduped.push(route);
  }

  return deduped;
}

function generateSitemapXml(routes) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const route of routes) {
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(`${SITE_URL}${route.path}`)}</loc>`);
    if (route.lastmod) {
      lines.push(`    <lastmod>${route.lastmod}</lastmod>`);
    }
    lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    lines.push(`    <priority>${route.priority}</priority>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  lines.push("");
  return lines.join("\n");
}

function generateRobotsTxt() {
  return `User-agent: *\nAllow: /\nDisallow: /test\nDisallow: /test/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function writeOutput(fileName, contents) {
  fs.writeFileSync(path.join(PUBLIC_DIR, fileName), contents, "utf8");
}

function writePrerenderRoutes(routes) {
  const onlyPaths = routes.map((route) => route.path);
  fs.writeFileSync(PRERENDER_ROUTES_PATH, JSON.stringify(onlyPaths, null, 2), "utf8");
}

async function main() {
  const routes = await buildRoutes();
  writeOutput("sitemap.xml", generateSitemapXml(routes));
  writeOutput("robots.txt", generateRobotsTxt());
  writePrerenderRoutes(routes);

  // eslint-disable-next-line no-console
  console.log(
    `[seo] Generated sitemap.xml (${routes.length} URLs), robots.txt and prerender-routes.json for ${SITE_URL}`
  );
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("[seo] Generation failed:", error);
  process.exit(1);
});
