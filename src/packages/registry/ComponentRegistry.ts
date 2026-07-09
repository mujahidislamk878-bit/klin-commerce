import { puckConfigBuilder } from "../../lib/puck-config-builder";

export interface ComponentMetadata {
  type: string;
  name: string;
  category: string;
  description: string;
  icon: string;
}

export const ComponentRegistry = {
  getComponents(): ComponentMetadata[] {
    const list: ComponentMetadata[] = [];
    const categories = puckConfigBuilder.categories || {};
    
    Object.entries(categories).forEach(([categoryName, cat]) => {
      cat.components.forEach((compName) => {
        list.push({
          type: compName,
          name: compName.replace(/([A-Z])/g, " $1").trim(),
          category: categoryName,
          description: this.getDescription(compName),
          icon: this.getIcon(compName)
        });
      });
    });
    
    return list;
  },

  getDescription(type: string): string {
    switch (type) {
      case "Hero": return "Premium hero showcase with headline and button.";
      case "Navbar": return "Navigation header link lists.";
      case "FeatureGrid": return "Structured features overview boxes.";
      case "Gallery": return "Visual storefront grid lookbook.";
      case "Testimonials": return "User quotes and customer experiences.";
      case "Pricing": return "Product package comparisons list.";
      case "FAQ": return "Frequently Asked Questions folddowns.";
      case "CTA": return "Direct call-to-action button strip.";
      case "Footer": return "Bottom footer details.";
      case "ProductShowcase": return "Single product details selector block.";
      case "ProductGrid": return "Storefront catalog grid rows.";
      case "DiscountBanner": return "Promo discount code notification block.";
      default: return "Visual layout content block.";
    }
  },

  getIcon(type: string): string {
    switch (type) {
      case "Hero": return "Monitor";
      case "Navbar": return "Menu";
      case "FeatureGrid": return "Grid";
      case "Gallery": return "Image";
      case "Testimonials": return "MessageSquare";
      case "Pricing": return "Tag";
      case "FAQ": return "HelpCircle";
      case "CTA": return "Play";
      case "Footer": return "Download";
      case "ProductShowcase": return "ShoppingBag";
      case "ProductGrid": return "LayoutGrid";
      case "DiscountBanner": return "Percent";
      default: return "Box";
    }
  }
};
