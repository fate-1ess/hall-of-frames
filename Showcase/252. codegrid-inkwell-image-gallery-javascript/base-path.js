const ABSOLUTE_URL_REGEX = /^(?:[a-z]+:)?\/\//i;

const normalize = (value = "") => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const getBase = () => {
  const base = import.meta.env.BASE_URL ?? "/";
  if (base === "./") return base;
  return normalize(base) || "/";
};

export const withBasePath = (path = "") => {
  if (!path) {
    const base = getBase();
    return base === "./" ? base : `${base}/`;
  }

  if (ABSOLUTE_URL_REGEX.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const base = getBase();

  if (base === "./") {
    return `./${normalizedPath}`;
  }

  if (base === "/") {
    return `/${normalizedPath}`;
  }

  return `${base}/${normalizedPath}`;
};
