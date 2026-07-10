# Puck Configuration & Component Registry Migration Guide

This guide details the auto-generation of Puck configurations from the canonical Component Registry, as established in Phase 2A.

---

## 1. Dynamic Config Generation

Puck editor configurations are now generated automatically by calling `createPuckConfig(options)` defined in `src/lib/createPuckConfig.ts`. 

```
Component Registry (packages/registry)
             │
             ▼ (Registry API query)
   - Map domains and panels to Puck categories
   - Convert schema types to Puck field configs
   - Create render wrapper for component
             │
             ▼
Puck Config Object (categories & components)
```

### Configurator Options
The configuration generator supports dynamic filters to return tailored configurations for different parts of the workspace:
* `includeHidden?: boolean` - If set to `true`, includes registry blocks that are marked as hidden from visual builder canvases.
* `categoryFilter?: string[]` - Restricts generated components to specific list categories (e.g. only rendering `["Layout", "Marketing"]` on the landing page playground).

---

## 2. Adding a New Component to the Builder

To register a new component and make it instantly editable inside Puck and the custom Sidebars with **zero builder code changes**, follow these steps:

1. **Implement the UI Component**: Add your component under `packages/ui` (e.g., under `packages/ui/marketing`, `packages/ui/commerce`, etc.).
2. **Add Registry Entry**: Open `packages/registry/index.ts` and add the component to `RAW_REGISTRY`:
   ```typescript
   RAW_REGISTRY.set("MyNewBlock", {
     component: MyNewBlock,
     label: "My New Block",
     category: "Marketing", // Used by mapping loop to infer domain/panel
     description: "Description of my block",
     defaultProps: {
       subtitle: "Default subtitle"
     },
     schema: {
       title: textSchema("Title text"),
     },
     keywords: ["new", "block"],
   });
   ```
3. **Specify Builder Customizations** (Optional): Add custom builder parameters:
   ```typescript
   builder: {
     visible: true,
     draggable: true,
     panel: "Marketing",
     icon: "Sparkles",
     order: 15
   }
   ```

Puck, the Component Explorer sidebar, the Property Inspector fields, and the Runtime Resolver will automatically query the Registry API, resolve the namespaced block (e.g. `marketing.my-new-block`), render it on drag-and-drop, and expose its editable parameters in the inspector.
