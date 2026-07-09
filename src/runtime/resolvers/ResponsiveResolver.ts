import { RenderContext } from "../core/RenderContext";

export class ResponsiveResolver {
  public static resolve(context: RenderContext): RenderContext {
    const layout = JSON.parse(JSON.stringify(context.page.layout || { content: [], root: {} }));
    const device = context.device.toLowerCase() as "desktop" | "tablet" | "mobile";

    if (layout.content) {
      layout.content = layout.content.map((block: any) => {
        // Resolve responsive spacing, visibility or layouts
        const resolvedProps = { ...block.props };

        // If properties are responsiveProp objects (containing desktop, tablet, mobile fields)
        // compile them to current viewport value so components don't calculate them.
        Object.entries(block.props || {}).forEach(([key, value]: [string, any]) => {
          if (value && typeof value === "object" && ("desktop" in value || "tablet" in value || "mobile" in value)) {
            resolvedProps[key] = value[device] || value["desktop"] || "";
          }
        });

        // Toggle visibility block checks
        let isVisible = true;
        if (block.props?.visibility) {
          const vis = block.props.visibility;
          if (vis[device] === false) {
            isVisible = false;
          }
        }

        return {
          ...block,
          props: resolvedProps,
          _isVisible: isVisible
        };
      });

      // Filter out blocks that should be hidden on current viewport size
      layout.content = layout.content.filter((b: any) => b._isVisible !== false);
    }

    return {
      ...context,
      page: {
        ...context.page,
        layout,
      }
    };
  }
}
export default ResponsiveResolver;
