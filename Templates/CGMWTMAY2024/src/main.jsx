import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function normalizeInitialPath() {
  const { pathname, search, hash } = window.location;
  if (!pathname.endsWith("/index.html")) return;

  const trimmedPath = pathname.replace(/index\.html$/, "");
  const normalizedPath = trimmedPath.endsWith("/") ? trimmedPath : `${trimmedPath}/`;
  window.history.replaceState(null, "", `${normalizedPath}${search}${hash}`);
}

function detectBasename() {
  const marker = "/index-assets/";
  const { pathname } = window.location;

  const markerIndex = pathname.indexOf(marker);
  if (markerIndex === -1) {
    return "";
  }

  const start = markerIndex + marker.length;
  const remainder = pathname.slice(start);
  const [projectId] = remainder.split("/").filter(Boolean);

  if (!projectId) {
    return "";
  }

  return `${marker}${projectId}`;
}

normalizeInitialPath();
const basename = detectBasename();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router basename={basename}>
    <Routes>
      <Route path="/*" element={<App />} />
    </Routes>
  </Router>
);
