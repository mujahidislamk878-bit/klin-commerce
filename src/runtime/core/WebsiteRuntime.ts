import { RenderContext, createRenderContext } from "./RenderContext";

export class WebsiteRuntime {
  public static async fetchSiteData(subdomain: string): Promise<any> {
    try {
      const res = await fetch(`http://localhost:5000/api/sites/resolve/${subdomain}`);
      if (!res.ok) throw new Error(`Subdomain '${subdomain}' not resolved`);
      const result = await res.json();
      return result.success ? result.siteData : null;
    } catch (e) {
      console.error("Failed to load website runtime data:", e);
      return null;
    }
  }

  public static buildContextFromRaw(
    siteData: any,
    activeSlug = "home",
    options: Partial<RenderContext> = {}
  ): RenderContext {
    if (!siteData) {
      return createRenderContext(options);
    }

    const activePage =
      siteData.pages?.find((p: any) => p.slug === activeSlug) ||
      siteData.pages?.[0] ||
      { title: "Home", slug: "home", builderJson: { content: [], root: {} } };

    return createRenderContext({
      website: {
        id: siteData.websiteId || "",
        name: siteData.name || "Klin Site",
        description: siteData.metadata?.websiteDescription || "",
        industry: siteData.metadata?.industry || "",
        supportEmail: siteData.metadata?.supportEmail || "",
        supportPhone: siteData.metadata?.supportPhone || "",
        logo: siteData.metadata?.logo || "",
        favicon: siteData.metadata?.favicon || "",
      },
      page: {
        title: activePage.title,
        slug: activePage.slug,
        layout: activePage.builderJson || { content: [], root: {} },
      },
      navigation: siteData.navigation || [],
      theme: siteData.theme || {},
      settings: siteData.settings || {},
      seo: {
        title: activePage.title || siteData.seo?.title || siteData.name,
        description: siteData.seo?.description || "",
        keywords: siteData.seo?.keywords || [],
      },
      ...options,
    });
  }
}
export default WebsiteRuntime;
