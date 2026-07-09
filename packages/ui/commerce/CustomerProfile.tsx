"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  User,
  MapPin,
  Package,
  CreditCard,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

// ── Types ──

interface Customer {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  memberSince?: string;
  addresses?: CustomerAddress[];
  orderCount?: number;
  lifetimeValue?: number;
}

interface CustomerAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

interface CustomerProfileProps extends EditableProps {
  customer: Customer;
  variant?: "sidebar" | "full";
}

export type { Customer, CustomerAddress, CustomerProfileProps };

// ── Helpers ──

const bgColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgColors[Math.abs(hash) % bgColors.length];
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

// ── Component ──

/**
 * CustomerProfile displays a customer's personal information, addresses,
 * order history stats, and payment methods in a tabbed card layout.
 *
 * @example
 * <CustomerProfile
 *   variant="full"
 *   customer={{
 *     id: 1,
 *     name: "Alice Johnson",
 *     email: "alice@example.com",
 *     phone: "(555) 123-4567",
 *     addresses: [{ label: "Home", street: "123 Main St", city: "NYC", state: "NY", zip: "10001", isDefault: true }],
 *     orderCount: 12,
 *     totalValue: 1849.50,
 *   }}
 * />
 */
const CustomerProfile = forwardRef<HTMLDivElement, CustomerProfileProps>(
  (
    {
      className,
      customer,
      variant = "full",
      ...props
    },
    ref,
  ) => {
    const {
      name,
      email,
      phone,
      avatar,
      memberSince,
      addresses = [],
      orderCount = 0,
      lifetimeValue = 0,
    } = customer;

    const isSidebar = variant === "sidebar";

    // ── Tabs ──
    const tabs = [
      {
        value: "profile",
        label: "Profile",
        content: (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">{email}</span>
            </div>
            {phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{phone}</span>
              </div>
            )}
            {memberSince && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">Member since {memberSince}</span>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-lg font-bold tabular-nums">{orderCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Orders
                </p>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-lg font-bold tabular-nums">
                  {formatCurrency(lifetimeValue)}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Total
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        value: "addresses",
        label: "Addresses",
        content: addresses.length > 0 ? (
          <div className="space-y-3">
            {addresses.map((addr, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg border border-border p-3",
                  addr.isDefault && "border-primary",
                )}
              >
                {addr.label && (
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-medium text-primary">
                        Default
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm">{addr.street}</p>
                <p className="text-sm text-muted-foreground">
                  {addr.city}, {addr.state} {addr.zip}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No addresses on file.
          </p>
        ),
      },
      {
        value: "payment",
        label: "Payment",
        content: (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CreditCard className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              Payment methods not shown.
            </p>
          </div>
        ),
      },
    ];

    // ── Render ──
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden",
          className,
        )}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        {...props}
      >
        {/* ── Header ── */}
        <div
          className={cn(
            "flex items-center gap-4 p-5",
            isSidebar && "flex-col text-center",
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              "flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden",
              "h-12 w-12 text-base font-semibold text-white",
              getColor(name),
            )}
          >
            {avatar ? (
              <img src={avatar} alt={name} className="h-full w-full object-cover" />
            ) : (
              getInitials(name)
            )}
          </div>

          {/* Info */}
          <div className={cn("min-w-0", isSidebar && "text-center")}>
            <h3 className="text-base font-semibold text-foreground">{name}</h3>
            {memberSince && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Customer since {memberSince}
              </p>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <TabsPrimitive.Root defaultValue="profile">
          <TabsPrimitive.List
            className={cn(
              "flex border-b border-border px-5",
              isSidebar && "justify-center",
            )}
          >
            {tabs.map((tab) => (
              <TabsPrimitive.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "px-3 py-2 text-xs font-medium transition-all duration-200",
                  "text-muted-foreground hover:text-foreground",
                  "border-b-2 border-transparent",
                  "data-[state=active]:border-primary data-[state=active]:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                {tab.label}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>

          <div className="p-5">
            {tabs.map((tab) => (
              <TabsPrimitive.Content key={tab.value} value={tab.value}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.content}
                </motion.div>
              </TabsPrimitive.Content>
            ))}
          </div>
        </TabsPrimitive.Root>
      </motion.div>
    );
  },
);

CustomerProfile.displayName = "CustomerProfile";

export { CustomerProfile };
export default CustomerProfile;