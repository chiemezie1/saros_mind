/**
 * WALLET CONNECTION BUTTON COMPONENT
 * 
 * A custom wallet connection button that provides a clean interface for
 * connecting and disconnecting Solana wallets. Displays connection status
 * and wallet information when connected.
 */

"use client";

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Wallet, Copy, ChevronDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * CUSTOM WALLET BUTTON COMPONENT
 */
export function WalletButton() {
  const { connected, publicKey, disconnect, select, wallets, connecting } = useWallet();
  const [copied, setCopied] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWallets(false);
      }
    }

    if (showWallets) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWallets]);

  /**
   * COPY ADDRESS HANDLER
   */
  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWalletSelect = (walletName: string) => {
    const wallet = wallets.find(w => w.adapter.name === walletName);
    if (wallet) {
      select(wallet.adapter.name);
      setShowWallets(false);
    }
  };

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={copyAddress}
          variant="outline"
          size="sm"
          className="font-mono"
        >
          {copied ? (
            <>📋 Copied!</>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </>
          )}
        </Button>
        <Button
          onClick={disconnect}
          variant="destructive"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  if (connecting) {
    return (
      <Button disabled variant="outline">
        Connecting...
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setShowWallets(!showWallets)}
        variant="default"
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>
      
      {showWallets && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          {wallets.map((wallet) => (
            <button
              key={wallet.adapter.name}
              onClick={() => handleWalletSelect(wallet.adapter.name)}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center gap-3"
            >
              {wallet.adapter.icon && (
                <Image
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              )}
              <span>{wallet.adapter.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}