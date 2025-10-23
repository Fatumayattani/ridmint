# Ridmint

> Create conditional payments on Base network with time delays or custom conditions

Ridmint is a decentralized application that enables users to create smart contract-powered conditional payments on the Base blockchain. Set time-based delays or event-based triggers for automatic or manual fund releases, providing secure escrow functionality for ETH and USDC payments.

## Features

- **Conditional Payments**: Create payments with time delays or custom event-based conditions
- **Multi-Token Support**: Send payments in ETH or USDC
- **Time-Based Release**: Set automatic fund releases after specified durations (5 minutes to 30 days)
- **Event-Based Release**: Manual release by payment creator when specific conditions are met
- **Payment Management**: Track sent and received payments with real-time status updates
- **Cancellation**: Creators can cancel pending payments and retrieve funds
- **Secure Escrow**: Smart contract holds funds until conditions are satisfied
- **Base Network**: Built on Base for fast, low-cost transactions

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom illustrated design system
- **Blockchain**: Base (L2) + Base Sepolia (testnet)
- **Smart Contracts**: Solidity ^0.8.20
- **Web3**: ethers.js v6
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Base Sepolia testnet ETH for testing ([Base Sepolia Faucet](https://docs.base.org/docs/tools/network-faucets/))
- USDC tokens on Base Sepolia (optional, for token payments)

## Getting Started

### 1. Clone the Repository

```bash
https://github.com/Fatumayattani/ridmint.git
cd ridmint
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

The project comes pre-configured with Supabase connection. Environment variables are already set in `.env`:

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### 4. Database Setup

The database schema is already configured. The payments table includes:

- Payment tracking (creator, recipient, amount, token)
- Condition types (time_delay, event)
- Status management (pending, completed, cancelled)
- Transaction history

### 5. Deploy Smart Contract

**Option A: Using Remix IDE**

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `ConditionalEscrow.sol`
3. Copy the contract code from `contracts/ConditionalEscrow.sol`
4. Compile with Solidity ^0.8.20
5. Deploy to Base Sepolia testnet
6. Copy the deployed contract address

**Option B: Using Hardhat/Foundry**

See `contracts/README.md` for detailed deployment instructions.

**Important**: After deployment, update the contract address in `src/config/contracts.ts`:

```typescript
export const CONTRACTS = {
  CONDITIONAL_ESCROW: '0xYourDeployedContractAddress',
  // ...
};
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Usage

### Creating a Payment

1. **Connect Wallet**: Click "Connect Wallet" to connect your Web3 wallet
2. **Create Payment**: Click "Create Payment" button
3. **Enter Details**:
   - Recipient wallet address
   - Amount and token (ETH or USDC)
   - Condition type:
     - **Time Delay**: Automatic release after specified time
     - **Event Based**: Manual release by creator
4. **Confirm**: Approve the transaction in your wallet

### Managing Payments

#### Sent Payments
- View all payments you've created
- Cancel pending payments
- Release event-based payments manually
- Track payment status

#### Received Payments
- View payments sent to you
- Release time-based payments when conditions are met
- Monitor incoming funds

### Payment Status

- **Pending**: Payment created, awaiting condition fulfillment
- **Completed**: Funds released to recipient
- **Cancelled**: Payment cancelled, funds returned to creator

## Smart Contract

### ConditionalEscrow.sol

The core smart contract provides:

- **createPayment()**: Create a new conditional payment
- **releasePayment()**: Release funds when conditions are met
- **cancelPayment()**: Cancel and refund a pending payment
- **canRelease()**: Check if payment can be released

### Condition Types

1. **TIME_DELAY**: Automatic release after specified seconds
2. **EVENT**: Manual release by payment creator

### Security Features

- Payment creator can always cancel pending payments
- Time-based payments automatically become releasable
- Event-based payments require creator authorization
- Funds held securely in smart contract until release

## Project Structure

```
ridmint/
├── contracts/              # Smart contracts
│   ├── ConditionalEscrow.sol
│   └── README.md
├── src/
│   ├── components/         # React components
│   │   ├── Header.tsx
│   │   ├── PaymentCard.tsx
│   │   ├── CreatePaymentModal.tsx
│   │   └── WalletDropdown.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useWallet.ts
│   │   └── usePayments.ts
│   ├── config/            # Configuration
│   │   └── contracts.ts
│   ├── lib/               # Libraries
│   │   └── supabase.ts
│   ├── utils/             # Utility functions
│   │   └── format.ts
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── supabase/             # Database migrations
└── public/               # Static assets
```

## Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Network Configuration

### Base Sepolia (Testnet)

- Chain ID: 84532
- RPC URL: https://sepolia.base.org
- Block Explorer: https://sepolia.basescan.org
- USDC Contract: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

### Base Mainnet

- Chain ID: 8453
- RPC URL: https://mainnet.base.org
- Block Explorer: https://basescan.org
- USDC Contract: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Wallet Connection Issues

- Ensure you're on Base Sepolia testnet
- Check that your wallet extension is unlocked
- Try refreshing the page

### Transaction Failures

- Verify you have sufficient ETH for gas fees
- For USDC payments, ensure you have approved the contract
- Check that the recipient address is valid

### Contract Not Deployed

If you see an error about the contract not being deployed:

1. Deploy the smart contract to Base Sepolia
2. Update the address in `src/config/contracts.ts`
3. Restart the development server

## Security Considerations

- Always verify recipient addresses before creating payments
- Test thoroughly on testnet before mainnet deployment
- Be aware of gas costs and transaction times
- Smart contracts are immutable once deployed
- Keep your wallet private keys secure

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:

- Open an issue on GitHub
- Review the documentation in `contracts/README.md`
- Check Base network documentation

## Acknowledgments

- Built on [Base](https://base.org/)
