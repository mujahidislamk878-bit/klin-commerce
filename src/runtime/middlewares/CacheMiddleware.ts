import { RenderContext } from "../core/RenderContext";
import { RenderCache } from "../cache/RenderCache";

export class CacheMiddleware {
  public static process(context: RenderContext): { hit: boolean; cachedHtml: string | null; hash: string } {
    const hash = RenderCache.generateHash(context);
    const cachedHtml = RenderCache.get(hash);
    return {
      hit: !!cachedHtml,
      cachedHtml,
      hash
    };
  }
}
export default CacheMiddleware;
