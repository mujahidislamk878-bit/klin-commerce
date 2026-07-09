"use client";

import type { Action } from "../types";

export function resolveAction(action: Action) {
  if (!action || !action.type) return;

  switch (action.type) {
    case "link":
      if (action.href) {
        if (action.target === "_blank") {
          window.open(action.href, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = action.href;
        }
      }
      break;
    case "scroll":
      if (action.scrollTo) {
        const el = document.getElementById(action.scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
      break;
    case "submit":
      // Triggers nearest form submission
      break;
    case "download":
      if (action.href) {
        const link = document.createElement("a");
        link.href = action.href;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      break;
    default:
      console.warn(`Action type "${action.type}" not resolved`);
      break;
  }
}
