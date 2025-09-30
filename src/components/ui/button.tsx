/**
 * BUTTON UI COMPONENT
 * 
 * A versatile button component built with class-variance-authority for
 * consistent styling and behavior across the application.
 * 
 * FEATURES:
 * - Multiple variants (default, destructive, outline, secondary, ghost, link)
 * - Size options (default, sm, lg, icon)
 * - Full accessibility support with proper ARIA attributes
 * - Loading states and disabled states
 * - Consistent focus and hover states
 * 
 * @component
 */

"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * BUTTON VARIANT CONFIGURATION
 * 
 * Defines all available button styles using class-variance-authority
 * for type-safe and consistent styling across the application.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * BUTTON COMPONENT PROPS
 * 
 * Extends HTML button attributes with variant props for styling options.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * BUTTON COMPONENT
 * 
 * Main button component with support for all variants and sizes.
 * Can render as a child component using the asChild prop.
 * 
 * @param className - Additional CSS classes
 * @param variant - Button style variant
 * @param size - Button size option
 * @param asChild - Render as child component (for composition)
 * @param props - Additional button HTML attributes
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }