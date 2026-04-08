/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import {
  ErrorOverlayProvider,
  GlobalErrorBoundary,
} from "./components/MbahErrorOverlay.jsx";
import { AuthProvider } from "./lib/auth";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorOverlayProvider>
      <GlobalErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </GlobalErrorBoundary>
    </ErrorOverlayProvider>
  </StrictMode>,
);
