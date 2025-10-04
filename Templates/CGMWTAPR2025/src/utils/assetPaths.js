const basePath = process.env.NEXT_PUBLIC_ASSET_PREFIX || process.env.NEXT_PUBLIC_BASE_PATH || process.env.NEXT_BASE_PATH || "";

const joinPath = (prefix, path) => {
  if (!path) return prefix || "";
  const normalizedPrefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedPrefix}${normalizedPath}` || normalizedPath;
};

export const withBasePath = (path = "") => joinPath(basePath, path);

const stripLeadingSlash = (value = "") => value.replace(/^\/+/, "");

export const getHeroImage = () => withBasePath("/hero.gif");

export const getProductImage = (fileName = "") =>
  withBasePath(`/product_images/${stripLeadingSlash(fileName)}`);

export const getArticleImage = (fileName = "") =>
  withBasePath(`/article_images/${stripLeadingSlash(fileName)}`);

export const getArticleAsset = getArticleImage;
export const getProductAsset = getProductImage;
