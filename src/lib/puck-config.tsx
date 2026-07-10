import type { Data } from "@measured/puck";
import { getTemplate, templates } from "./klin-templates";
import { createPuckConfig } from "./createPuckConfig";
import { normalizePuckData } from "../../packages/registry";

// Generate puckConfig dynamically from Component Registry
export const puckConfig = createPuckConfig({
  categoryFilter: ["Layout", "Marketing", "Storefront", "Navigation", "Core"],
});

// -----------------------------------------------------------------------------
// Convert shared Template → Puck Data
// -----------------------------------------------------------------------------
export function templateToPuckData(templateId: string): Data {
  const t = getTemplate(templateId);
  const content: Data["content"] = [];

  for (const s of t.sections) {
    switch (s.kind) {
      case "nav":
        content.push({ type: "Navbar", props: { id: `nav-${templateId}`, brand: s.brand } });
        break;
      case "hero":
        content.push({
          type: "Hero",
          props: {
            id: `hero-${templateId}`,
            eyebrow: t.hero.eyebrow,
            title: s.title,
            sub: s.subtitle,
            cta: s.cta,
            bg: t.palette.bg,
            ink: t.palette.ink,
            accent: t.palette.accent,
          },
        });
        break;
      case "grid":
        content.push({
          type: "FeatureGrid",
          props: { id: `grid-${templateId}`, title: s.title, items: s.items.join(", ") },
        });
        break;
      case "gallery":
        content.push({ type: "Gallery", props: { id: `gal-${templateId}`, items: s.items.join(", ") } });
        break;
      case "testimonial":
        content.push({
          type: "Testimonials",
          props: { id: `t-${templateId}`, quote: s.quote, author: s.author, bg: t.palette.ink, ink: t.palette.bg },
        });
        break;
      case "pricing":
        content.push({
          type: "Pricing",
          props: { id: `p-${templateId}`, tiers: s.tiers.map((x) => `${x.name}|${x.price}`).join(", ") },
        });
        break;
      case "faq":
        content.push({
          type: "FAQ",
          props: { id: `f-${templateId}`, items: s.items.map((x) => `${x.q}|${x.a}`).join(", ") },
        });
        break;
      case "cta":
        content.push({
          type: "CTA",
          props: { id: `cta-${templateId}`, title: s.title, button: s.button, bg: t.palette.ink, ink: t.palette.bg },
        });
        break;
      case "footer":
        content.push({ type: "Footer", props: { id: `foot-${templateId}`, brand: s.brand } });
        break;
    }
  }

  // Normalize data to V1 format (resolves Namespaced IDs and props mapping)
  return normalizePuckData({ content, root: { props: { title: t.name } } }, "v1");
}

export const editableCategories = templates.map((t) => ({ id: t.id, label: t.category }));
