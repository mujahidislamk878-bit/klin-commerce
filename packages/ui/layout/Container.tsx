"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as child via Radix Slot */
  asChild?: boolean;
  /** Maximum width value (applied as inline max-width + mx-auto) */
  maxWidth?: string;
  /** Apply horizontal padding (px-4 sm:px-6 lg:px-8) — defaults to true */
  paddingX?: boolean;
  /** Apply vertical padding (py-4 sm:py-6) — defaults to true */
  paddingY?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    { className, asChild = false, children, maxWidth, paddingX = true, paddingY = true, style, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : motion.div;

    return (
      <Comp
        ref={ref}
        className={cn(
          paddingX && "px-4 sm:px-6 lg:px-8",
          paddingY && "py-4 sm:py-6",
          className,
        )}
        style={{
          ...(maxWidth ? { maxWidth, marginLeft: "auto", marginRight: "auto" } : {}),
          ...(style ? { ...style } : {}),
        }}
        {...(props as any)}
      >
        {children}
      </Comp>
    );
  },
);
Container.displayName = "Container";

export { Container };
export default Container;
