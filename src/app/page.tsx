/**
 * SAROS DLMM ANALYTICS - MAIN APPLICATION PAGE
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
import { 
  RefreshCw, 
  BarChart3, 
  Search,
  DollarSign,
  CheckCircle2,
  Wallet
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { WalletButton } from "@/components/wallet/WalletButton";
import { useWallet } from '@solana/wallet-adapter-react';

/**
 * MAIN APPLICATION COMPONENT
 */
export default function SarosDLMMAnalytics() {
  // Wallet connection state
  const { connected, publicKey } = useWallet();
  
  // State for bin distribution data
  const [binData, setBinData] = useState<BinLiquidityData[]>([]);
  
  // State for pool selection
  const [selectedPool, setSelectedPool] = useState<string>("9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk");
  const [poolName, setPoolName] = useState<string>("USDC/USDT");
  
  // TODO: Replace with real pool data from Saros DLMM SDK
  const availablePools: any[] = [];

  /**
   * BIN DATA FETCHER
   */
  const getActiveBinData = async (poolAddress?: string) => {
    const targetPool = poolAddress || selectedPool;
    console.log('🔄 Fetching bin data for pool:', targetPool);
    
    try {
      const data = await getBinLiquidity(targetPool);
      setBinData(data);
      console.log(`✅ Loaded ${data.length} active bins`);
    } catch (error) {
      console.error('❌ Error fetching bin data:', error);
      setBinData([]);
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

  // Initialize data on component mount
  useEffect(() => {
    getActiveBinData();
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
                {availablePools.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Pool discovery not yet implemented
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Connect to Saros DLMM SDK to fetch available pools
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availablePools.map((pool) => (
                      <Card 
                        key={pool.address}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedPool === pool.address 
                            ? 'ring-2 ring-purple-500 bg-purple-500/10' 
                            : 'hover:bg-gray-800/50'
                        }`}
                        onClick={() => handlePoolSelect(pool.address, pool.name)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">{pool.name}</h3>
                              {selectedPool === pool.address && (
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                              )}
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-400">
                              <div className="flex justify-between">
                                <span>TVL:</span>
                                <span className="text-white">${formatNumber(pool.tvl)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Price:</span>
                                <span className="text-white">${pool.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Active Bin:</span>
                                <span className="text-white">{pool.activeBin}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
                  <BinDistributionChart binData={binData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}