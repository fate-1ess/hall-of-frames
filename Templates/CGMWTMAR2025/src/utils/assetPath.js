const sanitizeBase = () => {
  const baseUrl = import.meta.env.BASE_URL ?? "/";
  if (baseUrl === "/") {
    return "";
  }
  return baseUrl.replace(/\/+$/, "");
};

const assetPath = (relativePath = "") => {
  const normalizedPath = relativePath.replace(/^\/+/, "");
  const base = sanitizeBase();

  if (!normalizedPath) {
    return base || "/";
  }

  return `${base}/${normalizedPath}`;
};

export default assetPath;
