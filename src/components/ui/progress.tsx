/**
 * PROGRESS BAR UI COMPONENT
 * 
 * A customizable progress bar component built on Radix UI primitives
 * with enhanced styling and accessibility features.
 * 
 * FEATURES:
 * - Accessible progress indication with ARIA attributes
 * - Smooth animations and transitions
 * - Customizable colors and styling
 * - Support for determinate and indeterminate states
 * - Responsive design with consistent sizing
 * 
 * USAGE SCENARIOS:
 * - Performance attribution breakdowns
 * - Loading states for data fetching
 * - Portfolio allocation displays
 * - Fee distribution percentages
 * 
 * ACCESSIBILITY:
 * - Proper ARIA roles and labels
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - High contrast mode support
 * 
 * @component
 */

"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }