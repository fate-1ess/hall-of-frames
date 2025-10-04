const ABSOLUTE_PATTERN = /^(?:[a-z][a-z0-9+.-]*:|\/\/|data:|mailto:|tel:)/i;
let cachedBasePath;

const joinWithBase = (base, target) => {
  const trimmedBase = (base ?? "").replace(/\/+$/, "");
  const trimmedTarget = (target ?? "").replace(/^\/+/, "");

  if (!trimmedBase) {
    return `/${trimmedTarget}`.replace(/\{2,}/g, "/");
  }

  return `${trimmedBase}/${trimmedTarget}`.replace(/\{2,}/g, "/");
};

export const normalizeInitialPath = () => {
  if (typeof window === "undefined") return;

  const { pathname, search, hash } = window.location;
  if (!pathname.endsWith("/index.html")) return;

  const trimmedPath = pathname.replace(/index\.html$/, "");
  const normalizedPath = trimmedPath.endsWith("/")
    ? trimmedPath
    : `${trimmedPath}/`;

  window.history.replaceState(null, "", `${normalizedPath}${search}${hash}`);
};

export const detectBasePath = () => {
  if (typeof window === "undefined") {
    const baseUrl = import.meta.env.BASE_URL ?? "/";
    if (!baseUrl || baseUrl === "." || baseUrl === "./") return "";
    return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }

  if (cachedBasePath !== undefined) {
    return cachedBasePath;
  }

  const marker = "/index-assets/";
  const { pathname } = window.location;
  const markerIndex = pathname.indexOf(marker);

  if (markerIndex === -1) {
    cachedBasePath = "";
    return cachedBasePath;
  }

  const start = markerIndex + marker.length;
  const remainder = pathname.slice(start);
  const [projectId] = remainder.split("/").filter(Boolean);

  cachedBasePath = projectId ? `${marker}${projectId}` : "";
  return cachedBasePath;
};

export const getBasePath = () => detectBasePath();

export const resolveAssetPath = (inputPath) => {
  if (!inputPath) return inputPath;
  if (ABSOLUTE_PATTERN.test(inputPath)) return inputPath;

  const normalizedTarget = inputPath.replace(/^\.\//, "").replace(/^\/+/, "");

  if (typeof window !== "undefined") {
    const baseUrl = new URL(".", window.location.href);
    const resolved = new URL(normalizedTarget, baseUrl);
    return resolved.pathname;
  }

  const basePath = getBasePath();
  return joinWithBase(basePath || "/", normalizedTarget);
};
