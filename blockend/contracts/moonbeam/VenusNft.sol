
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract VenusNft is ERC721, ERC721URIStorage, Ownable {
    using ECDSA for bytes32;
    uint256 private _nextTokenId;

    bytes32 public constant KEY_HASH=keccak256("VENUS_NFT");

    constructor(address initialOwner)
        ERC721("SampleNft", "SFT")
        Ownable(initialOwner)
    {}

    function mintAiNft(address to, string memory uri, bytes memory signature) public payable{
        require(_getHashedData(_nextTokenId).recover(signature)==owner(), "Invalid signature");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function mintUploadNft(address to, string memory uri, bytes memory signature) public payable {
        require(_getHashedData(_nextTokenId).recover(signature)==owner(), "Invalid signature");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
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

    function _getHashedData(uint256 tokenId) internal view returns(bytes32){
        return keccak256(abi.encodePacked(KEY_HASH, tokenId));
    }
}