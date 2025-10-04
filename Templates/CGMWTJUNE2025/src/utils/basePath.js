const envBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.NEXT_PUBLIC_ASSET_PREFIX ||
  process.env.NEXT_BASE_PATH ||
  process.env.NEXT_ASSET_PREFIX ||
  "";

let cachedBasePath;

const stripLeadingSlash = (value = "") => value.replace(/^\/+/, "");

const stripTrailingSlash = (value = "") => {
  if (!value) return "";
  if (value === "/") return "";
  return value.replace(/\/+$/, "");
};

const ensureLeadingSlash = (value = "") => {
  if (!value) return "";
  return value.startsWith("/") ? value : `/${value}`;
};

const normalizeBase = (value = "") => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") return "";
  return ensureLeadingSlash(stripTrailingSlash(trimmed));
};

const normalizeRoute = (value = "") => {
  if (!value) return "/";
  if (value === "/") return "/";
  return ensureLeadingSlash(value);
};

const deriveBaseFromScript = () => {
  if (typeof window === "undefined") return "";
  const script = document.querySelector('script[src*="/_next/static/"]');
  if (!script) return "";

  const srcAttr = script.getAttribute("src");
  if (!srcAttr) return "";

  try {
    const url = new URL(srcAttr, window.location.href);
    const path = url.pathname;
    const breakpoint = path.indexOf("/_next/static/");
    if (breakpoint === -1) return "";
    const prefix = path.slice(0, breakpoint);
    return prefix;
  } catch (error) {
    return "";
  }
};

const deriveBaseFromPathname = (pathname = "") => {
  if (!pathname || pathname === "/") return "";
  const knownRoutes = ["archive", "contact", "studio", "work", "sample-project"];

  for (const route of knownRoutes) {
    const marker = `/${route}`;
    const index = pathname.indexOf(marker);
    if (index !== -1) {
      return pathname.slice(0, index) || "";
    }
  }

  return pathname;
};

export const getBasePath = () => {
  if (cachedBasePath !== undefined) return cachedBasePath;

  const envBase = normalizeBase(envBasePath);
  if (envBase) {
    cachedBasePath = envBase;
    return cachedBasePath;
  }

  if (typeof window === "undefined") {
    cachedBasePath = "";
    return cachedBasePath;
  }

  const scriptBase = normalizeBase(deriveBaseFromScript());
  if (scriptBase) {
    cachedBasePath = scriptBase;
    return cachedBasePath;
  }

  const pathname = window.location?.pathname || "";
  const derived = normalizeBase(deriveBaseFromPathname(pathname));
  cachedBasePath = derived;
  return cachedBasePath;
};

export const withBasePath = (path = "") => {
  const base = getBasePath();
  const normalizedPath = normalizeRoute(path);

  if (!base) return normalizedPath;

  if (normalizedPath === "/") {
    return `${base}/`;
  }

  return `${base}${normalizedPath}`;
};

export const withAssetPath = (path = "") => {
  const normalized = path ? ensureLeadingSlash(stripLeadingSlash(path)) : "";
  if (!normalized) return getBasePath() || "";
  return withBasePath(normalized);
};

export const toRelativePath = (path = "") => {
  const normalizedPath = normalizeRoute(path);
  const base = stripTrailingSlash(getBasePath());

  if (!base) return normalizedPath || "/";

  if (!normalizedPath.startsWith(base)) {
    return normalizedPath || "/";
  }

  const remainder = normalizedPath.slice(base.length) || "/";
  return remainder.startsWith("/") ? remainder : `/${remainder}`;
};

export const getCurrentRelativePath = () => {
  if (typeof window === "undefined") return "/";
  return toRelativePath(window.location.pathname);
};

export const createNavigationTargets = (route = "/") => {
  const normalizedRoute = normalizeRoute(route);
  return {
    route: normalizedRoute,
    href: withBasePath(normalizedRoute),
  };
};

export const isActiveRoute = (route = "/", current = getCurrentRelativePath()) => {
  const normalizedRoute = normalizeRoute(route);
  const normalizedCurrent = normalizeRoute(current);
  return normalizedRoute === normalizedCurrent;
};
