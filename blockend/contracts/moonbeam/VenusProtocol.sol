// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../wormhole/QueryResponse.sol";
import "../interfaces/IWormholeRelayer.sol";
import "../interfaces/IWormholeReceiver.sol";

error NotOwner(address sender);
error InCorrectPrice(uint256 pricePaid, uint256 priceRequired);
error NotActive(uint256 listingId);
error NotWhiteListedChain(uint16 chainId);
error NotWhiteListedAddress(address sender);
error NotRelayer(address sender);


contract VenusProtocol is QueryResponse, IWormholeReceiver {

    enum OrderStatus {
        DOES_NOT_EXIST,
        PENDING,
        COMPLETED,
        FAILED
    }

    enum Relayer {
        WORMHOLE,
        AXELAR
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
        Relayer relayer;
        OrderStatus status;
    }
    
    struct CrossChainQueryData{
        bytes response;
        bytes32 r;
        bytes32 s;
        uint8 v;
        uint8 guardianIndex;
    }

    uint256 public constant GAS_LIMIT = 200_000;
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Order) public orders;
    mapping(uint16 => address) public whitelistedWormholeAddresses;
    mapping(string => string) public whitelistedAxelarAddresses;
    mapping(uint256=>uint16) public chainIdsToWormholeChainIds;
    mapping(uint256=>string) public chainIdsToAxelarChainNames;
    mapping(address=>uint256) public claimables;
    uint256 public orderIdCounter;
    uint256 public listingIdCounter;
    address public owner;
    IWormholeRelayer public immutable wormholeRelayer;

    event NFTListed(uint256 listingId, address seller, address tokenAddress, uint256 tokenId, uint256 chainId, uint256 validity, uint256 priceInNative);
    event NftPurchaseInitiated(uint256 orderId, uint256 foreignChainListingId, uint256 wormholeChainId, address buyer, uint256 pricePaidInNative);
    event NftPurchaseCompleted(uint256 orderId);
    event NftPurchaseFailed(uint256 orderId);
    event CrossChainQueryLogger(ParsedQueryResponse r, EthCallQueryResponse eqr, address owner);

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

    function whitelistWormholeAddress(uint256[] memory chainIds, uint16[] memory _wormholeChainIds, address[] memory destinationAddresses) public onlyOwner{
        for(uint i=0; i<_wormholeChainIds.length; i++){
            whitelistedWormholeAddresses[_wormholeChainIds[i]] = destinationAddresses[i];
            chainIdsToWormholeChainIds[chainIds[i]] = _wormholeChainIds[i];
        }
    }

    function whitelistAxelarAddresses(uint256[] memory chainIds, string[] memory chainNames, string[] memory destinationAddresses) public onlyOwner{
        for(uint i=0; i<chainIds.length; i++){
            chainIdsToAxelarChainNames[chainIds[i]] = destinationAddresses[i];
            whitelistedAxelarAddresses[chainNames[i]] = destinationAddresses[i];
        }
    }

    function purchaseNFTViaWormhole(uint256 listingId, uint256 receiverValue) public payable  returns(uint256 orderId){
        uint16 wormholeChainId = chainIdsToWormholeChainIds[listings[listingId].chainId];
        uint256 cost=quoteCrossChainCall(wormholeChainId, receiverValue);
        
        if(msg.value >= listings[listingId].priceInNative+cost) revert InCorrectPrice(msg.value, listings[listingId].priceInNative+cost);
        if(!listings[listingId].isActive) revert NotActive(listingId);
        if(whitelistedWormholeAddresses[wormholeChainId] == address(0)) revert NotWhiteListedChain(wormholeChainId);
        
        orders[orderIdCounter]=Order(orderIdCounter, listingId, listings[listingId].chainId, msg.sender, Relayer.WORMHOLE, OrderStatus.PENDING);
        wormholeRelayer.sendPayloadToEvm{value: cost}(
            wormholeChainId,
            whitelistedWormholeAddresses[wormholeChainId],
            abi.encode(orderIdCounter, listings[listingId].tokenAddress,listings[listingId].tokenId, msg.sender, listings[listingId].seller), // payload
            receiverValue, // no receiver value needed since we're just passing a message
            GAS_LIMIT,
            wormholeChainId,
            owner
        );
        listings[listingId].isActive = false;
        emit NftPurchaseInitiated(orderIdCounter, listingId, wormholeChainId, msg.sender, msg.value);
        
        orderIdCounter++;
        return orderIdCounter-1;
    }

    // function purchaseNFTViaAxelar(uint256 listingId) public payable returns(uint256 orderId)
    // {

    // }

    function listNft(address tokenAddress, uint256 tokenId, uint256 nativePrice, uint256 validity, uint256 chainId, CrossChainQueryData calldata _crosschainQueryData) public {
        // Wormhole Cross chain queries for fetching approval
        // verify owner of the nft, verify approval
        // require(verifyApprovalCrossChainQuery(response, signatures), "Approval not verified");
        listings[listingIdCounter] = Listing(msg.sender, tokenAddress, tokenId, chainId, nativePrice, validity, true);
        emit NFTListed(listingIdCounter, msg.sender,  tokenAddress,  tokenId,  chainId,  validity,  nativePrice);
        listingIdCounter++;
    }

    function getOrderIdCounter() public view returns(uint256){
        return orderIdCounter;
    }

    function getListingIdCounte() public view returns(uint256){
        return listingIdCounter;
    }
    function verifyApprovalCrossChainQuery(CrossChainQueryData calldata __crosschainQueryData) public returns(bool){
        IWormhole.Signature[] memory signatures = new IWormhole.Signature[](1);
        signatures[0] = IWormhole.Signature(__crosschainQueryData.r,__crosschainQueryData.s, __crosschainQueryData.v, __crosschainQueryData.guardianIndex);
        ParsedQueryResponse memory r = parseAndVerifyQueryResponse(__crosschainQueryData.response, signatures);
        EthCallQueryResponse memory eqr = parseEthCallQueryResponse(r.responses[0]);
        address owner=abi.decode(eqr.result[0].result, (address));

        emit CrossChainQueryLogger(r, eqr, owner);
        return owner == msg.sender;
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
            emit NftPurchaseFailed(orderId);
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
