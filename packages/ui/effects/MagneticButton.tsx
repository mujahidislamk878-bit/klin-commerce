"use client";

import {
  forwardRef,
  useRef,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "../../utils/cn";

// ── Types ──

export interface MagneticButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

// ── Component ──

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      strength = 0.3,
      radius = 100,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 200, damping: 15 });
    const springY = useSpring(y, { stiffness: 200, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = buttonRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist > radius) {
        x.set(0);
        y.set(0);
        return;
      }

      // Scale strength by proximity (closer = stronger)
      const proximity = 1 - dist / radius;
      x.set(distX * strength * proximity);
      y.set(distY * strength * proximity);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        style={{ x: springX, y: springY, ...style }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "inline-flex items-center justify-center transition-shadow",
          className,
        )}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  },
);

MagneticButton.displayName = "MagneticButton";

export { MagneticButton };
export default MagneticButton;
