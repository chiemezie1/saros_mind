import { NextRequest, NextResponse } from 'next/server';
import { LiquidityBookServices, MODE } from '@saros-finance/dlmm-sdk';

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
    try {
      await dlmmService.quote({
        amount: 1000000, // 1 token with 6 decimals
        metadata: poolMetadata,
        optional: {
          isExactInput: true,
          swapForY: false, // tokenX to tokenY
          slippage: 0.005 // 0.5% slippage
        }
      });
      
      // Quote processed but not used for now
    } catch (quoteError) {
      console.warn('Failed to get quote for price:', quoteError);
    }

    // Structure response according to PoolMetrics interface
    const poolMetrics = {
      poolAddress,
      tokenX: 'unknown',
      tokenY: 'unknown', 
      currentPrice: 1.0,
      activeBin: 0,
      binStep: 100, // Default bin step
      reserves: {
        tokenX: 0,
        tokenY: 0,
      },
      volume24h: 0, // TODO: Implement 24h volume calculation
      fees24h: 0,   // TODO: Implement 24h fees calculation
      totalValueLocked: 0
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
