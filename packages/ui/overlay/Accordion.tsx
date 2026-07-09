"use client";

import { forwardRef, type ReactNode, useId } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

// ── Types ──

type AccordionVariant = "default" | "bordered" | "ghost" | "soft";
type AccordionSize = "sm" | "md" | "lg";
type AccordionType = "single" | "multiple";

export interface AccordionItem {
  label: string;
  content: ReactNode;
  value?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: AccordionType;
  defaultOpen?: string[];
  variant?: AccordionVariant;
  size?: AccordionSize;
  className?: string;
}

// ── Variant styles ──

const variantRootClasses: Record<AccordionVariant, string> = {
  default: "divide-y",
  bordered: "border rounded-lg divide-y",
  ghost: "divide-y",
  soft: "bg-muted/50 rounded-lg divide-y divide-white/50",
};

const variantTriggerPadding: Record<AccordionVariant, string> = {
  default: "px-0",
  bordered: "px-4",
  ghost: "px-0",
  soft: "px-4",
};

const variantContentPadding: Record<AccordionVariant, string> = {
  default: "px-0",
  bordered: "px-4",
  ghost: "px-0",
  soft: "px-4",
};

const sizeTriggerClasses: Record<AccordionSize, string> = {
  sm: "py-2 text-sm",
  md: "py-3 text-base",
  lg: "py-4 text-lg",
};

const sizeContentPadding: Record<AccordionSize, string> = {
  sm: "pb-3",
  md: "pb-4",
  lg: "pb-5",
};

const sizeContentText: Record<AccordionSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

// ── Component ──

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      type = "single",
      defaultOpen,
      variant = "default",
      size = "md",
      className,
    },
    ref,
  ) => {
    const uid = useId();

    return (
      <>
        {/* keyframes are deduplicated by the uid-based selector */}
        <style>{`
          .accordion-content-${uid}[data-state="open"] {
            height: var(--radix-accordion-content-height);
            opacity: 1;
          }
          .accordion-content-${uid}[data-state="closed"] {
            height: 0;
            opacity: 0;
          }
        `}</style>

        <AccordionPrimitive.Root
          ref={ref}
          type={type === "multiple" ? "multiple" : "single"}
          defaultValue={defaultOpen}
          className={cn("w-full", variantRootClasses[variant], className)}
          {...({} as any)}
        >
          {items.map((item, index) => {
            const value = item.value ?? `accordion-item-${index}`;
            return (
              <AccordionPrimitive.Item key={value} value={value}>
                <AccordionPrimitive.Header asChild>
                  <AccordionPrimitive.Trigger
                    className={cn(
                      "flex w-full items-center justify-between text-left font-medium text-foreground transition-colors",
                      "hover:text-foreground/80",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      variantTriggerPadding[variant],
                      sizeTriggerClasses[size],
                      "[&[data-state=open]>svg]:rotate-180",
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>

                <AccordionPrimitive.Content
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    `accordion-content-${uid}`,
                    variantContentPadding[variant],
                  )}
                >
                  <div
                    className={cn(
                      sizeContentPadding[size],
                      sizeContentText[size],
                      "text-muted-foreground",
                    )}
                  >
                    {item.content}
                  </div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            );
          })}
        </AccordionPrimitive.Root>
      </>
    );
  },
);

Accordion.displayName = "Accordion";

export { Accordion };
export default Accordion;
