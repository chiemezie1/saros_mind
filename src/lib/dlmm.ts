/**
 * SAROS DLMM SERVICE UTILITIES
 * 
 * This module provides utility functions for integrating with the Saros Dynamic Liquidity 
 * Market Maker (DLMM) protocol. It focuses on bin liquidity data for visualization.
 */

import { LiquidityBookServices, MODE } from "@saros-finance/dlmm-sdk";
import { PublicKey } from "@solana/web3.js";
import { BinLiquidityData } from "./types";

/**
 * SAROS DLMM SDK INSTANCE
 */
const dlmmService = new LiquidityBookServices({
  mode: MODE.MAINNET,
  options: {
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com",
  },
});

/**
 * Get bin liquidity data for visualization
 */
export const getBinLiquidity = async (poolAddress?: string): Promise<BinLiquidityData[]> => {
  try {
    const targetPool = poolAddress || "9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk";
    
    // Get pool metadata and pair account info
    const poolMetadata = await dlmmService.fetchPoolMetadata(targetPool);
    const pairAccount = await dlmmService.getPairAccount(new PublicKey(targetPool));
    
    if (!poolMetadata || !pairAccount) {
      return [];
    }

    // Generate bin data around the active bin
    const activeBinId = pairAccount.activeBinId;
    const binRange = 50; // Show 50 bins on each side
    const binData: BinLiquidityData[] = [];

    for (let i = -binRange; i <= binRange; i++) {
      const binId = activeBinId + i;
      const binStep = 25; // Default bin step
      const pricePerToken = Math.pow(1 + binStep / 10000, binId);
      
      // For now, generate sample liquidity data
      // In a real implementation, you would fetch actual bin reserves
      const isActive = i === 0;
      const liquidity = isActive ? Math.random() * 1000000 : Math.random() * 500000;
      
      binData.push({
        binId,
        price: pricePerToken,
        reserveXAmount: liquidity * 0.6,
        reserveYAmount: liquidity * 0.4,
        totalLiquidity: liquidity,
        totalSupply: liquidity.toString(),
        isActive,
      });
    }

    return binData;
  } catch (error) {
    console.error("Failed to fetch bin liquidity:", error);
    return [];
  }
};
