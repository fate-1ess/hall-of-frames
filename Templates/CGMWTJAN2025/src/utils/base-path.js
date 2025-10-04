const externalPattern = /^(?:[a-z0-9+.-]+:\/\/|data:)/i;

const normalize = (value = "") => value.replace(/^\/+/, "");

const ensureTrailingSlash = (value) =>
  value.endsWith("/") ? value : `${value}/`;

const getServerBase = () => {
  const envBase =
    process.env.NEXT_PUBLIC_BASE_PATH || process.env.NEXT_PUBLIC_ASSET_PREFIX;

  if (!envBase) return null;

  if (envBase === "./" || envBase === ".") {
    return "./";
  }

  return ensureTrailingSlash(envBase);
};

const getClientBase = () => {
  const { pathname } = window.location;
  const lastSlash = pathname.lastIndexOf("/");

  if (lastSlash === -1) return "/";

  return pathname.slice(0, lastSlash + 1);
};

export const resolveAssetPath = (path) => {
  if (!path || externalPattern.test(path)) {
    return path;
  }

  const normalized = normalize(path);

  if (typeof window === "undefined") {
    const serverBase = getServerBase();

    if (serverBase) {
      if (serverBase === "./") {
        return `./${normalized}`;
      }

      return `${serverBase}${normalized}`;
    }

    return `./${normalized}`;
  }

  const clientBase = getClientBase();
  return `${clientBase}${normalized}`;
};

export const resolvePagePath = (path) => {
  if (!path || externalPattern.test(path)) {
    return path;
  }

  if (path === "/" || path === "./" || path === ".") {
    return resolveAssetPath("index.html");
  }

  const normalized = normalize(path);
  const withExtension = normalized.endsWith(".html")
    ? normalized
    : `${normalized}.html`;

  return resolveAssetPath(withExtension);
};

export const resolveAnchorHref = (path) => {
  if (!path) return path;

  if (path.startsWith("#") || externalPattern.test(path)) {
    return path;
  }

  return resolvePagePath(path);
};
