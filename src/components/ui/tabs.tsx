/**
 * TABS UI COMPONENT SYSTEM
 * 
 * A comprehensive tabs implementation built on Radix UI primitives that
 * provides accessible, keyboard-navigable tabbed interfaces with enhanced
 * styling and interaction patterns.
 * 
 * COMPONENT HIERARCHY:
 * - Tabs: Root container managing tab state and keyboard navigation
 * - TabsList: Container for tab triggers with styling and layout
 * - TabsTrigger: Individual tab buttons with active/inactive states
 * - TabsContent: Content panels that correspond to each tab
 * 
 * FEATURES:
 * - Full keyboard navigation (arrow keys, home, end)
 * - Automatic content switching with smooth transitions
 * - ARIA compliance for screen reader accessibility
 * - Customizable styling with consistent design tokens
 * - Responsive design with mobile-optimized interactions
 * 
 * USAGE SCENARIOS:
 * - Dashboard navigation (Overview, Performance, Fees)
 * - Settings and configuration panels
 * - Data view switching (charts, tables, lists)
 * - Multi-step forms and wizards
 * 
 * ACCESSIBILITY:
 * - ARIA tablist, tab, and tabpanel roles
 * - Keyboard navigation with roving focus
 * - Screen reader announcements for state changes
 * - Focus management and visual indicators
 * 
 * @component
 */

"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }