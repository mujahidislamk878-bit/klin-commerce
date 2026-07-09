"use client";

import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

// ── Types ──

type DrawerSide = "left" | "right" | "top" | "bottom";
type DrawerSize = "sm" | "md" | "lg" | "full";

export interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  children?: ReactNode;
  side?: DrawerSide;
  size?: DrawerSize;
  className?: string;
  preventOutsideClose?: boolean;
}

// ── Size maps ──

const sizeMapHorizontal: Record<DrawerSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-full",
};

const sizeMapVertical: Record<DrawerSize, string> = {
  sm: "h-1/4",
  md: "h-1/3",
  lg: "h-1/2",
  full: "h-full",
};

// ── Animation variants ──

function getVariants(side: DrawerSide) {
  const offsetMap: Record<DrawerSide, string> = {
    left: "-100%",
    right: "100%",
    top: "-100%",
    bottom: "100%",
  };
  const offset = offsetMap[side];

  const isHorizontal = side === "left" || side === "right";
  const fromProp = isHorizontal ? { x: offset } : { y: offset };
  const toProp = isHorizontal ? { x: 0 } : { y: 0 };

  return {
    initial: { opacity: 0, ...fromProp },
    animate: { opacity: 1, ...toProp },
    exit: { opacity: 0, ...fromProp },
  };
}

function getPositionClasses(side: DrawerSide): string {
  const map: Record<DrawerSide, string> = {
    left: "left-0 top-0 h-full",
    right: "right-0 top-0 h-full",
    top: "top-0 left-0 w-full",
    bottom: "bottom-0 left-0 w-full",
  };
  return map[side];
}

function getSizeClasses(side: DrawerSide, size: DrawerSize): string {
  if (side === "left" || side === "right") {
    return sizeMapHorizontal[size];
  }
  return sizeMapVertical[size];
}

// ── Component ──

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onOpenChange,
      title,
      children,
      side = "right",
      size = "md",
      className,
      preventOutsideClose = false,
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    const anim = getVariants(side);
    const position = getPositionClasses(side);
    const sizing = getSizeClasses(side, size);
    const isHorizontal = side === "left" || side === "right";

    // ── Focus trap (basic) ──
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape" && !preventOutsideClose) {
          onOpenChange?.(false);
          return;
        }
        if (e.key !== "Tab" || !panelRef.current) return;

        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      },
      [preventOutsideClose, onOpenChange],
    );

    useEffect(() => {
      if (open) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        document.addEventListener("keydown", handleKeyDown);

        // Focus first focusable element
        requestAnimationFrame(() => {
          const first = panelRef.current?.querySelector<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          );
          first?.focus();
        });
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        previousActiveElement.current?.focus();
      };
    }, [open, handleKeyDown]);

    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                if (!preventOutsideClose) onOpenChange?.(false);
              }}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="drawer-panel"
              ref={(node) => {
                (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
              }}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className={cn(
                "fixed z-50 flex flex-col bg-background shadow-xl",
                position,
                sizing,
                // rounding
                side === "left" && "rounded-r-xl",
                side === "right" && "rounded-l-xl",
                side === "top" && "rounded-b-xl",
                side === "bottom" && "rounded-t-xl",
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
              {title && (
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => onOpenChange?.(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Body */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto",
                  title ? "px-6 py-4" : "px-6 py-6",
                )}
              >
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  },
);

Drawer.displayName = "Drawer";

export { Drawer };
export default Drawer;
