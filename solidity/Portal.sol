pragma solidity ^0.8.0;

import "./Vrmeta.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Portal is Ownable {
    
    IERC20 public vrmeta;

    constructor(address _vrmeta) {
        vrmeta = IERC20(_vrmeta);
    }
    
    event ClaimCreated(bytes32 hash, address who, uint amount);

    mapping(address=>uint) public balance;

    function hashMirror(bytes memory hash, address who, uint amount) public onlyOwner returns(bytes32) {
        bytes32 hashResponse = sha256(hash);
        emit ClaimCreated(hashResponse, who, amount);
        return hashResponse;
    }

    function deposit(uint amount) public {
        vrmeta.transferFrom(msg.sender, address(this), amount);
        balance[msg.sender] += amount;
    }

     function createClaim(bytes memory pw, uint256 amount) public {
        bytes32 claimHash = createPw(pw);
        emit ClaimCreated(claimHash, msg.sender, amount); 
        
    }

     function createPw(bytes memory _pw) public view returns(bytes32){
       /// bytes32 pw = stringToBytes32(_pw); 
      return sha256(_pw);  
      
   }

}
