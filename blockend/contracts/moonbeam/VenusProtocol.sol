// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../wormhole/QueryResponse.sol";

contract VenusProtocol is QueryResponse {

    enum OrderStatus {
        DOES_NOT_EXIST,
        PENDING,
        COMPLETED,
        FAILED
    }

    struct Listing {
        address seller;
        address tokenAddress;
        uint256 tokenId;
        uint256 wormholeChainId;
        uint256 priceInNative;
        bytes signature;
        bool isActive;
    }

    struct Order {
        uint256 orderId;
        uint256 listingId;
        uint256 wormholeChainId;
        address buyer;
        uint256 pricePaidInNative;
        OrderStatus status;
    }


    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Order) public orders;
    uint256 public orderIdCounter;
    uint256 public listingIdCounter;
    
    event NFTListed(uint256 listingId, address seller, address tokenAddress, uint256 tokenId, uint256 priceInNative);
    event NftPurchaseInitiated(uint256 orderId, uint256 foreignChainListingId, uint256 wormholeChainId, address buyer, uint256 pricePaidInNative);
    event NftPurchaseCompleted(uint256 orderId, address seller);
    event NftPurchaseFailed(uint256 orderId);


    constructor(address _wormhole) QueryResponse(_wormhole) {
        orderIdCounter = 0;
        listingIdCounter = 0;
    }

    function purchaseNFT(uint256 listingId, uint256 wormholeChainId) public payable  returns(uint256 orderId){
        emit NftPurchaseInitiated(orderIdCounter, listingId, wormholeChainId, msg.sender, msg.value);
        orderIdCounter++;
        return 0;
    }

    function listNft(address tokenAddress, uint256 tokenId, uint256 nativePrice, bytes memory response, IWormhole.Signature[] memory signatures) public {
        // Wormhole Cross chain queries for fetching approval?
        // require(verifyApprovalCrossChainQuery(response, signatures), "Approval not verified");
        emit NFTListed(listingIdCounter, msg.sender, tokenAddress, tokenId, nativePrice);
        listingIdCounter++;
    }

    function nftPurchaseCallback(uint256 orderId, address seller, bool isSuccess) public {
        if(isSuccess)
        {
            emit NftPurchaseCompleted(orderId, seller);
        }else{
            emit NftPurchaseFailed(orderId);
        }
    }

    function getOrderIdCounter() public view returns(uint256){
        return orderIdCounter;
    }

    function getListingIdCounte() public view returns(uint256){
        return listingIdCounter;
    }
    event Logger(ParsedQueryResponse r, EthCallQueryResponse eqr, address owner);
    function verifyApprovalCrossChainQuery(bytes memory response, bytes32 rSig, bytes32 sSig, uint8 vSig, uint8 guardianIndexSig) public  returns(bool){
        IWormhole.Signature[] memory signatures = new IWormhole.Signature[](1);
        signatures[0] = IWormhole.Signature(rSig, sSig, vSig, guardianIndexSig);
        ParsedQueryResponse memory r = parseAndVerifyQueryResponse(response, signatures);
        EthCallQueryResponse memory eqr = parseEthCallQueryResponse(r.responses[0]);
        address owner=abi.decode(eqr.result[0].result, (address));

        emit Logger(r, eqr, owner);
        return owner == msg.sender;
    }
}
