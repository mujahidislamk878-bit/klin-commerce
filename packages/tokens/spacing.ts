export type Spacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export const spacingMap: Record<Spacing, string> = {
  none: "p-0",
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  "2xl": "p-12",
  "3xl": "p-16",
  "4xl": "p-24",
};

export const spacingYMap: Record<Spacing, string> = {
  none: "py-0",
  xs: "py-1",
  sm: "py-2",
  md: "py-4",
  lg: "py-6",
  xl: "py-8",
  "2xl": "py-12",
  "3xl": "py-16",
  "4xl": "py-24",
};

export const spacingXMap: Record<Spacing, string> = {
  none: "px-0",
  xs: "px-1",
  sm: "px-2",
  md: "px-4",
  lg: "px-6",
  xl: "px-8",
  "2xl": "px-12",
  "3xl": "px-16",
  "4xl": "px-24",
};