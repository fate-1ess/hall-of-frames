"use client";

import { useEffect, useMemo, useState } from "react";

const MARKER = "/index-assets/";

const normalizeBase = (base) => {
  if (!base || base === "/") return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

const detectFromPathname = (pathname) => {
  if (!pathname) return "";

  const markerIndex = pathname.indexOf(MARKER);
  if (markerIndex === -1) return "";

  const start = markerIndex + MARKER.length;
  const remainder = pathname.slice(start);
  const [projectId] = remainder.split("/").filter(Boolean);

  return projectId ? `${MARKER}${projectId}` : "";
};

const STATIC_BASE_PATH = normalizeBase(process.env.NEXT_PUBLIC_BASE_PATH ?? "");

export const resolveBasePath = (pathname) => {
  const detected = detectFromPathname(pathname);
  return normalizeBase(detected || STATIC_BASE_PATH);
};

export const withBasePath = (path, basePath) => {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (!path.startsWith("/")) {
    return path;
  }

  const base = normalizeBase(basePath ?? STATIC_BASE_PATH);
  if (!base) {
    return path;
  }

  if (path === "/") {
    return `${base}/`;
  }

  return `${base}${path}`;
};

export const useBasePath = () => {
  const [basePath, setBasePath] = useState(STATIC_BASE_PATH);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const detected = resolveBasePath(window.location.pathname);
    setBasePath(detected);
  }, []);

  return basePath;
};

export const useWithBasePath = () => {
  const basePath = useBasePath();

  return useMemo(() => {
    return (path) => withBasePath(path, basePath);
  }, [basePath]);
};
