"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { QuoteProps } from "../../types";
import { Avatar } from "./Avatar";

// ── Maps ──

const variantClasses: Record<string, string> = {
  default: "",
  card: "bg-card border rounded-xl p-6 shadow-sm",
  bordered: "border-l-4 border-primary pl-4",
  highlight: "bg-primary/5 p-6 rounded-xl",
};

// ── Component ──

const Quote = forwardRef<HTMLQuoteElement, QuoteProps>(
  (
    {
      className,
      quote,
      author,
      role,
      avatar,
      variant = "default",
      bgColor,
      textColor,
      style,
      ...props
    },
    ref,
  ) => {
    const quoteStyle: React.CSSProperties = {
      ...(bgColor ? { backgroundColor: bgColor } : {}),
      ...(textColor ? { color: textColor } : {}),
      ...style,
    };

    return (
      <motion.blockquote
        ref={ref}
        className={cn("space-y-4", variantClasses[variant], className)}
        style={quoteStyle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        <p className="text-lg italic leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>

        {(author || role || avatar) && (
          <div className="flex items-center gap-3 pt-2">
            {avatar && (
              <Avatar
                src={avatar.src}
                alt={avatar.alt}
                name={avatar.name}
                size={avatar.size || "sm"}
                radius={avatar.radius}
                fallback={avatar.fallback}
                className={avatar.className}
              />
            )}

            <div>
              {author && (
                <cite className="not-italic font-semibold text-sm block">
                  {author}
                </cite>
              )}
              {role && (
                <span className="text-xs text-muted-foreground">{role}</span>
              )}
            </div>
          </div>
        )}
      </motion.blockquote>
    );
  },
);

Quote.displayName = "Quote";

export { Quote };
export default Quote;
