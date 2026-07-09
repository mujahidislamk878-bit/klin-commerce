import type { ReactNode, CSSProperties, ElementType, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

// ── Responsive ──
export type ResponsiveValue<T> = T | { desktop?: T; tablet?: T; mobile?: T };

// ── Spacing ──
export type SpacingScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 80;
export type Spacing = SpacingScale | "unset" | "auto";
export type SpacingCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GapSize = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12;

// ── Alignment ──
export type Align = "start" | "center" | "end" | "stretch";
export type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type TextAlign = "left" | "center" | "right";

// ── Visual ──
export type ColorScheme = "light" | "dark" | "auto";
export type RoundedSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
export type ShadowSize = "none" | "sm" | "md" | "lg" | "xl" | "float" | "lift" | "soft";

// ── Theme ──
export type ThemeColors = Record<string, string>;
export interface ThemeTokens {
  colors: ThemeColors & {
    background: string; foreground: string;
    primary: string; primaryForeground: string;
    secondary: string; secondaryForeground: string;
    muted: string; mutedForeground: string;
    accent: string; accentForeground: string;
    destructive: string; destructiveForeground: string;
    border: string; input: string; ring: string;
  };
  radii: Record<string, string>;
  fonts: Record<string, string>;
  shadows: Record<string, string>;
  spacing: Record<string, string>;
  components?: {
    button?: Record<string, string>;
    card?: Record<string, string>;
    navbar?: Record<string, string>;
    footer?: Record<string, string>;
    hero?: Record<string, string>;
    input?: Record<string, string>;
    modal?: Record<string, string>;
    drawer?: Record<string, string>;
    toast?: Record<string, string>;
    badge?: Record<string, string>;
  };
}

// ── Actions ──
export type ActionType = "link" | "submit" | "download" | "scroll" | "modal" | "drawer" | "popover";
export interface Action {
  type: ActionType;
  href?: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
  scrollTo?: string;
  modalId?: string;
  openInDrawer?: boolean;
}

// ── Animations ──
export type AnimationType =
  | "fadeIn" | "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight"
  | "slideUp" | "slideDown" | "slideLeft" | "slideRight"
  | "scaleIn" | "scaleInX" | "scaleInY"
  | "rotateIn" | "flipInX" | "flipInY"
  | "zoomIn"
  | "none";
export type AnimationTrigger = "onView" | "onLoad" | "onHover" | "onClick" | "scroll";
export interface AnimationProps {
  animation?: AnimationType;
  trigger?: AnimationTrigger;
  duration?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
  ease?: string;
}

// ── Base ──
export interface BaseProps {
  className?: string;
  id?: string;
  style?: CSSProperties;
  as?: ElementType;
  "data-testid"?: string;
}

export interface EditableProps extends BaseProps {
  label?: string;
  hidden?: boolean;
  actions?: Action[];
}

// ── Layout ──
export interface SectionProps extends EditableProps {
  width?: "full" | "contained" | "wide" | "narrow";
  paddingY?: Spacing;
  paddingX?: Spacing;
  bgColor?: string;
  bgImage?: string;
  bgVideo?: string;
  bgOverlay?: string;
  bgOverlayOpacity?: number;
  maxWidth?: string;
  minHeight?: string;
  children?: ReactNode;
  radius?: RoundedSize;
  shadow?: ShadowSize;
  border?: boolean;
}

export interface ContainerProps extends EditableProps {
  maxWidth?: string;
  children?: ReactNode;
  paddingX?: boolean;
  paddingY?: boolean;
}

export interface GridProps extends EditableProps {
  columns?: ResponsiveValue<SpacingCount>;
  gap?: GapSize;
  rowGap?: GapSize;
  align?: Align;
  justify?: Justify;
  children?: ReactNode;
  minChildWidth?: string;
}

export interface FlexProps extends EditableProps {
  direction?: ResponsiveValue<"row" | "col" | "row-reverse" | "col-reverse">;
  wrap?: boolean;
  gap?: GapSize;
  align?: Align;
  justify?: Justify;
  children?: ReactNode;
}

export interface StackProps extends EditableProps {
  gap?: GapSize;
  align?: Align;
  justify?: Justify;
  children?: ReactNode;
  divider?: boolean;
  dividerColor?: string;
}

export interface ColumnsProps extends EditableProps {
  ratio?: string;
  gap?: GapSize;
  align?: Align;
  children?: ReactNode;
  columnMinWidth?: string;
  stackedOn?: "mobile" | "tablet" | "never";
}

// ── Typography ──
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl";
export type FontWeight = "light" | "normal" | "medium" | "semibold" | "bold";

export interface HeadingProps extends EditableProps {
  level?: HeadingLevel;
  size?: HeadingSize;
  weight?: FontWeight;
  color?: string;
  align?: TextAlign;
  tracking?: "tight" | "normal" | "wide" | "wider" | "widest";
  leading?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  children?: ReactNode;
  transform?: "none" | "uppercase" | "lowercase" | "capitalize";
  gradient?: string;
}

export interface ParagraphProps extends EditableProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  align?: TextAlign;
  weight?: FontWeight;
  leading?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  maxWidth?: string;
  children?: ReactNode;
  clamp?: number;
}

export interface BadgeProps extends EditableProps {
  variant?: "default" | "outline" | "soft" | "solid" | "dot";
  size?: "xs" | "sm" | "md" | "lg";
  color?: string;
  dotColor?: string;
  children?: ReactNode;
}

export interface CaptionProps extends EditableProps {
  size?: "xs" | "sm" | "md";
  weight?: FontWeight;
  color?: string;
  align?: TextAlign;
  uppercase?: boolean;
  tracking?: "normal" | "wide" | "wider" | "widest";
  children?: ReactNode;
}

// ── Buttons ──
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "soft" | "link" | "gradient";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ButtonType = "button" | "submit" | "reset";

export interface ButtonProps extends EditableProps, ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: RoundedSize;
  asChild?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  gradientFrom?: string;
  gradientTo?: string;
  badge?: string | number;
  badgeVariant?: ButtonVariant;
  action?: Action;
}

export interface LinkProps extends EditableProps {
  href?: string;
  target?: string;
  rel?: string;
  variant?: "default" | "underline" | "muted" | "ghost";
  size?: "sm" | "md" | "lg";
  color?: string;
  underline?: boolean;
  children?: ReactNode;
  external?: boolean;
}

// ── Image / Media ──
export type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export interface ImageProps extends EditableProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: ObjectFit;
  radius?: RoundedSize;
  lazy?: boolean;
  priority?: boolean;
  fallback?: string;
  caption?: string;
  zoomOnHover?: boolean;
  overlay?: boolean;
  overlayColor?: string;
}

export interface VideoProps extends EditableProps {
  src: string;
  poster?: string;
  width?: number | string;
  height?: number | string;
  radius?: RoundedSize;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  objectFit?: ObjectFit;
  lazy?: boolean;
}

export interface IconProps extends EditableProps {
  name: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

// ── Forms ──
export interface InputProps extends EditableProps {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  size?: ButtonSize;
  radius?: RoundedSize;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TextareaProps extends EditableProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  rows?: number;
  maxLength?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface SelectProps extends EditableProps {
  label?: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface CheckboxProps extends EditableProps {
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface RadioGroupProps extends EditableProps {
  label?: string;
  options: { label: string; value: string }[];
  direction?: "row" | "col";
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export interface ToggleProps extends EditableProps {
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface DatePickerProps extends EditableProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

export interface FormFieldWrapperProps extends BaseProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export interface FormProps extends EditableProps {
  submitLabel?: string;
  fields?: FormField[];
  onSubmit?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface FormField {
  type: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "textarea" | "select" | "checkbox" | "radio" | "toggle" | "date";
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}

// ── Navigation ──
export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface MegaMenuItem {
  label: string;
  href?: string;
  description?: string;
  icon?: ReactNode;
  columns?: { title?: string; items: { label: string; href: string; description?: string }[] }[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends EditableProps {
  items: BreadcrumbItem[];
  separator?: string | ReactNode;
  homeHref?: string;
}

export interface TabsProps extends EditableProps {
  tabs: { label: string; value: string; content?: ReactNode }[];
  defaultTab?: string;
  variant?: "underline" | "pills" | "buttons";
  orientation?: "horizontal" | "vertical";
}

export interface PaginationProps extends EditableProps {
  total: number;
  perPage?: number;
  currentPage?: number;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  size?: "sm" | "md" | "lg";
}

// ── Card ──
export interface CardProps extends EditableProps {
  radius?: RoundedSize;
  shadow?: ShadowSize;
  border?: boolean;
  hover?: "none" | "lift" | "border" | "glow";
  padding?: Spacing;
  bgColor?: string;
  image?: string;
  imagePosition?: "top" | "bottom" | "background";
  imageHeight?: string;
  children?: ReactNode;
  href?: string;
  action?: Action;
  aspectRatio?: string;
}

// ── Marketing ──
export interface AvatarProps extends EditableProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  radius?: "full" | "md" | "lg";
  fallback?: string;
}

export interface RatingProps extends EditableProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  showValue?: boolean;
  interactive?: boolean;
}

export interface QuoteProps extends EditableProps {
  quote: string;
  author?: string;
  role?: string;
  avatar?: AvatarProps;
  variant?: "default" | "card" | "bordered" | "highlight";
  bgColor?: string;
  textColor?: string;
}

export interface LogoCloudProps extends EditableProps {
  logos: { src?: string; alt?: string; name?: string; href?: string; width?: number; height?: number }[];
  variant?: "default" | "grid" | "carousel" | "marquee" | "scrolling";
  maxLogos?: number;
  grayscale?: boolean;
  heading?: string;
  speed?: number;
}

export interface StatsProps extends EditableProps {
  stats: { value: string; label: string; prefix?: string; suffix?: string }[];
  columns?: ResponsiveValue<SpacingCount>;
  variant?: "default" | "card" | "bordered";
}

export interface TimelineProps extends EditableProps {
  items: { date: string; title: string; description: string; icon?: ReactNode }[];
  variant?: "default" | "alternating" | "compact" | "minimal" | "horizontal";
  animated?: boolean;
  color?: "primary" | "muted" | "accent";
}

export interface CountUpProps extends EditableProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  label?: string;
  inView?: boolean;
}

// ── Hero ──
export interface HeroProps extends EditableProps {
  heading: string;
  subheading?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: string;
  imagePosition?: "right" | "left" | "background" | "later";
  overlay?: string;
  variant?: "default" | "centered" | "split" | "fullscreen" | "minimal";
  height?: string;
  gradient?: string;
  children?: ReactNode;
}

// ── Footer ──
export interface FooterColumnLink {
  label: string;
  href: string;
}
export interface FooterColumn {
  title: string;
  links: FooterColumnLink[];
}
export interface FooterBrand {
  name: string;
  logo?: string;
  description?: string;
}
export interface FooterSocialLink {
  icon: string;
  href: string;
}
export interface FooterProps extends EditableProps {
  brand?: FooterBrand;
  columns?: FooterColumn[];
  socialLinks?: FooterSocialLink[];
  copyright?: string;
  variant?: "default" | "centered" | "minimal" | "dark" | "split";
}

// ── Carousel ──
export interface CarouselProps extends EditableProps {
  items: ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
  variant?: "default" | "card" | "fade";
  gap?: GapSize;
}

// ── Testimonials ──
export interface TestimonialItem {
  quote: string;
  author?: string;
  role?: string;
  avatar?: AvatarProps;
}
export interface TestimonialsProps extends EditableProps {
  items: TestimonialItem[];
  variant?: "grid" | "carousel" | "masonry" | "compact";
  columns?: number;
  autoplay?: boolean;
  heading?: string;
  subheading?: string;
}

// ── Pricing ──
export interface PricingPlanFeature {
  label: string;
  enabled?: boolean;
}
export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: PricingPlanFeature[];
  cta?: { label: string; href: string };
  highlighted?: boolean;
  highlightColor?: string;
  badge?: string;
}
export interface PricingProps extends EditableProps {
  plans: PricingPlan[];
  columns?: number;
  variant?: "default" | "card" | "bordered" | "compact";
  showPeriod?: boolean;
  currency?: string;
  heading?: string;
  subheading?: string;
}

// ── FAQ ──
export interface FAQItem {
  question: string;
  answer: string;
}
export interface FAQProps extends EditableProps {
  items: FAQItem[];
  variant?: "accordion" | "grid" | "inline";
  columns?: number;
  searchable?: boolean;
  heading?: string;
  subheading?: string;
}

// ── CTA ──
export interface CTAProps extends EditableProps {
  heading: string;
  subheading?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  variant?: "default" | "card" | "minimal" | "fullWidth";
  bgColor?: string;
  bgImage?: string;
  gradient?: string;
  children?: ReactNode;
}

export interface NotificationBarProps extends EditableProps {
  message: string;
  variant?: "info" | "success" | "warning" | "error";
  dismissible?: boolean;
  link?: { label: string; href: string };
}

export interface TooltipProps extends EditableProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
  delay?: number;
}

// ── Commerce ──
export interface ProductProps extends EditableProps {
  name: string;
  price: number;
  comparePrice?: number;
  currency?: string;
  image?: string;
  images?: string[];
  description?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  href?: string;
  sku?: string;
  inStock?: boolean;
  variants?: { name: string; options: string[] }[];
}

export interface CartItemProps extends EditableProps {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
  maxQuantity?: number;
  href?: string;
}

export interface CheckoutFormProps extends EditableProps {
  termsLabel?: string;
  submitLabel?: string;
  showCoupon?: boolean;
  showGiftMessage?: boolean;
}

export interface CustomerProps extends EditableProps {
  name?: string;
  email?: string;
  avatar?: AvatarProps;
  tier?: "standard" | "silver" | "gold" | "platinum";
  points?: number;
  orders?: number;
  totalSpent?: number;
  joinDate?: string;
}

// ── Overlay ──
export interface ModalProps extends EditableProps {
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children?: ReactNode;
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
}

export interface DrawerProps extends EditableProps {
  title?: string;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "full";
  children?: ReactNode;
}

export interface PopoverProps extends EditableProps {
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  children: ReactNode;
}

export interface AccordionProps extends EditableProps {
  items: { title: string; content: ReactNode; value?: string }[];
  type?: "single" | "multiple";
  defaultOpen?: string[];
  variant?: "default" | "bordered" | "ghost";
}

export interface AlertProps extends EditableProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  description?: string;
  dismissible?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

export interface ToastProps extends EditableProps {
  title?: string;
  description?: string;
  variant?: "info" | "success" | "warning" | "error";
  duration?: number;
  action?: { label: string; onClick?: string };
}

export interface TooltipContentProps extends EditableProps {
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  children: ReactNode;
}

// ── Builder ──
export interface SpacerProps extends EditableProps {
  height?: ResponsiveValue<Spacing>;
  bgColor?: string;
  border?: boolean;
  borderColor?: string;
}

export interface DividerProps extends EditableProps {
  variant?: "solid" | "dashed" | "dotted" | "gradient";
  color?: string;
  thickness?: number;
  label?: string;
  labelPosition?: "left" | "center" | "right";
}

export interface HtmlEmbedProps extends EditableProps {
  html: string;
  sandbox?: boolean;
  height?: string;
}

export interface CodeBlockProps extends EditableProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  theme?: "light" | "dark";
  copyable?: boolean;
  wrap?: boolean;
}

export interface CustomCssProps extends EditableProps {
  css: string;
}

export interface VisibilityProps extends EditableProps {
  children: ReactNode;
  showOnDesktop?: boolean;
  showOnTablet?: boolean;
  showOnMobile?: boolean;
}

// ── Dashboard ──
export interface KpiCardProps extends EditableProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  trend?: { value: number; direction: "up" | "down" | "neutral" };
  icon?: ReactNode;
  color?: string;
  chart?: "line" | "bar" | "area";
  chartData?: { labels: string[]; values: number[] };
}

export interface MetricProps extends EditableProps {
  label: string;
  value: string | number;
  tooltip?: string;
}

export interface DataTableProps extends EditableProps {
  columns: { key: string; label: string; sortable?: boolean; width?: string; align?: Align }[];
  rows: Record<string, unknown>[];
  pageSize?: number;
  searchable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
}