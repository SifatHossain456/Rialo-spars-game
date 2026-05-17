// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RialoRush is Ownable, ReentrancyGuard {
    enum Direction { UP, DOWN }
    enum RoundStatus { ACTIVE, LOCKED, SETTLED }

    struct Round {
        bytes32 id;
        string asset;
        uint256 startPrice;
        uint256 targetPrice;
        uint256 endPrice;
        Direction direction;
        RoundStatus status;
        Direction result;
        uint256 startTime;
        uint256 endTime;
        uint256 totalUpVotes;
        uint256 totalDownVotes;
    }

    struct PlayerStats {
        uint256 xp;
        uint256 wins;
        uint256 losses;
        uint256 streak;
        uint256 maxStreak;
        uint256 totalPredictions;
        uint256 lastRoundId;
    }

    mapping(bytes32 => Round) public rounds;
    mapping(bytes32 => mapping(address => Direction)) public predictions;
    mapping(bytes32 => mapping(address => bool)) public hasPredicted;
    mapping(address => PlayerStats) public playerStats;

    bytes32 public currentRoundId;
    address public oracle;
    uint256 public constant XP_WIN = 100;
    uint256 public constant XP_STREAK_BONUS = 50;

    event RoundCreated(bytes32 indexed roundId, string asset, uint256 startPrice);
    event PredictionPlaced(bytes32 indexed roundId, address indexed player, Direction choice);
    event RoundSettled(bytes32 indexed roundId, Direction result, uint256 endPrice);
    event XPAwarded(address indexed player, uint256 amount, uint256 newTotal);

    modifier onlyOracle() {
        require(msg.sender == oracle || msg.sender == owner(), "Not oracle");
        _;
    }

    constructor() Ownable(msg.sender) {
        oracle = msg.sender;
    }

    function setOracle(address _oracle) external onlyOwner {
        oracle = _oracle;
    }

    function createRound(
        bytes32 roundId,
        string calldata asset,
        uint256 startPrice,
        uint256 targetPrice,
        Direction direction,
        uint256 duration
    ) external onlyOracle {
        require(rounds[roundId].startTime == 0, "Round exists");

        rounds[roundId] = Round({
            id: roundId,
            asset: asset,
            startPrice: startPrice,
            targetPrice: targetPrice,
            endPrice: 0,
            direction: direction,
            status: RoundStatus.ACTIVE,
            result: Direction.UP,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            totalUpVotes: 0,
            totalDownVotes: 0
        });

        currentRoundId = roundId;
        emit RoundCreated(roundId, asset, startPrice);
    }

    function predict(bytes32 roundId, Direction choice) external nonReentrant {
        Round storage round = rounds[roundId];
        require(round.status == RoundStatus.ACTIVE, "Round not active");
        require(block.timestamp < round.endTime - 10, "Voting locked");
        require(!hasPredicted[roundId][msg.sender], "Already predicted");

        predictions[roundId][msg.sender] = choice;
        hasPredicted[roundId][msg.sender] = true;

        if (choice == Direction.UP) round.totalUpVotes++;
        else round.totalDownVotes++;

        playerStats[msg.sender].totalPredictions++;
        emit PredictionPlaced(roundId, msg.sender, choice);
    }

    function settleRound(bytes32 roundId, uint256 endPrice) external onlyOracle {
        Round storage round = rounds[roundId];
        require(round.status != RoundStatus.SETTLED, "Already settled");

        round.endPrice = endPrice;
        round.result = endPrice > round.startPrice ? Direction.UP : Direction.DOWN;
        round.status = RoundStatus.SETTLED;

        emit RoundSettled(roundId, round.result, endPrice);
    }

    function claimXP(bytes32 roundId) external nonReentrant {
        Round storage round = rounds[roundId];
        require(round.status == RoundStatus.SETTLED, "Not settled");
        require(hasPredicted[roundId][msg.sender], "No prediction");

        Direction myChoice = predictions[roundId][msg.sender];
        bool won = myChoice == round.result;

        PlayerStats storage stats = playerStats[msg.sender];
        require(stats.lastRoundId != uint256(roundId), "Already claimed");
        stats.lastRoundId = uint256(roundId);

        if (won) {
            stats.wins++;
            stats.streak++;
            if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;

            uint256 xpEarned = XP_WIN + (stats.streak > 1 ? XP_STREAK_BONUS * (stats.streak - 1) : 0);
            stats.xp += xpEarned;

            emit XPAwarded(msg.sender, xpEarned, stats.xp);
        } else {
            stats.losses++;
            stats.streak = 0;
        }
    }

    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }

    function getRound(bytes32 roundId) external view returns (Round memory) {
        return rounds[roundId];
    }
}
