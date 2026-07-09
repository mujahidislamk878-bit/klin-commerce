import { WebsiteRuntime } from "../core/WebsiteRuntime";
import { RenderContext } from "../core/RenderContext";
import { RuntimeResolver } from "../core/RuntimeResolver";

export class WebsiteRuntimeService {
  public static async fetchAndHydrate(
    subdomain: string,
    activePageSlug = "home",
    overrides: Partial<RenderContext> = {}
  ): Promise<RenderContext | null> {
    const rawData = await WebsiteRuntime.fetchSiteData(subdomain);
    if (!rawData) return null;

    const rawContext = WebsiteRuntime.buildContextFromRaw(rawData, activePageSlug, overrides);
    return RuntimeResolver.resolve(rawContext);
  }
}
export default WebsiteRuntimeService;
