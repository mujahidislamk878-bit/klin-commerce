import { WebsiteRuntime } from "../core/WebsiteRuntime";
import { RenderContext } from "../core/RenderContext";
import { RuntimeResolver } from "../core/RuntimeResolver";

export class RuntimeService {
  public static async initializeRuntime(subdomain: string, activePageSlug = "home", overrides: Partial<RenderContext> = {}): Promise<RenderContext | null> {
    const rawData = await WebsiteRuntime.fetchSiteData(subdomain);
    if (!rawData) return null;

    const rawContext = WebsiteRuntime.buildContextFromRaw(rawData, activePageSlug, overrides);
    // Resolve entire resolver chain
    return RuntimeResolver.resolve(rawContext);
  }
}
export default RuntimeService;
