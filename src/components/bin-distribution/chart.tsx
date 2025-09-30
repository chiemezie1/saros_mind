/**
 * DLMM BIN DISTRIBUTION CHART COMPONENT
 * 
 * Interactive visualization component for displaying DLMM bin liquidity distribution.
 * This chart shows how liquidity is distributed across different price ranges (bins)
 * in a Dynamic Liquidity Market Maker pool.
 * 
 * Features:
 * - Interactive bar chart showing liquidity per bin
 * - Active bin highlighting for current market price
 * - Responsive design with mobile optimization
 * - Real-time data updates with smooth animations
 * - Detailed hover tooltips with bin information
 * 
 * Visualization Details:
 * - X-axis: Bin ID (represents price ranges)
 * - Y-axis: Total liquidity amount in USD
 * - Special highlighting for the currently active bin (green)
 * - Color coding for different bins (blue for normal, green for active)
 * 
 * @component
 */

import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BinLiquidityData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

/**
 * CHART CONFIGURATION
 * 
 * Defines the visual configuration for the chart components,
 * including labels and color schemes for different data series.
 */
const chartConfig = {
  totalLiquidity: {
    label: "Liquidity ($)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

/**
 * MAIN BIN DISTRIBUTION CHART COMPONENT
 * 
 * Renders an interactive bar chart showing liquidity distribution across DLMM bins.
 * Automatically handles data processing, responsive sizing, and user interactions.
 * 
 * @param binData - Array of processed bin liquidity data
 * @returns JSX element containing the chart visualization or empty state
 */
export function BinDistributionChart({
  binData,
}: {
  binData: BinLiquidityData[];
}) {
  /**
   * EMPTY STATE HANDLING
   * 
   * Displays a helpful message when no bin data is available,
   * maintaining consistent UI layout and user experience.
   */
  if (binData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Bin Distribution Chart
          </h4>
          <div className="text-xs italic">No data available</div>
        </div>
        <div className="flex items-center justify-center h-64 border border-dashed rounded-lg bg-muted/10">
          <p className="text-muted-foreground text-sm">
            No liquidity data to display
          </p>
        </div>
      </div>
    );
  }

  /**
   * DATA PROCESSING
   * 
   * Sort bins by their ID for proper visualization order.
   * This ensures the chart displays bins in sequential order
   * from lowest to highest price ranges.
   */
  const sortedBinData = [...binData].sort((a, b) => a.binId - b.binId);

  /**
   * MAIN CHART RENDER
   * 
   * Renders the complete chart with all interactive features,
   * including tooltips, animations, and responsive sizing.
   */
  return (
    <div className="space-y-4">
      {/* CHART HEADER */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Bin Distribution Chart
          </h4>
        </div>
        <div className="text-xs italic">
          Showing {binData.length} bins with liquidity
        </div>
      </div>

      {/* CHART CONTAINER WITH RESPONSIVE DESIGN */}
      <ChartContainer config={chartConfig} className="min-h-[300px]">
        <BarChart
          accessibilityLayer
          data={sortedBinData}
          margin={{
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
          }}
        >
          {/* CHART GRID FOR VISUAL REFERENCE */}
          <CartesianGrid vertical={false} />
          
          {/* X-AXIS: BIN IDS */}
          <XAxis
            dataKey="binId"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}`}
          />
          
          {/* Y-AXIS: LIQUIDITY VALUES */}
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${formatNumber(value)}`}
          />
          
          {/* INTERACTIVE TOOLTIP WITH DETAILED BIN INFORMATION */}
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                className="min-w-[200px]"
                formatter={(value, name, props) => {
                  const payload = props.payload;
                  const isActive = payload?.isActive;
                  return [
                    <div key="content" className="space-y-1">
                      {/* BIN IDENTIFICATION WITH ACTIVE STATUS */}
                      <div
                        className={`font-semibold ${isActive ? "text-green-600" : ""}`}
                      >
                        Bin {payload?.binId} {isActive ? "(Active)" : ""}
                      </div>
                      {/* DETAILED BIN METRICS */}
                      <div className="text-xs space-y-0.5">
                        {/* BIN PRICE INFORMATION */}
                        <div>Bin Price: ${payload?.price?.toFixed(6)}</div>
                        
                        {/* TOTAL LIQUIDITY VALUE */}
                        <div>
                          Total Liquidity: $
                          {formatNumber(payload?.totalLiquidity)}
                        </div>
                        
                        {/* TOKEN RESERVES */}
                        <div>
                          Base Reserve: {formatNumber(payload?.reserveXAmount)}{" "}
                          tokens
                        </div>
                        <div>
                          Quote Reserve: {formatNumber(payload?.reserveYAmount)}{" "}
                          tokens
                        </div>
                        
                        {/* CALCULATED VALUES */}
                        <div>
                          Base Value: $
                          {formatNumber(
                            payload?.reserveXAmount * payload?.price
                          )}
                        </div>
                        <div>
                          Quote Value: ${formatNumber(payload?.reserveYAmount)}
                        </div>
                      </div>
                    </div>,
                  ];
                }}
              />
            }
          />
          
          {/* BAR CHART WITH CONDITIONAL COLORING */}
          <Bar dataKey="totalLiquidity" radius={2}>
            {/* DYNAMIC CELL COLORING BASED ON ACTIVE STATUS */}
            {sortedBinData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isActive ? "#22c55e" : "#3b82f6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
