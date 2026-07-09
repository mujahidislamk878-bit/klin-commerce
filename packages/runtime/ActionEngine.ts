"use client";

import type { Action } from "../types";

export class ActionEngine {
  public execute(action: Action) {
    if (!action || !action.type) return;

    switch (action.type) {
      case "link":
        if (action.href) {
          window.location.href = action.href;
        }
        break;
      case "scroll":
        if (action.scrollTo) {
          const el = document.getElementById(action.scrollTo);
          el?.scrollIntoView({ behavior: "smooth" });
        }
        break;
      case "modal":
        if (action.modalId) {
          // Trigger global modal open event/handler
          const event = new CustomEvent("klin_open_modal", { detail: { modalId: action.modalId } });
          window.dispatchEvent(event);
        }
        break;
      case "submit":
        // Submit nearest parent form
        break;
      default:
        console.log(`Action Engine dispatching: ${action.type}`, action);
        // Expose a custom window event for custom listeners/plugins
        window.dispatchEvent(new CustomEvent("klin_action", { detail: action }));
        break;
    }
  }
}

export const actionEngine = new ActionEngine();
