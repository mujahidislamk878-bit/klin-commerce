# Klin Framework Component Registry Audit

This audit document tracks the status of component registries, Puck configurations, and metadata definitions across the Klin Framework, outlining the structural consolidation of Phase 2A.

---

## 1. Registry Architecture Comparison

### Existing (Pre-consolidation)
Previously, the codebase suffered from a fragmented component registration system with overlapping definitions:
* **Canonical Registry** (`packages/registry/index.ts`): Defined component keys, categories, full schemas, default properties, and keywords, but was never integrated into the Builder or Interactive Playground.
* **Component Wrapper Registry** (`src/packages/registry/ComponentRegistry.ts`): Extracted list metadata from the manual Puck config to populate the custom Sidebar Explorer list, defining duplicate icons and descriptions.
* **Metadata Inspector Registry** (`src/packages/registry/MetadataRegistry.ts`): Defined duplicate component properties and labels for rendering edit widgets in the custom Property Inspector.
* **Manual Puck Configurations** (`src/lib/puck-config.tsx` & `src/lib/puck-config-builder.tsx`): Contained hardcoded component maps, fields, and custom simplified mockup render HTML.

### Canonical (Post-consolidation)
We have centralized all component definition metadata into a single authoritative source of truth:
* **Sole Registry & API**: `packages/registry/index.ts` and `packages/registry/api.ts` define all Component metadata, schemas, defaultProps, and expose the authoritative `Registry` query layer.
* **Domain-based Namespaces**: Standardized component identification on lowercased, namespaced strings (e.g., `core.hero`, `layout.feature-grid`, `media.gallery`, `commerce.product-showcase`, `marketing.discount-banner`).
* **Metadata & Component Explorer Separation**: The Sidebar Component Explorer and Property Inspector query the Registry API directly, mapping icons (`builder.icon`), builder panels (`builder.panel`), and sorting order (`builder.order`) dynamically.

---

## 2. Mockup/Demo Components Integration

To prevent pollution of the premium component library (`packages/ui`), visual preview mockups are isolated and namespaced logically by domain:
* Mockup component files are located under `packages/ui/mockups/` (`FeatureGrid`, `Gallery`, `ProductShowcase`, `DiscountBanner`).
* The registry imports them via `@klin/ui/mockups` and assigns them to their respective domains:
  - `layout.feature-grid`
  - `media.gallery`
  - `commerce.product-showcase`
  - `marketing.discount-banner`

---

## 3. Data Normalization & Compatibility Flow

To preserve full compatibility with existing MongoDB database pages and JSON templates without filling UI components with legacy checks, we run a versioned normalization layer at all loading boundaries:

```
Template / DB JSON (V1 layout)
       │
       ▼ (contains types like "Hero" & props like "title", "sub", "cta")
normalizePuckData(data, "v1")
       │
       ▼ (converts type -> "core.hero" & maps props -> "heading", "subheading", "primaryCta")
Puck Canvas / WebsiteRenderer
```

This pipeline ensures that no template or data modifications are required, while guaranteeing that all components in the builder receive modern standardized schemas from a single source of truth.
