import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles.css";

// Patch pointer capture issues in dnd-kit (specifically under Chrome/Safari pointer race conditions)
if (typeof window !== "undefined" && typeof Element !== "undefined") {
  const originalSetPointerCapture = Element.prototype.setPointerCapture;
  Element.prototype.setPointerCapture = function (pointerId) {
    try {
      originalSetPointerCapture.call(this, pointerId);
    } catch (e: any) {
      if (e?.name !== "NotFoundError") {
        throw e;
      }
    }
  };

  const originalReleasePointerCapture = Element.prototype.releasePointerCapture;
  Element.prototype.releasePointerCapture = function (pointerId) {
    try {
      originalReleasePointerCapture.call(this, pointerId);
    } catch (e: any) {
      if (e?.name !== "NotFoundError") {
        throw e;
      }
    }
  };
}


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
