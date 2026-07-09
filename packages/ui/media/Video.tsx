"use client";

import { forwardRef, type VideoHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { VideoProps, RoundedSize } from "../../types";

const radiusClasses: Record<RoundedSize, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  (
    {
      src,
      poster,
      width,
      height,
      radius,
      autoPlay = false,
      loop = true,
      muted = true,
      controls = false,
      objectFit,
      lazy = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const videoAttributes: VideoHTMLAttributes<HTMLVideoElement> & {
      preload?: "none" | "metadata" | "auto";
    } = {
      src,
      poster,
      width: width !== undefined ? Number(width) : undefined,
      height: height !== undefined ? Number(height) : undefined,
      autoPlay,
      loop,
      muted,
      controls,
      playsInline: autoPlay, // required for autoplay on iOS/Safari
      preload: lazy ? "none" : "metadata",
      style: objectFit ? { objectFit } : undefined,
    };

    return (
      <motion.div
        className={cn(
          "overflow-hidden",
          radius && radiusClasses[radius],
          className,
        )}
        style={{
          ...style,
          ...(width !== undefined
            ? { width: typeof width === "number" ? width : width }
            : {}),
          ...(height !== undefined
            ? { height: typeof height === "number" ? height : height }
            : {}),
        }}
        {...rest}
      >
        <video
          ref={ref}
          {...videoAttributes}
          className="h-full w-full"
        />
      </motion.div>
    );
  },
);

Video.displayName = "Video";

export { Video };
export default Video;
