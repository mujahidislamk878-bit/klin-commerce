import React from "react";
import type { Config, Data } from "@measured/puck";
import { getTemplate } from "./klin-templates";

// Component props types
type NavProps = { brand: string };
type HeroProps = { eyebrow: string; title: string; sub: string; cta: string; bg: string; ink: string; accent: string };
type FeatureProps = { title: string; items: string };
type GalleryProps = { items: string };
type TestimonialProps = { quote: string; author: string; bg: string; ink: string };
type PricingProps = { tiers: string };
type FaqProps = { items: string };
type CtaProps = { title: string; button: string; bg: string; ink: string };
type FooterProps = { brand: string };

// Additional Builder Specific Commerce Props
type ProductShowcaseProps = { productId: string; titleOverride: string; showPrice: boolean; accentColor: string };
type ProductGridProps = { limit: number; columns: "2" | "3" | "4"; showBorder: boolean };
type DiscountBannerProps = { code: string; percentOff: number; theme: "dark" | "light" };

type BuilderProps = {
  Navbar: NavProps;
  Hero: HeroProps;
  FeatureGrid: FeatureProps;
  Gallery: GalleryProps;
  Testimonials: TestimonialProps;
  Pricing: PricingProps;
  FAQ: FaqProps;
  CTA: CtaProps;
  Footer: FooterProps;
  
  // Custom Storefront Blocks
  ProductShowcase: ProductShowcaseProps;
  ProductGrid: ProductGridProps;
  DiscountBanner: DiscountBannerProps;
};

export const puckConfigBuilder: Config<BuilderProps> = {
  categories: {
    Layout: {
      components: ["Navbar", "Footer"]
    },
    Marketing: {
      components: ["Hero", "FeatureGrid", "Gallery", "Testimonials", "Pricing", "FAQ", "CTA"]
    },
    Storefront: {
      components: ["ProductShowcase", "ProductGrid", "DiscountBanner"]
    }
  },
  components: {
    Navbar: {
      fields: { brand: { type: "text" } },
      defaultProps: { brand: "Enterprise Studio" },
      render: ({ brand }: NavProps) => (
        <div className="flex items-center justify-between px-8 py-5 border-b border-black/5 bg-white">
          <div className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{brand}</div>
          <nav className="hidden gap-6 text-xs font-semibold opacity-70 md:flex">
            <span>Shop All</span><span>New Arrivals</span><span>Categories</span><span>Contact</span>
          </nav>
          <button className="rounded-full bg-black px-4 py-2 text-xs text-white font-bold">Shopping Bag (0)</button>
        </div>
      ),
    },

    Hero: {
      fields: {
        eyebrow: { type: "text" },
        title:   { type: "textarea" },
        sub:     { type: "textarea" },
        cta:     { type: "text" },
        bg:      { type: "text" },
        ink:     { type: "text" },
        accent:  { type: "text" },
      },
      defaultProps: {
        eyebrow: "Exclusive collection",
        title: "The Ultimate Brand Experience.",
        sub: "Design storefront layout visually. Ship instantly.",
        cta: "Shop Now",
        bg: "#0A0B10",
        ink: "#FFFFFF",
        accent: "#6366F1",
      },
      render: ({ eyebrow, title, sub, cta, bg, ink, accent }: HeroProps) => (
        <section className="px-8 py-20 md:py-28 flex flex-col items-center text-center" style={{ background: bg, color: ink }}>
          <div className="text-xs uppercase tracking-widest opacity-80 font-mono font-bold" style={{ color: accent }}>{eyebrow}</div>
          <h1 className="mt-4 max-w-4xl text-5xl md:text-7xl font-bold tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg opacity-85">{sub}</p>
          <button className="mt-8 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition hover:scale-105" style={{ background: accent, color: "#ffffff" }}>
            {cta}
          </button>
        </section>
      ),
    },

    FeatureGrid: {
      fields: {
        title: { type: "text" },
        items: { type: "textarea" },
      },
      defaultProps: {
        title: "Enterprise Core Features",
        items: "Fast Delivery, Secure Payments, 24/7 Support, Premium Quality",
      },
      render: ({ title, items }: FeatureProps) => (
        <section className="px-8 py-16 bg-neutral-50">
          <h2 className="text-3xl font-bold text-center" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {items.split(",").map((it, i) => (
              <div key={i} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm flex flex-col justify-between h-40">
                <div className="text-2xl font-bold text-neutral-300">0{i+1}</div>
                <div className="font-bold text-sm text-[#0F1020]">{it.trim()}</div>
              </div>
            ))}
          </div>
        </section>
      ),
    },

    Gallery: {
      fields: { items: { type: "textarea" } },
      defaultProps: { items: "Lookbook Alpha, Lookbook Beta, Lookbook Gamma, Lookbook Delta" },
      render: ({ items }: GalleryProps) => (
        <section className="px-8 py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {items.split(",").map((it, i) => (
              <div key={i} className="aspect-[4/5] rounded-[24px] bg-neutral-100 p-6 flex flex-col justify-end text-xs font-bold text-neutral-800 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="relative z-10 text-white font-mono text-[10px] tracking-wider uppercase">{it.trim()}</span>
              </div>
            ))}
          </div>
        </section>
      ),
    },

    Testimonials: {
      fields: {
        quote: { type: "textarea" },
        author: { type: "text" },
        bg: { type: "text" }, ink: { type: "text" },
      },
      defaultProps: {
        quote: "This is the best template editor we've ever launched our ecommerce shop with.",
        author: "Chief Brand Director, Aura",
        bg: "#0A0B10", ink: "#FFFFFF",
      },
      render: ({ quote, author, bg, ink }: TestimonialProps) => (
        <section className="px-8 py-24 text-center" style={{ background: bg, color: ink }}>
          <blockquote className="mx-auto max-w-4xl text-2xl md:text-4xl font-serif italic leading-relaxed">
            "{quote}"
          </blockquote>
          <div className="mt-8 text-xs font-bold uppercase tracking-widest opacity-75">— {author}</div>
        </section>
      ),
    },

    Pricing: {
      fields: { tiers: { type: "textarea" } },
      defaultProps: { tiers: "Standard Package|$49/mo, Enterprise Suite|$199/mo, Dedicated Cloud|Custom Plan" },
      render: ({ tiers }: PricingProps) => (
        <section className="px-8 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center" style={{ fontFamily: "Outfit, sans-serif" }}>Pricing Tiers</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {tiers.split(",").map((row, i) => {
              const [name, price] = row.split("|").map((s) => s.trim());
              return (
                <div key={i} className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm flex flex-col justify-between h-56">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">{name}</div>
                    <div className="mt-4 text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{price}</div>
                  </div>
                  <button className="w-full py-3 bg-black text-white rounded-xl text-xs font-bold">Select Plan</button>
                </div>
              );
            })}
          </div>
        </section>
      ),
    },

    FAQ: {
      fields: { items: { type: "textarea" } },
      defaultProps: { items: "What are your shipping rates?|Free standard shipping worldwide., Do you support international returns?|Yes, within 30 days of delivery." },
      render: ({ items }: FaqProps) => (
        <section className="px-8 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center" style={{ fontFamily: "Outfit, sans-serif" }}>Frequently Asked Questions</h2>
          <div className="mt-10 divide-y divide-black/5">
            {items.split(",").map((row, i) => {
              const [q, a] = row.split("|");
              return (
                <div key={i} className="py-5">
                  <div className="font-bold text-sm text-[#0F1020]">{q}</div>
                  <div className="mt-2 text-xs text-neutral-500 leading-relaxed">{a}</div>
                </div>
              );
            })}
          </div>
        </section>
      ),
    },

    CTA: {
      fields: { title: { type: "text" }, button: { type: "text" }, bg: { type: "text" }, ink: { type: "text" } },
      defaultProps: { title: "Explore the new seasons collection.", button: "Shop Collection", bg: "#6366F1", ink: "#FFFFFF" },
      render: ({ title, button, bg, ink }: CtaProps) => (
        <section className="px-8 py-20 text-center rounded-[32px] m-8 shadow-lg" style={{ background: bg, color: ink }}>
          <h2 className="mx-auto max-w-4xl text-3xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            {title}
          </h2>
          <button className="mt-8 rounded-full px-8 py-3.5 bg-white text-[#0F1020] hover:scale-105 transition text-xs font-bold uppercase tracking-wider">
            {button}
          </button>
        </section>
      ),
    },

    Footer: {
      fields: { brand: { type: "text" } },
      defaultProps: { brand: "Enterprise Inc." },
      render: ({ brand }: FooterProps) => (
        <footer className="bg-neutral-900 text-white px-8 py-12 border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-base font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{brand}</div>
            <div className="text-xs text-white/50">© {new Date().getFullYear()} Klin Commerce platform.</div>
          </div>
        </footer>
      ),
    },

    // Custom Storefront Blocks
    ProductShowcase: {
      fields: {
        productId: { type: "text" },
        titleOverride: { type: "text" },
        showPrice: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        accentColor: { type: "text" }
      },
      defaultProps: {
        productId: "p_1",
        titleOverride: "Summer Cotton Hoodie",
        showPrice: true,
        accentColor: "#6366F1"
      },
      render: ({ titleOverride, showPrice, accentColor }: ProductShowcaseProps) => (
        <div className="max-w-4xl mx-auto my-12 p-8 rounded-3xl border border-black/5 bg-white shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center text-xs font-semibold text-neutral-400">
            [Product Image Container]
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[9px] bg-indigo-500/10 text-indigo-600 font-mono tracking-wider uppercase">Hot Seller</span>
            <h3 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{titleOverride}</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">High-performance canvas threads designed for active daily routines.</p>
            {showPrice && <div className="text-lg font-bold font-mono">$89.00</div>}
            <button className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-md transition hover:scale-105" style={{ backgroundColor: accentColor }}>
              Add to cart
            </button>
          </div>
        </div>
      )
    },

    ProductGrid: {
      fields: {
        limit: { type: "number" },
        columns: { type: "radio", options: [{ label: "2 Columns", value: "2" }, { label: "3 Columns", value: "3" }, { label: "4 Columns", value: "4" }] },
        showBorder: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] }
      },
      defaultProps: {
        limit: 3,
        columns: "3",
        showBorder: true
      },
      render: ({ limit, columns, showBorder }: ProductGridProps) => (
        <section className="px-8 py-16 max-w-6xl mx-auto">
          <h3 className="text-xl font-bold mb-8" style={{ fontFamily: "Outfit, sans-serif" }}>Featured Catalog</h3>
          <div className={`grid gap-6 ${
            columns === "2" ? "grid-cols-2" :
            columns === "4" ? "grid-cols-4" : "grid-cols-3"
          }`}>
            {Array.from({ length: limit }).map((_, idx) => (
              <div key={idx} className={`bg-white rounded-3xl p-5 shadow-sm flex flex-col justify-between h-80 ${showBorder ? "border border-black/5" : ""}`}>
                <div className="h-44 w-full bg-neutral-100 rounded-2xl flex items-center justify-center text-[10px] text-neutral-400 font-bold">Product Showcase Image</div>
                <div className="pt-4 flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold">Premium Canvas Tee</h4>
                    <span className="text-[10px] text-neutral-400">Casual Apparel</span>
                  </div>
                  <span className="font-mono text-xs font-bold">$39.00</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )
    },

    DiscountBanner: {
      fields: {
        code: { type: "text" },
        percentOff: { type: "number" },
        theme: { type: "radio", options: [{ label: "Dark mode", value: "dark" }, { label: "Light mode", value: "light" }] }
      },
      defaultProps: {
        code: " KlinSummer30 ",
        percentOff: 30,
        theme: "dark"
      },
      render: ({ code, percentOff, theme }: DiscountBannerProps) => (
        <div className={`py-6 px-8 flex flex-col sm:flex-row justify-between items-center gap-4 m-8 rounded-3xl ${
          theme === "dark" ? "bg-black text-white" : "bg-indigo-50 border border-indigo-100 text-indigo-900"
        }`}>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider">Summer Season Event</h4>
            <p className="text-xs opacity-75 mt-0.5">Use discount promo code at checkout to claim your savings.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold font-mono">{percentOff}% OFF</span>
            <div className={`px-4 py-2 border rounded-xl font-mono text-xs font-bold uppercase ${
              theme === "dark" ? "border-white/20 bg-white/5 text-white" : "border-indigo-200 bg-white text-indigo-900"
            }`}>
              Code: {code}
            </div>
          </div>
        </div>
      )
    }
  }
};
export default puckConfigBuilder;
