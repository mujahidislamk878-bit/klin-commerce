"use client";

import { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../utils/cn";
import type { ToggleProps } from "../../types";

const trackSizeMap = {
  sm: "w-8 h-4",
  md: "w-10 h-5",
  lg: "w-12 h-6",
};

const thumbSizeMap = {
  sm: "h-3 w-3 data-[state=checked]:translate-x-4",
  md: "h-4 w-4 data-[state=checked]:translate-x-5",
  lg: "h-5 w-5 data-[state=checked]:translate-x-6",
};

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      label,
      description,
      size = "md",
      disabled,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const toggleId = id || `toggle-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className={cn("flex items-start gap-3", className)}>
        <SwitchPrimitive.Root
          ref={ref}
          id={toggleId}
          disabled={disabled}
          className={cn(
            "relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
            "bg-muted-foreground/20",
            "data-[state=checked]:bg-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-200 ease-out",
            trackSizeMap[size],
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            className={cn(
              "pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-out",
              "translate-x-0.5",
              thumbSizeMap[size],
            )}
          />
        </SwitchPrimitive.Root>

        {(label || description) && (
          <div className="grid gap-0.5 leading-none">
            {label && (
              <label
                htmlFor={toggleId}
                className="text-sm font-medium leading-none"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle };
export default Toggle;