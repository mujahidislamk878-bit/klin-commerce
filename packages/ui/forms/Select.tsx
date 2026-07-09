"use client";

import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";
import type { SelectProps } from "../../types";
import { FormFieldWrapper } from "./FormFieldWrapper";

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      placeholder,
      options,
      required,
      disabled,
      error,
      hint,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <FormFieldWrapper
        label={label}
        required={required}
        error={error}
        hint={hint}
        id={selectId}
        className={className}
      >
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm",
              "ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "appearance-none pr-10",
              error && "border-destructive",
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 pr-3 pointer-events-none text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </FormFieldWrapper>
    );
  },
);

Select.displayName = "Select";

export { Select };
export default Select;