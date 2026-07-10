import { REGISTRY, RegistryEntry } from "./index";

export interface BuilderFilterOptions {
  includeHidden?: boolean;
  panelFilter?: string[];
}

/**
 * Authoritative API for interacting with the Klin Component Registry.
 * Provides abstraction for querying, filtering, and retrieving components.
 */
export const Registry = {
  /**
   * Retrieve a single registry entry by its namespaced ID (e.g. "core.hero") or component name/label.
   */
  get(idOrName: string): RegistryEntry | undefined {
    return REGISTRY.get(idOrName) || Array.from(REGISTRY.values()).find(
      (e) => e.id === idOrName || e.label === idOrName
    );
  },

  /**
   * Get all registered components.
   */
  getAll(): RegistryEntry[] {
    return Array.from(REGISTRY.values());
  },

  /**
   * Get components belonging to a specific domain (e.g. "commerce", "marketing").
   */
  getByDomain(domain: string): RegistryEntry[] {
    const targetDomain = domain.toLowerCase();
    return Array.from(REGISTRY.values()).filter(
      (entry) => entry.domain.toLowerCase() === targetDomain
    );
  },

  /**
   * Get components assigned to a specific builder panel.
   */
  getByBuilderPanel(panel: string): RegistryEntry[] {
    return Array.from(REGISTRY.values()).filter(
      (entry) => entry.builder?.panel === panel
    );
  },

  /**
   * Get all visible components for visual editors.
   */
  getVisible(): RegistryEntry[] {
    return Array.from(REGISTRY.values()).filter(
      (entry) => entry.builder?.visible !== false
    );
  },

  /**
   * Get filtered and ordered list of components for builder sidebar lists.
   */
  getBuilderComponents(options: BuilderFilterOptions = {}): RegistryEntry[] {
    const { includeHidden = false, panelFilter } = options;

    return Array.from(REGISTRY.values())
      .filter((entry) => {
        const isVisible = entry.builder?.visible !== false;
        if (!isVisible && !includeHidden) {
          return false;
        }

        const panel = entry.builder?.panel || entry.domain;
        if (panelFilter && panelFilter.length > 0 && !panelFilter.includes(panel)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const orderA = a.builder?.order ?? 100;
        const orderB = b.builder?.order ?? 100;
        return orderA - orderB;
      });
  },

  /**
   * Retrieve all unique builder panels defined across components.
   */
  getBuilderPanels(): string[] {
    const panels = new Set<string>();
    REGISTRY.forEach((entry) => {
      if (entry.builder?.panel) {
        panels.add(entry.builder.panel);
      } else {
        panels.add(entry.domain);
      }
    });
    return Array.from(panels);
  }
};

export default Registry;
