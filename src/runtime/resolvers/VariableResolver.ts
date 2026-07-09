import { RenderContext } from "../core/RenderContext";

export class VariableResolver {
  public static resolve(context: RenderContext): RenderContext {
    // Deep clone active layout to resolve dynamic placeholders without side effects
    const layout = JSON.parse(JSON.stringify(context.page.layout || { content: [], root: {} }));

    const resolvePath = (path: string): string => {
      const parts = path.split(".");
      let root: any = null;

      switch (parts[0]) {
        case "website":
          root = context.website;
          break;
        case "settings":
          root = context.settings;
          break;
        case "page":
          root = context.page;
          break;
        case "seo":
          root = context.seo;
          break;
        case "user":
        case "customer":
          root = context.userSession;
          break;
        case "workspace":
          root = { name: "Klin SaaS Workspace", plan: "Enterprise Plan" };
          break;
        case "globals":
          root = { year: new Date().getFullYear().toString() };
          break;
        case "product":
          root = context.commerceData?.products?.[0] || { title: "Sample Product", price: "$49.00" };
          break;
        case "collection":
          root = context.commerceData?.collections?.[0] || { name: "Sample Collection" };
          break;
        case "order":
          root = { total: "$129.00", shipping: { address: "123 Main St, New York, NY" } };
          break;
        default:
          root = context.cmsData;
          break;
      }

      if (!root) return "";

      let current = root;
      // Traverse rest of properties e.g. "settings.localization.currency"
      for (const p of parts.slice(1)) {
        if (current && typeof current === "object" && p in current) {
          current = current[p];
        } else {
          return "";
        }
      }

      return current !== undefined && current !== null ? String(current) : "";
    };

    const processString = (str: string): string => {
      return str.replace(/\{\{([^}]+)\}\}/g, (_, match) => {
        return resolvePath(match.trim());
      });
    };

    const traverse = (obj: any): any => {
      if (typeof obj === "string") {
        return processString(obj);
      }
      if (Array.isArray(obj)) {
        return obj.map(traverse);
      }
      if (obj !== null && typeof obj === "object") {
        const nextObj: any = {};
        Object.entries(obj).forEach(([key, val]) => {
          nextObj[key] = traverse(val);
        });
        return nextObj;
      }
      return obj;
    };

    if (layout.content) {
      layout.content = traverse(layout.content);
    }

    return {
      ...context,
      page: {
        ...context.page,
        layout,
      },
    };
  }
}
export default VariableResolver;
