import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { detectBasePath, normalizeInitialPath } from './utils/basePath.js';

normalizeInitialPath();
const basename = detectBasePath();

createRoot(document.getElementById('root')).render(
  <Router basename={basename}>
    <Routes>
      <Route path="/*" element={<App />} />
    </Routes>
  </Router>
);
