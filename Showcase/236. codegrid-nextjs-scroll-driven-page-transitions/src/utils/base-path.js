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

export const getAssetPrefix = () => {
  const clientPrefix = getClientPrefix();
  return clientPrefix ?? getBuildTimePrefix();
};

export const withAssetPrefix = (path = "") => {
  const prefix = getAssetPrefix();
  if (!path) return prefix;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return prefix ? `${prefix}${normalizedPath}` : normalizedPath;
};

export const withBasePath = withAssetPrefix;
