"use client";

import { forwardRef, useState, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface HoverGlowProps extends EditableProps {
  children?: ReactNode;
  glowColor?: string;
  glowSize?: number;
}

const HoverGlow = forwardRef<HTMLDivElement, HoverGlowProps>(
  ({ children, glowColor = "rgba(15,16,32,0.08)", glowSize = 300, className, ...props }, ref) => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    return (
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(false)}
        className={cn("relative overflow-hidden group", className)}
        {...props}
      >
        {hovered && (
          <div
            className="absolute pointer-events-none transition-opacity duration-300 rounded-full"
            style={{
              width: `${glowSize}px`,
              height: `${glowSize}px`,
              left: `${coords.x - glowSize / 2}px`,
              top: `${coords.y - glowSize / 2}px`,
              background: `radial-gradient(circle closest-side, ${glowColor}, transparent)`,
            }}
          />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

HoverGlow.displayName = "HoverGlow";
export default HoverGlow;
export { HoverGlow };
