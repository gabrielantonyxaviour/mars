// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../interfaces/IWormholeRelayer.sol";
import "../interfaces/IWormholeReceiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error NotRelayer(address sender);
error NotMinter(address sender);
error NotCorrectChain(uint16 chain);

contract VenusCrosschainNft is IWormholeReceiver, ERC721, ERC721URIStorage{
    uint256 private _nextTokenId;

    IWormholeRelayer public immutable wormholeRelayer;
    bytes32 public immutable minterAddress;
    uint16 public immutable minterWormholeChainId;

    mapping(uint256 => bool) public nftTypes;

    constructor (address _wormholeRelayer, address _minterAddress, uint16 _minterWormholeChainId)  ERC721("VenusCrosschainNFT", "VCC") {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        minterAddress = bytes32(uint256(uint160(_minterAddress)));
        minterWormholeChainId = _minterWormholeChainId;
    }

    event NFTMinted(uint256 tokenId, address minter, bool nftType);
    
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory, // additionalVaas
        bytes32 sourceAddress, // address that called 'sendPayloadToEvm' (HelloWormhole contract address)
        uint16 sourceChain,
        bytes32 // unique identifier of delivery
    ) public payable override {
        if(msg.sender != address(wormholeRelayer))revert NotRelayer(msg.sender);
        if(sourceAddress != minterAddress) revert NotMinter(msg.sender);
        if(sourceChain != minterWormholeChainId) revert NotCorrectChain(sourceChain);
        
        (address minter, string memory tokenUri,  bool nftType) = abi.decode(
            payload,
            (address, string, bool)
        );

        uint256 tokenId = _nextTokenId++;
        _safeMint(minter, tokenId);
        _setTokenURI(tokenId, tokenUri);
        nftTypes[tokenId] = nftType;

        emit NFTMinted(tokenId, minter, nftType);
    }


    // Called by Wormhole Cross chain query to verify NFT setup for listing
    function getAllowed(address tokenAddress, uint256 tokenId, address caller) public view returns(bool)
    {
        return IERC721(tokenAddress).ownerOf(tokenId) == caller && IERC721(tokenAddress).getApproved(tokenId) == address(this);
    }


    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}



