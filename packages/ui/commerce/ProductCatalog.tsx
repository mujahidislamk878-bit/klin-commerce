"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { Grid } from "../layout/Grid";
import { ProductCard, type Product } from "./ProductCard";
import type { EditableProps } from "../../types";

export interface ProductCatalogProps extends EditableProps {
  products?: Product[];
  title?: string;
  layout?: "grid" | "list" | "slider";
  columns?: number;
}

const ProductGrid = forwardRef<HTMLDivElement, ProductCatalogProps>(
  ({ products = [], columns = 3, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <Grid columns={{ desktop: columns as any, tablet: 2, mobile: 1 }} gap="md">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Grid>
      </div>
    );
  }
);
ProductGrid.displayName = "ProductGrid";

const ProductList = forwardRef<HTMLDivElement, ProductCatalogProps>(
  ({ products = [], className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full flex flex-col gap-4", className)} {...props}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} layout="horizontal" />
        ))}
      </div>
    );
  }
);
ProductList.displayName = "ProductList";

const ProductSlider = forwardRef<HTMLDivElement, ProductCatalogProps>(
  ({ products = [], className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full overflow-x-auto flex gap-4 pb-4 scrollbar-none", className)} {...props}>
        {products.map((p) => (
          <div key={p.id} className="min-w-[280px] max-w-[280px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    );
  }
);
ProductSlider.displayName = "ProductSlider";

const FeaturedProducts = forwardRef<HTMLDivElement, ProductCatalogProps>(
  ({ products = [], title = "Featured Products", columns = 3, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-6 w-full", className)} {...props}>
        <h3 className="text-2xl font-bold text-[#0F1020]">{title}</h3>
        <ProductGrid products={products} columns={columns} />
      </div>
    );
  }
);
FeaturedProducts.displayName = "FeaturedProducts";

const RelatedProducts = forwardRef<HTMLDivElement, ProductCatalogProps>(
  ({ products = [], title = "Related Products", columns = 4, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-6 w-full border-t border-[#0F1020]/5 pt-8", className)} {...props}>
        <h3 className="text-xl font-bold text-[#0F1020]">{title}</h3>
        <ProductGrid products={products.slice(0, 4)} columns={columns} />
      </div>
    );
  }
);
RelatedProducts.displayName = "RelatedProducts";

const RecentlyViewed = forwardRef<HTMLDivElement, ProductCatalogProps>(
  ({ products = [], title = "Recently Viewed", className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-6 w-full", className)} {...props}>
        <h3 className="text-lg font-bold text-[#0F1020]/70">{title}</h3>
        <ProductSlider products={products.slice(0, 5)} />
      </div>
    );
  }
);
RecentlyViewed.displayName = "RecentlyViewed";

export { ProductGrid, ProductList, ProductSlider, FeaturedProducts, RelatedProducts, RecentlyViewed };
