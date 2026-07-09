import type React from "react";

// ── Layout ──
import { Section } from "../ui/layout/Section";
import { Container } from "../ui/layout/Container";
import { Grid } from "../ui/layout/Grid";
import { Flex } from "../ui/layout/Flex";
import { Stack } from "../ui/layout/Stack";
import { Columns } from "../ui/layout/Columns";

// ── Typography ──
import { Heading } from "../ui/typography/Heading";
import { Paragraph } from "../ui/typography/Paragraph";
import { Badge } from "../ui/typography/Badge";
import { Caption } from "../ui/typography/Caption";

// ── Buttons ──
import { Button } from "../ui/buttons/Button";
import { Link } from "../ui/buttons/Link";

// ── Media ──
import { Image } from "../ui/media/Image";
import { Video } from "../ui/media/Video";
import { Icon } from "../ui/media/Icon";

// ── Marketing ──
import { Hero } from "../ui/marketing/Hero";
import { Footer } from "../ui/marketing/Footer";
import { Carousel } from "../ui/marketing/Carousel";
import { Card } from "../ui/marketing/Card";
import { Testimonials } from "../ui/marketing/Testimonials";
import { Pricing } from "../ui/marketing/Pricing";
import { FAQ } from "../ui/marketing/FAQ";
import { CTA } from "../ui/marketing/CTA";
import { LogoCloud } from "../ui/marketing/LogoCloud";
import { Timeline } from "../ui/marketing/Timeline";
import { Stats } from "../ui/marketing/Stats";
import { Quote } from "../ui/marketing/Quote";
import { NotificationBar } from "../ui/marketing/NotificationBar";
import { Avatar } from "../ui/marketing/Avatar";
import { Rating } from "../ui/marketing/Rating";
import { CountUp } from "../ui/marketing/CountUp";

// ── Forms ──
import { Input } from "../ui/forms/Input";
import { Textarea } from "../ui/forms/Textarea";
import { Select } from "../ui/forms/Select";
import { Checkbox } from "../ui/forms/Checkbox";
import { Toggle } from "../ui/forms/Toggle";

// ── Navigation ──
import { Breadcrumbs } from "../ui/navigation/Breadcrumbs";
import { Tabs } from "../ui/navigation/Tabs";
import { Pagination } from "../ui/navigation/Pagination";

// ── Overlay ──
import { Modal } from "../ui/overlay/Modal";
import { Drawer } from "../ui/overlay/Drawer";
import { Accordion } from "../ui/overlay/Accordion";
import { Alert } from "../ui/overlay/Alert";

// ── Dashboard ──
import { KpiCard } from "../ui/dashboard/KpiCard";
import { Metric } from "../ui/dashboard/Metric";
import { DataTable } from "../ui/dashboard/DataTable";

// ── Commerce ──
import { ProductCard } from "../ui/commerce/ProductCard";
import { CartItem } from "../ui/commerce/CartItem";

// ── New Typography ──
import { Text, Label, Code, Blockquote, GradientText, Highlight, LinkText, UnorderedList, Kbd, RichText, AnimatedText } from "../ui/typography";

// ── New Navigation ──
import { Navbar, SidebarNav, FooterNav, CommandPalette, SearchBar, StepNav } from "../ui/navigation";

// ── New Builder ──
import { Spacer, Divider, HtmlEmbed, Visibility, Anchor, ShapeDivider, ResponsiveWrapper, EmptyState, SlotComponent, CanvasContainer, SectionBackground } from "../ui/builder";

// ── New Commerce ──
import { ProductGrid, ProductList, ProductSlider, FeaturedProducts, RelatedProducts, RecentlyViewed, ProductGallery, ProductRating, SkuDisplay, StockIndicator, VariantSelector, QuantitySelector, ProductDetails, ProductTabs, ProductReviews, AddToCartButton, BuyNowButton, CartSummary, CartDrawer, MiniCart, ShippingAddress, BillingAddress, ShippingSelector, PaymentMethods, CheckoutForm, WishlistButton, CompareButton, AccountMenu, LoginButton } from "../ui/commerce";

// ── New Forms ──
import { ColorPicker, DatePicker, TimePicker, OTPInput, PhoneInput, RatingInput, Combobox, MultiSelect, Slider, Range, FileUpload, DragUpload, SearchInput, AddressForm } from "../ui/forms";

// ── New Dashboard ──
import { LineChart, AreaChart, BarChart, PieChart, RevenueCard, ActivityFeed, DashboardTimeline as TrackerTimeline, CalendarWidget, KanbanBoard, HeatmapGrid, ProgressWidgets } from "../ui/dashboard";

// ── New Animation ──
import { TiltCard, HoverGlow, Ripple, Confetti, Skeleton, LottieWrapper } from "../ui/animation";

// ── Types ──

export interface RegistryEntry<T = any> {
  component: React.ComponentType<T>;
  label: string;
  category: string;
  subcategory?: string;
  description?: string;
  defaultProps?: Partial<T>;
  /** JSON Schema describing the Puck-compatible editable props */
  schema: Record<string, any>;
  editable?: boolean;
  deletable?: boolean;
  nesting?: { allowed?: string[]; disallowed?: string[] };
  keywords?: string[];
  thumbnail?: string;
}

export type ComponentRegistry = Map<string, RegistryEntry<any>>;

// ── Generic schema helpers ──

const textSchema = (label: string) => ({
  type: "text" as const,
  label,
});

const numberSchema = (label: string, min?: number, max?: number) => ({
  type: "number" as const,
  label,
  ...(min !== undefined ? { min } : {}),
  ...(max !== undefined ? { max } : {}),
});

const selectSchema = (label: string, options: string[]) => ({
  type: "select" as const,
  label,
  options: options.map((o) => ({ label: o, value: o })),
});

const booleanSchema = (label: string) => ({
  type: "radio" as const,
  label,
  options: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
});

const responsiveProp = (label: string) => ({
  type: "object" as const,
  label,
  subfields: {
    desktop: { type: "text" as const, label: "Desktop" },
    tablet: { type: "text" as const, label: "Tablet" },
    mobile: { type: "text" as const, label: "Mobile" },
  },
});

const colorSchema = (label: string) => ({
  type: "text" as const,
  label,
});

// ── Registry ──

export const REGISTRY: ComponentRegistry = new Map([
  // ══════════════════════════════════════════════
  // LAYOUT
  // ══════════════════════════════════════════════
  [
    "Section",
    {
      component: Section,
      label: "Section",
      category: "Layout",
      description: "A page section with background, spacing, and width constraints",
      defaultProps: {
        padding: { desktop: "lg", tablet: "md", mobile: "sm" },
        variant: "default",
        width: "contained",
      },
      schema: {
        padding: responsiveProp("Padding"),
        variant: selectSchema("Variant", [
          "default",
          "muted",
          "accent",
          "card",
          "bordered",
        ]),
        width: selectSchema("Width", ["full", "contained", "wide", "narrow"]),
        bgColor: colorSchema("Background Colour"),
        bgImage: textSchema("Background Image URL"),
        radius: selectSchema("Border Radius", [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "full",
        ]),
        border: booleanSchema("Border"),
        shadow: selectSchema("Shadow", [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "float",
          "lift",
          "soft",
        ]),
      },
      keywords: [
        "section",
        "wrapper",
        "container",
        "segment",
        "block",
        "area",
      ],
    },
  ],
  [
    "Container",
    {
      component: Container,
      label: "Container",
      category: "Layout",
      description: "A centred content wrapper with optional max-width",
      defaultProps: { maxWidth: "1280px" },
      schema: {
        maxWidth: textSchema("Max Width"),
        paddingX: booleanSchema("Horizontal Padding"),
        paddingY: booleanSchema("Vertical Padding"),
      },
      keywords: ["container", "wrapper", "center", "max-width"],
    },
  ],
  [
    "Grid",
    {
      component: Grid,
      label: "Grid",
      category: "Layout",
      description: "CSS grid layout with responsive columns and gap control",
      defaultProps: { columns: 3, gap: "md" },
      schema: {
        columns: {
          type: "object",
          label: "Columns",
          subfields: {
            desktop: numberSchema("Desktop", 1, 12),
            tablet: numberSchema("Tablet", 1, 12),
            mobile: numberSchema("Mobile", 1, 12),
          },
        },
        gap: selectSchema("Gap", [
          "none",
          "xs",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
        ]),
        align: selectSchema("Align", ["start", "center", "end", "stretch"]),
      },
      keywords: ["grid", "columns", "layout", "cards"],
    },
  ],
  [
    "Flex",
    {
      component: Flex,
      label: "Flex",
      category: "Layout",
      description: "Flexbox container with responsive direction and alignment",
      defaultProps: { direction: "row", gap: "md" },
      schema: {
        direction: {
          type: "object",
          label: "Direction",
          subfields: {
            desktop: selectSchema("Desktop", [
              "row",
              "col",
              "row-reverse",
              "col-reverse",
            ]),
            tablet: selectSchema("Tablet", [
              "row",
              "col",
              "row-reverse",
              "col-reverse",
            ]),
            mobile: selectSchema("Mobile", [
              "row",
              "col",
              "row-reverse",
              "col-reverse",
            ]),
          },
        },
        gap: selectSchema("Gap", [
          "none",
          "xs",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
        ]),
        wrap: booleanSchema("Wrap"),
        align: selectSchema("Align", ["start", "center", "end", "stretch"]),
        justify: selectSchema("Justify", [
          "start",
          "center",
          "end",
          "between",
          "around",
          "evenly",
        ]),
      },
      keywords: ["flex", "flexbox", "row", "layout"],
    },
  ],
  [
    "Stack",
    {
      component: Stack,
      label: "Stack",
      category: "Layout",
      description: "Vertical flex stack with consistent gap between children",
      defaultProps: { gap: "md", align: "stretch" },
      schema: {
        gap: selectSchema("Gap", [
          "none",
          "xs",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
        ]),
        align: selectSchema("Align", ["start", "center", "end", "stretch"]),
        divider: booleanSchema("Show Dividers"),
      },
      keywords: ["stack", "vertical", "column", "vstack"],
    },
  ],
  [
    "Columns",
    {
      component: Columns,
      label: "Columns",
      category: "Layout",
      description: "Two-column layout with configurable ratio and breakpoint",
      defaultProps: { ratio: "1:1", gap: "md", stackedOn: "mobile" },
      schema: {
        ratio: textSchema("Column Ratio (e.g. 1:1, 2:1, 3:2)"),
        gap: selectSchema("Gap", [
          "none",
          "xs",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
        ]),
        stackedOn: selectSchema("Stack On", ["mobile", "tablet", "never"]),
        align: selectSchema("Align", ["start", "center", "end", "stretch"]),
      },
      keywords: ["columns", "two-column", "split", "sidebar"],
    },
  ],

  // ══════════════════════════════════════════════
  // TYPOGRAPHY
  // ══════════════════════════════════════════════
  [
    "Heading",
    {
      component: Heading,
      label: "Heading",
      category: "Typography",
      description: "Section heading with configurable level, size, and weight",
      defaultProps: {
        level: 2,
        size: "4xl",
        weight: "bold",
        children: "Heading Text",
      },
      schema: {
        children: textSchema("Text"),
        level: selectSchema("HTML Level", ["1", "2", "3", "4", "5", "6"]),
        size: selectSchema("Size", [
          "xs",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "4xl",
          "5xl",
          "6xl",
          "7xl",
          "8xl",
          "9xl",
        ]),
        weight: selectSchema("Weight", [
          "light",
          "normal",
          "medium",
          "semibold",
          "bold",
        ]),
        color: colorSchema("Colour"),
        align: selectSchema("Align", ["left", "center", "right"]),
        tracking: selectSchema("Letter Spacing", [
          "tight",
          "normal",
          "wide",
          "wider",
          "widest",
        ]),
        gradient: textSchema("Gradient (optional, e.g. from-blue-500 to-purple-500)"),
      },
      keywords: [
        "heading",
        "title",
        "h1",
        "h2",
        "h3",
        "headline",
        "typography",
      ],
    },
  ],
  [
    "Paragraph",
    {
      component: Paragraph,
      label: "Paragraph",
      category: "Typography",
      description: "Body text with size, colour, and clamp control",
      defaultProps: { size: "md", children: "Paragraph text goes here." },
      schema: {
        children: textSchema("Text"),
        size: selectSchema("Size", ["xs", "sm", "md", "lg", "xl"]),
        color: colorSchema("Colour"),
        align: selectSchema("Align", ["left", "center", "right"]),
        weight: selectSchema("Weight", [
          "light",
          "normal",
          "medium",
          "semibold",
          "bold",
        ]),
        clamp: numberSchema("Line Clamp", 1, 10),
        maxWidth: textSchema("Max Width"),
      },
      keywords: [
        "paragraph",
        "text",
        "body",
        "p",
        "content",
        "typography",
      ],
    },
  ],
  [
    "Badge",
    {
      component: Badge,
      label: "Badge",
      category: "Typography",
      description: "Small label for status, tags, or metadata",
      defaultProps: {
        variant: "default",
        size: "sm",
        children: "Badge",
      },
      schema: {
        children: textSchema("Label"),
        variant: selectSchema("Variant", [
          "default",
          "outline",
          "soft",
          "solid",
          "dot",
        ]),
        size: selectSchema("Size", ["xs", "sm", "md", "lg"]),
        color: colorSchema("Colour"),
      },
      keywords: ["badge", "tag", "label", "status", "chip", "pill"],
    },
  ],
  [
    "Caption",
    {
      component: Caption,
      label: "Caption",
      category: "Typography",
      description: "Small supporting text for images, tables, or footnotes",
      defaultProps: { size: "sm", children: "Caption text" },
      schema: {
        children: textSchema("Text"),
        size: selectSchema("Size", ["xs", "sm", "md"]),
        color: colorSchema("Colour"),
        align: selectSchema("Align", ["left", "center", "right"]),
        uppercase: booleanSchema("Uppercase"),
      },
      keywords: ["caption", "small", "footnote", "figcaption"],
    },
  ],

  // ══════════════════════════════════════════════
  // BUTTONS
  // ══════════════════════════════════════════════
  [
    "Button",
    {
      component: Button,
      label: "Button",
      category: "Buttons",
      description: "Action button with multiple variants and sizes",
      defaultProps: { variant: "primary", size: "md", children: "Button" },
      schema: {
        children: textSchema("Label"),
        variant: selectSchema("Variant", [
          "primary",
          "secondary",
          "outline",
          "ghost",
          "soft",
          "link",
          "gradient",
        ]),
        size: selectSchema("Size", ["xs", "sm", "md", "lg", "xl"]),
        radius: selectSchema("Radius", [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "full",
        ]),
        fullWidth: booleanSchema("Full Width"),
        loading: booleanSchema("Loading State"),
        disabled: booleanSchema("Disabled"),
        href: textSchema("Link URL (optional)"),
      },
      keywords: [
        "button",
        "cta",
        "action",
        "submit",
        "btn",
        "click",
      ],
    },
  ],
  [
    "Link",
    {
      component: Link,
      label: "Link",
      category: "Buttons",
      description: "Textual link with optional underline and icon",
      defaultProps: { variant: "default", children: "Link", href: "#" },
      schema: {
        children: textSchema("Label"),
        href: textSchema("URL"),
        variant: selectSchema("Variant", [
          "default",
          "underline",
          "muted",
          "ghost",
        ]),
        size: selectSchema("Size", ["sm", "md", "lg"]),
        external: booleanSchema("Open in New Tab"),
      },
      keywords: ["link", "anchor", "a", "hyperlink", "url"],
    },
  ],

  // ══════════════════════════════════════════════
  // MEDIA
  // ══════════════════════════════════════════════
  [
    "Image",
    {
      component: Image,
      label: "Image",
      category: "Media",
      description: "Responsive image with lazy loading, caption, and hover zoom",
      defaultProps: {
        src: "https://placehold.co/800x600",
        alt: "Image",
      },
      schema: {
        src: textSchema("Image URL"),
        alt: textSchema("Alt Text"),
        width: textSchema("Width"),
        height: textSchema("Height"),
        radius: selectSchema("Radius", [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "full",
        ]),
        objectFit: selectSchema("Object Fit", [
          "cover",
          "contain",
          "fill",
          "none",
          "scale-down",
        ]),
        caption: textSchema("Caption"),
        zoomOnHover: booleanSchema("Zoom on Hover"),
        lazy: booleanSchema("Lazy Load"),
      },
      keywords: ["image", "img", "photo", "picture", "media"],
    },
  ],
  [
    "Video",
    {
      component: Video,
      label: "Video",
      category: "Media",
      description: "Embedded video player with autoplay and poster support",
      defaultProps: { src: "", controls: true },
      schema: {
        src: textSchema("Video URL"),
        poster: textSchema("Poster Image URL"),
        controls: booleanSchema("Show Controls"),
        autoPlay: booleanSchema("Auto Play"),
        loop: booleanSchema("Loop"),
        muted: booleanSchema("Muted"),
        radius: selectSchema("Radius", [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "full",
        ]),
      },
      keywords: ["video", "player", "media", "embed"],
    },
  ],
  [
    "Icon",
    {
      component: Icon,
      label: "Icon",
      category: "Media",
      description: "Lucide icon with configurable size and colour",
      defaultProps: { name: "Star", size: 24 },
      schema: {
        name: textSchema("Icon Name (Lucide)"),
        size: numberSchema("Size", 12, 64),
        color: colorSchema("Colour"),
        strokeWidth: numberSchema("Stroke Width", 1, 3),
      },
      keywords: ["icon", "svg", "lucide", "symbol", "graphic"],
    },
  ],

  // ══════════════════════════════════════════════
  // MARKETING
  // ══════════════════════════════════════════════
  [
    "Hero",
    {
      component: Hero,
      label: "Hero",
      category: "Marketing",
      subcategory: "Sections",
      description:
        "Full-width hero section with heading, subtext, CTAs, and optional image",
      defaultProps: {
        variant: "default",
        heading: "Hero Title",
        subheading: "Supporting text goes here",
      },
      schema: {
        heading: textSchema("Heading"),
        subheading: textSchema("Subheading"),
        variant: selectSchema("Variant", [
          "default",
          "centered",
          "split",
          "fullscreen",
          "minimal",
        ]),
        image: textSchema("Background / Hero Image"),
        gradient: textSchema("Overlay Gradient"),
        height: textSchema("Min Height"),
        primaryCta: {
          type: "object",
          label: "Primary CTA",
          subfields: {
            label: textSchema("Label"),
            href: textSchema("URL"),
          },
        },
        secondaryCta: {
          type: "object",
          label: "Secondary CTA",
          subfields: {
            label: textSchema("Label"),
            href: textSchema("URL"),
          },
        },
      },
      keywords: [
        "hero",
        "banner",
        "header",
        "jumbotron",
        "landing",
        "cover",
        "splash",
      ],
    },
  ],
  [
    "Footer",
    {
      component: Footer,
      label: "Footer",
      category: "Marketing",
      subcategory: "Sections",
      description: "Page footer with brand, columns of links, social icons, and copyright",
      defaultProps: { variant: "default" },
      schema: {
        variant: selectSchema("Variant", [
          "default",
          "centered",
          "minimal",
          "dark",
          "split",
        ]),
        brand: {
          type: "object",
          label: "Brand",
          subfields: {
            name: textSchema("Name"),
            logo: textSchema("Logo URL"),
            description: textSchema("Description"),
          },
        },
        copyright: textSchema("Copyright Text"),
      },
      keywords: ["footer", "bottom", "links", "brand", "copyright"],
    },
  ],
  [
    "Carousel",
    {
      component: Carousel,
      label: "Carousel",
      category: "Marketing",
      subcategory: "Components",
      description: "Sliding carousel with autoplay, arrows, and dots",
      defaultProps: { variant: "default", autoPlay: true, interval: 5000 },
      schema: {
        variant: selectSchema("Variant", ["default", "card", "fade"]),
        autoPlay: booleanSchema("Auto Play"),
        interval: numberSchema("Interval (ms)", 1000, 30000),
        showArrows: booleanSchema("Show Arrows"),
        showDots: booleanSchema("Show Dots"),
        loop: booleanSchema("Loop"),
      },
      keywords: [
        "carousel",
        "slider",
        "slideshow",
        "gallery",
        "swiper",
      ],
    },
  ],
  [
    "Card",
    {
      component: Card,
      label: "Card",
      category: "Marketing",
      subcategory: "Components",
      description:
        "Content card with image, hover effects, and optional link/action",
      defaultProps: { padding: "md", radius: "lg", border: true },
      schema: {
        padding: selectSchema("Padding", [
          "none",
          "xs",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "4xl",
        ]),
        radius: selectSchema("Radius", [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "full",
        ]),
        border: booleanSchema("Border"),
        hover: selectSchema("Hover Effect", [
          "none",
          "lift",
          "border",
          "glow",
        ]),
        bgColor: colorSchema("Background Colour"),
        image: textSchema("Card Image URL"),
        shadow: selectSchema("Shadow", [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "float",
          "lift",
          "soft",
        ]),
      },
      keywords: [
        "card",
        "tile",
        "panel",
        "box",
        "block",
        "widget",
      ],
    },
  ],
  [
    "Testimonials",
    {
      component: Testimonials,
      label: "Testimonials",
      category: "Marketing",
      subcategory: "Sections",
      description: "Customer testimonials in grid, carousel, or masonry layout",
      defaultProps: { variant: "grid", columns: 3 },
      schema: {
        variant: selectSchema("Variant", [
          "grid",
          "carousel",
          "masonry",
          "compact",
        ]),
        columns: numberSchema("Columns", 1, 6),
        heading: textSchema("Heading"),
        subheading: textSchema("Subheading"),
      },
      keywords: [
        "testimonials",
        "reviews",
        "social proof",
        "quote",
        "feedback",
      ],
    },
  ],
  [
    "Pricing",
    {
      component: Pricing,
      label: "Pricing",
      category: "Marketing",
      subcategory: "Sections",
      description: "Pricing table with plan tiers, features, and CTAs",
      defaultProps: { variant: "card", columns: 3 },
      schema: {
        variant: selectSchema("Variant", [
          "default",
          "card",
          "bordered",
          "compact",
        ]),
        columns: numberSchema("Columns", 1, 4),
        heading: textSchema("Heading"),
        subheading: textSchema("Subheading"),
        showPeriod: booleanSchema("Show Period"),
        currency: textSchema("Currency Symbol"),
      },
      keywords: [
        "pricing",
        "plans",
        "tiers",
        "subscription",
        "saas",
      ],
    },
  ],
  [
    "FAQ",
    {
      component: FAQ,
      label: "FAQ",
      category: "Marketing",
      subcategory: "Sections",
      description: "Frequently asked questions in accordion or grid layout",
      defaultProps: { variant: "accordion" },
      schema: {
        variant: selectSchema("Variant", ["accordion", "grid", "inline"]),
        heading: textSchema("Heading"),
        subheading: textSchema("Subheading"),
        searchable: booleanSchema("Searchable"),
      },
      keywords: [
        "faq",
        "questions",
        "answers",
        "help",
        "support",
      ],
    },
  ],
  [
    "CTA",
    {
      component: CTA,
      label: "CTA",
      category: "Marketing",
      subcategory: "Sections",
      description: "Call-to-action banner with heading, subtext, and buttons",
      defaultProps: { variant: "default", heading: "Get Started Today" },
      schema: {
        heading: textSchema("Heading"),
        subheading: textSchema("Subheading"),
        variant: selectSchema("Variant", [
          "default",
          "card",
          "minimal",
          "fullWidth",
        ]),
        bgColor: colorSchema("Background Colour"),
        gradient: textSchema("Gradient"),
        primaryCta: {
          type: "object",
          label: "Primary CTA",
          subfields: {
            label: textSchema("Label"),
            href: textSchema("URL"),
          },
        },
        secondaryCta: {
          type: "object",
          label: "Secondary CTA",
          subfields: {
            label: textSchema("Label"),
            href: textSchema("URL"),
          },
        },
      },
      keywords: [
        "cta",
        "call to action",
        "banner",
        "conversion",
        "signup",
      ],
    },
  ],
  [
    "LogoCloud",
    {
      component: LogoCloud,
      label: "Logo Cloud",
      category: "Marketing",
      subcategory: "Components",
      description:
        "Grid or scrolling row of brand/client logos for social proof",
      defaultProps: { variant: "default", grayscale: true },
      schema: {
        variant: selectSchema("Variant", [
          "default",
          "grid",
          "carousel",
          "marquee",
          "scrolling",
        ]),
        heading: textSchema("Heading"),
        grayscale: booleanSchema("Grayscale"),
        maxLogos: numberSchema("Max Logos", 1, 50),
      },
      keywords: [
        "logo",
        "brand",
        "client",
        "trust",
        "social proof",
      ],
    },
  ],
  [
    "Timeline",
    {
      component: Timeline,
      label: "Timeline",
      category: "Marketing",
      subcategory: "Components",
      description: "Chronological timeline for roadmaps, history, or steps",
      defaultProps: { variant: "default", animated: true },
      schema: {
        variant: selectSchema("Variant", [
          "default",
          "alternating",
          "compact",
          "minimal",
          "horizontal",
        ]),
        animated: booleanSchema("Animate on Scroll"),
        color: selectSchema("Colour", ["primary", "muted", "accent"]),
      },
      keywords: [
        "timeline",
        "roadmap",
        "history",
        "steps",
        "milestones",
      ],
    },
  ],
  [
    "Stats",
    {
      component: Stats,
      label: "Stats",
      category: "Marketing",
      subcategory: "Components",
      description: "Statistical data display with counters and labels",
      defaultProps: { variant: "default", columns: 3 },
      schema: {
        variant: selectSchema("Variant", ["default", "card", "bordered"]),
        columns: numberSchema("Columns", 1, 6),
      },
      keywords: [
        "stats",
        "statistics",
        "numbers",
        "metrics",
        "data",
      ],
    },
  ],
  [
    "Quote",
    {
      component: Quote,
      label: "Quote",
      category: "Marketing",
      subcategory: "Components",
      description: "Attributed quote block with optional avatar",
      defaultProps: {
        variant: "default",
        quote: "Inspirational quote goes here.",
      },
      schema: {
        quote: textSchema("Quote Text"),
        author: textSchema("Author Name"),
        role: textSchema("Author Role"),
        variant: selectSchema("Variant", [
          "default",
          "card",
          "bordered",
          "highlight",
        ]),
        bgColor: colorSchema("Background Colour"),
      },
      keywords: [
        "quote",
        "blockquote",
        "testimonial",
        "citation",
        "pull quote",
      ],
    },
  ],
  [
    "NotificationBar",
    {
      component: NotificationBar,
      label: "Notification Bar",
      category: "Marketing",
      subcategory: "Components",
      description: "Top-of-page announcement bar for alerts and promotions",
      defaultProps: {
        variant: "info",
        message: "Announcement message here",
        dismissible: true,
      },
      schema: {
        message: textSchema("Message"),
        variant: selectSchema("Variant", [
          "info",
          "success",
          "warning",
          "error",
        ]),
        dismissible: booleanSchema("Dismissible"),
        link: {
          type: "object",
          label: "Link",
          subfields: {
            label: textSchema("Label"),
            href: textSchema("URL"),
          },
        },
      },
      keywords: [
        "notification",
        "announcement",
        "bar",
        "banner",
        "alert",
      ],
    },
  ],
  [
    "Avatar",
    {
      component: Avatar,
      label: "Avatar",
      category: "Marketing",
      subcategory: "Components",
      description: "User avatar image with fallback initials",
      defaultProps: { size: "md", radius: "full" },
      schema: {
        src: textSchema("Image URL"),
        alt: textSchema("Alt Text"),
        name: textSchema("Name (for initials fallback)"),
        size: selectSchema("Size", ["sm", "md", "lg", "xl"]),
        radius: selectSchema("Radius", ["full", "md", "lg"]),
      },
      keywords: [
        "avatar",
        "user",
        "profile",
        "photo",
        "initials",
      ],
    },
  ],
  [
    "Rating",
    {
      component: Rating,
      label: "Rating",
      category: "Marketing",
      subcategory: "Components",
      description: "Star rating display, optionally interactive",
      defaultProps: { value: 4, max: 5, size: "md" },
      schema: {
        value: numberSchema("Rating", 0, 5),
        max: numberSchema("Max Stars", 1, 10),
        size: selectSchema("Size", ["sm", "md", "lg"]),
        color: colorSchema("Colour"),
        showValue: booleanSchema("Show Numeric Value"),
        interactive: booleanSchema("Interactive"),
      },
      keywords: [
        "rating",
        "stars",
        "review",
        "score",
        "feedback",
      ],
    },
  ],
  [
    "CountUp",
    {
      component: CountUp,
      label: "Count Up",
      category: "Marketing",
      subcategory: "Components",
      description: "Animated number counter that counts up on view",
      defaultProps: { end: 100, duration: 2, suffix: "+" },
      schema: {
        end: numberSchema("End Value", 0),
        start: numberSchema("Start Value", 0),
        duration: numberSchema("Duration (s)", 0.5, 10),
        prefix: textSchema("Prefix"),
        suffix: textSchema("Suffix"),
        decimals: numberSchema("Decimals", 0, 6),
        separator: textSchema("Thousands Separator"),
        label: textSchema("Label Below"),
      },
      keywords: [
        "counter",
        "countup",
        "animate",
        "number",
        "stat",
      ],
    },
  ],

  // ══════════════════════════════════════════════
  // BUILDER
  // ══════════════════════════════════════════════
  [
    "Spacer",
    {
      component: Spacer,
      label: "Spacer",
      category: "Builder",
      subcategory: "Utilities",
      description: "Empty spacer for vertical gaps between blocks",
      defaultProps: { height: 16 },
      schema: {
        height: numberSchema("Height (px)", 0, 200),
        variant: selectSchema("Variant", [
          "default",
          "line",
          "dashed",
          "dotted",
          "gradient",
        ]),
        bgColor: colorSchema("Background Colour"),
      },
      keywords: [
        "spacer",
        "gap",
        "space",
        "separator",
        "empty",
        "divider",
      ],
    },
  ],
  [
    "Divider",
    {
      component: Divider,
      label: "Divider",
      category: "Builder",
      subcategory: "Utilities",
      description: "Visual divider line, optionally with a label",
      defaultProps: { variant: "solid", orientation: "horizontal" },
      schema: {
        variant: selectSchema("Variant", [
          "solid",
          "dashed",
          "dotted",
          "gradient",
        ]),
        orientation: selectSchema("Orientation", [
          "horizontal",
          "vertical",
        ]),
        label: textSchema("Label (optional)"),
        labelPosition: selectSchema("Label Position", [
          "left",
          "center",
          "right",
        ]),
        color: colorSchema("Colour"),
      },
      keywords: [
        "divider",
        "line",
        "separator",
        "rule",
        "hr",
        "horizontal rule",
      ],
    },
  ],
  [
    "HtmlEmbed",
    {
      component: HtmlEmbed,
      label: "HTML Embed",
      category: "Builder",
      subcategory: "Utilities",
      description: "Embed raw HTML markup inside a sandboxed iframe",
      defaultProps: { html: "<p>Hello world</p>", sandbox: true },
      schema: {
        html: {
          type: "textarea",
          label: "HTML Markup",
        },
        sandbox: booleanSchema("Sandbox"),
        height: textSchema("Height (CSS value)"),
        scrollable: booleanSchema("Scrollable"),
      },
      keywords: [
        "html",
        "embed",
        "iframe",
        "code",
        "custom",
        "widget",
      ],
    },
  ],
  [
    "Visibility",
    {
      component: Visibility,
      label: "Visibility Toggle",
      category: "Builder",
      subcategory: "Utilities",
      description: "Show or hide content based on visibility state",
      defaultProps: { visible: true, mode: "hide" },
      schema: {
        visible: booleanSchema("Visible"),
        mode: selectSchema("Mode", ["hide", "show"]),
        keepSpace: booleanSchema("Keep Space When Hidden"),
        animation: selectSchema("Animation", [
          "none",
          "fade",
          "slide",
          "scale",
        ]),
      },
      keywords: [
        "visibility",
        "show",
        "hide",
        "toggle",
        "conditional",
        "reveal",
      ],
    },
  ],

  // ══════════════════════════════════════════════
  // FORMS
  // ══════════════════════════════════════════════
  [
    "Input",
    {
      component: Input,
      label: "Input",
      category: "Forms",
      description: "Single-line text input with label and error state",
      defaultProps: { label: "Label", placeholder: "Enter text...", type: "text" },
      schema: {
        label: textSchema("Label"),
        placeholder: textSchema("Placeholder"),
        type: selectSchema("Type", [
          "text",
          "email",
          "password",
          "number",
          "tel",
          "url",
          "search",
        ]),
        required: booleanSchema("Required"),
        error: textSchema("Error Message"),
        hint: textSchema("Hint Text"),
      },
      keywords: ["input", "text", "field", "form", "textfield"],
    },
  ],
  [
    "Textarea",
    {
      component: Textarea,
      label: "Textarea",
      category: "Forms",
      description: "Multi-line text input with resizing control",
      defaultProps: { label: "Message", placeholder: "Enter message...", rows: 4 },
      schema: {
        label: textSchema("Label"),
        placeholder: textSchema("Placeholder"),
        required: booleanSchema("Required"),
        rows: numberSchema("Rows", 1, 20),
        maxLength: numberSchema("Max Length", 1, 10000),
        error: textSchema("Error Message"),
      },
      keywords: ["textarea", "text", "area", "multiline", "message"],
    },
  ],
  [
    "Select",
    {
      component: Select,
      label: "Select",
      category: "Forms",
      description: "Dropdown select with labelled options",
      defaultProps: { label: "Choose", placeholder: "Select..." },
      schema: {
        label: textSchema("Label"),
        placeholder: textSchema("Placeholder"),
        required: booleanSchema("Required"),
        error: textSchema("Error Message"),
      },
      keywords: ["select", "dropdown", "option", "choose", "form"],
    },
  ],
  [
    "Checkbox",
    {
      component: Checkbox,
      label: "Checkbox",
      category: "Forms",
      description: "Binary checkbox with label and optional description",
      defaultProps: { label: "Check me" },
      schema: {
        label: textSchema("Label"),
        description: textSchema("Description"),
        required: booleanSchema("Required"),
      },
      keywords: ["checkbox", "check", "toggle", "option", "agree"],
    },
  ],
  [
    "Toggle",
    {
      component: Toggle,
      label: "Toggle",
      category: "Forms",
      description: "Switch-style toggle with label and description",
      defaultProps: { label: "Enable", size: "md" },
      schema: {
        label: textSchema("Label"),
        description: textSchema("Description"),
        size: selectSchema("Size", ["sm", "md", "lg"]),
        disabled: booleanSchema("Disabled"),
      },
      keywords: ["toggle", "switch", "on", "off", "enable"],
    },
  ],

  // ══════════════════════════════════════════════
  // NAVIGATION
  // ══════════════════════════════════════════════
  [
    "Breadcrumbs",
    {
      component: Breadcrumbs,
      label: "Breadcrumbs",
      category: "Navigation",
      description: "Hierarchical breadcrumb trail for page context",
      defaultProps: { separator: "/" },
      schema: {
        separator: textSchema("Separator"),
        homeHref: textSchema("Home URL"),
      },
      keywords: [
        "breadcrumbs",
        "navigation",
        "path",
        "trail",
        "hierarchy",
      ],
    },
  ],
  [
    "Tabs",
    {
      component: Tabs,
      label: "Tabs",
      category: "Navigation",
      description: "Tabbed content switcher with configurable style",
      defaultProps: { variant: "underline", orientation: "horizontal" },
      schema: {
        variant: selectSchema("Variant", ["underline", "pills", "buttons"]),
        orientation: selectSchema("Orientation", [
          "horizontal",
          "vertical",
        ]),
        defaultTab: textSchema("Default Tab Value"),
      },
      keywords: ["tabs", "tab", "navigation", "sections", "panels"],
    },
  ],
  [
    "Pagination",
    {
      component: Pagination,
      label: "Pagination",
      category: "Navigation",
      description: "Page navigation with page numbers and prev/next",
      defaultProps: { total: 50, perPage: 10, currentPage: 1 },
      schema: {
        total: numberSchema("Total Items", 1),
        perPage: numberSchema("Per Page", 1, 100),
        currentPage: numberSchema("Current Page", 1),
        siblingCount: numberSchema("Sibling Count", 0, 5),
        showFirstLast: booleanSchema("Show First/Last"),
        showPrevNext: booleanSchema("Show Prev/Next"),
        size: selectSchema("Size", ["sm", "md", "lg"]),
      },
      keywords: [
        "pagination",
        "pages",
        "pager",
        "navigation",
        "prev",
        "next",
      ],
    },
  ],

  // ══════════════════════════════════════════════
  // OVERLAY
  // ══════════════════════════════════════════════
  [
    "Modal",
    {
      component: Modal,
      label: "Modal",
      category: "Overlay",
      description: "Dialog modal overlay with title, description, and body",
      defaultProps: { size: "md", showCloseButton: true },
      schema: {
        title: textSchema("Title"),
        description: textSchema("Description"),
        size: selectSchema("Size", ["sm", "md", "lg", "xl", "full"]),
        closeOnOverlay: booleanSchema("Close on Overlay Click"),
        showCloseButton: booleanSchema("Show Close Button"),
      },
      keywords: ["modal", "dialog", "popup", "overlay", "lightbox"],
    },
  ],
  [
    "Drawer",
    {
      component: Drawer,
      label: "Drawer",
      category: "Overlay",
      description: "Slide-in panel from any edge of the screen",
      defaultProps: { side: "right", size: "md" },
      schema: {
        title: textSchema("Title"),
        side: selectSchema("Side", ["left", "right", "top", "bottom"]),
        size: selectSchema("Size", ["sm", "md", "lg", "full"]),
      },
      keywords: [
        "drawer",
        "panel",
        "slide",
        "sidebar",
        "offcanvas",
      ],
    },
  ],
  [
    "Accordion",
    {
      component: Accordion,
      label: "Accordion",
      category: "Overlay",
      description: "Collapsible sections for content organisation",
      defaultProps: { type: "single", variant: "default" },
      schema: {
        type: selectSchema("Type", ["single", "multiple"]),
        variant: selectSchema("Variant", ["default", "bordered", "ghost"]),
      },
      keywords: [
        "accordion",
        "collapse",
        "expand",
        "faq",
        "disclosure",
      ],
    },
  ],
  [
    "Alert",
    {
      component: Alert,
      label: "Alert",
      category: "Overlay",
      description: "Inline notification for success, warning, error, or info",
      defaultProps: { variant: "info" },
      schema: {
        title: textSchema("Title"),
        description: textSchema("Description"),
        variant: selectSchema("Variant", [
          "info",
          "success",
          "warning",
          "error",
        ]),
        dismissible: booleanSchema("Dismissible"),
      },
      keywords: [
        "alert",
        "notification",
        "message",
        "toast",
        "banner",
        "info",
      ],
    },
  ],

  // ══════════════════════════════════════════════
  // DASHBOARD
  // ══════════════════════════════════════════════
  [
    "KpiCard",
    {
      component: KpiCard,
      label: "KPI Card",
      category: "Dashboard",
      description: "Key performance indicator card with value, trend, and optional chart",
      defaultProps: { label: "Revenue", value: "$12,345", color: "primary" },
      schema: {
        label: textSchema("Label"),
        value: textSchema("Value"),
        prefix: textSchema("Prefix"),
        suffix: textSchema("Suffix"),
        color: colorSchema("Colour"),
        trend: {
          type: "object",
          label: "Trend",
          subfields: {
            value: numberSchema("Change %", -100, 1000),
            direction: selectSchema("Direction", ["up", "down", "neutral"]),
          },
        },
      },
      keywords: [
        "kpi",
        "metric",
        "dashboard",
        "card",
        "stat",
        "indicator",
      ],
    },
  ],
  [
    "Metric",
    {
      component: Metric,
      label: "Metric",
      category: "Dashboard",
      description: "Simple metric display with label, value, and optional tooltip",
      defaultProps: { label: "Metric", value: 0 },
      schema: {
        label: textSchema("Label"),
        value: textSchema("Value"),
        tooltip: textSchema("Tooltip"),
      },
      keywords: ["metric", "stat", "value", "dashboard"],
    },
  ],
  [
    "DataTable",
    {
      component: DataTable,
      label: "Data Table",
      category: "Dashboard",
      description: "Sortable, searchable data table with pagination and export",
      defaultProps: { pageSize: 10 },
      schema: {
        pageSize: numberSchema("Page Size", 5, 100),
        searchable: booleanSchema("Searchable"),
        exportable: booleanSchema("Exportable"),
        selectable: booleanSchema("Selectable Rows"),
      },
      keywords: [
        "table",
        "data",
        "grid",
        "spreadsheet",
        "rows",
        "columns",
      ],
    },
  ],

  // ══════════════════════════════════════════════
  // COMMERCE
  // ══════════════════════════════════════════════
  [
    "ProductCard",
    {
      component: ProductCard,
      label: "Product Card",
      category: "Commerce",
      description: "E-commerce product card with image, name, price, and badge",
      defaultProps: {
        name: "Product Name",
        price: 29.99,
        rating: 4,
      },
      schema: {
        name: textSchema("Product Name"),
        price: numberSchema("Price", 0),
        comparePrice: numberSchema("Compare-at Price", 0),
        currency: textSchema("Currency Symbol"),
        image: textSchema("Image URL"),
        badge: textSchema("Badge Text"),
        rating: numberSchema("Rating", 0, 5),
        inStock: booleanSchema("In Stock"),
      },
      keywords: [
        "product",
        "card",
        "shop",
        "ecommerce",
        "store",
        "item",
      ],
    },
  ],
  [
    "CartItem",
    {
      component: CartItem,
      label: "Cart Item",
      category: "Commerce",
      description: "Line item row for a shopping cart",
      defaultProps: {
        name: "Product",
        price: 29.99,
        quantity: 1,
      },
      schema: {
        name: textSchema("Product Name"),
        price: numberSchema("Unit Price", 0),
        quantity: numberSchema("Quantity", 1, 999),
        image: textSchema("Image URL"),
        maxQuantity: numberSchema("Max Quantity", 1, 999),
      },
      keywords: [
        "cart",
        "item",
        "basket",
        "checkout",
        "order",
      ],
    },
  ],
  [
    "Text",
    {
      component: Text,
      label: "Text",
      category: "Typography",
      description: "Responsive body copy with gradient and animation support",
      defaultProps: { size: "md", weight: "normal", children: "Body text paragraph" },
      schema: {
        children: textSchema("Content"),
        size: selectSchema("Size", ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"]),
        weight: selectSchema("Weight", ["light", "normal", "medium", "semibold", "bold"]),
        align: selectSchema("Alignment", ["left", "center", "right"]),
        color: textSchema("Color (Hex/HSL)"),
        gradient: textSchema("Gradient Value"),
      },
      keywords: ["text", "paragraph", "typography", "body", "span"],
    },
  ],
  [
    "Navbar",
    {
      component: Navbar,
      label: "Navbar",
      category: "Navigation",
      description: "Interactive site header navbar with mega menu",
      defaultProps: { brandName: "Klin", sticky: true, transparent: false },
      schema: {
        brandName: textSchema("Brand Name"),
        sticky: booleanSchema("Sticky Header"),
        transparent: booleanSchema("Transparent Background"),
      },
      keywords: ["nav", "navbar", "header", "menu", "megamenu"],
    },
  ],
  [
    "Anchor",
    {
      component: Anchor,
      label: "Scroll Anchor",
      category: "Builder",
      description: "Pinned scroll target location",
      defaultProps: { anchorId: "section-1" },
      schema: {
        anchorId: textSchema("Anchor unique ID"),
      },
      keywords: ["anchor", "scroll", "link", "target"],
    },
  ],
  [
    "ProductGrid",
    {
      component: ProductGrid,
      label: "Product Grid",
      category: "Commerce",
      description: "Grid listing catalog items",
      defaultProps: { columns: 3 },
      schema: {
        columns: numberSchema("Grid Columns (Desktop)", 1, 6),
      },
      keywords: ["shop", "store", "grid", "products"],
    },
  ],
  [
    "OTPInput",
    {
      component: OTPInput,
      label: "OTP Input",
      category: "Forms",
      description: "Pin verification entry field",
      defaultProps: { length: 6 },
      schema: {
        length: numberSchema("Pin Length", 4, 8),
      },
      keywords: ["otp", "pin", "verification", "auth", "input"],
    },
  ],
  [
    "LineChart",
    {
      component: LineChart,
      label: "Line Chart",
      category: "Dashboard",
      description: "Interactive analytics line chart card",
      defaultProps: { title: "Revenue Trends" },
      schema: {
        title: textSchema("Card Title"),
      },
      keywords: ["chart", "line", "analytics", "graph", "dashboard"],
    },
  ],
  [
    "TiltCard",
    {
      component: TiltCard,
      label: "Tilt Card",
      category: "Animation",
      description: "3D mouse angle tilt hover effect container",
      defaultProps: { maxTilt: 15 },
      schema: {
        maxTilt: numberSchema("Max Tilt Angle", 5, 45),
      },
      keywords: ["tilt", "hover", "effect", "card", "3d"],
    },
  ],
  [
    "LottieWrapper",
    {
      component: LottieWrapper,
      label: "Lottie Player",
      category: "Animation",
      description: "Autoplaying lottie animation loader",
      defaultProps: { src: "" },
      schema: {
        src: textSchema("Animation JSON URL"),
      },
      keywords: ["lottie", "animation", "motion", "player"],
    },
  ],
]);

// ── Exports ──

/** Get all entries in a given category */
export function getEntriesByCategory(category: string): RegistryEntry[] {
  return Array.from(REGISTRY.entries())
    .filter(([, entry]) => entry.category === category)
    .map(([, entry]) => entry);
}

/** Get all unique category names */
export function getCategories(): string[] {
  const cats = new Set<string>();
  REGISTRY.forEach((entry) => cats.add(entry.category));
  return Array.from(cats);
}

/** Get entry by component name */
export function getEntry(name: string): RegistryEntry | undefined {
  return REGISTRY.get(name);
}
