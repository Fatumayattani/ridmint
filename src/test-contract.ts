import { ethers } from "ethers";
import { CONDITIONAL_ESCROW_ADDRESS, CONDITIONAL_ESCROW_ABI } from "./config/contracts";

async function main() {
  // ✅ connect to Base Sepolia RPC
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");

  // create a contract instance
  const contract = new ethers.Contract(
    CONDITIONAL_ESCROW_ADDRESS,
    CONDITIONAL_ESCROW_ABI,
    provider
  );

  // just a simple call — get total number of payments
  const counter = await contract.paymentCounter();
  console.log("✅ Payment Counter:", counter.toString());
}

main().catch((err) => {
  console.error("❌ Test failed:", err);
});
