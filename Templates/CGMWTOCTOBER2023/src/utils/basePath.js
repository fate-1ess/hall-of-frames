const marker = "/index-assets/";

export const normalizeInitialPath = () => {
  if (typeof window === "undefined") return;

  const { pathname, search, hash } = window.location;
  if (!pathname.endsWith("/index.html")) return;

  const trimmedPath = pathname.replace(/index\.html$/, "");
  const normalized = trimmedPath.endsWith("/") ? trimmedPath : `${trimmedPath}/`;
  window.history.replaceState(null, "", `${normalized}${search}${hash}`);
};

export const detectBasePath = () => {
  if (typeof window === "undefined") return "";

  const { pathname } = window.location;
  const markerIndex = pathname.indexOf(marker);
  if (markerIndex === -1) return "";

  const start = markerIndex + marker.length;
  const remainder = pathname.slice(start);
  const [projectId] = remainder.split("/").filter(Boolean);
  return projectId ? `${marker}${projectId}` : "";
};
