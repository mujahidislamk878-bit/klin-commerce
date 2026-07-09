"use client";

import { forwardRef, type ElementType } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "../../utils/cn";
import type { IconProps } from "../../types";

/**
 * Renders a Lucide icon by name.
 *
 * @example
 * <Icon name="Heart" size={32} color="red" strokeWidth={1.5} />
 * <Icon name="Github" className="text-muted-foreground" />
 */
const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 24, color, strokeWidth = 2, className, style, ...rest }, ref) => {
    const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as
      | ElementType
      | undefined;

    if (!LucideIcon) {
      console.warn(
        `[Icon] Lucide icon "${name}" not found. Check spelling or icon name.`,
      );
      return null;
    }

    return (
      <LucideIcon
        ref={ref}
        size={typeof size === "number" ? size : Number(size)}
        color={color}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
        className={cn(className)}
        style={style}
        {...rest}
      />
    );
  },
);

Icon.displayName = "Icon";

export { Icon };
export default Icon;
