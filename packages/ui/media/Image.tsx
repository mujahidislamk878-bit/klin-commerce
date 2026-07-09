"use client";

import { forwardRef, useState, useCallback, type ImgHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { ImageProps, RoundedSize } from "../../types";

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

const Image = forwardRef<HTMLDivElement, ImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      objectFit = "cover",
      radius,
      lazy = true,
      priority = false,
      fallback,
      caption,
      zoomOnHover = false,
      overlay = false,
      overlayColor,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    const handleLoad = useCallback(() => {
      setLoaded(true);
    }, []);

    const handleError = useCallback(() => {
      setErrored(true);
      setLoaded(true);
    }, []);

    const hasFallback = errored && fallback;

    const imgAttributes: ImgHTMLAttributes<HTMLImageElement> & {
      fetchPriority?: "high" | "low" | "auto";
      loading?: "lazy" | "eager";
    } = {
      alt,
      width: width !== undefined ? Number(width) : undefined,
      height: height !== undefined ? Number(height) : undefined,
      style: { objectFit },
      loading: lazy ? "lazy" : "eager",
      fetchPriority: priority ? "high" : undefined,
      onLoad: handleLoad,
      onError: handleError,
      className: cn(
        "h-full w-full",
        zoomOnHover && "transition-transform duration-500 ease-out group-hover:scale-110",
      ),
    };

    // Image visually hidden until loaded (unless fallback showing)
    const imgStyle = {
      ...imgAttributes.style,
      ...(hasFallback ? { display: "none" } : {}),
      ...(!hasFallback && !loaded ? { opacity: 0 } : {}),
    };

    return (
      <motion.div
        ref={ref}
        className={cn("inline-flex flex-col", className)}
        style={{
          ...style,
          ...(width !== undefined
            ? { width: typeof width === "number" ? width : width }
            : {}),
        }}
        {...rest}
      >
        {/* Image wrapper — handles radius + zoom clip */}
        <div
          className={cn(
            "relative overflow-hidden",
            radius && radiusClasses[radius],
            zoomOnHover && "group",
          )}
          style={
            height !== undefined
              ? { height: typeof height === "number" ? height : height }
              : undefined
          }
        >
          {/* Fallback colour placeholder */}
          {hasFallback && (
            <div
              className="h-full w-full"
              style={{ backgroundColor: fallback }}
              aria-label={alt}
            />
          )}

          {/* Image element */}
          {!hasFallback && (
            <img
              {...imgAttributes}
              src={src}
              style={imgStyle}
              className={cn(
                imgAttributes.className,
                "transition-opacity duration-300",
                loaded && "opacity-100",
              )}
            />
          )}

          {/* Dark gradient overlay */}
          {overlay && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  overlayColor ??
                  "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)",
              }}
            />
          )}
        </div>

        {/* Caption below */}
        {caption && (
          <figcaption className="mt-2 text-sm text-muted-foreground">
            {caption}
          </figcaption>
        )}
      </motion.div>
    );
  },
);

Image.displayName = "Image";

export { Image };
export default Image;
