"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface SectionBackgroundProps extends EditableProps {
  bgImage?: string;
  bgVideo?: string;
  bgOverlay?: string;
  bgOverlayOpacity?: number;
}

const SectionBackground = forwardRef<HTMLDivElement, SectionBackgroundProps>(
  ({ bgImage, bgVideo, bgOverlay = "rgba(15,16,32,0.4)", bgOverlayOpacity = 0.5, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0", className)}
        {...props}
      >
        {/* Background Video */}
        {bgVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={bgVideo}
          />
        )}

        {/* Background Image */}
        {bgImage && !bgVideo && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}

        {/* Backdrop Overlay */}
        {(bgImage || bgVideo) && bgOverlay && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundColor: bgOverlay,
              opacity: bgOverlayOpacity,
            }}
          />
        )}
      </div>
    );
  }
);

SectionBackground.displayName = "SectionBackground";
export default SectionBackground;
export { SectionBackground };
