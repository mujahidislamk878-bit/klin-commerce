"use client";

import { forwardRef } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { TabsProps } from "../../types";

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      tabs,
      defaultTab,
      variant = "underline",
      orientation = "horizontal",
      ...props
    },
    ref,
  ) => {
    const triggerBase = cn(
      "px-4 py-2 text-sm font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "whitespace-nowrap select-none",
    );

    const triggerVariant: Record<string, string> = {
      underline: cn(
        "border-b-2 border-transparent",
        "text-muted-foreground hover:text-foreground",
        "data-[state=active]:border-primary data-[state=active]:text-foreground",
      ),
      pills: cn(
        "rounded-md",
        "text-muted-foreground hover:text-foreground",
        "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
      ),
      buttons: cn(
        "rounded-md border border-input bg-background shadow-sm",
        "hover:bg-accent hover:text-accent-foreground",
        "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary",
      ),
    };

    const listVariant: Record<string, string> = {
      underline: "border-b border-border",
      pills: "gap-1",
      buttons: "gap-1",
    };

    return (
      <TabsPrimitive.Root
        ref={ref}
        defaultValue={defaultTab || tabs[0]?.value}
        orientation={orientation}
        className={cn(orientation === "vertical" && "flex gap-4", className)}
        {...props}
      >
        <TabsPrimitive.List
          className={cn(
            "flex",
            orientation === "vertical" && "flex-col",
            listVariant[variant],
          )}
        >
          {tabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              className={cn(triggerBase, triggerVariant[variant])}
            >
              {tab.label}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>

        {tabs.map(
          (tab) =>
            tab.content && (
              <TabsPrimitive.Content
                key={tab.value}
                value={tab.value}
                className="focus-visible:outline-none"
              >
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.content}
                </motion.div>
              </TabsPrimitive.Content>
            ),
        )}
      </TabsPrimitive.Root>
    );
  },
);

Tabs.displayName = "Tabs";

export { Tabs };
export default Tabs;
