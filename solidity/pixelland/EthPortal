pragma solidity ^0.8.0;

contract Converter {

    IERC20 public vrmeta;
    event ClaimCreated(bytes32 hash, uint amount);

    mapping(address=>bytes32) public hashes;

    function createClaim(string memory pw, uint256 amount) public {
        require(vrmeta.balanceOf(msg.sender) >= amount);
        bytes32 claimHash = createPw(pw);
        emit ClaimCreated(claimHash, amount); 
        
    }

     function createPw(string memory _pw) public pure returns(bytes32){
        bytes32 pw = stringToBytes32(_pw); 
      return keccak256(abi.encode(pw));  
   }

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
    assembly {
        result := mload(add(source, 32))
    }
}

}
