# Saros DLMM Analytics Dashboard

> **🚀 A comprehensive analytics and portfolio management platform for Saros Dynamic Liquidity Market Maker (DLMM) pools on Solana**

This project provides institutional-grade analytics, real-time portfolio tracking, and advanced liquidity management tools for DLMM liquidity providers. Built with Next.js 15, TypeScript, and the official Saros Finance SDK.

## 📋 Table of Contents

- [Why This Project Matters](#-why-this-project-matters)
- [Key Features](#-key-features)
- [Quick Start](#-quick-start)
- [Technical Architecture](#-technical-architecture)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🎯 Why This Project Matters

### The DLMM Revolution
Dynamic Liquidity Market Makers represent the next evolution in automated market making, offering:
- **Capital Efficiency**: Concentrated liquidity in specific price ranges
- **Reduced Impermanent Loss**: Better price discovery and tighter spreads
- **Enhanced Yield**: Higher fee generation through focused liquidity provision

### The Analytics Gap
Current DLMM tools lack comprehensive analytics, making it difficult for liquidity providers to:
- Track portfolio performance across multiple positions
- Understand fee generation and impermanent loss
- Make data-driven decisions about position management
- Optimize their liquidity provision strategies

### Our Solution
This dashboard bridges that gap by providing:
- **Real-time Portfolio Analytics**: Complete overview of positions, P&L, and performance
- **Advanced Visualizations**: Interactive charts for liquidity distribution and performance tracking
- **Fee Analysis**: Detailed breakdown of earnings across pools and time periods
- **Risk Management**: Impermanent loss tracking and position health indicators

## ✨ Key Features

### 📊 Portfolio Analytics Dashboard
- **Real-time Portfolio Value**: Live tracking of total position value with P&L calculations
- **Position Management**: Comprehensive view of all active DLMM positions
- **Fee Tracking**: Detailed analysis of earned fees across all pools
- **Performance Attribution**: Breakdown of returns (fees vs. price appreciation vs. IL)

### 📈 Interactive Performance Charts
- **Historical Performance**: 30-day portfolio value tracking with HODL comparison
- **Fee Distribution**: Visual breakdown of earnings across different pools
- **Liquidity Distribution**: Real-time visualization of bin liquidity allocation
- **Risk Metrics**: Impermanent loss tracking and concentration analysis

### 🔧 Advanced Analytics
- **Pool-Level Metrics**: TVL, volume, active bins, and utilization rates
- **Market Intelligence**: Price trends, volatility analysis, and market depth
- **Strategy Optimization**: Data-driven insights for position management
- **Performance Benchmarking**: Compare against HODL and other strategies

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (Latest LTS recommended)
- **npm** or **yarn** package manager
- **Solana RPC Access** (Mainnet or Devnet)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-org/saros-dlmm-dashboard.git
cd saros-dlmm-dashboard

# Install dependencies
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the project root:

```env
# Solana RPC Configuration
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
# Alternative: Use a dedicated RPC provider for better performance
# NEXT_PUBLIC_RPC_URL=https://rpc.helius.xyz/?api-key=YOUR_API_KEY

# Optional: Analytics and monitoring
# ANALYTICS_API_KEY=your_analytics_key
```

### 3. Start Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** to see the dashboard in action!

### 4. Explore the Features
- **Full Dashboard Tab**: Complete analytics experience with portfolio overview
- **Original Demo Tab**: Bin distribution visualization from the base template
- **API Endpoints**: Test the REST APIs at `/api/portfolio/[pubkey]`, `/api/pool/[address]`, `/api/fees/[pubkey]`

## 🎯 Features

### 1. Real-time Portfolio Metrics
- **Total portfolio value** with P&L tracking
- **Active positions count** and summary
- **Fees earned** across all positions
- **APR estimation** based on historical performance
- Live updates with caching optimization

### 2. Interactive Performance Charts
- **Portfolio value over time** with 30-day history
- **HODL comparison** to track strategy effectiveness
- **Performance attribution** breakdown (fees vs IL vs price appreciation)
- **Real-time updates** with configurable refresh intervals

### 3. Liquidity Distribution Visualization
- **Live DLMM bins** with current reserves
- **Active bin highlighting** and price calculation
- **Interactive charts** showing liquidity concentration
- **Zoom and filter** capabilities for detailed analysis

### 4. Position Management & Analytics
- **Position table** with detailed metrics per position
- **Fee tracking** at position and pool level
- **Impermanent loss calculation** with HODL comparison
- **Position performance attribution**

### 5. Advanced Analytics
- **Fee distribution pie charts** across pools
- **Pool-level metrics** (TVL, current price, active bin)
- **Historical performance tracking**
- **Risk metrics** and position health indicators

## 🛠 Technical Implementation

### Core SDK Functions Used

The dashboard leverages the following Saros DLMM SDK functions:

- `fetchPoolMetadata` - Pool-level metadata (reserves, token decimals, etc.)
- `getPairAccount` - Pair state (activeBin, binStep, etc.)
- `getBinArrayInfo` / `getBinArray` - Read bins (reserveX, reserveY for each bin)
- `getUserPositions` - List wallet's DLMM positions with fees
- `quote` / `getQuote` - Price quotes for market price and swaps
- `getBinLiquidity` - Enhanced bin liquidity data with calculations

### API Endpoints

**Portfolio Metrics**
```
GET /api/portfolio/[pubkey]
```
Returns complete portfolio overview including total value, P&L, fees earned, and position details.

**Pool Metrics**
```
GET /api/pool/[poolAddress]
```
Returns pool-specific data including TVL, current price, active bin, and reserves.

**Fee Analysis**
```
GET /api/fees/[pubkey]
```
Returns fee distribution across pools with percentage breakdowns and pool-specific earnings.

## 🏗 Technical Architecture

> **📖 For detailed technical documentation, see [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)**

### System Overview
```
Frontend (Next.js) → API Routes → Business Logic → Saros SDK → Solana Blockchain
```

### Key Technologies
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Charts**: Recharts for interactive data visualization
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Blockchain**: Saros DLMM SDK, Solana Web3.js
- **Performance**: Multi-level caching, request optimization

### Caching Strategy
- **Pool metadata**: 2-minute TTL (stable data)
- **Pair accounts**: 1-minute TTL (moderate updates)
- **Price quotes**: 30-second TTL (frequent changes)
- **User positions**: 15-second TTL (real-time needs)

## 📁 Project Structure

```
saros-dlmm-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # REST API endpoints
│   │   │   ├── portfolio/[pubkey]/route.ts    # Portfolio analytics
│   │   │   ├── pool/[poolAddress]/route.ts    # Pool metrics
│   │   │   └── fees/[pubkey]/route.ts         # Fee analysis
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx          # Main dashboard page
│   ├── components/            # React components
│   │   ├── dlmm-dashboard.tsx        # Main dashboard
│   │   ├── bin-distribution/         # Liquidity charts
│   │   └── ui/                       # Reusable UI components
│   └── lib/                   # Business logic
│       ├── dlmm.ts           # Core DLMM integration
│       ├── types.ts          # TypeScript definitions
│       └── utils.ts          # Helper functions
├── public/                    # Static assets
├── TECHNICAL_ARCHITECTURE.md  # Detailed technical docs
└── README.md                 # This file
```

## 🔌 API Documentation

### Portfolio Analytics
```http
GET /api/portfolio/[pubkey]
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalValue": 12450.50,
    "totalPnL": 245.20,
    "totalFeesEarned": 125.30,
    "activePositions": 3,
    "positions": [...],
    "lastUpdated": "2025-09-29T10:30:00Z"
  }
}
```

### Pool Metrics
```http
GET /api/pool/[poolAddress]
```
**Response:**
```json
{
  "success": true,
  "data": {
    "poolAddress": "9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk",
    "currentPrice": 0.999845,
    "totalValueLocked": 2450000,
    "activeBin": 8388608,
    "reserves": {
      "tokenX": 1225000,
      "tokenY": 1225000
    }
  }
}
```

### Fee Distribution
```http
GET /api/fees/[pubkey]
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "poolAddress": "9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk",
      "poolName": "USDC/USDT",
      "feesEarned": 85.50,
      "percentage": 68.2,
      "color": "#8884d8"
    }
  ]
}
```

## 💻 Development Guide

### Code Organization
The project follows a clean architecture pattern:

1. **Presentation Layer** (`src/app/`, `src/components/`)
   - Next.js pages and React components
   - User interface and interaction handling

2. **API Layer** (`src/app/api/`)
   - RESTful endpoints for data access
   - Request validation and response formatting

3. **Business Logic** (`src/lib/dlmm.ts`)
   - Core application logic and calculations
   - Integration with external services

4. **Integration Layer** (`src/lib/dlmm.ts` SDK calls)
   - Saros DLMM SDK integration
   - Blockchain data retrieval and processing

### Adding New Features

1. **Define Types** in `src/lib/types.ts`
2. **Implement Business Logic** in `src/lib/dlmm.ts`
3. **Create API Endpoint** in `src/app/api/`
4. **Build UI Components** in `src/components/`
5. **Update Dashboard** in `src/components/dlmm-dashboard.tsx`

### Testing Strategy
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker Deployment
```dockerfile
# Dockerfile included in project
docker build -t saros-dlmm-dashboard .
docker run -p 3000:3000 saros-dlmm-dashboard
```

### Environment Variables for Production
```env
NEXT_PUBLIC_RPC_URL=https://your-production-rpc-endpoint
NODE_ENV=production
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled, comprehensive type coverage
- **ESLint**: Follow the provided configuration
- **Prettier**: Code formatting enforced
- **Conventional Commits**: Use conventional commit message format

### Testing Requirements
- Add unit tests for new business logic
- Ensure TypeScript compilation passes
- Test API endpoints with various inputs
- Verify UI components render correctly

## 🔒 Security & Privacy

- **No Private Keys**: Application only uses public keys for read-only operations
- **RPC Security**: Validates all blockchain data before processing
- **Input Validation**: All API endpoints validate input parameters
- **Error Handling**: Secure error messages that don't expose sensitive data

## 📈 Roadmap

### Phase 1: Core Analytics ✅
- [x] Portfolio tracking and metrics
- [x] Fee distribution analysis
- [x] Interactive performance charts
- [x] Pool-level analytics

### Phase 2: Enhanced Features (In Progress)
- [ ] Real-time WebSocket updates
- [ ] Advanced position management UI
- [ ] Multiple wallet support
- [ ] Mobile-responsive design improvements

### Phase 3: Advanced Analytics (Planned)
- [ ] Strategy backtesting
- [ ] Risk management tools
- [ ] Automated rebalancing suggestions
- [ ] Cross-protocol yield comparison

### Phase 4: Enterprise Features (Future)
- [ ] Multi-user dashboard
- [ ] API rate limiting and authentication
- [ ] Advanced reporting and exports
- [ ] Integration with portfolio management tools

## 📞 Support & Community

- **Documentation**: [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)
- **Issues**: [GitHub Issues](https://github.com/your-org/saros-dlmm-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/saros-dlmm-dashboard/discussions)
- **Saros Finance**: [Official Documentation](https://docs.saros.finance)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Saros Finance Team** - For the innovative DLMM protocol and SDK
- **Solana Foundation** - For the robust blockchain infrastructure
- **Next.js Team** - For the excellent React framework
- **Recharts Contributors** - For powerful data visualization tools
- **shadcn/ui** - For beautiful, accessible UI components

---

**Built with ❤️ for the Solana DeFi ecosystem**

*Making DLMM analytics accessible to everyone*
```

The application will be available at `http://localhost:3000`

## Workshop Details

For more information about this workshop, including detailed instructions, examples, and resources, please visit:

**https://saros-playground.vercel.app/workshops**

## Project Structure

- `src/app/` - Main application files
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and types
- `public/` - Static assets

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Recharts (for data visualization)
# saros_mind
