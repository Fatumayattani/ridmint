import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying ConditionalEscrow contract...");

  const ContractFactory = await ethers.getContractFactory("ConditionalEscrow");
  const escrow = await ContractFactory.deploy();

  // ⏳ wait for deployment to be mined
  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log(`✅ Contract deployed at: ${address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
