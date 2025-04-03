"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

const ToastProvider = ({ children }) => (
  <ToastPrimitives.Provider>{children}</ToastPrimitives.Provider>
);

const ToastViewport = () => {
  const [mounted, setMounted] = React.useState(false);
  const [viewportRef, setViewportRef] = React.useState(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 自定义挂载点为 document.body
  const mountNode = typeof document !== "undefined" ? document.body : null;

  if (!mountNode) return null;

  return createPortal(
    <ToastPrimitives.Viewport
      ref={setViewportRef}
      className={cn(
        "fixed bottom-4 right-4 z-[100] flex flex-col gap-4 max-w-[400px] w-full sm:w-auto"
      )}
    />,
    mountNode
  );
};

const toastVariants = {
  default:
    "border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg rounded-lg p-4 flex flex-col gap-2 transition-all duration-300",
  destructive:
    "border border-red-600 bg-red-600 text-white shadow-lg rounded-lg p-4 flex flex-col gap-2 transition-all duration-300 hover:bg-red-500",
};

const Toast = React.forwardRef(({ className, variant = "default", duration = 3000, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    duration={duration}
    className={cn(toastVariants[variant], className)}
    {...props}
  />
));
Toast.displayName = "Toast";

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 opacity-50 hover:opacity-100 transition-opacity",
      className
    )}
    {...props}
  >
    <X className="h-5 w-5" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = "ToastDescription";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};