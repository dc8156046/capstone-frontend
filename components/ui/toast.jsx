"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "fixed bottom-4 right-4 z-[100] flex flex-col gap-4 max-w-[400px] w-full sm:w-auto",
        className
      )}
      {...props}
    />
  ));
  
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

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
  
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

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
  
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
