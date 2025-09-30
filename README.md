# Saros DLMM Portfolio Tracker

A streamlined analytics platform for liquidity providers using Saros Dynamic Liquidity Market Maker (DLMM) pools. Connect your wallet to view real-time portfolio metrics, fee earnings, and explore pool analytics with live blockchain data.

**🔗 Live Demo: [https://saros-mind.vercel.app/](https://saros-mind.vercel.app/)**

## Overview

This application provides a functional interface for tracking DLMM liquidity positions using the official Saros DLMM SDK. Built with a focus on core functionality and real data integration, it offers portfolio tracking and pool exploration without unnecessary complexity.

The platform connects directly to Solana mainnet and uses the Saros DLMM SDK to provide accurate, real-time data for liquidity providers managing their DLMM positions.

## Key Features

**Portfolio Analytics**
- Real-time portfolio valuation and P&L tracking
- Active position count across all DLMM pools
- Fee earnings breakdown by pool
- Live data fetched from your connected wallet

**Pool Explorer**
- Pool address input for custom pool analysis
- Pool information display with metadata
- Bin distribution visualization and analysis
- Interactive liquidity distribution charts
- Support for any valid Saros DLMM pool address

**Wallet Integration**
- Multi-wallet support (Phantom, Solflare, Torus, Ledger, WalletConnect)
- Secure connection with Solana Wallet Adapter
- Real-time position data loading

**Technical Implementation**
- Real Saros DLMM SDK integration (v1.3.1)
- Solana mainnet connectivity for production data
- TypeScript for type safety and reliability

## Quick Start

### Prerequisites
- Node.js 18 or higher
- A Solana wallet (optional - app works without positions)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/chiemezie1/saros_mind.git
cd saros_mind

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Production Build

```bash
npm run build
npm start
```

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and select your Solana wallet provider
2. **View Portfolio**: If you have DLMM positions, they'll load automatically with real-time metrics
3. **Explore Pools**: Use the Pool Explorer tab to analyze different DLMM pools
4. **Input Pool Address**: Enter any valid Saros DLMM pool address to analyze its bin distribution
5. **Analyze Distribution**: View bin distribution charts for liquidity visualization
6. **Track Performance**: Monitor your portfolio value, fees, and position performance

The application works without any existing DLMM positions - you can explore pools by entering their addresses.

## Technical Stack

**Frontend**
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for responsive styling
- shadcn/ui component library
- Recharts for data visualization

**Blockchain Integration**
- Saros DLMM SDK v1.3.1 for protocol data
- Solana Web3.js for blockchain interactions
- Solana Wallet Adapter for multi-wallet support

**API Architecture**
- RESTful API endpoints for data access
- Server-side rendering with Next.js
- Real-time data fetching from Saros protocol

## API Endpoints

### Portfolio Data
```
GET /api/portfolio/[pubkey]
```
Returns portfolio metrics including total value, P&L, active positions, and fee earnings.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalValue": 10000,
    "totalPnL": 500,
    "totalFeesEarned": 150,
    "activePositions": 3,
    "performance24h": 2.5
  }
}
```

### Pool Information
```
GET /api/pool/[poolAddress]
```
Returns pool metadata, current price, and basic pool metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk",
    "currentPrice": 1.0,
    "reserves": {
      "tokenX": 1000000,
      "tokenY": 1000000
    },
    "totalValueLocked": 2000000
  }
}
```

### Fee Analysis
```
GET /api/fees/[pubkey]
```
Returns fee distribution data across all user positions.

## Project Structure

```
saros_mind/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API endpoints for data fetching
│   │   │   ├── portfolio/[pubkey]/
│   │   │   ├── pool/[poolAddress]/
│   │   │   └── fees/[pubkey]/
│   │   ├── page.tsx      # Main dashboard page
│   │   └── layout.tsx    # App layout and providers
│   ├── components/       # React components
│   │   ├── dlmm-dashboard.tsx    # Main dashboard component
│   │   ├── bin-distribution/     # Pool visualization
│   │   ├── wallet/               # Wallet connection
│   │   └── ui/                   # Reusable UI components
│   └── lib/              # Utilities and type definitions
│       ├── dlmm.ts      # Saros DLMM SDK integration
│       ├── types.ts     # TypeScript type definitions
│       └── utils.ts     # Utility functions
├── public/              # Static assets and images
├── components.json      # shadcn/ui configuration
└── README.md
```

## Development

### Key Components
- **DLMMDashboard**: Main dashboard orchestrating data and UI
- **BinDistributionChart**: Visualizes liquidity distribution across bins
- **WalletButton**: Handles wallet connection and management
- **API Routes**: Fetch real data from Saros DLMM SDK

### Adding Features
1. Define types in `src/lib/types.ts`
2. Add SDK integration in `src/lib/dlmm.ts`
3. Create API endpoints in `src/app/api/`
4. Build UI components in `src/components/`

### Code Quality
- TypeScript with strict mode enabled
- ESLint for code quality and consistency
- Prettier for code formatting
- shadcn/ui for consistent component design

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```bash
docker build -t saros-portfolio-tracker .
docker run -p 3000:3000 saros-portfolio-tracker
```

### Environment Variables
```bash
# Required for RPC connectivity
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
```

## Current Implementation Status

This is a streamlined implementation focusing on core functionality:

✅ **Implemented Features:**
- Real wallet connection with multiple providers
- Live portfolio data fetching using Saros DLMM SDK
- Pool exploration with metadata display
- Bin distribution visualization
- Responsive UI with clean design
- TypeScript implementation for reliability

🚧 **Simplified/Placeholder Areas:**
- Portfolio calculations use basic metrics
- Fee calculations use placeholder logic
- Pool discovery shows basic information
- Advanced analytics removed for simplicity

This approach ensures the application is functional, uses real SDK data, and provides a solid foundation for future enhancements.

## Contributing

Contributions welcome! Focus areas for improvement:
- Enhanced portfolio valuation algorithms
- Improved fee calculation accuracy
- Additional pool analysis features
- UI/UX enhancements
- Performance optimizations

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Implement changes with TypeScript
4. Test with real wallet connections
5. Submit pull request

## License

MIT License - see LICENSE file for details.

## Resources

- [Saros Finance Documentation](https://docs.saros.finance)
- [Saros DLMM SDK](https://www.npmjs.com/package/@saros-finance/dlmm-sdk)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Next.js Documentation](https://nextjs.org/docs)