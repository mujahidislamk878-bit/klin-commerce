"use client";

import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface LinkTextProps extends EditableProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}

const LinkText = forwardRef<HTMLAnchorElement, LinkTextProps>(
  ({ children, href = "#", external = false, className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(
          "text-primary font-medium hover:text-primary/80 underline underline-offset-4 decoration-primary/30 transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

LinkText.displayName = "LinkText";
export default LinkText;
export { LinkText };
