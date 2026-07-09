"use client";

import { forwardRef } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../../utils/cn";
import type { CheckboxProps } from "../../types";

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      label,
      description,
      required,
      disabled,
      error,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const checkboxId = id || `checkbox-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <div className="flex items-start gap-3">
          <CheckboxPrimitive.Root
            ref={ref}
            id={checkboxId}
            disabled={disabled}
            required={required}
            className={cn(
              "peer h-4 w-4 shrink-0 rounded-sm border border-primary",
              "ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
              error && "border-destructive data-[state=checked]:bg-destructive",
            )}
            aria-invalid={!!error}
            {...props}
          >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
              <Check className="h-3 w-3" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          {(label || description) && (
            <div className="grid gap-0.5 leading-none">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    "text-sm font-medium leading-none",
                    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  )}
                >
                  {label}
                  {required && <span className="ml-1 text-destructive">*</span>}
                </label>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive ml-7" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export default Checkbox;