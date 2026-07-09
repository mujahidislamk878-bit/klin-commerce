# Puck Builder Registry Guide (Enterprise v2.0)

This guide documents the JSON Schema mapping configs, categories, and inspector fields used to expose Design System components inside the Puck editor interface.

---

## 1. Schema Property Builders

Registry properties use unified JSON descriptors mapped in `packages/registry/index.ts` to render editing widgets in the sidebar inspector.

```typescript
const textSchema = (label: string) => ({
  type: "text" as const,
  label,
});

const numberSchema = (label: string, min?: number, max?: number) => ({
  type: "number" as const,
  label,
  ...(min !== undefined ? { min } : {}),
  ...(max !== undefined ? { max } : {}),
});

const selectSchema = (label: string, options: string[]) => ({
  type: "select" as const,
  label,
  options: options.map((o) => ({ label: o, value: o })),
});

const booleanSchema = (label: string) => ({
  type: "radio" as const,
  label,
  options: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
});
```

---

## 2. Editor Categories

To keep the drag-and-drop workspace clean, components are categorized in the sidebar palette:

### 1. Typography
- **Heading:** Structured title headings.
- **Text:** Responsive text paragraphs.

### 2. Navigation
- **Navbar:** Sticky/transparent nav header.

### 3. Builder
- **Scroll Anchor:** Target anchors for landing page routing.
- **Divider** & **Spacer:** Layout spacers.

### 4. Commerce
- **Product Grid:** Catalog listing grids.
- **Product Card:** Direct product link cards.

### 5. Forms
- **OTP Input:** Auto-focus shifting pin verify field.

### 6. Dashboard
- **Line Chart:** Realtime SVG analytics lines widget.

### 7. Animation
- **Tilt Card:** 3D cursor-tracking tilt block.
- **Lottie Player:** Autoplay animation canvas wrapper.
