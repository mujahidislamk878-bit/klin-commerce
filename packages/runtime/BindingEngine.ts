"use client";

export interface DataBinding {
  sourceType: "static" | "cms" | "product" | "customer" | "order" | "global";
  key: string; // e.g. "product.name", "customer.firstName"
}

export class BindingEngine {
  public resolve(binding: DataBinding, contextData: any): any {
    if (!binding || binding.sourceType === "static") {
      return null;
    }

    const { sourceType, key } = binding;
    const dataPool = contextData?.[sourceType];
    if (!dataPool) return null;

    // Resolve nested keys e.g. "profile.name"
    return key.split(".").reduce((acc, curr) => acc?.[curr], dataPool);
  }
}

export const bindingEngine = new BindingEngine();
