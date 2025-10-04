const ABSOLUTE_URL_REGEX = /^(?:[a-z]+:)?\/\//i;

const normalize = (value = "") => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const getBuildPrefix = () =>
  normalize(
    process.env.NEXT_PUBLIC_ASSET_PREFIX ??
      process.env.NEXT_PUBLIC_BASE_PATH ??
      process.env.NEXT_ASSET_PREFIX ??
      process.env.NEXT_BASE_PATH ??
      ""
  );

const getRuntimePrefix = () => {
  if (typeof window === "undefined") return null;

  const data = window.__NEXT_DATA__ ?? {};
  const prefix = data.assetPrefix || data.basePath;
  if (prefix) return normalize(prefix);

  const scriptWithNext = Array.from(
    document.querySelectorAll('script[src*="/_next/"]')
  ).find((script) => {
    const src = script.getAttribute("src") ?? "";
    return src.includes("/_next/");
  });

  if (scriptWithNext) {
    const src = scriptWithNext.getAttribute("src") ?? "";
    const index = src.indexOf("/_next/");
    if (index !== -1) {
      return normalize(src.slice(0, index));
    }
  }

  const { pathname } = window.location;
  if (typeof pathname === "string" && pathname.length > 1) {
    return normalize(pathname.replace(/\/?index\.html?$/, ""));
  }

  return "";
};

const getAssetPrefix = () => {
  const runtimePrefix = getRuntimePrefix();
  if (runtimePrefix !== null) return runtimePrefix;

  return getBuildPrefix();
};

export const withBasePath = (path = "") => {
  if (!path) return getAssetPrefix();

  if (ABSOLUTE_URL_REGEX.test(path)) {
    return path;
  }

  const prefix = getAssetPrefix();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (prefix && normalizedPath.startsWith(`${prefix}/`)) {
    return normalizedPath;
  }

  return prefix ? `${prefix}${normalizedPath}` : normalizedPath;
};
