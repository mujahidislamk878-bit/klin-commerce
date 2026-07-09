import { RenderContext } from "../core/RenderContext";

export class CMSResolver {
  public static resolve(context: RenderContext): RenderContext {
    // Hydrates bound database collection references from CMS pool
    const resolvedCmsPool = {
      blog: [
        { title: "Building SaaS with Klin Builder", slug: "building-saas-with-klin", author: "Staff Writer" },
        { title: "Design Systems in 2026", slug: "design-systems-2026", author: "Klin Design Team" }
      ],
      pages: [
        { name: "About Us", link: "/about" },
        { name: "Services", link: "/services" }
      ],
      ...context.cmsData
    };

    return {
      ...context,
      cmsData: resolvedCmsPool
    };
  }
}
export default CMSResolver;
