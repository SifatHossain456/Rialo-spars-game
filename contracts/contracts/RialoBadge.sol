// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RialoBadge is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    enum BadgeType { BRONZE, SILVER, GOLD, DIAMOND, CHAMPION }

    struct BadgeMetadata {
        BadgeType badgeType;
        uint256 xpAtMint;
        uint256 mintedAt;
    }

    mapping(uint256 => BadgeMetadata) public badges;
    mapping(address => mapping(BadgeType => bool)) public hasBadge;
    address public minter;

    event BadgeMinted(address indexed player, uint256 tokenId, BadgeType badgeType);

    modifier onlyMinter() {
        require(msg.sender == minter || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() ERC721("Rialo Rush Badge", "RRB") Ownable(msg.sender) {}

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function mintBadge(
        address player,
        BadgeType badgeType,
        uint256 xp,
        string memory tokenURI_
    ) external onlyMinter returns (uint256) {
        require(!hasBadge[player][badgeType], "Badge already owned");

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(player, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        badges[tokenId] = BadgeMetadata({
            badgeType: badgeType,
            xpAtMint: xp,
            mintedAt: block.timestamp
        });
        hasBadge[player][badgeType] = true;

        emit BadgeMinted(player, tokenId, badgeType);
        return tokenId;
    }

    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721URIStorage) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
