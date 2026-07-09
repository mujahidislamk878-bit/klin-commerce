"use client";

import { forwardRef } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "../../utils/cn";
import type { LinkProps } from "../../types";

// ── Variant map ──

const variantClasses: Record<string, string> = {
  default: "text-primary hover:text-primary/80",
  underline:
    "underline underline-offset-4 decoration-primary/30 hover:decoration-primary",
  muted: "text-muted-foreground hover:text-foreground",
  ghost: "hover:text-primary",
};

// ── Size map ──

const sizeClasses: Record<string, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

// ── Component ──

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      href,
      target,
      rel,
      variant = "default",
      size = "md",
      color,
      underline: forceUnderline = false,
      external = false,
      children,
      ...props
    },
    ref,
  ) => {
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : target
        ? { target, rel }
        : {};

    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          "inline-flex items-center gap-1.5 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          forceUnderline && "underline underline-offset-4",
          color && `text-[${color}]`,
          className,
        )}
        {...externalProps}
        {...(props as any)}
      >
        {children}
        {external && (
          <ExternalLink
            className="h-3.5 w-3.5 shrink-0 opacity-70"
            aria-hidden="true"
          />
        )}
      </a>
    );
  },
);

Link.displayName = "Link";

export { Link };
export default Link;
