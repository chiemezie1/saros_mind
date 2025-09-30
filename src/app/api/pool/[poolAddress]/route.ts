import { NextRequest, NextResponse } from 'next/server';
import { LiquidityBookServices, MODE } from '@saros-finance/dlmm-sdk';
import { PublicKey } from '@solana/web3.js';

// Initialize DLMM service
const dlmmService = new LiquidityBookServices({
  mode: MODE.MAINNET,
  options: {
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com",
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ poolAddress: string }> }
) {
  try {
    const { poolAddress } = await params;
    console.log('Pool API called for:', poolAddress);
    
    if (!poolAddress) {
      return NextResponse.json({
        success: false,
        message: 'Pool address is required',
        data: null
      }, { status: 400 });
    }

    // Fetch pool metadata using Saros DLMM SDK
    const poolMetadata = await dlmmService.fetchPoolMetadata(poolAddress);
    
    if (!poolMetadata) {
      return NextResponse.json({
        success: false,
        message: 'Pool not found',
        data: null
      }, { status: 404 });
    }

    // Get quote to determine current price
    let currentPrice = 0;
    try {
      const quote = await dlmmService.quote({
        pair: new PublicKey(poolAddress),
        amountIn: 1000000, // 1 token with 6 decimals
        swapYtoX: false, // tokenX to tokenY
      });
      
      if (quote && quote.amountOut) {
        currentPrice = Number(quote.amountOut) / 1000000; // Convert back to decimal
      }
    } catch (quoteError) {
      console.warn('Failed to get quote for price:', quoteError);
      currentPrice = 1.0; // Fallback price
    }

    // Structure response according to PoolMetrics interface
    const poolMetrics = {
      poolAddress,
      tokenX: poolMetadata.tokenX?.mint || 'unknown',
      tokenY: poolMetadata.tokenY?.mint || 'unknown',
      currentPrice,
      activeBin: poolMetadata.activeBin || 0,
      binStep: poolMetadata.binStep || 100, // Default bin step
      reserves: {
        tokenX: poolMetadata.reserveX || 0,
        tokenY: poolMetadata.reserveY || 0,
      },
      volume24h: 0, // TODO: Implement 24h volume calculation
      fees24h: 0,   // TODO: Implement 24h fees calculation
      totalValueLocked: (poolMetadata.reserveX || 0) * currentPrice + (poolMetadata.reserveY || 0)
    };
    
    return NextResponse.json({
      success: true,
      data: poolMetrics,
    });
  } catch (error) {
    console.error('Pool API error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch pool data',
      data: null
    }, { status: 500 });
  }
}
