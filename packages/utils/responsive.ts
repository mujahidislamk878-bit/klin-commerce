import type { ResponsiveValue, GapSize, SpacingCount } from "../types";

export function resolveResponsive<T>(value: ResponsiveValue<T> | undefined, breakpoint: "desktop" | "tablet" | "mobile"): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) return value as T;
  if (breakpoint === "mobile") return (value as any).mobile ?? (value as any).tablet ?? (value as any).desktop;
  if (breakpoint === "tablet") return (value as any).tablet ?? (value as any).desktop;
  return (value as any).desktop;
}

export function gapToClass(gap: GapSize | undefined): string {
  if (!gap || gap === "none") return "gap-0";
  const map: Record<string, string> = {
    xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6",
    xl: "gap-8", "2xl": "gap-12", "3xl": "gap-16",
  };
  return map[gap] ?? "gap-4";
}

export function columnsToClass(columns: SpacingCount | undefined): string {
  if (!columns) return "";
  const map: Record<number, string> = {
    1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4",
    5: "grid-cols-5", 6: "grid-cols-6", 8: "grid-cols-8", 12: "grid-cols-12",
  };
  return map[columns] ?? "grid-cols-1";
}