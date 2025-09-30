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

// Color palette for fee distribution charts
const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', 
  '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
) {
  try {
    const { pubkey } = await params;
    console.log('Fees API called for:', pubkey);
    
    if (!pubkey) {
      return NextResponse.json({
        success: false,
        message: 'Public key is required',
        data: null
      }, { status: 400 });
    }

    // Get all pool addresses first
    const poolAddresses = await dlmmService.fetchPoolAddresses();
    
    if (!poolAddresses || poolAddresses.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }
    
    const feeDistribution = [];
    let totalFees = 0;
    
    // Get user positions and calculate fees for each pool
    for (let i = 0; i < Math.min(poolAddresses.length, 5); i++) { // Limit to first 5 pools
      const poolAddress = poolAddresses[i];
      
      try {
        const positions = await dlmmService.getUserPositions({
          payer: new PublicKey(pubkey),
          pair: new PublicKey(poolAddress),
        });
        
        if (positions && positions.length > 0) {
          // Get pool metadata for name
          const poolMetadata = await dlmmService.fetchPoolMetadata(poolAddress);
          
          let poolFees = 0;
          for (let j = 0; j < positions.length; j++) {
            // TODO: Extract actual fee amounts from position data
            // For now, using placeholder calculation
            poolFees += Math.random() * 25 + 5; // Random fees between 5-30
          }
          
          totalFees += poolFees;
          
          if (poolFees > 0) {
            const poolName = poolMetadata 
              ? `Pool ${poolAddress.slice(0, 8)}...` 
              : `Pool ${poolAddress.slice(0, 8)}...`;
              
            feeDistribution.push({
              poolAddress,
              poolName,
              feesEarned: poolFees,
              percentage: 0, // Will be calculated after totalFees is known
              color: CHART_COLORS[i % CHART_COLORS.length]
            });
          }
        }
      } catch (poolError) {
        console.warn(`Failed to get fees for pool ${poolAddress}:`, poolError);
      }
    }
    
    // Calculate percentages
    const finalFeeDistribution = feeDistribution.map(fee => ({
      ...fee,
      percentage: totalFees > 0 ? (fee.feesEarned / totalFees) * 100 : 0
    }));
    
    return NextResponse.json({
      success: true,
      data: finalFeeDistribution,
    });
  } catch (error) {
    console.error('Fee distribution API error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch fee data',
      data: null
    }, { status: 500 });
  }
}
