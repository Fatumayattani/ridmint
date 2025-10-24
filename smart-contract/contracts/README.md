# Ridmint Smart Contracts

## ConditionalEscrow.sol

This contract enables conditional payments on Base network.

### Deployment

Deploy using Remix, Hardhat, or Foundry to Base mainnet or Base Sepolia testnet.

### Contract Address
After deployment, update the contract address in `src/config/contracts.ts`

### Features
- ETH and ERC20 token support
- Time-based conditions
- Event-based conditions (manual release by creator)
- Payment cancellation by creator
- Automatic fund release when conditions are met
