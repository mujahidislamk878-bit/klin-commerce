"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface ShapeDividerProps extends EditableProps {
  color?: string;
  height?: number;
  flip?: boolean;
  position?: "top" | "bottom";
  shape?: "wave" | "curve" | "triangle" | "tilt";
}

const ShapeDivider = forwardRef<HTMLDivElement, ShapeDividerProps>(
  (
    {
      color = "#F6F7FB",
      height = 60,
      flip = false,
      position = "bottom",
      shape = "wave",
      className,
      style,
      ...props
    },
    ref
  ) => {
    const paths = {
      wave: "M0,0 C240,40 480,80 720,40 C960,0 1200,80 1440,20 L1440,100 L0,100 Z",
      curve: "M0,100 C240,40 480,0 720,0 C960,0 1200,40 1440,100 Z",
      triangle: "M0,100 L720,0 L1440,100 Z",
      tilt: "M0,100 L1440,0 L1440,100 L0,100 Z",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "absolute left-0 right-0 overflow-hidden w-full leading-none pointer-events-none z-10",
          position === "top" ? "top-0" : "bottom-0",
          flip && "scale-x-[-1]",
          className
        )}
        style={{
          height: `${height}px`,
          transform: position === "top" ? "rotate(180deg)" : undefined,
          ...style,
        }}
        {...props}
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="relative block w-full"
          style={{ height: `${height}px` }}
        >
          <path d={paths[shape]} fill={color} />
        </svg>
      </div>
    );
  }
);

ShapeDivider.displayName = "ShapeDivider";
export default ShapeDivider;
export { ShapeDivider };
