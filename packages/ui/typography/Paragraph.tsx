"use client";

import { forwardRef, type ForwardedRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { ParagraphProps, FontWeight, TextAlign } from "../../types";

// ── Maps ──

const SIZE_CLASS: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const WEIGHT_CLASS: Record<FontWeight, string> = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
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

interface ExtendedParagraphProps extends ParagraphProps {
  children?: ReactNode;
}

function Paragraph(
  {
    size = "md",
    color,
    align,
    weight,
    leading,
    maxWidth,
    clamp,
    className,
    style,
    children,
    ...rest
  }: ExtendedParagraphProps,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  const inlineStyle: React.CSSProperties = {
    ...(color ? { color } : {}),
    ...(maxWidth ? { maxWidth } : {}),
    ...style,
  };

  return (
    <motion.div>
      <p
        ref={ref}
        className={cn(
          "font-sans",
          SIZE_CLASS[size] ?? "text-base",
          weight && WEIGHT_CLASS[weight],
          leading && LEADING_CLASS[leading],
          align && ALIGN_CLASS[align],
          clamp ? `line-clamp-${clamp}` : "",
          className,
        )}
        style={inlineStyle}
        {...rest}
      >
        {children}
      </p>
    </motion.div>
  );
}

const ForwardedParagraph = forwardRef(Paragraph);
ForwardedParagraph.displayName = "Paragraph";

export default ForwardedParagraph;
export { ForwardedParagraph as Paragraph };
