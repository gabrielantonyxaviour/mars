// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../interfaces/IWormholeRelayer.sol";
import "../interfaces/IWormholeReceiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NotRelayer(address sender);
error NotProtocol(address sender);
error NotCorrectChain(uint16 chain);
error InSufficientFee(uint256 fee);

contract VenusConnector is IWormholeReceiver{

    IWormholeRelayer public immutable wormholeRelayer;
    bytes32 public immutable protocolAddress;
    uint16 public immutable protocolWormholeChainId;

    uint256 public gasLimit = 200_000;


    constructor (address _wormholeRelayer, address _protocolAddress, uint16 _protocolWormholeChainId) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        protocolAddress = bytes32(uint256(uint160(_protocolAddress)));
        protocolWormholeChainId = _protocolWormholeChainId;
    }
    
    event ConfirmationRelayed(uint256 orderId, bool isAllowed);

    function setGasLimit(uint256 _gasLimit) public {
        gasLimit = _gasLimit;
    }

    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory, // additionalVaas
        bytes32 sourceAddress, // address that called 'sendPayloadToEvm' (HelloWormhole contract address)
        uint16 sourceChain,
        bytes32 // unique identifier of delivery
    ) public payable override {
        if(msg.sender != address(wormholeRelayer))revert NotRelayer(msg.sender);
        if(sourceAddress != protocolAddress) revert NotProtocol(msg.sender);
        if(sourceChain != protocolWormholeChainId) revert NotCorrectChain(sourceChain);
        if(msg.value < quoteCrossChainCall(sourceChain, 0)) revert InSufficientFee(msg.value);
        
        (uint256 orderId, address tokenAddress, uint256 tokenId, address buyer, address seller) = abi.decode(
            payload,
            (uint256, address, uint256, address, address)
        );
        bool isAllowed=IERC721(tokenAddress).ownerOf(tokenId) == seller && IERC721(tokenAddress).getApproved(tokenId) == address(this);
        if(isAllowed){
            IERC721(tokenAddress).safeTransferFrom(seller, buyer, tokenId);
        }
        wormholeRelayer.sendPayloadToEvm{value: msg.value}(
            sourceChain,
            address(uint160(uint256(sourceAddress))),
            abi.encode(orderId, isAllowed), // payload
            0, // no receiver value needed since we're just passing a message
            gasLimit
        );
        emit ConfirmationRelayed(orderId, isAllowed);
    }

    function quoteCrossChainCall(
        uint16 targetChain, uint256 receiverValue
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            receiverValue,
            gasLimit
        );
    }

    // Called by Wormhole Cross chain query to verify NFT setup for listing
    function getAllowed(address tokenAddress, uint256 tokenId, address caller) public view returns(bool)
    {
        return IERC721(tokenAddress).ownerOf(tokenId) == caller && IERC721(tokenAddress).getApproved(tokenId) == address(this);
    }
}
