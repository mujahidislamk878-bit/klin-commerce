"use client";

import { forwardRef, type ForwardedRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { HeadingProps, HeadingLevel, HeadingSize, FontWeight, TextAlign } from "../../types";

// ── Maps ──

const LEVEL_TAG: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

const SIZE_CLASS: Record<HeadingSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
};

const WEIGHT_CLASS: Record<FontWeight, string> = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const TRACKING_CLASS: Record<string, string> = {
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

const LEADING_CLASS: Record<string, string> = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

const ALIGN_CLASS: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// ── Component ──

interface ExtendedHeadingProps extends HeadingProps {
  children?: ReactNode;
}

function Heading(
  {
    level = 2,
    size = "4xl",
    weight,
    tracking,
    leading,
    transform,
    gradient,
    color,
    align,
    className,
    style,
    children,
    ...rest
  }: ExtendedHeadingProps,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  const Tag = LEVEL_TAG[level] ?? "h2";

  const gradientClasses =
    gradient
      ? "bg-gradient-to-r bg-clip-text text-transparent"
      : "";

  const inlineStyle: React.CSSProperties = {
    ...(color ? { color } : {}),
    ...(gradient ? { backgroundImage: gradient } : {}),
    ...style,
  };

  return (
    <motion.div ref={ref}>
      <Tag
        className={cn(
          "font-display",
          SIZE_CLASS[size] ?? "text-4xl",
          weight && WEIGHT_CLASS[weight],
          tracking && TRACKING_CLASS[tracking],
          leading && LEADING_CLASS[leading],
          transform && transform !== "none" && transform,
          align && ALIGN_CLASS[align],
          gradientClasses,
          className,
        )}
        style={inlineStyle}
        {...rest}
      >
        {children}
      </Tag>
    </motion.div>
  );
}

const ForwardedHeading = forwardRef(Heading);
ForwardedHeading.displayName = "Heading";

export default ForwardedHeading;
export { ForwardedHeading as Heading };
