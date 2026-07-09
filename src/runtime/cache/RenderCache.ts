import { RenderContext } from "../core/RenderContext";

export class RenderCache {
  private static cacheStore: Map<string, string> = new Map();

  public static generateHash(context: RenderContext): string {
    const layoutStr = JSON.stringify(context.page?.layout || "");
    const themeStr = JSON.stringify(context.theme || "");
    const cmsStr = JSON.stringify(context.cmsData || "");
    const deviceStr = context.device || "Desktop";
    const localeStr = context.locale || "en";

    // Standard string hashing helper
    let hash = 0;
    const combined = `${layoutStr}_${themeStr}_${cmsStr}_${deviceStr}_${localeStr}`;
    for (let i = 0; i < combined.length; i++) {
      const chr = combined.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return `hash_${hash}`;
  }

  public static get(hash: string): string | null {
    const value = this.cacheStore.get(hash);
    if (value) {
      console.log(`[CACHE HIT] Render tree loaded from cache: ${hash}`);
      return value;
    }
    return null;
  }

  public static set(hash: string, htmlOutput: string) {
    console.log(`[CACHE STORED] Saved render output to cache: ${hash}`);
    this.cacheStore.set(hash, htmlOutput);
  }

  public static clear() {
    console.log("[CACHE CLEARED] Clearing all renderer cache keys");
    this.cacheStore.clear();
  }
}
export default RenderCache;
