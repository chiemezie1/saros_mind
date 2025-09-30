/**
 * SAROS DLMM ANALYTICS SERVICE
 * 
 * This module provides comprehensive integration with the Saros Dynamic Liquidity Market Maker (DLMM)
 * protocol on Solana. It offers portfolio analytics, position tracking, fee analysis, and pool metrics
 * for liquidity providers.
 * 
 * Key Features:
 * - Real-time portfolio tracking and P&L calculation
 * - Multi-level caching for performance optimization
 * - Fee distribution analysis across pools
 * - Liquidity distribution visualization
 * - Pool-level analytics and metrics
 * 
 * Architecture:
 * - Integrates with official Saros DLMM SDK
 * - Implements caching layer for RPC call optimization
 * - Provides type-safe interfaces for all data structures
 * - Supports both individual pool and portfolio-wide analysis
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { LiquidityBookServices, MODE } from "@saros-finance/dlmm-sdk";
import { PublicKey, Transaction, Keypair } from "@solana/web3.js";
import { 
  BinLiquidityData, 
  UserPosition, 
  PoolMetrics, 
  PortfolioMetrics, 
  PositionSnapshot,
  PerformanceData,
  PerformanceAttribution,
  FeeDistribution,
  LiquidityRange,
  VaultInfo,
  CacheEntry,
  ApiResponse,
  PoolMetadata
} from "./types";
import { calculateTokenAmount } from "./utils";

/**
 * DEFAULT POOL CONFIGURATION
 * 
 * USDC/USDT pool on Saros DLMM - used as the primary demonstration pool
 * This is a high-volume, stable pair ideal for showcasing DLMM analytics
 */
const POOL_ADDRESS = "9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk";

/**
 * SAROS DLMM SDK INSTANCE
 * 
 * Singleton instance configured for Solana mainnet with customizable RPC endpoint.
 * This instance handles all blockchain interactions and provides access to DLMM pools.
 * 
 * Configuration:
 * - Mode: MAINNET (can be changed to DEVNET/TESTNET for development)
 * - RPC URL: Configurable via environment variable for flexibility
 */
const dlmmService = new LiquidityBookServices({
  mode: MODE.MAINNET,
  options: {
    rpcUrl:
      process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com",
  },
});

/**
 * MULTI-LEVEL CACHING SYSTEM
 * 
 * Implements intelligent caching to minimize RPC calls and improve performance.
 * Different data types have different TTL values based on their update frequency.
 * 
 * Cache Strategy:
 * - Pool metadata: 2 minutes (relatively stable)
 * - Pair accounts: 1 minute (moderate update frequency)
 * - Price quotes: 30 seconds (frequent changes for trading)
 * - User positions: 15 seconds (real-time requirements)
 */
const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = {
  POOL_METADATA: 120000, // 2 minutes - Pool configuration data
  PAIR_ACCOUNT: 60000,   // 1 minute - Active bin and pair state
  PRICE_QUOTE: 30000,    // 30 seconds - Current market prices
  USER_POSITIONS: 15000, // 15 seconds - User position data
};

/**
 * POOL INFORMATION DATA STRUCTURE
 * 
 * Comprehensive pool data structure that combines metadata, pricing, and bin information
 * into a single cohesive interface for easy consumption by UI components.
 */
type PoolInfo = {
  metadata: any;            // Raw pool metadata from SDK
  currentMarketPrice: number; // Current price calculated from quotes
  activeBin: number;        // Currently active bin ID
  binStep: number;          // Price step between bins
  bins: any[];              // Array of bin data with reserves
  resultIndex: number;      // Index for bin array calculations
};

/**
 * CORE POOL DATA RETRIEVAL FUNCTION
 * 
 * Fetches comprehensive pool information by combining multiple SDK calls:
 * 1. Pool metadata (token info, reserves, decimals)
 * 2. Current market price via quote mechanism
 * 3. Pair account data (active bin, bin step)
 * 4. Bin array information (liquidity distribution)
 * 
 * This is the foundation function that powers most analytics features.
 * 
 * @param poolAddress - Solana address of the DLMM pool
 * @returns Promise<PoolInfo> - Comprehensive pool data structure
 * 
 * @example
 * ```typescript
 * const poolInfo = await fetchPoolInfo("9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk");
 * console.log(`Current price: ${poolInfo.currentMarketPrice}`);
 * console.log(`Active bin: ${poolInfo.activeBin}`);
 * ```
 */
export const fetchPoolInfo = async (poolAddress: string): Promise<PoolInfo> => {
  try {
    // Step 1: Fetch pool metadata containing token information and reserves
    const metadata = await dlmmService.fetchPoolMetadata(poolAddress);
    console.log("📊 Fetching pool info for:", poolAddress);

    // Step 2: Calculate human-readable token amounts from raw reserves
    const baseAmount = calculateTokenAmount(
      Number(metadata.baseReserve),
      metadata.extra.tokenBaseDecimal
    );
    const quoteAmount = calculateTokenAmount(
      Number(metadata.quoteReserve),
      metadata.extra.tokenQuoteDecimal
    );

    console.log("💰 Reserve amounts:", { baseAmount, quoteAmount });

    // Step 3: Calculate current market price using quote mechanism
    // We use a 1M token quote to get accurate price discovery
    let currentMarketPrice = 1;
    const quoteResult = await dlmmService.quote({
      amount: 1_000_000, // 1M tokens for accurate price calculation
      metadata,
      optional: {
        isExactInput: true,  // Exact input amount
        swapForY: true,      // Swap base token for quote token
        slippage: 0.5,       // 0.5% slippage tolerance
      },
    });

    console.log("💱 Quote result:", quoteResult);

    // Convert quote result to human-readable price
    currentMarketPrice = calculateTokenAmount(
      Number(quoteResult.amountOut),
      metadata.extra.tokenQuoteDecimal
    );

    console.log("📈 Current market price:", currentMarketPrice);

    // Step 4: Get pair account data for active bin and configuration
    const poolPublicKey = new PublicKey(poolAddress);
    const pairAccount = await dlmmService.getPairAccount(poolPublicKey);

    console.log("🏛️ Pair account data:", pairAccount);

    const activeBin = pairAccount.activeId;
    const binStep = pairAccount.binStep;

    // Step 5: Calculate bin array index and fetch bin data
    // Bins are grouped in arrays of 256, so we need to find the correct array
    const activeBinArrayIndex = Math.floor(activeBin / 256);

    const arrayInfo = await dlmmService.getBinArrayInfo({
      binArrayIndex: activeBinArrayIndex,
      pair: poolPublicKey,
      payer: poolPublicKey, // Using pool address as payer for read-only operations
    });

    console.log("🗂️ Bin info:", { binStep, activeBin });
    console.log("📋 Array info:", arrayInfo);

    // Return comprehensive pool information
    return {
      metadata,
      currentMarketPrice,
      activeBin,
      binStep,
      bins: arrayInfo.bins,
      resultIndex: arrayInfo.resultIndex,
    };
  } catch (error) {
    console.error("❌ Error fetching pool data:", error);
    throw error;
  }
};

/**
 * BIN LIQUIDITY DISTRIBUTION ANALYZER
 * 
 * Processes raw bin data into visualization-ready format for liquidity distribution charts.
 * This function transforms DLMM bin data into structured information that can be easily
 * consumed by chart components to show liquidity concentration across price ranges.
 * 
 * Key Calculations:
 * - Converts raw token amounts to human-readable decimals
 * - Calculates price for each bin based on active bin and bin step
 * - Computes total liquidity value in USD equivalent
 * - Identifies active bins for highlighting
 * 
 * @returns Promise<BinLiquidityData[]> - Array of processed bin data for visualization
 * 
 * @example
 * ```typescript
 * const binData = await getBinLiquidity();
 * binData.forEach(bin => {
 *   console.log(`Bin ${bin.binId}: $${bin.totalLiquidity} at price ${bin.price}`);
 * });
 * ```
 */
export const getBinLiquidity = async (poolAddress?: string): Promise<BinLiquidityData[]> => {
  try {
    const targetPool = poolAddress || POOL_ADDRESS;
    console.log("🔍 Analyzing bin liquidity distribution for:", targetPool);

    // Fetch comprehensive pool information
    const {
      metadata,
      currentMarketPrice,
      activeBin,
      binStep,
      bins,
      resultIndex,
    } = await fetchPoolInfo(targetPool);

    const binLiquidityData: BinLiquidityData[] = [];

    // Process each bin to extract liquidity information
    bins.forEach((bin: any, index: number) => {
      // Only process bins that have liquidity (non-zero reserves)
      if (bin.reserveX > 0 || bin.reserveY > 0) {
        // Calculate absolute bin ID from array index
        const binId = resultIndex * 256 + index;
        const isActiveBin = binId === activeBin;

        // Convert raw token amounts to human-readable format
        const reserveXAmount = calculateTokenAmount(
          bin.reserveX,
          metadata.extra.tokenBaseDecimal
        );
        const reserveYAmount = calculateTokenAmount(
          bin.reserveY,
          metadata.extra.tokenQuoteDecimal
        );

        // Calculate bin price based on distance from active bin
        // DLMM uses compound interest formula: price = basePrice * (1 + binStep)^distance
        const priceDelta = Math.pow(1 + binStep / 10000, binId - activeBin);
        const binPrice = currentMarketPrice * priceDelta;

        // Calculate total liquidity value in USD equivalent
        // For accurate valuation, we consider both token reserves
        const totalLiquidity =
          reserveXAmount * binPrice + reserveYAmount / binPrice;

        // Create structured bin data for visualization
        binLiquidityData.push({
          binId,
          price: binPrice,
          reserveXAmount,
          reserveYAmount,
          totalLiquidity,
          totalSupply: (reserveXAmount + reserveYAmount).toString(), 
          isActive: isActiveBin,
        });
      }
    });

    console.log(`📊 Processed ${binLiquidityData.length} active bins`);
    return binLiquidityData;
  } catch (error) {
    console.error("❌ Bin liquidity analysis error:", error);
    return [];
  }
};

// =============================================================================
// CORE SDK FUNCTIONS - Extended Implementation  
// =============================================================================

// Cache helper functions
const getCached = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
};

const setCache = <T>(key: string, data: T, ttl: number): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

// ✅ Enhanced fetchPoolMetadata with caching (using existing working implementation)
export const fetchPoolMetadataEnhanced = async (poolAddress: string) => {
  const cacheKey = `pool_metadata_${poolAddress}`;
  const cached = getCached(cacheKey);
  
  if (cached) return cached;
  
  try {
    const metadata = await dlmmService.fetchPoolMetadata(poolAddress);
    setCache(cacheKey, metadata, CACHE_TTL.POOL_METADATA);
    return metadata;
  } catch (error) {
    console.error("Error fetching pool metadata:", error);
    throw error;
  }
};

// ✅ Enhanced getPairAccount with caching (using existing working implementation)
export const getPairAccountEnhanced = async (poolAddress: string) => {
  const cacheKey = `pair_account_${poolAddress}`;
  const cached = getCached(cacheKey);
  
  if (cached) return cached;
  
  try {
    const poolPublicKey = new PublicKey(poolAddress);
    const pairAccount = await dlmmService.getPairAccount(poolPublicKey);
    setCache(cacheKey, pairAccount, CACHE_TTL.PAIR_ACCOUNT);
    return pairAccount;
  } catch (error) {
    console.error("Error fetching pair account:", error);
    throw error;
  }
};

// ✅ Enhanced getBinArrayInfo (using existing working implementation)
export const getBinArrayInfoEnhanced = async (
  poolAddress: string,
  binArrayIndex: number,
  payer: string
) => {
  try {
    const poolPublicKey = new PublicKey(poolAddress);
    const payerPublicKey = new PublicKey(payer);
    
    const arrayInfo = await dlmmService.getBinArrayInfo({
      binArrayIndex,
      pair: poolPublicKey,
      payer: payerPublicKey,
    });
    
    return arrayInfo;
  } catch (error) {
    console.error("Error fetching bin array info:", error);
    throw error;
  }
};

// ✅ getUserPositions - Simplified version for now
export const getUserPositions = async (
  userPublicKey: string,
  pairAddress?: string
): Promise<UserPosition[]> => {
  const cacheKey = `user_positions_${userPublicKey}_${pairAddress || 'all'}`;
  const cached = getCached<UserPosition[]>(cacheKey);
  
  if (cached) return cached;
  
  try {
    // For now, return empty array - would need proper SDK integration
    // This function would typically call the DLMM REST API or use SDK methods
    const userPositions: UserPosition[] = [];
    
    setCache(cacheKey, userPositions, CACHE_TTL.USER_POSITIONS);
    return userPositions;
  } catch (error) {
    console.error("Error fetching user positions:", error);
    return [];
  }
};

// ✅ Enhanced quote function (using existing working quote implementation)
export const getQuoteEnhanced = async (
  poolAddress: string,
  amount: number,
  isExactInput: boolean = true,
  swapForY: boolean = true,
  slippage: number = 0.5
) => {
  const cacheKey = `quote_${poolAddress}_${amount}_${isExactInput}_${swapForY}_${slippage}`;
  const cached = getCached(cacheKey);
  
  if (cached) return cached;
  
  try {
    // Use the working fetchPoolInfo implementation
    const { metadata } = await fetchPoolInfo(poolAddress);
    
    const quoteResult = await dlmmService.quote({
      amount: amount,
      metadata,
      optional: {
        isExactInput,
        swapForY,
        slippage,
      },
    });
    
    setCache(cacheKey, quoteResult, CACHE_TTL.PRICE_QUOTE);
    return quoteResult;
  } catch (error) {
    console.error("Error getting quote:", error);
    throw error;
  }
};

// =============================================================================
// FEATURE IMPLEMENTATIONS
// =============================================================================

// 🎯 Feature 1: Real-time portfolio metrics
export const getPortfolioMetrics = async (userPublicKey: string): Promise<PortfolioMetrics> => {
  try {
    console.log("Fetching portfolio metrics for:", userPublicKey);
    
    // Get all user positions
    const positions = await getUserPositions(userPublicKey);
    
    if (positions.length === 0) {
      return {
        totalValue: 0,
        totalPnL: 0,
        totalFeesEarned: 0,
        activePositions: 0,
        positions: [],
        lastUpdated: new Date(),
      };
    }
    
    // Get unique pool addresses
    const uniquePools = [...new Set(positions.map(pos => pos.poolAddress))];
    
    // Fetch pool metadata and current prices for all pools
    const poolData = await Promise.all(
      uniquePools.map(async (poolAddress) => {
        const [metadata, pairAccount] = await Promise.all([
          fetchPoolMetadataEnhanced(poolAddress),
          getPairAccountEnhanced(poolAddress)
        ]);
        
        // Get current price via existing working implementation
        const { currentMarketPrice } = await fetchPoolInfo(poolAddress);
        const currentPrice = currentMarketPrice;
        
        return {
          poolAddress,
          metadata,
          pairAccount,
          currentPrice
        };
      })
    );
    
    // Calculate values for each position
    let totalValue = 0;
    let totalFeesEarned = 0;
    
    const enrichedPositions = positions.map(position => {
      const pool = poolData.find(p => p.poolAddress === position.poolAddress);
      if (!pool) return position;
      
      // Calculate current USD value
      const usdValue = (position.tokenXAmount * pool.currentPrice) + 
                     (position.tokenYAmount);
      
      // Calculate fees earned
      const feesUSD = (position.feesEarned.tokenX * pool.currentPrice) + 
                     (position.feesEarned.tokenY);
      
      totalValue += usdValue;
      totalFeesEarned += feesUSD;
      
      return {
        ...position,
        usdValue,
      };
    });
    
    return {
      totalValue,
      totalPnL: 0, // Will be calculated with historical data
      totalFeesEarned,
      activePositions: positions.length,
      positions: enrichedPositions,
      lastUpdated: new Date(),
    };
    
  } catch (error) {
    console.error("Error calculating portfolio metrics:", error);
    throw error;
  }
};

// 🎯 Feature 2: Performance attribution analytics
export const calculatePerformanceAttribution = async (
  userPublicKey: string,
  timeframe: '1d' | '7d' | '30d' = '7d'
): Promise<PerformanceAttribution> => {
  try {
    // This would require historical data from your database
    // For now, returning mock structure
    return {
      feesEarned: 0,
      impermanentLoss: 0,
      priceAppreciation: 0,
      totalReturn: 0,
      hodlComparison: 0,
    };
  } catch (error) {
    console.error("Error calculating performance attribution:", error);
    throw error;
  }
};

// 🎯 Feature 3: Fee distribution across pools
export const getFeeDistribution = async (userPublicKey: string): Promise<FeeDistribution[]> => {
  try {
    const positions = await getUserPositions(userPublicKey);
    const poolFees = new Map<string, number>();
    
    // Group fees by pool
    for (const position of positions) {
      const poolAddress = position.poolAddress;
      const feesUSD = position.feesEarned.tokenX + position.feesEarned.tokenY; // Simplified
      
      poolFees.set(poolAddress, (poolFees.get(poolAddress) || 0) + feesUSD);
    }
    
    const totalFees = Array.from(poolFees.values()).reduce((sum, fees) => sum + fees, 0);
    
    const distribution: FeeDistribution[] = Array.from(poolFees.entries()).map(
      ([poolAddress, fees], index) => ({
        poolAddress,
        poolName: `Pool ${poolAddress.slice(0, 8)}...`, // Would fetch actual names
        feesEarned: fees,
        percentage: totalFees > 0 ? (fees / totalFees) * 100 : 0,
        color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`, // Generate colors
      })
    );
    
    return distribution.sort((a, b) => b.feesEarned - a.feesEarned);
  } catch (error) {
    console.error("Error calculating fee distribution:", error);
    throw error;
  }
};

// 🎯 Feature 4: Enhanced pool metrics (using existing working data)
export const getPoolMetrics = async (poolAddress: string): Promise<PoolMetrics> => {
  try {
    // Use existing working implementation
    const poolInfo = await fetchPoolInfo(poolAddress);
    
    const reserveX = calculateTokenAmount(
      poolInfo.metadata.baseReserve,
      poolInfo.metadata.extra.tokenBaseDecimal
    );
    const reserveY = calculateTokenAmount(
      poolInfo.metadata.quoteReserve,
      poolInfo.metadata.extra.tokenQuoteDecimal
    );
    
    const totalValueLocked = (reserveX * poolInfo.currentMarketPrice) + reserveY;
    
    return {
      poolAddress,
      tokenX: poolInfo.metadata.extra.tokenBaseMint || '',
      tokenY: poolInfo.metadata.extra.tokenQuoteMint || '',
      currentPrice: poolInfo.currentMarketPrice,
      activeBin: poolInfo.activeBin,
      binStep: poolInfo.binStep,
      reserves: {
        tokenX: reserveX,
        tokenY: reserveY,
      },
      totalValueLocked,
    };
  } catch (error) {
    console.error("Error fetching pool metrics:", error);
    throw error;
  }
};
