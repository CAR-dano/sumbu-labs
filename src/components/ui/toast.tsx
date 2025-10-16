"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col gap-3 p-4 md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl bg-white/[0.06] backdrop-blur-md p-4 pr-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/10 transition-all duration-220 ease-out data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:fade-in-0 hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)] before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:-z-10 before:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent",
        success:
          "before:bg-gradient-to-br before:from-emerald-500/30 before:via-emerald-400/10 before:to-transparent ring-emerald-500/20",
        error:
          "before:bg-gradient-to-br before:from-rose-500/30 before:via-rose-400/10 before:to-transparent ring-rose-500/20",
        warning:
          "before:bg-gradient-to-br before:from-amber-500/30 before:via-amber-400/10 before:to-transparent ring-amber-500/20",
        info: "before:bg-gradient-to-br before:from-sky-500/30 before:via-sky-400/10 before:to-transparent ring-sky-500/20",
        loading:
          "before:bg-gradient-to-br before:from-violet-500/30 before:via-violet-400/10 before:to-transparent ring-violet-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Icon mapping for variants
const iconMap = {
  default: null,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

// Icon colors for variants
const iconColorMap = {
  default: "text-white/70",
  success: "text-emerald-400",
  error: "text-rose-400",
  warning: "text-amber-400",
  info: "text-sky-400",
  loading: "text-violet-400",
};

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      duration?: number;
    }
>(
  (
    { className, variant = "default", duration = 3500, children, ...props },
    ref
  ) => {
    const [progress, setProgress] = React.useState(100);
    const [isPaused, setIsPaused] = React.useState(false);
    const startTimeRef = React.useRef<number>(Date.now());
    const remainingTimeRef = React.useRef<number>(duration);

    React.useEffect(() => {
      if (isPaused) return;

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(newProgress);

        if (newProgress <= 0) {
          clearInterval(interval);
        }
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }, [isPaused, duration]);

    const handleMouseEnter = () => {
      setIsPaused(true);
      remainingTimeRef.current = (progress / 100) * duration;
    };

    const handleMouseLeave = () => {
      setIsPaused(false);
      startTimeRef.current = Date.now();
    };

    const Icon = variant ? iconMap[variant] : null;

    return (
      <ToastPrimitives.Root
        ref={ref}
        duration={duration}
        className={cn(toastVariants({ variant }), className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Icon */}
        {Icon && (
          <div className="flex-shrink-0 mt-0.5">
            <Icon
              className={cn(
                "w-5 h-5",
                iconColorMap[variant || "default"],
                variant === "loading" && "animate-spin"
              )}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </ToastPrimitives.Root>
    );
  }
);
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-xl bg-white/5 px-3 text-sm font-medium text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-lg p-1.5 text-white/40 opacity-0 transition-all duration-200 hover:text-white/70 hover:bg-white/5 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/20 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-bold text-white leading-tight", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm text-white/75 leading-relaxed mt-1", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
