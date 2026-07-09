"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

// ── Types ──

type RevealDirection = "up" | "down" | "left" | "right" | "none";

export interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  once?: boolean;
  distance?: number;
  duration?: number;
  className?: string;
}

// ── Direction offsets ──

function getOffset(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    case "none":
      return {};
  }
}

// ── Component ──

const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(
  (
    {
      children,
      direction = "up",
      delay = 0,
      once = true,
      distance = 50,
      duration = 0.5,
      className,
    },
    ref,
  ) => {
    const offset = getOffset(direction, distance);

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        initial={{ opacity: 0, ...offset }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    );
  },
);

ScrollReveal.displayName = "ScrollReveal";

export { ScrollReveal };
export default ScrollReveal;
