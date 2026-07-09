"use client";

import { klinAPIs, type ComponentMetadata } from "./DeveloperAPIs";
import { textProperty, actionProperty, colorProperty, selectProperty } from "./PropertySystem";

export function registerComponentMetadata(metadata: ComponentMetadata) {
  klinAPIs.registerComponent(metadata);
}

export function getComponentMetadata(id: string): ComponentMetadata | undefined {
  return klinAPIs.components.get(id);
}

// ponytail: register core typography and navbar default metadata automatically
registerComponentMetadata({
  id: "Text",
  name: "Text Block",
  category: "Typography",
  version: "1.0.0",
  author: "Klin Team",
  supports: {
    responsive: true,
    theme: true,
    animation: true,
    cms: true,
  },
  defaultProps: {
    children: "Editable paragraph copy",
    size: "md",
    weight: "normal",
  },
  themeTokensUsed: ["foreground", "font-sans"],
});

registerComponentMetadata({
  id: "Navbar",
  name: "Navigation Header",
  category: "Navigation",
  version: "1.0.0",
  author: "Klin Team",
  supports: {
    theme: true,
    actions: true,
  },
  defaultProps: {
    brandName: "Klin Workspace",
    sticky: true,
  },
});
