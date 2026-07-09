export interface RenderContext {
  website: {
    id: string;
    name: string;
    description?: string;
    industry?: string;
    supportEmail?: string;
    supportPhone?: string;
    socialLinks?: Record<string, string>;
    logo?: string;
    favicon?: string;
  };
  page: {
    title: string;
    slug: string;
    layout: any; // Puck builderJson
  };
  navigation: any[];
  theme: {
    colors: Record<string, string>;
    radii?: Record<string, string>;
    fonts?: Record<string, string>;
    shadows?: Record<string, string>;
    spacing?: Record<string, string>;
    components?: Record<string, any>;
  };
  locale: string;
  direction: "LTR" | "RTL";
  currency: string;
  device: "Desktop" | "Laptop" | "Tablet" | "Mobile";
  viewport: { width: number; height: number };
  userSession: {
    isAuthenticated: boolean;
    userId?: string;
    email?: string;
    name?: string;
    role?: "Guest" | "Customer" | "Admin";
  } | null;
  cmsData: Record<string, any>;
  commerceData: {
    products: any[];
    collections: any[];
    cart: any[];
    totals: number;
  };
  assets: {
    manifest: any;
    images: any[];
    videos: any[];
    fonts: any[];
    svg: any[];
    icons: any[];
  };
  settings: {
    subdomain: string;
    customDomain?: string;
    performance?: any;
    security?: any;
    integrations?: any;
  };
  seo: {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    twitterCard?: string;
    canonicalUrl?: string;
  };
}

export function createRenderContext(params: Partial<RenderContext>): RenderContext {
  const defaultContext: RenderContext = {
    website: {
      id: "",
      name: "Klin Site",
      description: "",
      industry: "General",
      supportEmail: "",
      supportPhone: "",
      socialLinks: {},
      logo: "",
      favicon: "",
    },
    page: {
      title: "Home",
      slug: "home",
      layout: { content: [], root: {} },
    },
    navigation: [],
    theme: {
      colors: {
        primary: "#0f172a",
        secondary: "#f8fafc",
        accent: "#4f46e5",
        background: "#ffffff",
        foreground: "#0f172a",
      },
      radii: { sm: "4px", md: "8px", lg: "16px" },
      fonts: { body: "Inter", heading: "Outfit" },
      shadows: { sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.1)" },
      spacing: { sm: "8px", md: "16px", lg: "24px" },
    },
    locale: "en",
    direction: "LTR",
    currency: "USD",
    device: "Desktop",
    viewport: { width: 1440, height: 900 },
    userSession: {
      isAuthenticated: false,
      role: "Guest",
    },
    cmsData: {},
    commerceData: {
      products: [],
      collections: [],
      cart: [],
      totals: 0,
    },
    assets: {
      manifest: {},
      images: [],
      videos: [],
      fonts: [],
      svg: [],
      icons: [],
    },
    settings: {
      subdomain: "my-site",
      customDomain: "",
    },
    seo: {
      title: "Klin Site",
      description: "Modern website powered by Klin",
      keywords: [],
    },
  };

  // Merge parameters recursively
  const merged = {
    ...defaultContext,
    ...params,
    website: { ...defaultContext.website, ...params.website },
    page: { ...defaultContext.page, ...params.page },
    theme: {
      ...defaultContext.theme,
      ...params.theme,
      colors: { ...defaultContext.theme.colors, ...params.theme?.colors },
      radii: { ...defaultContext.theme.radii, ...params.theme?.radii },
      fonts: { ...defaultContext.theme.fonts, ...params.theme?.fonts },
      shadows: { ...defaultContext.theme.shadows, ...params.theme?.shadows },
      spacing: { ...defaultContext.theme.spacing, ...params.theme?.spacing },
    },
    userSession: params.userSession ? { ...defaultContext.userSession, ...params.userSession } : defaultContext.userSession,
    commerceData: { ...defaultContext.commerceData, ...params.commerceData },
    assets: { ...defaultContext.assets, ...params.assets },
    settings: { ...defaultContext.settings, ...params.settings },
    seo: { ...defaultContext.seo, ...params.seo },
  };

  // Return deep-frozen immutable object
  return Object.freeze(merged) as RenderContext;
}
