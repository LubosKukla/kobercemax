const ABSOLUTE_URL_RE = /^(?:[a-z]+:)?\/\//i;

export function resolvePublicAssetPath(path) {
  if (!path) return path;

  const value = String(path).trim();
  if (!value) return value;

  if (value.startsWith("data:") || value.startsWith("blob:") || ABSOLUTE_URL_RE.test(value)) {
    return value;
  }

  const base = (process.env.BASE_URL || "/").replace(/\/+$/, "/");
  if (base !== "/" && value.startsWith(base)) {
    return value;
  }

  if (value.startsWith("/")) {
    const baseWithoutTrailingSlash = base.replace(/\/$/, "");
    return `${baseWithoutTrailingSlash}${value}`;
  }

  return `${base}${value.replace(/^\/+/, "")}`;
}
