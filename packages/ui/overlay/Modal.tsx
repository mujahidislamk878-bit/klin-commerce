"use client";

import { forwardRef, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

// ── Types ──

type ModalSize = "sm" | "md" | "lg" | "xl" | "full" | "auto";
type ModalVariant = "default" | "sidebar" | "drawer";

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
  closeButton?: boolean;
  preventOutsideClose?: boolean;
  className?: string;
}

// ── Size map ──

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[90vw]",
  auto: "max-w-fit",
};

// ── Variant animations ──

const variantAnimations: Record<
  ModalVariant,
  { initial: Record<string, number | string>; animate: Record<string, number | string>; exit: Record<string, number | string> }
> = {
  default: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  sidebar: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
  },
  drawer: {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" },
  },
};

// ── Component ──

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      footer,
      size = "md",
      variant = "default",
      closeButton = true,
      preventOutsideClose = false,
      className,
    },
    ref,
  ) => {
    const anim = variantAnimations[variant];

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              {/* Overlay */}
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  key="modal-overlay"
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              {/* Content */}
              <Dialog.Content
                asChild
                forceMount
                onInteractOutside={
                  preventOutsideClose ? (e) => e.preventDefault() : undefined
                }
              >
                <motion.div
                  key="modal-content"
                  ref={ref}
                  className={cn(
                    "fixed z-50 overflow-y-auto bg-background shadow-xl",
                    // variant positioning
                    variant === "default" &&
                      "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl",
                    variant === "sidebar" &&
                      "right-0 top-0 h-full max-h-screen rounded-l-xl",
                    variant === "drawer" &&
                      "bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl",
                    // sizing
                    variant === "default" && sizeMap[size],
                    variant === "sidebar" && "w-full sm:max-w-lg",
                    variant === "drawer" && "w-full",
                    className,
                  )}
                  initial={anim.initial}
                  animate={anim.animate}
                  exit={anim.exit}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                >
                  {/* Header */}
                  {(title || closeButton) && (
                    <div
                      className={cn(
                        "flex items-start justify-between gap-4",
                        "px-6 pt-6 pb-0",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        {title && (
                          <Dialog.Title className="text-lg font-semibold text-foreground">
                            {title}
                          </Dialog.Title>
                        )}
                        {description && (
                          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                            {description}
                          </Dialog.Description>
                        )}
                      </div>

                      {closeButton && (
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            aria-label="Close"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </Dialog.Close>
                      )}
                    </div>
                  )}

                  {/* Body */}
                  <div className="px-6 py-6">{children}</div>

                  {/* Footer */}
                  {footer && (
                    <div className="border-t px-6 py-4">{footer}</div>
                  )}
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    );
  },
);

Modal.displayName = "Modal";

export { Modal };
export default Modal;
