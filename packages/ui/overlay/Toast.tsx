"use client";

import {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "../../utils/cn";

// ── Types ──

type ToastVariant = "info" | "success" | "warning" | "error" | "loading" | "blank";
type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  message?: string;
  description?: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  duration?: number;
  dismissible?: boolean;
  action?: ToastAction;
  className?: string;
  children?: ReactNode;
}

// ── Icon map ──

const iconMap: Record<ToastVariant, ReactNode> = {
  info: <Info className="h-5 w-5 text-blue-500" />,
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  loading: <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />,
  blank: null,
};

// ── Position classes ──

const positionClasses: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

// ── Slide direction per position ──

function getSlideDirection(position: ToastPosition) {
  if (position.startsWith("top")) return { y: -20 };
  return { y: 20 };
}

// ── Component ──

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      open,
      onOpenChange,
      message,
      description,
      variant = "info",
      position = "top-right",
      duration = 4000,
      dismissible = true,
      action,
      className,
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(open);

    const handleClose = useCallback(() => {
      setVisible(false);
      onOpenChange?.(false);
    }, [onOpenChange]);

    // Sync external open state
    useEffect(() => {
      setVisible(open);
    }, [open]);

    // Auto-dismiss
    useEffect(() => {
      if (!visible || variant === "loading" || duration <= 0) return;

      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }, [visible, variant, duration, handleClose]);

    const slideDir = getSlideDirection(position);

    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={ref}
            role="alert"
            aria-live="polite"
            className={cn(
              "fixed z-[100] flex items-start gap-3 rounded-lg border bg-background p-4 shadow-lg",
              "max-w-sm w-full",
              positionClasses[position],
              className,
            )}
            initial={{ opacity: 0, ...slideDir }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, ...slideDir }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Icon */}
            {variant !== "blank" && (
              <span className="mt-0.5 shrink-0">{iconMap[variant]}</span>
            )}

            {/* Content */}
            <div className="min-w-0 flex-1">
              {message && (
                <p className="text-sm font-medium text-foreground">{message}</p>
              )}
              {description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            {/* Action */}
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="shrink-0 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {action.label}
              </button>
            )}

            {/* Close */}
            {dismissible && variant !== "loading" && (
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

Toast.displayName = "Toast";

export { Toast };
export default Toast;
