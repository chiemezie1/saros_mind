/**
 * SARimport React, { useEffect, useState } from \"react\";mport React, { useEffect, useState, useCallback } from \"react\";mport React, { useEffect, useState, useCallback } from \"react\";S DLMM ANALYTICS - MAIN APPLICATION PAGE
 * 
 * This is the primary entry point for the Saros DLMM Analytics Dashboard.
 * It provides a comprehensive interface for analyzing DLMM pools and portfolios
 * with enhanced pool selection and bin distribution visualization.
 */

"use client";

import React, { useEffect, useState } from "react";
import { DLMMDashboard } from "@/components/dlmm-dashboard";
import { BinDistributionChart } from "@/components/bin-distribution/chart";
import { getBinLiquidity } from "@/lib/dlmm";
import { BinLiquidityData } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  RefreshCw, 
  BarChart3, 
  Search,
  DollarSign,
  CheckCircle2,
  Wallet
} from "lucide-react";
import { WalletButton } from "@/components/wallet/WalletButton";
import { useWallet } from '@solana/wallet-adapter-react';

/**
 * MAIN APPLICATION COMPONENT
 */
export default function SarosDLMMAnalytics() {
  // Wallet connection state
  const { connected, publicKey } = useWallet();
  
  // State for bin distribution data
  const [activeBinData, setActiveBinData] = useState<BinLiquidityData[] | null>(null);
  
  // State for pool selection
  const [selectedPool, setSelectedPool] = useState<string>("9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk");
  const [poolName, setPoolName] = useState<string>("USDC/USDT");
  const [poolAddressInput, setPoolAddressInput] = useState<string>("");
  
  // TODO: Replace with real pool data from Saros DLMM SDK
  // const availablePools: unknown[] = [];

  /**
   * BIN DATA FETCHER
   */
  const getActiveBinData = async (poolAddress?: string) => {
    const targetPool = poolAddress || selectedPool;
    console.log('🔄 Fetching bin data for pool:', targetPool);
    
    try {
      const data = await getBinLiquidity(targetPool);
      setActiveBinData(data);
      console.log(`✅ Loaded ${data.length} active bins`);
    } catch (error) {
      console.error('❌ Error fetching bin data:', error);
      setActiveBinData([]);
    }
  };

  /**
   * POOL SELECTION HANDLER
   */
  const handlePoolSelect = (poolAddress: string, name: string) => {
    setSelectedPool(poolAddress);
    setPoolName(name);
    getActiveBinData(poolAddress);
  };

  /**
   * HANDLE POOL ADDRESS INPUT
   */
  const handlePoolAddressSubmit = () => {
    if (poolAddressInput.trim()) {
      const shortAddress = poolAddressInput.slice(0, 8) + "...";
      handlePoolSelect(poolAddressInput.trim(), `Pool ${shortAddress}`);
      setPoolAddressInput("");
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    getActiveBinData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* 
        HEADER SECTION
      */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            Saros DLMM Analytics
          </h1>
          <p className="text-muted-foreground">
            {connected && publicKey 
              ? `Analyzing portfolio for ${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}`
              : "Advanced analytics and portfolio tracking for DLMM liquidity providers"
            }
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <WalletButton />
          {connected && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Connection Status */}
      {!connected && (
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="font-medium text-blue-400">Connect Wallet</h3>
              <p className="text-sm text-blue-300/80">
                Connect your Solana wallet to view your DLMM portfolio data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 
        MAIN NAVIGATION INTERFACE
      */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">
            📊 Full Dashboard
          </TabsTrigger>
          <TabsTrigger value="enhanced">
            🎯 Pool Selection
          </TabsTrigger>
        </TabsList>
        
        {/* 
          COMPREHENSIVE ANALYTICS DASHBOARD
        */}
        <TabsContent value="dashboard">
          <DLMMDashboard 
            poolAddress={selectedPool}
            userPublicKey={connected && publicKey ? publicKey.toString() : undefined}
          />
        </TabsContent>
        
        {/* 
          ENHANCED POOL SELECTION
        */}
        <TabsContent value="enhanced">
          <div className="space-y-6">
            {/* Pool Selection Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Pool Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Pool Address Input */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="poolAddress" className="block text-sm font-medium mb-2">
                        Enter Pool Address
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="poolAddress"
                          placeholder="Enter Saros DLMM pool address..."
                          value={poolAddressInput}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPoolAddressInput(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handlePoolAddressSubmit}
                          disabled={!poolAddressInput.trim()}
                        >
                          Analyze Pool
                        </Button>
                      </div>
                    </div>
                    
                    {/* Current Pool Display */}
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{poolName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedPool.slice(0, 8)}...{selectedPool.slice(-8)}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => getActiveBinData(selectedPool)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Example Pools */}
                  <div>
                    <h4 className="font-medium mb-3">Example Pools:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        variant="ghost" 
                        className="justify-start h-auto p-3"
                        onClick={() => handlePoolSelect("9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk", "USDC/USDT")}
                      >
                        <div className="text-left">
                          <div className="font-medium">USDC/USDT Pool</div>
                          <div className="text-sm text-muted-foreground">9P3N4Qxj...kkSAk</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Pool Analytics */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {poolName} - Bin Distribution Analysis
                  </CardTitle>
                  <Button 
                    onClick={() => getActiveBinData(selectedPool)}
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-400">
                    Live liquidity distribution for {poolName} pool ({selectedPool.slice(0, 8)}...)
                  </p>
                  <BinDistributionChart binData={activeBinData || []} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}