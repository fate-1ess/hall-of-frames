import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const normalizeInitialPath = () => {
  if (typeof window === "undefined") {
    return;
  }

  const { pathname, search, hash } = window.location;

  if (pathname.toLowerCase().endsWith("/index.html")) {
    const trimmedPath = pathname.slice(0, -"/index.html".length) || "/";
    const nextPath = trimmedPath === "" ? "/" : trimmedPath;
    window.history.replaceState(null, "", `${nextPath}${search}${hash}`);
  }
};

normalizeInitialPath();

const getBaseName = () => {
  if (import.meta.env.DEV || typeof window === "undefined") {
    return "/";
  }

  const marker = "/index-assets/";
  const { pathname } = window.location;
  const markerIndex = pathname.indexOf(marker);

  if (markerIndex === -1) {
    return "/";
  }

  const remainder = pathname.slice(markerIndex + marker.length);
  const [templateSegment] = remainder.split("/").filter(Boolean);

  if (!templateSegment) {
    return "/";
  }

  return `${marker}${templateSegment}`;
};

const basename = getBaseName();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router basename={basename}>
    <Routes>
      <Route path="/*" element={<App />} />
    </Routes>
  </Router>
);
