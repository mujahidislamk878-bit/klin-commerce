// ═══════════════════════════════════════════════════════════════
// Klin Component Library — Master Barrel Index
// ═══════════════════════════════════════════════════════════════

// ── Types ──
export * from "./types";

// ── Tokens ──
export * from "./tokens";

// ── Utilities ──
export * from "./utils";

// ── UI: Layout ──
export * from "./ui/layout";

export {
  Heading,
  HeadingComponent,
  Paragraph,
  ParagraphComponent,
  Badge,
  BadgeComponent,
  Caption,
  CaptionComponent,
  Text,
  TextComponent,
  Label,
  LabelComponent,
  Code,
  CodeComponent,
  InlineCode,
  Blockquote,
  BlockquoteComponent,
  GradientText,
  GradientTextComponent,
  Highlight,
  HighlightComponent,
  LinkText,
  LinkTextComponent,
  UnorderedList,
  OrderedList,
  ListItem,
  Kbd,
  KbdComponent,
  RichText,
  RichTextComponent,
  AnimatedText,
  AnimatedTextComponent,
} from "./ui/typography";

// ── UI: Buttons ──
export * from "./ui/buttons";

// ── UI: Media ──
export { Image, Video, Icon } from "./ui/media";

// ── UI: Forms ──
export * from "./ui/forms";

// ── UI: Navigation ──
export * from "./ui/navigation";

// ── UI: Overlay ──
export * from "./ui/overlay";

// ── UI: Marketing ──
export * from "./ui/marketing";

// ── UI: Animation ──
export * from "./ui/animation";

// ── UI: Effects ──
export * from "./ui/effects";

// ── UI: Dashboard ──
export * from "./ui/dashboard";

// ── UI: Commerce ──
export * from "./ui/commerce";

// ── UI: Builder ──
export * from "./ui/builder";

// ── Registry ──
export { REGISTRY, getEntriesByCategory, getCategories, getEntry, normalizePuckData, REGISTRY_VERSION, BindingRegistry, Registry } from "./registry";
export type { RegistryEntry, ComponentRegistry, DataBindingVariable } from "./registry";
export type { RegistryBuilderMeta, RegistryDomainMeta } from "./types";

// ── Runtime ──
export * from "./runtime";
