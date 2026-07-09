import { RenderContext } from "./RenderContext";
import ThemeResolver from "../resolvers/ThemeResolver";
import VariableResolver from "../resolvers/VariableResolver";
import ComponentResolver from "../resolvers/ComponentResolver";
import AssetResolver from "../resolvers/AssetResolver";
import CMSResolver from "../resolvers/CMSResolver";
import CommerceResolver from "../resolvers/CommerceResolver";
import ResponsiveResolver from "../resolvers/ResponsiveResolver";
import SEOResolver from "../resolvers/SEOResolver";

export class RuntimeResolver {
  public static resolve(context: RenderContext): RenderContext {
    let currentContext = context;

    // Run resolver chain pipeline sequentially
    currentContext = ThemeResolver.resolve(currentContext);
    currentContext = VariableResolver.resolve(currentContext);
    currentContext = ComponentResolver.resolve(currentContext);
    currentContext = AssetResolver.resolve(currentContext);
    currentContext = CMSResolver.resolve(currentContext);
    currentContext = CommerceResolver.resolve(currentContext);
    currentContext = ResponsiveResolver.resolve(currentContext);
    currentContext = SEOResolver.resolve(currentContext);

    return currentContext;
  }
}
export default RuntimeResolver;
