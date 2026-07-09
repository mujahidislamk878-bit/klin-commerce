"use client";

import { klinAPIs } from "./DeveloperAPIs";

export interface ValidationError {
  nodeId: string;
  componentId: string;
  field?: string;
  message: string;
  severity: "warning" | "error";
}

export class ValidationEngine {
  public validateNode(nodeId: string, componentId: string, props: Record<string, any>): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check custom registered validator function
    const customValidator = klinAPIs.validators.get(componentId);
    if (customValidator) {
      const messages = customValidator(props);
      messages.forEach((msg) => {
        errors.push({
          nodeId,
          componentId,
          message: msg,
          severity: "warning",
        });
      });
    }

    // Default metadata constraints validation
    if (componentId === "Button" && !props.children) {
      errors.push({ nodeId, componentId, field: "children", message: "Button must contain label text", severity: "warning" });
    }

    if (componentId === "Navbar" && (!props.links || props.links.length === 0)) {
      errors.push({ nodeId, componentId, field: "links", message: "Navbar must contain navigation links", severity: "warning" });
    }

    return errors;
  }
}

export const validationEngine = new ValidationEngine();
