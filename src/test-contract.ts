import { ethers } from "ethers";
import { CONTRACTS, CONTRACT_ABI, ERC20_ABI, NETWORKS } from './config/contracts';

async function main() {
  // ✅ connect using NETWORKS config instead of hardcoding RPC
  const provider = new ethers.JsonRpcProvider(NETWORKS.BASE_SEPOLIA.rpcUrl);

  // create a contract instance
  const contract = new ethers.Contract(
    CONTRACTS.CONDITIONAL_ESCROW,
    CONTRACT_ABI,
    provider
  );

  // Example of using ERC20_ABI (e.g., checking USDC balance)
  const usdc = new ethers.Contract(
    CONTRACTS.USDC_BASE_SEPOLIA,
    ERC20_ABI,
    provider
  );
  const balance = await usdc.balanceOf("0xYourWalletAddressHere");
  console.log("💰 USDC Balance:", ethers.formatUnits(balance, 6));

  // just a simple call — get total number of payments
  const counter = await contract.paymentCounter();
  console.log("✅ Payment Counter:", counter.toString());
}

main().catch((err) => {
  console.error("❌ Test failed:", err);
});
