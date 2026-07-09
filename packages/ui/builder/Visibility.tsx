"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

// ── Animation variants ──

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const slideVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const scaleVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const variantMap = {
  fade: fadeVariants,
  slide: slideVariants,
  scale: scaleVariants,
};

// ── Props ──

export interface VisibilityProps {
  /** Whether the content is visible */
  visible: boolean;
  /** Children to show/hide */
  children: React.ReactNode;
  /** Mode: hide children when visible=false, or show children only when visible=true */
  mode?: "hide" | "show";
  /** When true, use visibility:hidden instead of display:none to preserve space */
  keepSpace?: boolean;
  /** Animation to apply on visibility change */
  animation?: "fade" | "slide" | "scale" | "none";
  /** Additional class names */
  className?: string;
}

// ── Component ──

const Visibility = React.forwardRef<HTMLDivElement, VisibilityProps>(
  (
    {
      visible,
      children,
      mode = "hide",
      keepSpace = false,
      animation = "none",
      className,
    },
    ref,
  ) => {
    const shouldRender =
      mode === "hide" ? visible : visible;

    // ── No animation: plain CSS toggle ──
    if (animation === "none") {
      return (
        <div
          ref={ref}
          className={cn(
            !keepSpace && !shouldRender && "hidden",
            keepSpace && !shouldRender && "invisible",
            className,
          )}
        >
          {children}
        </div>
      );
    }

    // ── Animated ──
    const variants = variantMap[animation] ?? fadeVariants;

    return (
      <div ref={ref} className={cn(className)}>
        <AnimatePresence>
          {shouldRender && (
            <motion.div
              key="visibility-content"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
Visibility.displayName = "Visibility";

export { Visibility };
export default Visibility;
