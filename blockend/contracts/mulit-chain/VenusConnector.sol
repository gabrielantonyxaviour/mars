// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../interfaces/IWormholeRelayer.sol";
import "../interfaces/IWormholeReceiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract VenusConnector is IWormholeReceiver{

    IWormholeRelayer public immutable wormholeRelayer;
    bytes32 public immutable protocolAddress;
    uint16 public immutable protocolWormholeChainId;

    uint256 public constant GAS_LIMIT = 100_000;


    constructor (address _wormholeRelayer, address _protocolAddress, uint16 _protocolWormholeChainId, string memory _protocolAxelarChainName) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        protocolAddress = bytes32(uint256(uint160(_protocolAddress)));
        protocolWormholeChainId = _protocolWormholeChainId;
    }
    
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory, // additionalVaas
        bytes32 sourceAddress, // address that called 'sendPayloadToEvm' (HelloWormhole contract address)
        uint16 sourceChain,
        bytes32 // unique identifier of delivery
    ) public payable override {
        require(msg.sender == address(wormholeRelayer), "Only relayer allowed");
        require(protocolAddress == sourceAddress, "Address not allowed");
        require(sourceChain == protocolWormholeChainId, "Chain not allowed");
        require(msg.value>=quoteCrossChainCall(sourceChain, 0), "Insufficient cross chain fee");
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
            GAS_LIMIT
        );
    }

    function quoteCrossChainCall(
        uint16 targetChain, uint256 receiverValue
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            receiverValue,
            GAS_LIMIT
        );
    }

}
