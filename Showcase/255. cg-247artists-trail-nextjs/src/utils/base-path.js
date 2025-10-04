const ABSOLUTE_URL_REGEX = /^(?:[a-z]+:)?\/\//i;

const normalize = (value = "") => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const getBuildTimePrefix = () =>
  normalize(
    process.env.NEXT_PUBLIC_ASSET_PREFIX ??
      process.env.NEXT_PUBLIC_BASE_PATH ??
      ""
  );

const getClientPrefix = () => {
  if (typeof window === "undefined") return null;

  const data = window.__NEXT_DATA__ ?? {};
  const prefix = data.assetPrefix || data.basePath;
  return normalize(prefix);
};

let cachedRuntimePrefix = null;

const getRuntimePrefixFromScripts = () => {
  if (typeof window === "undefined") return null;
  if (cachedRuntimePrefix !== null) return cachedRuntimePrefix;

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
      cachedRuntimePrefix = normalize(src.slice(0, index));
      return cachedRuntimePrefix;
    }
  }

  const { pathname } = window.location;
  if (typeof pathname === "string" && pathname.length > 1) {
    const normalized = normalize(pathname.replace(/\/index\.html?$/, ""));
    cachedRuntimePrefix = normalized;
    return cachedRuntimePrefix;
  }

  cachedRuntimePrefix = "";
  return cachedRuntimePrefix;
};

export const getAssetPrefix = () => {
  const clientPrefix = getClientPrefix();
  if (clientPrefix) return clientPrefix;

  const runtimePrefix = getRuntimePrefixFromScripts();
  if (runtimePrefix) return runtimePrefix;

  return getBuildTimePrefix();
};

export const withAssetPrefix = (path = "") => {
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

export const withBasePath = withAssetPrefix;
