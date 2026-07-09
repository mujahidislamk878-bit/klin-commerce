export interface PropertyMetadata {
  type: "text" | "textarea" | "color" | "number" | "select" | "spacing" | "asset" | "product";
  label: string;
  default: any;
}

export const MetadataRegistry = {
  getFieldsMetadata(componentType: string): Record<string, PropertyMetadata> {
    switch (componentType) {
      case "Hero":
        return {
          eyebrow: { type: "text", label: "Eyebrow Text", default: "Exclusive collection" },
          title: { type: "textarea", label: "Hero Title", default: "The Ultimate Brand Experience." },
          sub: { type: "textarea", label: "Subtitle", default: "Design storefront layout visually." },
          cta: { type: "text", label: "Button Label", default: "Shop Now" },
          bg: { type: "color", label: "Background Color", default: "#0A0B10" },
          ink: { type: "color", label: "Text Color", default: "#FFFFFF" },
          accent: { type: "color", label: "Accent Highlight", default: "#6366F1" }
        };
      case "Navbar":
        return {
          brand: { type: "text", label: "Brand Label", default: "Enterprise Studio" }
        };
      case "ProductShowcase":
        return {
          productId: { type: "product", label: "Select Catalog Product", default: "" },
          titleOverride: { type: "text", label: "Title Override", default: "" },
          showPrice: { type: "select", label: "Show Price Label", default: true },
          accentColor: { type: "color", label: "Accent Color Theme", default: "#6366F1" }
        };
      default:
        return {};
    }
  }
};
