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

/**
 * Handle GET requests for user portfolio data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
) {
  try {
    const { pubkey } = await params;

    if (!pubkey) {
      return NextResponse.json({
        success: false,
        message: 'Public key is required',
        data: null
      }, { status: 400 });
    }

    console.log('📊 Portfolio API called for:', pubkey);
    
    // Get all pool addresses first
    const poolAddresses = await dlmmService.fetchPoolAddresses();
    
    if (!poolAddresses || poolAddresses.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalValue: 0,
          totalPnL: 0,
          totalFeesEarned: 0,
          activePositions: 0,
          performance24h: 0
        },
      });
    }
    
    let totalValue = 0;
    let totalFeesEarned = 0;
    let activePositions = 0;
    
    // Get user positions for each pool
    for (const poolAddress of poolAddresses.slice(0, 5)) { // Limit to first 5 pools for performance
      try {
        const positions = await dlmmService.getUserPositions({
          payer: new PublicKey(pubkey),
          pair: new PublicKey(poolAddress),
        });
        
        if (positions && positions.length > 0) {
          activePositions += positions.length;
          
          // Calculate position values (simplified calculation)
          for (let i = 0; i < positions.length; i++) {
            // TODO: Implement proper position valuation
            // This would require getting current prices and calculating token amounts
            totalValue += 1000; // Placeholder
            totalFeesEarned += 10; // Placeholder
          }
        }
      } catch (poolError) {
        console.warn(`Failed to get positions for pool ${poolAddress}:`, poolError);
      }
    }
    
    const portfolioMetrics = {
      totalValue,
      totalPnL: totalValue * 0.05, // 5% P&L placeholder
      totalFeesEarned,
      activePositions,
      performance24h: 2.34 // Placeholder
    };
    
    return NextResponse.json({
      success: true,
      data: portfolioMetrics,
    });
  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch portfolio data",
      data: null
    }, { status: 500 });
  }
}
