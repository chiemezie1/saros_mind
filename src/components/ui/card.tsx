/**
 * CARD UI COMPONENT LIBRARY
 * 
 * A collection of reusable card components built on top of Radix UI and styled
 * with Tailwind CSS. These components provide consistent styling and behavior
 * for content containers throughout the application.
 * 
 * COMPONENT HIERARCHY:
 * - Card: Main container with border and rounded corners
 * - CardHeader: Top section for titles and descriptions  
 * - CardTitle: Primary heading within the header
 * - CardDescription: Secondary text for additional context
 * - CardContent: Main content area with appropriate padding
 * - CardFooter: Bottom section for actions and additional info
 * 
 * DESIGN PRINCIPLES:
 * - Consistent spacing using Tailwind spacing scale
 * - Accessible focus states and semantic HTML structure
 * - Dark mode support through CSS custom properties
 * - Responsive design with mobile-first approach
 * 
 * USAGE PATTERNS:
 * - Dashboard metrics cards
 * - Content containers for forms and data
 * - Analytics visualizations
 * - Information panels
 * 
 * @component
 */

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * MAIN CARD CONTAINER COMPONENT
 * 
 * The primary container that provides the visual foundation for all card content.
 * Includes border, rounded corners, background, and shadow styling.
 * 
 * Features:
 * - Responsive border radius and padding
 * - Subtle border and shadow for depth
 * - Background color with proper contrast
 * - Support for forwarded refs
 * 
 * @param className - Additional CSS classes for customization
 * @param children - Content to be rendered inside the card
 * @param props - Additional HTML div element props
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/**
 * CARD HEADER COMPONENT
 * 
 * Container for card titles, descriptions, and header actions.
 * Provides consistent spacing and layout for the top section of cards.
 * 
 * Features:
 * - Standardized padding for visual consistency
 * - Flexbox layout support for complex headers
 * - Proper spacing between header elements
 * 
 * @param className - Additional CSS classes for customization
 * @param children - Header content (typically CardTitle and CardDescription)
 * @param props - Additional HTML div element props
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * CARD TITLE COMPONENT
 * 
 * Primary heading for card content with proper semantic structure.
 * Uses h3 element for accessibility and SEO benefits.
 * 
 * Features:
 * - Semantic HTML structure with h3 element
 * - Consistent typography scaling
 * - Proper font weight and line height
 * - Support for responsive text sizing
 * 
 * @param className - Additional CSS classes for customization
 * @param children - Title text content
 * @param props - Additional HTML h3 element props
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * CARD DESCRIPTION COMPONENT
 * 
 * Secondary text component for providing additional context or details.
 * Styled with muted colors to create proper visual hierarchy.
 * 
 * Features:
 * - Muted text color for secondary information
 * - Optimized text size for readability
 * - Semantic paragraph element
 * - Consistent spacing and line height
 * 
 * @param className - Additional CSS classes for customization
 * @param children - Description text content
 * @param props - Additional HTML paragraph element props
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * CARD CONTENT COMPONENT
 * 
 * Main content area with appropriate padding and spacing.
 * Designed to work seamlessly with headers and footers.
 * 
 * Features:
 * - Consistent padding that aligns with header
 * - Reduced top padding when used with header
 * - Flexible content layout support
 * - Proper spacing for various content types
 * 
 * @param className - Additional CSS classes for customization
 * @param children - Main card content (charts, forms, text, etc.)
 * @param props - Additional HTML div element props
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * CARD FOOTER COMPONENT
 * 
 * Bottom section for actions, additional information, or navigation.
 * Provides consistent spacing and alignment for footer content.
 * 
 * Features:
 * - Flexbox layout with item alignment
 * - Consistent padding that matches header
 * - Reduced top padding for seamless integration
 * - Support for buttons, links, and text content
 * 
 * @param className - Additional CSS classes for customization
 * @param children - Footer content (buttons, links, additional info)
 * @param props - Additional HTML div element props
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }