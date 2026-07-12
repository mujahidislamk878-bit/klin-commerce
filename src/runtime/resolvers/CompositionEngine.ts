import { Registry } from "../../../packages/registry";

export type LayoutMode = "safe" | "advanced" | "pro";

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  suggestion?: string;
}

class CompositionEngineManager {
  private activeMode: LayoutMode = "safe";

  setMode(mode: LayoutMode) {
    this.activeMode = mode;
    console.log(`[CompositionEngine] Layout Mode set to: ${mode.toUpperCase()}`);
  }

  getMode(): LayoutMode {
    return this.activeMode;
  }

  /**
   * Validates placement rules based on layout capabilities, compatibility, slots, and HTML accessibility structures.
   */
  validatePlacement(
    componentType: string,
    parentType: string | null,
    slotName?: string
  ): ValidationResult {
    const compEntry = Registry.get(componentType);
    const parentEntry = parentType ? Registry.get(parentType) : null;

    if (!compEntry) {
      return { allowed: true };
    }

    const childName = compEntry.id.split(".").pop() || compEntry.label || componentType;
    const parentName = parentEntry ? (parentEntry.id.split(".").pop() || parentEntry.label) : "Root";

    // 1. Accessibility HTML Validation Rules (Prevents nesting interactive controls inside themselves)
    if (parentEntry) {
      const pClean = parentName.toLowerCase();
      const cClean = childName.toLowerCase();

      if (cClean === "button" && pClean === "button") {
        return {
          allowed: false,
          reason: "HTML Accessibility violation: A button cannot be nested inside another button.",
          suggestion: "Use a regular text label or span styling instead."
        };
      }
      if (cClean === "form" && pClean === "form") {
        return {
          allowed: false,
          reason: "HTML Standard violation: A form cannot contain another form block.",
          suggestion: "Position them as sibling columns or separate page sections."
        };
      }
      if ((cClean === "link" || cClean === "linktext" || cClean === "anchor") && 
          (pClean === "link" || pClean === "linktext" || pClean === "anchor")) {
        return {
          allowed: false,
          reason: "HTML Standard violation: An anchor link cannot nest inside another link.",
          suggestion: "Try using plain bold texts or decorative spans."
        };
      }
    }

    // 2. Mode specific validation rules
    if (this.activeMode === "safe") {
      // Safe Mode constraints:
      // In safe mode, nesting is heavily restricted to predefined slots/containers.
      // E.g., Sections can only stack at root, other components must sit within sections.
      if (!parentType) {
        const rootOnly = ["core.navbar", "core.footer", "layout.section", "Section"];
        const isRootAllowed = rootOnly.some(item => compEntry.id.includes(item) || childName.includes(item)) || compEntry.domain === "layout";
        
        if (!isRootAllowed) {
          return {
            allowed: false,
            reason: `Safe Mode: Component "${childName}" cannot be placed at the page root level.`,
            suggestion: "Please drag a 'Section' onto the page first, then drop your component inside it."
          };
        }
      }
    }

    // 3. Parent-Child Compatibility Checks
    if (parentEntry) {
      const parentCompatibility = parentEntry.compatibility;
      if (parentCompatibility) {
        // Rejects check
        if (parentCompatibility.rejects?.some(r => compEntry.id.includes(r) || childName.includes(r))) {
          return {
            allowed: false,
            reason: `Compatibility Rule: Component "${childName}" is rejected by parent "${parentName}".`,
            suggestion: `Place "${childName}" in a Section, Container, or Grid component instead.`
          };
        }
        // Accepts check
        if (parentCompatibility.accepts && !parentCompatibility.accepts.some(a => compEntry.id.includes(a) || childName.includes(a))) {
          return {
            allowed: false,
            reason: `Compatibility Rule: Parent "${parentName}" only accepts specific components.`,
            suggestion: `Allowed components inside: ${parentCompatibility.accepts.join(", ")}`
          };
        }
      }
    }

    // 4. Named Slots Compatibility Checks
    if (parentEntry && slotName) {
      const slotRules = parentEntry.slots?.[slotName];
      if (slotRules) {
        // Rejects check
        if (slotRules.rejects?.some(r => compEntry.id.includes(r) || childName.includes(r))) {
          return {
            allowed: false,
            reason: `Slot Rule: Component "${childName}" is rejected by the "${slotName}" slot inside "${parentName}".`,
            suggestion: `Drag a different text or badge item here.`
          };
        }
        // Accepts check
        if (slotRules.accepts && !slotRules.accepts.some(a => compEntry.id.includes(a) || childName.includes(a))) {
          return {
            allowed: false,
            reason: `Slot Rule: The "${slotName}" slot inside "${parentName}" only accepts compatible sub-components.`,
            suggestion: `Accepted in this slot: ${slotRules.accepts.join(", ")}`
          };
        }
      }
    }

    return { allowed: true };
  }
}

export const CompositionEngine = new CompositionEngineManager();
export default CompositionEngine;
