"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef(({ className, sideOffset = 6, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-lg border border-neutral-200/50 bg-black/40 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-md",
        "animate-in fade-in zoom-in-100 transition-all duration-200 ease-out",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out transition-all duration-150 ease-in",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  ))
TooltipContent.displayName = TooltipPrimitive.Content.displayName


export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }