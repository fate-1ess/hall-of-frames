const ABSOLUTE_PATTERN = /^(?:[a-z][a-z0-9+.-]*:|\/\/|data:|mailto:|tel:)/i;
let cachedBasePath;

const ensureLeadingSlash = (value = "") => {
  if (!value) return "/";
  return value.startsWith("/") ? value : `/${value}`;
};

const stripTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const joinWithBase = (base, target) => {
  const normalizedBase = stripTrailingSlash(base ?? "");
  const normalizedTarget = target.replace(/^\/+/, "");

  if (!normalizedBase) {
    return ensureLeadingSlash(normalizedTarget);
  }

  return `${ensureLeadingSlash(normalizedBase)}/${normalizedTarget}`.replace(
    /\/{2,}/g,
    "/"
  );
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
    if (!baseUrl || baseUrl === "." || baseUrl === "./" || baseUrl === "/") {
      return "";
    }

    const trimmed = stripTrailingSlash(baseUrl);
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
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

export const resolveAssetPath = (inputPath = "") => {
  if (!inputPath) return inputPath;
  if (ABSOLUTE_PATTERN.test(inputPath)) return inputPath;

  const normalizedTarget = inputPath
    .replace(/^\.\//, "")
    .replace(/^\/+/, "");

  const basePath = getBasePath();
  if (!basePath) {
    return ensureLeadingSlash(normalizedTarget);
  }

  return joinWithBase(basePath, normalizedTarget);
};

export const resolveRoutePath = (path = "") => {
  if (!path) return "/";

  const normalized = path.startsWith("/") ? path : `/${path}`;
  const basePath = getBasePath();

  if (!basePath) {
    return normalized;
  }

  return joinWithBase(basePath, normalized.replace(/^\/+/, ""));
};
