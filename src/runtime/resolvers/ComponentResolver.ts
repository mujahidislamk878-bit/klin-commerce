import { RenderContext } from "../core/RenderContext";
import { puckConfig } from "../../lib/puck-config";
import { normalizePuckData } from "../../../packages/registry";

export class ComponentResolver {
  public static resolve(context: RenderContext): RenderContext {
    let layout = JSON.parse(JSON.stringify(context.page.layout || { content: [], root: {} }));
    
    // Normalize layout elements and mapping old props to unified schemas
    layout = normalizePuckData(layout, "v1");

    // Resolve block types inside content
    if (layout.content) {
      layout.content = layout.content.map((block: any) => {
        const componentDef = puckConfig.components[block.type as keyof typeof puckConfig.components];
        return {
          ...block,
          _resolvedComponent: componentDef || null,
          props: {
            // Pre-fill default props if missing
            ...(componentDef?.defaultProps || {}),
            ...block.props,
          }
        };
      });
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
export default ComponentResolver;
