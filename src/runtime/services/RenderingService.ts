import { RenderContext } from "../core/RenderContext";
import { CacheMiddleware } from "../middlewares/CacheMiddleware";
import { RenderCache } from "../cache/RenderCache";
import { RuntimeEvents } from "../events/RuntimeEvents";

export class RenderingService {
  public static renderPage(context: RenderContext, renderTriggerFn: () => string): { html: string; cacheHit: boolean; hash: string } {
    RuntimeEvents.emit("Render Started", { websiteId: context.website.id, page: context.page.slug });

    // Check rendering cache
    const { hit, cachedHtml, hash } = CacheMiddleware.process(context);
    if (hit && cachedHtml) {
      RuntimeEvents.emit("Render Finished", { websiteId: context.website.id, page: context.page.slug, cacheHit: true });
      return {
        html: cachedHtml,
        cacheHit: true,
        hash
      };
    }

    // Execute render logic compilation
    const html = renderTriggerFn();
    RenderCache.set(hash, html);

    RuntimeEvents.emit("Render Finished", { websiteId: context.website.id, page: context.page.slug, cacheHit: false });
    return {
      html,
      cacheHit: false,
      hash
    };
  }

  public static clearCache() {
    RenderCache.clear();
    RuntimeEvents.emit("Cache Cleared");
  }
}
export default RenderingService;
