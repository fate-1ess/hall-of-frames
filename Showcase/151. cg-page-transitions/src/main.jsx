import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { detectBasePath, normalizeInitialPath } from "./utils/basePath.js";

normalizeInitialPath();
const basename = detectBasePath();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router basename={basename}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
