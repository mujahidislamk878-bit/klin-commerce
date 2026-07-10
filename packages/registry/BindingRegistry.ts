export interface DataBindingVariable {
  path: string;
  label: string;
  category: "Products" | "CMS" | "Global Settings" | "Customer";
}

export const BindingRegistry = {
  getVariables(): DataBindingVariable[] {
    return [
      { path: "product.name", label: "Selected Product Name", category: "Products" },
      { path: "product.price", label: "Selected Product Price", category: "Products" },
      { path: "product.description", label: "Selected Product Description", category: "Products" },
      { path: "cms.blog.title", label: "Dynamic Blog Title", category: "CMS" },
      { path: "cms.blog.author", label: "Dynamic Blog Author", category: "CMS" },
      { path: "settings.businessName", label: "Storefront Business Name", category: "Global Settings" },
      { path: "customer.firstName", label: "Customer First Name", category: "Customer" },
      { path: "customer.email", label: "Customer Account Email", category: "Customer" }
    ];
  }
};
