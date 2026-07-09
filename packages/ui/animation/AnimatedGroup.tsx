"use client";

import { forwardRef, useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../utils/cn";

// ── Types ──

type GroupDirection = "up" | "down" | "left" | "right";

export interface AnimatedGroupProps {
  children: ReactNode[];
  staggerDelay?: number;
  direction?: GroupDirection;
  once?: boolean;
  className?: string;
}

// ── Direction offsets ──

function getOffset(direction: GroupDirection) {
  switch (direction) {
    case "up":
      return { y: 30 };
    case "down":
      return { y: -30 };
    case "left":
      return { x: 30 };
    case "right":
      return { x: -30 };
  }
}

// ── Component ──

const AnimatedGroup = forwardRef<HTMLDivElement, AnimatedGroupProps>(
  (
    {
      children,
      staggerDelay = 0.1,
      direction = "up",
      once = true,
      className,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once });
    const offset = getOffset(direction);

    return (
      <div ref={containerRef} className={cn(className)}>
        {Array.isArray(children) &&
          children.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, ...offset }}
              animate={
                isInView
                  ? { opacity: 1, x: 0, y: 0 }
                  : { opacity: 0, ...offset }
              }
              transition={{
                duration: 0.5,
                delay: index * staggerDelay,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {child}
            </motion.div>
          ))}
      </div>
    );
  },
);

AnimatedGroup.displayName = "AnimatedGroup";

export { AnimatedGroup };
export default AnimatedGroup;
