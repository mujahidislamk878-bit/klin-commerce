"use client";

import { forwardRef, type ReactNode } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

// ── Types ──

type AlertVariant = "default" | "destructive" | "success" | "warning";

export interface AlertProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  cancelLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  onCancel?: () => void;
  variant?: AlertVariant;
  className?: string;
  children?: ReactNode;
}

// ── Variant action button colours ──

const actionVariantClasses: Record<AlertVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  warning: "bg-amber-600 text-white hover:bg-amber-700",
};

// ── Component ──

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      cancelLabel = "Cancel",
      actionLabel = "Continue",
      onAction,
      onCancel,
      variant = "default",
      className,
      children,
    },
    ref,
  ) => {
    return (
      <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <AlertDialog.Portal forceMount>
              {/* Overlay */}
              <AlertDialog.Overlay asChild forceMount>
                <motion.div
                  key="alert-overlay"
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AlertDialog.Overlay>

              {/* Content */}
              <AlertDialog.Content asChild forceMount>
                <motion.div
                  key="alert-content"
                  ref={ref}
                  className={cn(
                    "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
                    "rounded-xl bg-background p-6 shadow-xl",
                    className,
                  )}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                >
                  {title && (
                    <AlertDialog.Title className="text-lg font-semibold text-foreground">
                      {title}
                    </AlertDialog.Title>
                  )}

                  {description && (
                    <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
                      {description}
                    </AlertDialog.Description>
                  )}

                  {children && <div className="mt-4">{children}</div>}

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <AlertDialog.Cancel asChild>
                      <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {cancelLabel}
                      </button>
                    </AlertDialog.Cancel>

                    <AlertDialog.Action asChild>
                      <button
                        type="button"
                        onClick={onAction}
                        className={cn(
                          "inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                          actionVariantClasses[variant],
                        )}
                      >
                        {actionLabel}
                      </button>
                    </AlertDialog.Action>
                  </div>
                </motion.div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          )}
        </AnimatePresence>
      </AlertDialog.Root>
    );
  },
);

Alert.displayName = "Alert";

export { Alert };
export default Alert;
