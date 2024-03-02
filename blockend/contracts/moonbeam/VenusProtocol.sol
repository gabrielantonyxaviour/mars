// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../wormhole/QueryResponse.sol";
import "../interfaces/IWormholeRelayer.sol";
import "../interfaces/IWormholeReceiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


error NotOwner(address sender);
error InCorrectPrice(uint256 pricePaid, uint256 priceRequired);
error NotActive(uint256 listingId);
error NotWhiteListedChain(uint16 chainId);
error NotWhiteListedAddress(address sender);
error NotRelayer(address sender);
error InvalidChain(uint256 chainId);

contract VenusProtocol is QueryResponse, IWormholeReceiver {

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
        uint256 chainId;
        uint256 priceInNative;
        uint256 validity;
        bool isActive;
    }

    struct Order {
        uint256 orderId;
        uint256 listingId;
        uint256 chainId;
        address buyer;
        OrderStatus status;
    }
    
    struct CrossChainQueryData{
        bytes response;
        bytes32 r;
        bytes32 s;
        uint8 v;
        uint8 guardianIndex;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Order) public orders;
    mapping(uint16 => address) public whitelistedWormholeAddresses;
    mapping(uint256=>uint16) public chainIdsToWormholeChainIds;
    mapping(address=>uint256) public claimables;
    uint256 public orderIdCounter;
    uint256 public listingIdCounter;
    address public owner;
    bool public crossChainVerificationEnabled;
    IWormholeRelayer public immutable wormholeRelayer;
    

    event NFTListed(uint256 listingId, address seller, address tokenAddress, uint256 tokenId, uint256 chainId, uint256 validity, uint256 priceInNative);
    event NftPurchaseInitiated(uint256 orderId, uint256 foreignChainListingId, uint256 wormholeChainId, address buyer, uint256 pricePaidInNative);
    event NftPurchaseCompleted(uint256 orderId);
    event NftPurchaseFailed(uint256 orderId);
    event ClaimablesClaimed(address receiver, uint256 amount);

    constructor(address _wormholeCoreAddress, address _wormholeRelayer) QueryResponse(_wormholeCoreAddress)  {
        owner=msg.sender;
        wormholeRelayer=IWormholeRelayer(_wormholeRelayer);
        orderIdCounter = 0;
        listingIdCounter = 0;
    }

    modifier onlyOwner()
    {

       if(msg.sender != owner) revert NotOwner(msg.sender);   
        _;
    }

    function whitelistWormholeAddress(uint256[] memory _chainIds, uint16[] memory _wormholeChainIds, address[] memory _destinationAddresses) public onlyOwner{
        for(uint i=0; i<_wormholeChainIds.length; i++){
            whitelistedWormholeAddresses[_wormholeChainIds[i]] = _destinationAddresses[i];
            chainIdsToWormholeChainIds[_chainIds[i]] = _wormholeChainIds[i];
        }
    }
    function purchaseNft(uint256 listingId) public payable {
        if(msg.value < listings[listingId].priceInNative) revert InCorrectPrice(msg.value, listings[listingId].priceInNative);
        if(!listings[listingId].isActive) revert NotActive(listingId);
        if(listings[listingId].chainId != 1287) revert InvalidChain(listings[listingId].chainId);
        orders[orderIdCounter]=Order(orderIdCounter, listingId, listings[listingId].chainId, msg.sender, OrderStatus.COMPLETED);
        listings[listingId].isActive = false;
        claimables[listings[listingId].seller] += listings[listingId].priceInNative;
        IERC721(listings[listingId].tokenAddress).safeTransferFrom(listings[listingId].seller, msg.sender, listings[listingId].tokenId);
        emit NftPurchaseCompleted(orderIdCounter);
        orderIdCounter++;
    }

    function purchaseNftViaWormhole(uint256 listingId, uint256 receiverValue , uint256 gasLimit) public payable {
        uint16 wormholeChainId = chainIdsToWormholeChainIds[listings[listingId].chainId];
        uint256 cost=quoteCrossChainCall(wormholeChainId, receiverValue, gasLimit);
        
        if(msg.value < listings[listingId].priceInNative+cost) revert InCorrectPrice(msg.value, listings[listingId].priceInNative+cost);
        if(!listings[listingId].isActive) revert NotActive(listingId);
        if(whitelistedWormholeAddresses[wormholeChainId] == address(0)) revert NotWhiteListedChain(wormholeChainId);
        
        orders[orderIdCounter]=Order(orderIdCounter, listingId, listings[listingId].chainId, msg.sender, OrderStatus.PENDING);
        wormholeRelayer.sendPayloadToEvm{value: cost}(
            wormholeChainId,
            whitelistedWormholeAddresses[wormholeChainId],
            abi.encode(orderIdCounter, listings[listingId].tokenAddress,listings[listingId].tokenId, msg.sender, listings[listingId].seller), // payload
            receiverValue, 
            gasLimit,
            wormholeChainId,
            owner
        );
        listings[listingId].isActive = false;
        emit NftPurchaseInitiated(orderIdCounter, listingId, wormholeChainId, msg.sender, msg.value);
        
        orderIdCounter++;
    }


    function listNft(address tokenAddress, uint256 tokenId, uint256 nativePrice, uint256 validity, uint256 chainId, CrossChainQueryData calldata _crosschainQueryData) public {
        if(crossChainVerificationEnabled){
            require(verifyApprovalCrossChainQuery(_crosschainQueryData), "Approval not verified");
        }
        listings[listingIdCounter] = Listing(msg.sender, tokenAddress, tokenId, chainId, nativePrice, validity, true);
        emit NFTListed(listingIdCounter, msg.sender,  tokenAddress,  tokenId,  chainId,  validity,  nativePrice);
        listingIdCounter++;
    }

    function getOrderIdCounter() public view returns(uint256){
        return orderIdCounter;
    }

    function getListingIdCounter() public view returns(uint256){
        return listingIdCounter;
    }
    function verifyApprovalCrossChainQuery(CrossChainQueryData calldata __crosschainQueryData) public view returns(bool){
        IWormhole.Signature[] memory signatures = new IWormhole.Signature[](1);
        signatures[0] = IWormhole.Signature(__crosschainQueryData.r,__crosschainQueryData.s, __crosschainQueryData.v, __crosschainQueryData.guardianIndex);
        ParsedQueryResponse memory r = parseAndVerifyQueryResponse(__crosschainQueryData.response, signatures);
        EthCallQueryResponse memory eqr = parseEthCallQueryResponse(r.responses[0]);

        return abi.decode(eqr.result[0].result, (bool));
    }

    function setCrossChainVerificationEnabled(bool state) public {
        crossChainVerificationEnabled=state;
    }


    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory, // additionalVaas
        bytes32 sourceAddressBytes32, // address that called 'sendPayloadToEvm' (HelloWormhole contract address)
        uint16 sourceChain,
        bytes32 // unique identifier of delivery
    ) public payable override {
        if(msg.sender != address(wormholeRelayer))revert NotRelayer(msg.sender);
        address sourceAddress=address(uint160(uint256(sourceAddressBytes32)));
        if(whitelistedWormholeAddresses[sourceChain] != sourceAddress) revert NotWhiteListedAddress(sourceAddress);
        // Parse the payload and do the corresponding actions!
        (uint256 orderId, bool success) = abi.decode(
            payload,
            (uint256, bool)
        );
        if(success){
            orders[orderId].status = OrderStatus.COMPLETED;
            claimables[listings[orders[orderId].listingId].seller] += listings[orders[orderId].listingId].priceInNative;
            emit NftPurchaseCompleted(orderId);
        }else{
            orders[orderId].status = OrderStatus.FAILED;
            claimables[orders[orderId].buyer] += listings[orders[orderId].listingId].priceInNative;
            listings[orders[orderId].listingId].isActive = true;
            emit NftPurchaseFailed(orderId);
        }
    }

    function claimClaimables(address receivingAddress) public {
        uint256 claimableValue=claimables[receivingAddress];
        claimables[receivingAddress]=0;
        payable(receivingAddress).transfer(claimableValue);
        emit ClaimablesClaimed(receivingAddress, claimableValue);
    }

    function quoteCrossChainCall(
        uint16 targetChain, uint256 receiverValue, uint256 gasLimit
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
