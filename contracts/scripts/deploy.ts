import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const RialoRush = await ethers.getContractFactory("RialoRush");
  const rialoRush = await RialoRush.deploy();
  await rialoRush.waitForDeployment();
  const rushAddress = await rialoRush.getAddress();
  console.log("RialoRush deployed to:", rushAddress);

  const RialoBadge = await ethers.getContractFactory("RialoBadge");
  const rialoBadge = await RialoBadge.deploy();
  await rialoBadge.waitForDeployment();
  const badgeAddress = await rialoBadge.getAddress();
  console.log("RialoBadge deployed to:", badgeAddress);

  await rialoBadge.setMinter(rushAddress);
  console.log("Minter set to RialoRush contract");

  console.log("\n=== Deployment Summary ===");
  console.log("RialoRush:", rushAddress);
  console.log("RialoBadge:", badgeAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
