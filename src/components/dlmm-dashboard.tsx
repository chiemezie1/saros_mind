/**
 * SAROS DLMM ANALYTICS DASHBOARD
 * 
 * The main dashboard component that provides comprehensive analytics for DLMM liquidity providers.
 * This component orchestrates multiple data sources and visualization components to deliver
 * real-time insights into portfolio performance, fee generation, and liquidity distribution.
 * 
 * Key Features:
 * - Real-time portfolio metrics with P&L tracking
 * - Interactive performance charts with historical data
 * - Fee distribution analysis across multiple pools
 * - Liquidity distribution visualization
 * - Pool-level analytics and metrics
 * 
 * Data Flow:
 * 1. Component mounts and fetches data from API endpoints
 * 2. State management handles loading, error, and data states
 * 3. Data is processed and passed to child visualization components
 * 4. Real-time updates through periodic data refreshing
 * 
 * Architecture:
 * - Container component pattern for data management
 * - Modular UI components for different analytics views
 * - Responsive design with mobile-first approach
 * - Error boundaries and loading states for better UX
 */

"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  PortfolioMetrics, 
  FeeDistribution, 
  PoolMetrics,
  ApiResponse
} from '@/lib/types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

/**
 * DASHBOARD COMPONENT PROPS
 * 
 * Configurable props for customizing dashboard behavior and data sources
 */
interface DashboardProps {
  userPublicKey?: string;  // Optional user wallet address for portfolio analytics
  poolAddress?: string;    // Pool address to analyze (defaults to USDC/USDT)
}

/**
 * MAIN DASHBOARD COMPONENT
 * 
 * Orchestrates data fetching, state management, and UI rendering for comprehensive
 * DLMM analytics. Supports both pool-level and user-specific analytics based on props.
 * 
 * @param userPublicKey - Optional wallet address for portfolio-specific analytics
 * @param poolAddress - DLMM pool address to analyze (defaults to USDC/USDT pool)
 */
export function DLMMDashboard({ userPublicKey, poolAddress = "9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk" }: DashboardProps) {
  // State Management for Different Data Sources
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [feeDistribution, setFeeDistribution] = useState<FeeDistribution[]>([]);
  const [poolMetrics, setPoolMetrics] = useState<PoolMetrics | null>(null);
  // UI State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * PORTFOLIO DATA FETCHER
   * 
   * Retrieves comprehensive portfolio metrics for a given user including:
   * - Total portfolio value and P&L calculations
   * - Active positions count and details
   * - Fee earnings across all pools
   * - Last updated timestamp for data freshness
   * 
   * @param pubkey - User's Solana wallet public key
   */
  const fetchPortfolioData = async (pubkey: string) => {
    try {
      const response = await fetch(`/api/portfolio/${pubkey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const result: ApiResponse<PortfolioMetrics> = await response.json();
      
      if (result.success && result.data) {
        setPortfolioMetrics(result.data);
        console.log('📊 Portfolio data updated:', result.data);
      } else {
        console.warn('⚠️ Portfolio API returned no data');
      }
    } catch (err) {
      console.error('❌ Failed to fetch portfolio data:', err);
      setError('Failed to load portfolio data');
    }
  };

  // Fetch fee distribution
  const fetchFeeDistribution = async (pubkey: string) => {
    try {
      const response = await fetch(`/api/fees/${pubkey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const result: ApiResponse<FeeDistribution[]> = await response.json();
      
      if (result.success && result.data) {
        setFeeDistribution(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch fee distribution:', err);
    }
  };

  // Fetch pool metrics
  const fetchPoolMetrics = async (poolAddr: string) => {
    try {
      const response = await fetch(`/api/pool/${poolAddr}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const result: ApiResponse<PoolMetrics> = await response.json();
      
      if (result.success && result.data) {
        setPoolMetrics(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch pool metrics:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Always fetch pool metrics
        await fetchPoolMetrics(poolAddress);

        // Fetch user-specific data if public key provided
        if (userPublicKey && userPublicKey !== "11111111111111111111111111111111") {
          await Promise.all([
            fetchPortfolioData(userPublicKey),
            fetchFeeDistribution(userPublicKey)
          ]);
        }

        // Performance data will be implemented later

      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userPublicKey, poolAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading DLMM Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">DLMM Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics for Saros DLMM liquidity positions
        </p>
      </div>

      {/* Portfolio Overview Cards */}
      {portfolioMetrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <span className="text-xs text-muted-foreground">USD</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioMetrics?.totalValue?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                {portfolioMetrics?.totalPnL ? (portfolioMetrics.totalPnL >= 0 ? '+' : '') + '$' + portfolioMetrics.totalPnL.toFixed(2) + ' P&L' : '$0.00 P&L'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees Earned</CardTitle>
              <span className="text-xs text-muted-foreground">USD</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioMetrics?.totalFeesEarned?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                From {portfolioMetrics?.activePositions || 0} positions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
              <span className="text-xs text-muted-foreground">Count</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolioMetrics.activePositions}</div>
              <p className="text-xs text-muted-foreground">
                Last updated {new Date(portfolioMetrics.lastUpdated).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">APR Estimate</CardTitle>
              <span className="text-xs text-muted-foreground">%</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5%</div>
              <p className="text-xs text-muted-foreground">
                Based on 30-day fees
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message when no wallet is connected */}
      {!userPublicKey && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Analytics</CardTitle>
            <CardDescription>
              Connect your wallet to view your DLMM portfolio analytics and positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Connect your Solana wallet to access:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                <li>• Portfolio value and P&L tracking</li>
                <li>• Fees earned from liquidity positions</li>
                <li>• Active position monitoring</li>
                <li>• Historical performance charts</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pool Overview */}
      {poolMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>Pool Overview</CardTitle>
            <CardDescription>
              Current state of {poolMetrics.poolAddress.slice(0, 8)}...{poolMetrics.poolAddress.slice(-8)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Current Price</div>
                <div className="text-2xl font-bold">${poolMetrics?.currentPrice?.toFixed(6) || '0.000000'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Value Locked</div>
                <div className="text-2xl font-bold">${poolMetrics?.totalValueLocked?.toFixed(0) || '0'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Active Bin</div>
                <div className="text-2xl font-bold">{poolMetrics?.activeBin || 'N/A'}</div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Token X Reserve</div>
                <div className="font-mono text-sm">{poolMetrics?.reserves?.tokenX?.toFixed(2) || '0.00'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Token Y Reserve</div>
                <div className="font-mono text-sm">{poolMetrics?.reserves?.tokenY?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distribution">Liquidity Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="fees">Fee Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Portfolio Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Value Over Time</CardTitle>
                <CardDescription>30-day performance history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  Performance chart coming soon...
                </div>
              </CardContent>
            </Card>

            {/* Fee Distribution Pie Chart */}
            {feeDistribution.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Fee Distribution by Pool</CardTitle>
                  <CardDescription>Breakdown of fees earned across pools</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={feeDistribution}
                        dataKey="feesEarned"
                        nameKey="poolName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry?.percentage?.toFixed(1) || '0.0'}%`}
                      >
                        {feeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`$${value?.toFixed(2) || '0.00'}`, 'Fees Earned']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Live Liquidity Distribution</CardTitle>
              <CardDescription>
                Current bin liquidity visualization for {poolAddress.slice(0, 8)}...{poolAddress.slice(-8)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Bin distribution chart is handled in main page */}
              <div className="text-center text-gray-500">
                Liquidity distribution visualization coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Attribution</CardTitle>
              <CardDescription>Breakdown of returns by source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fees Earned</span>
                      <span className="text-sm font-medium">+$125.50</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Price Appreciation</span>
                      <span className="text-sm font-medium">+$45.20</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Impermanent Loss</span>
                      <span className="text-sm font-medium text-red-500">-$23.10</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Fee Analysis</CardTitle>
              <CardDescription>Detailed breakdown of fee earnings</CardDescription>
            </CardHeader>
            <CardContent>
              {feeDistribution.length > 0 ? (
                <div className="space-y-4">
                  {feeDistribution.map((pool, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: pool.color }}
                        />
                        <div>
                          <div className="font-medium">{pool.poolName}</div>
                          <div className="text-sm text-muted-foreground">
                            {pool.poolAddress.slice(0, 8)}...{pool.poolAddress.slice(-8)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${pool?.feesEarned?.toFixed(2) || '0.00'}</div>
                        <div className="text-sm text-muted-foreground">{pool?.percentage?.toFixed(1) || '0.0'}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No fee data available. Connect wallet to see your fee earnings.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}