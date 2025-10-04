const rawBase = import.meta.env.BASE_URL ?? "/";
const sanitizedBase = (() => {
  if (!rawBase || rawBase === "/") return "";
  const trimmed = rawBase.trim();
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.replace(/\/+$/, "");
})();

const baseWithSlash = sanitizedBase ? `${sanitizedBase}/` : "/";

const externalPattern = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;
const specialSchemes = /^(?:mailto:|tel:|data:|javascript:)/i;

export const BASE_PATH = sanitizedBase;

const ensureLeadingSlash = (value) => {
  if (!value) return "/";
  return value.startsWith("/") ? value : `/${value}`;
};

const alreadyPrefixed = (value) => {
  if (!sanitizedBase) return false;
  if (value === sanitizedBase) return true;
  if (value.startsWith(baseWithSlash)) return true;
  return false;
};

export const isExternalUrl = (url = "") => {
  if (!url) return false;
  if (url.startsWith("#")) return false;
  if (specialSchemes.test(url)) return true;
  return externalPattern.test(url);
};

export const withBasePath = (path = "") => {
  if (!path || isExternalUrl(path) || path.startsWith("#")) {
    return path;
  }

  const normalized = ensureLeadingSlash(path);

  if (!sanitizedBase) {
    return normalized;
  }

  if (alreadyPrefixed(normalized)) {
    return normalized;
  }

  if (normalized === "/") {
    return `${sanitizedBase}/`;
  }

  return `${sanitizedBase}${normalized}`;
};

export const stripBasePath = (path = "") => {
  if (!path) return "/";

  let normalized = ensureLeadingSlash(path);

  if (!sanitizedBase) {
    return normalized;
  }

  if (normalized === sanitizedBase || normalized === `${sanitizedBase}/`) {
    return "/";
  }

  if (normalized.startsWith(baseWithSlash)) {
    const stripped = normalized.slice(sanitizedBase.length);
    return stripped || "/";
  }

  return normalized;
};

export const normalizeInternalPath = (value = "") => {
  if (!value || value === "#") return "/";

  try {
    const url = new URL(value, window.location.origin + baseWithSlash);
    return normalizePathname(url.pathname);
  } catch (error) {
    return normalizePathname(value);
  }
};

const hasExtension = (segment = "") => /\.[a-zA-Z0-9]+$/.test(segment);

const appendHtmlIfNeeded = (pathname) => {
  if (pathname === "/") return pathname;

  const trimmed = pathname.replace(/\/+$/, "");
  if (!trimmed || trimmed === "") {
    return "/";
  }

  const lastSegment = trimmed.split("/").pop() || "";
  if (hasExtension(lastSegment)) {
    return ensureLeadingSlash(trimmed);
  }

  return `${ensureLeadingSlash(trimmed)}.html`;
};

const normalizePathname = (pathname) => {
  const stripped = stripBasePath(pathname);
  if (stripped === "/index.html" || stripped === "index.html") {
    return "/";
  }
  if (!stripped || stripped === "") {
    return "/";
  }

  const normalized = ensureLeadingSlash(stripped);
  return appendHtmlIfNeeded(normalized);
};

const attributesToAdjust = ["href", "src", "poster"];

export const applyBasePathToDom = () => {
  if (typeof document === "undefined") return;
  if (!sanitizedBase) return;

  const candidates = document.querySelectorAll(
    attributesToAdjust.map((attr) => `[${attr}]`).join(",")
  );

  candidates.forEach((element) => {
    const tag = element.tagName ? element.tagName.toLowerCase() : "";

    attributesToAdjust.forEach((attr) => {
      const originalValue = element.getAttribute(attr);
      if (!originalValue) return;
      if (!originalValue.startsWith("/") || originalValue.startsWith("//")) return;
      if (specialSchemes.test(originalValue)) return;

      let nextValue = originalValue;

      if (attr === "href" && tag === "a") {
        const normalized = normalizeInternalPath(originalValue);
        if (!normalized) return;
        nextValue = withBasePath(normalized);
      } else {
        nextValue = withBasePath(originalValue);
      }

      if (nextValue && nextValue !== originalValue) {
        element.setAttribute(attr, nextValue);
      }
    });
  });

  document.documentElement.setAttribute("data-base-path", sanitizedBase);
  window.__NEGATIVE_FILMS_BASE_PATH__ = sanitizedBase;
};

export const resolveAssetPath = (path = "") => withBasePath(path);

export const resolveRoutePath = (path = "") => {
  const normalized = normalizeInternalPath(path);
  return withBasePath(normalized);
};
