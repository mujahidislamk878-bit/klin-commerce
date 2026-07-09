import { RenderContext } from "../core/RenderContext";

export class ThemeResolver {
  public static resolve(context: RenderContext): RenderContext {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      
      // Set colors
      if (context.theme.colors) {
        Object.entries(context.theme.colors).forEach(([key, val]) => {
          if (val) root.style.setProperty(`--theme-color-${key}`, val);
        });
      }

      // Set radii
      if (context.theme.radii) {
        Object.entries(context.theme.radii).forEach(([key, val]) => {
          if (val) root.style.setProperty(`--theme-radius-${key}`, val);
        });
      }

      // Set spacing
      if (context.theme.spacing) {
        Object.entries(context.theme.spacing).forEach(([key, val]) => {
          if (val) root.style.setProperty(`--theme-space-${key}`, val);
        });
      }
    }
    
    return context;
  }
}
export default ThemeResolver;
