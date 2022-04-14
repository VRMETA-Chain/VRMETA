pragma solidity ^0.8.0;

import "./Vrmeta.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Portal is Ownable {
    
    Vrmeta public vrmeta;

    constructor(address _vrmeta) {
        vrmeta = Vrmeta(_vrmeta);
    }
    
    event ClaimCreated(bytes32 hash, address who, uint amount);
    event Processed(uint amountBurned);

    mapping(address=>uint) public balance;

    function process(address who, uint amount) public onlyOwner {
        vrmeta.burn(amount);
        balance[who] -= amount;
        emit Processed(amount);
    }

     function createClaim(bytes memory pw, uint256 amount) public {
        require (vrmeta.balanceOf(msg.sender) >= amount);
        vrmeta.transferFrom(msg.sender, address(this), amount);
        balance[msg.sender] += amount;
        bytes32 claimHash = createPw(pw);
        emit ClaimCreated(claimHash, msg.sender, amount); 
        
    }

     function createPw(bytes memory _pw) public pure returns(bytes32){
       /// bytes32 pw = stringToBytes32(_pw); 
      return sha256(_pw);  
      
   }

}
