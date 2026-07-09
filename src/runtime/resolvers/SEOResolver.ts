import { RenderContext } from "../core/RenderContext";

export class SEOResolver {
  public static resolve(context: RenderContext): RenderContext {
    const siteTitle = context.seo?.title || context.website.name || "Klin Site";
    const siteDesc = context.seo?.description || "Klin visual builder page";
    const canonical = `http://${context.settings?.subdomain || "site"}.klin.store/${context.page?.slug === "home" ? "" : context.page?.slug}`;

    // Generate JSON-LD Schema
    const schemaOrg = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": context.website.name,
      "url": `http://${context.settings?.subdomain || "site"}.klin.store`,
      "description": context.website.description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `http://${context.settings?.subdomain || "site"}.klin.store/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    return {
      ...context,
      seo: {
        ...context.seo,
        title: siteTitle,
        description: siteDesc,
        canonicalUrl: canonical,
        ogImage: context.website.logo || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
        twitterCard: "summary_large_image"
      },
      cmsData: {
        ...context.cmsData,
        jsonLdSchema: JSON.stringify(schemaOrg)
      }
    };
  }
}
export default SEOResolver;
