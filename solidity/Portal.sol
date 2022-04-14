pragma solidity ^0.8.0;

import "./Vrmeta.sol";

contract Portal {
    
    IERC20 public vrmeta;

    constructor(address _vrmeta) {
        vrmeta = IERC20(_vrmeta);
    }
    
    event ClaimCreated(bytes32 hash, address who, uint amount);

    mapping(address=>uint) public balance;

    function hashMirror(bytes memory hash, address who, uint amount) public returns(bytes32) {
        bytes32 hashResponse = sha256(hash);
        emit ClaimCreated(hashResponse, who, amount);
        return hashResponse;
    }

    function deposit(uint amount) public {
        vrmeta.transferFrom(msg.sender, address(this), amount);
        balance[msg.sender] += amount;
    }

}
