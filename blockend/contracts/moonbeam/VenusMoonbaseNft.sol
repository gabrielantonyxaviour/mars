
pragma solidity ^0.8.12;

import "../interfaces/IWormholeRelayer.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

error InvalidSignature(address recoveredAddress);
error NotEnoughFee(uint256 fee);

contract VenusMoonbaseNft is ERC721, ERC721URIStorage, Ownable {
    using ECDSA for bytes32;

    uint256 public _nextTokenId;

    bytes32 public constant KEY_HASH=keccak256("VENUS_NFT");
    IWormholeRelayer public immutable wormholeRelayer;
    uint256 public aiMintFee;
    uint256 public importMintFee;
    mapping(uint16 => address) public whitelistedWormholeAddresses;
    mapping(uint256=>uint16) public chainIdsToWormholeChainIds;

    constructor(address initialOwner, address _wormholeRelayer, uint256 _aiMintFee, uint256 _importMintFee)
        ERC721("SampleNft", "SFT")
        Ownable(initialOwner)
    {
        aiMintFee=_aiMintFee;
        importMintFee=_importMintFee;
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
    }
    
    event NFTMinted(uint256 tokenId, address minter, string tokenUri, bool nftType);
    event CrosschainMintSent(uint256 tokenId, address minter, string tokenUri, bool nftType, uint256 chainId);


    function updateAiMintFee(uint256 _aiMintFee) public onlyOwner {
        aiMintFee=_aiMintFee;
    }

    function updateImportMintFee(uint256 _importMintFee) public onlyOwner {
        importMintFee=_importMintFee;
    }

    function whitelistWormholeAddress(uint256[] memory chainIds, uint16[] memory _wormholeChainIds, address[] memory _destinationAddresses) public onlyOwner{
        for(uint i=0; i<_wormholeChainIds.length; i++){
            whitelistedWormholeAddresses[_wormholeChainIds[i]] = _destinationAddresses[i];
            chainIdsToWormholeChainIds[chainIds[i]] = _wormholeChainIds[i];
        }
    }

    function mintAiNft(address _to, string memory _uri, bytes memory signature, uint256 chainId, uint256 gasLimit) public payable{
        uint16 wormholeChainId = chainIdsToWormholeChainIds[chainId];
        uint256 cost = quoteCrossChainCall(wormholeChainId, gasLimit);
        
        if(msg.value < aiMintFee + cost) revert NotEnoughFee(msg.value);
        if(chainId != 1287){

            wormholeRelayer.sendPayloadToEvm {value: cost} (
                wormholeChainId,
                whitelistedWormholeAddresses[wormholeChainId],
                abi.encode(_to, _uri, true), // payload
                0, // no receiver value needed since we're just passing a message
                gasLimit
            );
            emit CrosschainMintSent(_nextTokenId, _to, _uri, true, chainId);
            _nextTokenId+=1;
        }else{
            _mintNft(_to, _uri);
            emit NFTMinted(_nextTokenId, _to, _uri, true);
        }
    }

    function mintImportNft(address _to, string memory _uri, bytes memory signature, uint256 chainId, uint256 gasLimit) public  payable {
        uint16 wormholeChainId = chainIdsToWormholeChainIds[chainId];
        uint256 cost = quoteCrossChainCall(wormholeChainId, gasLimit);
        
        if(msg.value < importMintFee + cost) revert NotEnoughFee(msg.value);
        if(chainId != 1287){
            wormholeRelayer.sendPayloadToEvm{value: cost}(
                wormholeChainId,
                whitelistedWormholeAddresses[wormholeChainId],
                abi.encode(_to, _uri, false), // payload
                0, // no receiver value needed since we're just passing a message
                gasLimit,
                wormholeChainId,
                owner()
            );
            emit CrosschainMintSent(_nextTokenId, _to, _uri, true, chainId);
            _nextTokenId+=1;
        }else{
            _mintNft(_to, _uri);
            emit NFTMinted(_nextTokenId, _to, _uri, false);
        }
    }
    
    function _mintNft(address _to, string memory _uri) internal{
        uint256 tokenId = _nextTokenId++;
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);
    }

    function quoteCrossChainCall(
        uint16 targetChain, uint256 gasLimit
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            gasLimit
        );
    }

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