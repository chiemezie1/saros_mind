/**
 * SAROS DLMM ANALYTICS - TYPE DEFINITIONS
 * 
 * Comprehensive type definitions for the DLMM analytics platform.
 * These types ensure type safety across the entire application and provide
 * clear interfaces for data structures used in analytics and visualization.
 * 
 * Organization:
 * - Core DLMM data structures (bins, positions, pools)
 * - Portfolio and analytics types
 * - API and response types
 * - UI and visualization types
 */

/**
 * BIN LIQUIDITY DATA
 * 
 * Represents processed liquidity information for a single DLMM bin.
 * Used primarily for liquidity distribution visualization and analysis.
 * 
 * @interface BinLiquidityData
 */
export interface BinLiquidityData {
  binId: number;           // Unique identifier for the bin
  price: number;           // Current price for this bin
  reserveXAmount: number;  // Amount of base token in human-readable format
  reserveYAmount: number;  // Amount of quote token in human-readable format
  totalLiquidity: number;  // Total liquidity value in USD equivalent
  totalSupply: string;     // Total supply for compatibility (legacy field)
  isActive: boolean;       // Whether this is the currently active bin
}

/**
 * PORTFOLIO AND POSITION MANAGEMENT TYPES
 * 
 * Types for tracking user positions, portfolio metrics, and performance analytics.
 */

/**
 * USER POSITION
 * 
 * Represents a single liquidity position in a DLMM pool with comprehensive
 * tracking of tokens, fees, and performance metrics.
 * 
 * @interface UserPosition
 */
export interface UserPosition {
  positionId: string;        // Unique identifier for the position
  poolAddress: string;       // Address of the DLMM pool
  lowerBinId: number;       // Lower bound of the position's price range
  upperBinId: number;       // Upper bound of the position's price range
  tokenXAmount: number;     // Current amount of base token
  tokenYAmount: number;     // Current amount of quote token
  feesEarned: {             // Accumulated fees from providing liquidity
    tokenX: number;         // Fees earned in base token
    tokenY: number;         // Fees earned in quote token
  };
  usdValue: number;         // Current USD value of the position
  initialDepositValue: number; // Initial deposit value for P&L calculation
  createdAt: Date;          // Position creation timestamp
}

/**
 * POOL METRICS
 * 
 * Comprehensive metrics for a DLMM pool including pricing, liquidity,
 * and trading volume information.
 * 
 * @interface PoolMetrics
 */
export interface PoolMetrics {
  poolAddress: string;      // Solana address of the pool
  tokenX: string;           // Base token mint address
  tokenY: string;           // Quote token mint address
  currentPrice: number;     // Current market price (tokenY per tokenX)
  activeBin: number;        // Currently active bin ID
  binStep: number;          // Price step between bins (basis points)
  reserves: {               // Current token reserves in the pool
    tokenX: number;         // Base token reserve amount
    tokenY: number;         // Quote token reserve amount
  };
  volume24h?: number;       // 24-hour trading volume (optional)
  fees24h?: number;         // 24-hour fees generated (optional)
  totalValueLocked: number; // Total value locked in USD
}

/**
 * PORTFOLIO METRICS
 * 
 * Aggregated portfolio information across all user positions,
 * providing comprehensive performance and analytics data.
 * 
 * @interface PortfolioMetrics
 */
export interface PortfolioMetrics {
  totalValue: number;        // Current total portfolio value in USD
  totalPnL: number;          // Total profit/loss since inception
  totalFeesEarned: number;   // Total fees earned across all positions
  activePositions: number;   // Count of currently active positions
  positions: UserPosition[]; // Array of individual positions
  lastUpdated: Date;         // Timestamp of last data update
}

// Historical Data Types
export interface PositionSnapshot {
  id: string;
  timestamp: Date;
  poolId: string;
  positionId: string;
  tokenXAmount: number;
  tokenYAmount: number;
  usdValue: number;
  feesEarnedSinceLastSnapshot: number;
  price: number;
}

export interface PerformanceData {
  timestamp: Date;
  totalValue: number;
  feesEarned: number;
  impermanentLoss: number;
  hodlValue: number;
}

// Analytics Types
export interface PerformanceAttribution {
  feesEarned: number;
  impermanentLoss: number;
  priceAppreciation: number;
  totalReturn: number;
  hodlComparison: number;
}

/**
 * FEE DISTRIBUTION DATA
 * 
 * Represents how fees are distributed across different pools for a user.
 * Used for portfolio-level fee analysis and pool comparison.
 */
export interface FeeDistribution {
  poolAddress: string;     // Pool contract address
  poolName: string;        // Human-readable pool name (e.g., "USDC/USDT")
  feesEarned: number;      // Total fees earned from this pool in USD
  percentage: number;      // Percentage of total fees from this pool
  color: string;           // Color for chart visualization
}

/**
 * POOL METADATA INTERFACE
 * 
 * Comprehensive pool information including tokens, reserves, and metrics.
 * Used for pool selection and overview displays.
 */
export interface PoolMetadata {
  address: string;          // Pool contract address
  tokenX: {
    symbol: string;         // Token X symbol (e.g., "USDC")
    decimals: number;       // Token X decimal places
    mint: string;           // Token X mint address
  };
  tokenY: {
    symbol: string;         // Token Y symbol (e.g., "USDT")
    decimals: number;       // Token Y decimal places
    mint: string;           // Token Y mint address
  };
  baseReserve: number;      // Base token reserves
  quoteReserve: number;     // Quote token reserves
  totalValueLocked: number; // Total value locked in USD
  binStep: number;          // Price step between bins
  activeBin: number;        // Currently active bin ID
  currentPrice: number;     // Current market price
  volume24h?: number;       // 24-hour trading volume
  fees24h?: number;         // 24-hour fee generation
  apy?: number;             // Estimated APY
}

// Liquidity Management Types
export interface LiquidityRange {
  lowerBinId: number;
  upperBinId: number;
  lowerPrice: number;
  upperPrice: number;
  tokenXAmount: number;
  tokenYAmount: number;
}

export interface VaultInfo {
  tokenX: {
    mint: string;
    balance: number;
    decimal: number;
  };
  tokenY: {
    mint: string;
    balance: number;
    decimal: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Cache Types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface BinDistributionChart {
  bins: BinLiquidityData[];
  activeBin: number;
  priceRange: {
    min: number;
    max: number;
  };
}
