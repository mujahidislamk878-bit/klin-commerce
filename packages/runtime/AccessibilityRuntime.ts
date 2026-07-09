"use client";

export interface AccessibilityIssue {
  nodeId: string;
  element: string;
  type: "aria" | "keyboard" | "contrast" | "semantic";
  message: string;
}

export class AccessibilityRuntime {
  public auditNode(nodeId: string, type: string, props: Record<string, any>): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];

    // Check alt text for images
    if (type === "Image" && !props.alt) {
      issues.push({
        nodeId,
        element: "img",
        type: "aria",
        message: "Image is missing alternative (alt) text.",
      });
    }

    // Check aria-label on icon-only buttons
    if (type === "Button" && props.iconOnly && !props["aria-label"]) {
      issues.push({
        nodeId,
        element: "button",
        type: "aria",
        message: "Icon-only button is missing an aria-label descriptor.",
      });
    }

    // Check semantic tag hierarchy
    if (type === "Heading" && props.level === 1 && !props.children) {
      issues.push({
        nodeId,
        element: "h1",
        type: "semantic",
        message: "H1 heading element should contain descriptive title children.",
      });
    }

    return issues;
  }
}

export const accessibilityRuntime = new AccessibilityRuntime();
