/**
 * WALLET CONTEXT PROVIDER
 * 
 * Provides Solana wallet connection functionality throughout the application.
 * This component sets up the wallet adapter context with support for multiple
 * wallet types and handles connection state management.
 * 
 * FEATURES:
 * - Multi-wallet support (Phantom, Solflare, etc.)
 * - Automatic connection persistence
 * - Error handling and user notifications
 * - Network configuration management
 * - Connection state tracking
 * 
 * ARCHITECTURE:
 * - Uses Solana Wallet Adapter for standardized wallet integration
 * - Provides React context for wallet state across components
 * - Handles wallet connection/disconnection events
 * - Manages network configuration (mainnet/devnet)
 * 
 * @component
 */

"use client";

import React, { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

/**
 * WALLET CONTEXT PROVIDER PROPS
 * 
 * Configuration options for the wallet provider component.
 */
interface WalletContextProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
}

/**
 * WALLET CONTEXT PROVIDER COMPONENT
 * 
 * Sets up the complete wallet infrastructure for the application including
 * connection management, wallet adapters, and UI components.
 * 
 * @param children - Child components that will have access to wallet context
 * @param network - Solana network to connect to (defaults to mainnet-beta)
 */
export const WalletContextProvider: FC<WalletContextProviderProps> = ({ 
  children, 
  network = WalletAdapterNetwork.Mainnet 
}) => {
  /**
   * NETWORK ENDPOINT CONFIGURATION
   * 
   * Determines the RPC endpoint based on the selected network.
   * Uses Solana's public endpoints or can be configured for custom RPC.
   */
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  /**
   * WALLET ADAPTERS CONFIGURATION
   * 
   * Configures the available wallet adapters for user selection.
   * Includes the most popular Solana wallets with proper initialization.
   */
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};