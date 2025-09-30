/**
 * SEPARATOR UI COMPONENT
 * 
 * A flexible separator component for creating visual divisions between
 * content sections with proper semantic meaning and accessibility.
 * 
 * FEATURES:
 * - Horizontal and vertical orientation support
 * - Semantic HTML structure with proper ARIA roles
 * - Consistent styling with theme integration
 * - Responsive design with adaptive spacing
 * - Customizable appearance and sizing
 * 
 * USAGE PATTERNS:
 * - Section dividers in cards and panels
 * - Content grouping in dashboards
 * - Visual hierarchy in forms and lists
 * - Layout structure in complex interfaces
 * 
 * ACCESSIBILITY:
 * - Proper separator role for screen readers
 * - Decorative vs semantic distinction
 * - Keyboard navigation compatibility
 * - Focus management integration
 * 
 * @component
 */

"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }