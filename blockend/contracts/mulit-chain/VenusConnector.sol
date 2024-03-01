// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../interfaces/IWormholeRelayer.sol";
import "../interfaces/IWormholeReceiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract VenusConnector is IWormholeReceiver{

    IWormholeRelayer public immutable wormholeRelayer;
    address public immutable protocolAddress;
    uint16 public immutable protocolWormholeChainId;

    uint256 public constant GAS_LIMIT = 50_000;


    constructor (address _wormholeRelayer, address _protocolAddress, uint16 _protocolWormholeChainId, string memory _protocolAxelarChainName) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        protocolAddress = _protocolAddress;
        protocolWormholeChainId = _protocolWormholeChainId;
    }
    
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory, // additionalVaas
        bytes32 sourceAddressBytes32, // address that called 'sendPayloadToEvm' (HelloWormhole contract address)
        uint16 sourceChain,
        bytes32 // unique identifier of delivery
    ) public payable override {
        require(msg.sender == address(wormholeRelayer), "Only relayer allowed");
        address sourceAddress=address(uint160(uint256(sourceAddressBytes32)));
        require(protocolAddress == sourceAddress, "Address not allowed");
        require(sourceChain == protocolWormholeChainId, "Chain not allowed");
        require(msg.value>=quoteCrossChainCall(sourceChain, 0), "Insufficient cross chain fee");
        // Parse the payload and do the corresponding actions!
        (uint256 orderId, address tokenAddress, uint256 tokenId, address buyer, address seller) = abi.decode(
            payload,
            (uint256, address, uint256, address, address)
        );
        bool isOwner=IERC721(tokenAddress).ownerOf(tokenId) == seller;
        bool isApproved=IERC721(tokenAddress).getApproved(tokenId) == address(this);
        uint8 state= isOwner && isApproved ? 0 : isOwner ? 1 : 2;
        wormholeRelayer.sendPayloadToEvm{value: msg.value}(
            sourceChain,
            protocolAddress,
            abi.encode(orderId, state), // payload
            0, // no receiver value needed since we're just passing a message
            GAS_LIMIT
        ); 
        if(state==0){
            IERC721(tokenAddress).safeTransferFrom(seller, buyer, tokenId);
        }
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
