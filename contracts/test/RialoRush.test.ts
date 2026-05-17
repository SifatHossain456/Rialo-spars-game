import { expect } from "chai";
import { ethers } from "hardhat";
import { RialoRush } from "../typechain-types";

describe("RialoRush", () => {
  let contract: RialoRush;
  let owner: any;
  let player: any;

  const roundId = ethers.id("round_001");
  const startPrice = 108000n * 10n ** 8n;
  const targetPrice = 109000n * 10n ** 8n;

  beforeEach(async () => {
    [owner, player] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("RialoRush");
    contract = await Factory.deploy();
  });

  it("creates a round", async () => {
    await contract.createRound(roundId, "BTC", startPrice, targetPrice, 0, 60);
    const round = await contract.getRound(roundId);
    expect(round.asset).to.equal("BTC");
    expect(round.status).to.equal(0); // ACTIVE
  });

  it("allows prediction", async () => {
    await contract.createRound(roundId, "BTC", startPrice, targetPrice, 0, 60);
    await contract.connect(player).predict(roundId, 0); // UP
    const stats = await contract.getPlayerStats(player.address);
    expect(stats.totalPredictions).to.equal(1n);
  });

  it("settles a round", async () => {
    await contract.createRound(roundId, "BTC", startPrice, targetPrice, 0, 60);
    const endPrice = 109500n * 10n ** 8n;
    await contract.settleRound(roundId, endPrice);
    const round = await contract.getRound(roundId);
    expect(round.status).to.equal(2); // SETTLED
    expect(round.result).to.equal(0); // UP (endPrice > startPrice)
  });
});
