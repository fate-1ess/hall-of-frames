export const resolveAssetPath = (path) => {
  if (!path) return path;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|data:)/i.test(path)) {
    return path;
  }

  const cleanedPath = path.startsWith("/") ? path.slice(1) : path;
  const baseUrl = new URL(".", window.location.href);
  return new URL(cleanedPath, baseUrl).toString();
};
