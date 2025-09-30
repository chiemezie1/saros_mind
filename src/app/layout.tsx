/**
 * ROOT LAYOUT COMPONENT FOR SAROS DLMM ANALYTICS
 * 
 * This component serves as the foundational layout for the entire application,
 * establishing global styles, theming, wallet connectivity, and structural patterns
 * that persist across all pages and routes.
 * 
 * KEY RESPONSIBILITIES:
 * - Global CSS and styling imports
 * - Wallet connection context and providers
 * - Dark mode theme configuration
 * - Typography and accessibility settings
 * - Page structure and container setup
 * - Font optimization and loading
 * 
 * DESIGN DECISIONS:
 * - Dark theme by default for better data visualization readability
 * - Antialiased text for improved typography rendering
 * - Flexible layout using CSS Grid/Flexbox for responsive design
 * - Semantic HTML structure for accessibility
 * - Wallet adapter integration for Solana connectivity
 * 
 * TECHNICAL FEATURES:
 * - Next.js App Router compatibility
 * - Client-side and server-side rendering support
 * - Global CSS cascade and custom properties
 * - Responsive viewport handling
 * - Solana wallet adapter integration
 * 
 * @component
 */

import React from "react";
import "./globals.css";
import { WalletContextProvider } from "@/components/wallet/WalletContextProvider";

/**
 * ROOT LAYOUT COMPONENT PROPS
 * 
 * Defines the structure for children components that will be rendered
 * within the root layout container.
 */
interface RootLayoutProps {
  children: React.ReactNode; // All page content and nested layouts
}

/**
 * ROOT LAYOUT COMPONENT
 * 
 * Establishes the fundamental HTML structure, global styling, and wallet
 * connectivity for the entire DLMM analytics application. This layout wraps
 * all pages and provides consistent theming, structure, and wallet context.
 * 
 * LAYOUT STRUCTURE:
 * - HTML root with language and theme attributes
 * - Body with global styling and typography
 * - Wallet context provider for Solana integration
 * - Flexible container for dynamic content scaling
 * - Future-ready structure for headers, footers, sidebars
 * 
 * WALLET INTEGRATION:
 * - Solana wallet adapter context throughout the app
 * - Support for multiple wallet types (Phantom, Solflare, etc.)
 * - Automatic connection persistence
 * - Error handling for wallet interactions
 * 
 * ACCESSIBILITY FEATURES:
 * - Proper lang attribute for screen readers
 * - High contrast dark theme for better readability
 * - Antialiased text for improved legibility
 * - Semantic HTML structure
 * 
 * @param children - Page content and nested layouts to render
 * @returns Complete HTML document structure with global styling and wallet context
 */
export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className="dark">
      {/* Global body styling with dark theme and typography optimization */}
      <body className="antialiased bg-black text-white">
        {/* Wallet context provider for Solana wallet integration */}
        <WalletContextProvider>
          {/* Main application container with flexible layout */}
          <div className="flex flex-col min-h-screen">
            {/* Primary content area that adapts to content height */}
            <div className="flex-1">{children}</div>
            
            {/* Future: Navigation, footer, and sidebar components can be added here */}
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
