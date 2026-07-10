import type { Data } from "@measured/puck";

const typeMap: Record<string, string> = {
  Navbar: "core.navbar",
  Hero: "core.hero",
  FeatureGrid: "layout.feature-grid",
  Gallery: "media.gallery",
  Testimonials: "marketing.testimonials",
  Pricing: "marketing.pricing",
  FAQ: "marketing.faq",
  CTA: "marketing.cta",
  Footer: "core.footer",
  ProductShowcase: "commerce.product-showcase",
  ProductGrid: "commerce.product-grid",
  DiscountBanner: "marketing.discount-banner",
  Section: "layout.section",
  Container: "layout.container",
  Grid: "layout.grid",
  Flex: "layout.flex",
  Stack: "layout.stack",
  Columns: "layout.columns",
  Heading: "core.heading",
  Paragraph: "core.paragraph",
  Badge: "core.badge",
  Caption: "core.caption",
  Text: "core.text",
  Button: "core.button",
  Link: "core.link",
  Image: "media.image",
  Video: "media.video",
  Icon: "media.icon",
  Carousel: "media.carousel",
  Card: "core.card",
  LogoCloud: "core.logo-cloud",
  Timeline: "core.timeline",
  Stats: "core.stats",
  Quote: "core.quote",
  NotificationBar: "core.notification-bar",
  Avatar: "core.avatar",
  Rating: "core.rating",
  CountUp: "core.count-up",
  Spacer: "layout.spacer",
  Divider: "layout.divider",
  HtmlEmbed: "core.html-embed",
  Visibility: "core.visibility",
  Input: "forms.input",
  Textarea: "forms.textarea",
  Select: "forms.select",
  Checkbox: "forms.checkbox",
  Toggle: "forms.toggle",
  Breadcrumbs: "core.breadcrumbs",
  Tabs: "core.tabs",
  Pagination: "core.pagination",
  Modal: "core.modal",
  Drawer: "core.drawer",
  Accordion: "core.accordion",
  Alert: "core.alert",
  KpiCard: "core.kpi-card",
  Metric: "core.metric",
  DataTable: "core.data-table",
  ProductCard: "commerce.product-card",
  CartItem: "commerce.cart-item",
  Anchor: "core.anchor",
  OTPInput: "forms.otp-input",
  LineChart: "core.line-chart",
  TiltCard: "media.tilt-card",
  LottieWrapper: "media.lottie-wrapper",
};

/**
 * Normalizes Puck data by translating legacy component names (e.g. "Hero")
 * to namespaced immutable IDs (e.g. "core.hero") and adapting v1 properties
 * to current Component Library formats.
 */
export function normalizePuckData(data: Data, schemaVersion = "v1"): Data {
  if (!data || !data.content) {
    return data || { content: [], root: {} };
  }

  const content = data.content.map((block: any) => {
    // Determine canonical normalized block type
    let normalizedType = block.type;
    if (typeMap[block.type]) {
      normalizedType = typeMap[block.type];
    }

    const props = { ...block.props };

    // Ensure block and props have matching unique IDs (required by properties inspector)
    const blockId = block.id || props.id || `${normalizedType.split(".").pop() || "block"}_${Math.random().toString(36).substring(2, 9)}`;
    const finalBlockId = block.id || blockId;
    props.id = props.id || blockId;

    // Apply translation layers for v1 properties
    if (schemaVersion === "v1") {
      switch (normalizedType) {
        case "core.hero":
          if (props.title !== undefined && props.heading === undefined) {
            props.heading = props.title;
          }
          if (props.sub !== undefined && props.subheading === undefined) {
            props.subheading = props.sub;
          }
          if (props.cta !== undefined && props.primaryCta === undefined) {
            props.primaryCta = { label: props.cta, href: "#" };
          }
          if (props.bg || props.ink) {
            props.style = {
              ...props.style,
              backgroundColor: props.bg,
              color: props.ink,
            };
          }
          // Clean up old properties
          delete props.title;
          delete props.sub;
          delete props.cta;
          delete props.bg;
          delete props.ink;
          delete props.accent;
          delete props.eyebrow;
          break;

        case "core.navbar":
          if (props.brand !== undefined && props.brandName === undefined) {
            props.brandName = props.brand;
          }
          delete props.brand;
          break;

        case "core.footer":
          if (props.brand !== undefined) {
            if (typeof props.brand === "string") {
              props.brand = { name: props.brand };
            }
          } else if (props.brandName !== undefined) {
            props.brand = { name: props.brandName };
            delete props.brandName;
          }
          break;

        case "marketing.cta":
          if (props.title !== undefined && props.heading === undefined) {
            props.heading = props.title;
          }
          if (props.button !== undefined && props.primaryCta === undefined) {
            props.primaryCta = { label: props.button, href: "#" };
          }
          if (props.bg || props.ink) {
            props.style = {
              ...props.style,
              backgroundColor: props.bg,
              color: props.ink,
            };
          }
          delete props.title;
          delete props.button;
          delete props.bg;
          delete props.ink;
          break;

        case "marketing.testimonials":
          if (props.quote !== undefined && props.items === undefined) {
            props.items = [{ quote: props.quote, author: props.author || "" }];
          }
          delete props.quote;
          delete props.author;
          delete props.bg;
          delete props.ink;
          break;

        case "marketing.pricing":
          if (props.tiers !== undefined && typeof props.tiers === "string" && props.plans === undefined) {
            props.plans = props.tiers.split(",").map((row: string) => {
              const [name, price] = row.split("|").map((s) => s.trim());
              return { name: name || "", price: price || "", cta: { label: "Select Plan", href: "#" } };
            });
          }
          delete props.tiers;
          break;

        case "marketing.faq":
          if (props.items !== undefined && typeof props.items === "string") {
            props.items = props.items.split(",").map((row: string) => {
              const [q, a] = row.split("|").map((s) => s.trim());
              return { question: q || "", answer: a || "" };
            });
          }
          break;
      }
    }

    return {
      ...block,
      id: finalBlockId,
      type: normalizedType,
      props,
    };
  });

  return {
    ...data,
    content,
  };
}
export default normalizePuckData;
