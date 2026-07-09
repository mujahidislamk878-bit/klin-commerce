import { RenderContext } from "../core/RenderContext";

export class CommerceResolver {
  public static resolve(context: RenderContext): RenderContext {
    // Injects product records and formats currency pricing symbols
    const sampleProducts = [
      { id: "p1", title: "Minimalist Leather Backpack", price: "$149.00", currency: context.currency },
      { id: "p2", title: "Ergonomic Office Chair", price: "$329.00", currency: context.currency },
      { id: "p3", title: "Mechanical Keycap Set", price: "$59.00", currency: context.currency }
    ];

    const sampleCollections = [
      { name: "New Arrivals", slug: "new-arrivals", productIds: ["p1", "p2"] },
      { name: "Workplace Essentials", slug: "workplace", productIds: ["p2", "p3"] }
    ];

    return {
      ...context,
      commerceData: {
        ...context.commerceData,
        products: context.commerceData?.products?.length ? context.commerceData.products : sampleProducts,
        collections: context.commerceData?.collections?.length ? context.commerceData.collections : sampleCollections,
      }
    };
  }
}
export default CommerceResolver;
