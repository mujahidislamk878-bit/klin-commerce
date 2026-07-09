"use client";

import { forwardRef, type ForwardedRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { CaptionProps, FontWeight, TextAlign } from "../../types";

// ── Maps ──

const SIZE_CLASS: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
};

const WEIGHT_CLASS: Record<FontWeight, string> = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const TRACKING_CLASS: Record<string, string> = {
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

const ALIGN_CLASS: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// ── Component ──

interface ExtendedCaptionProps extends CaptionProps {
  children?: ReactNode;
}

function Caption(
  {
    size = "xs",
    uppercase = true,
    tracking = "wider",
    color,
    weight,
    align,
    className,
    style,
    children,
    ...rest
  }: ExtendedCaptionProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const inlineStyle: React.CSSProperties = {
    ...(color ? { color } : {}),
    ...style,
  };

  return (
    <motion.div>
      <span
        ref={ref}
        className={cn(
          "font-sans",
          SIZE_CLASS[size] ?? "text-xs",
          uppercase && "uppercase",
          tracking && TRACKING_CLASS[tracking],
          weight && WEIGHT_CLASS[weight],
          align && ALIGN_CLASS[align],
          className,
        )}
        style={inlineStyle}
        {...rest}
      >
        {children}
      </span>
    </motion.div>
  );
}

const ForwardedCaption = forwardRef(Caption);
ForwardedCaption.displayName = "Caption";

export default ForwardedCaption;
export { ForwardedCaption as Caption };
