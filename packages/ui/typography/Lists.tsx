"use client";

import { forwardRef, type HTMLAttributes, type LiHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface ListProps extends EditableProps, HTMLAttributes<HTMLOListElement | HTMLUListElement> {
  spacing?: "sm" | "md" | "lg";
}

export interface ListItemProps extends EditableProps, LiHTMLAttributes<HTMLLIElement> {}

const UnorderedList = forwardRef<HTMLUListElement, ListProps>(
  ({ children, spacing = "sm", className, ...props }, ref) => {
    const spacingClass = spacing === "sm" ? "space-y-1" : spacing === "md" ? "space-y-2" : "space-y-4";
    return (
      <ul
        ref={ref}
        className={cn("list-disc list-inside text-[#0F1020]/80 pl-4", spacingClass, className)}
        {...props}
      >
        {children}
      </ul>
    );
  }
);

UnorderedList.displayName = "UnorderedList";

const OrderedList = forwardRef<HTMLOListElement, ListProps>(
  ({ children, spacing = "sm", className, ...props }, ref) => {
    const spacingClass = spacing === "sm" ? "space-y-1" : spacing === "md" ? "space-y-2" : "space-y-4";
    return (
      <ol
        ref={ref}
        className={cn("list-decimal list-inside text-[#0F1020]/80 pl-4", spacingClass, className)}
        {...props}
      >
        {children}
      </ol>
    );
  }
);

OrderedList.displayName = "OrderedList";

const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn("text-sm md:text-base leading-relaxed", className)} {...props}>
        {children}
      </li>
    );
  }
);

ListItem.displayName = "ListItem";

export { UnorderedList, OrderedList, ListItem };
