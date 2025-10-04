import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { detectBasePath, normalizeInitialPath } from "./utils/paths";

normalizeInitialPath();
const basename = detectBasePath();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router basename={basename}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>
);
