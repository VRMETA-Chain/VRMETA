pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MapTest is Ownable {

    //[x,y]
    uint[2] public mapDimensions;

    // ---VOTING DATA FIELDS ---//

    //incremented when new voters are added via plot ownership
    uint public voters;
    bool public voteInProgress;
    mapping(address => bool) public isVoter;
    mapping(address => mapping(uint=>bool)) public hasVoted;
    
    struct NewMapVote {
        uint voteCount;
        uint votesFor;
        uint votesAgainst;
        uint[2] proposedCoords;
    }

    //keeps track of vote rounds;
    uint public id;
    mapping(uint => NewMapVote) public mapVotesInProgress;


    // ---PROPOSAL DATA FIELDS ---//
    //used in proposals only
    struct Plot {
        uint[2][2] coords;
        address proposer;
    }

    //used to track pending proposals. propList[0] is used to get the earliest.
    Plot[] public propList;
    mapping(address => Plot) public plotProposal;
 
    //Tracks owned plot pair between [[x1, y1], [x2, y2]]
    mapping(address => uint[2][2]) public myPlots;
   
    //returns the owned coordinate pair
    function getCoords(address addr) public view returns(uint[2][2] memory) {
        return myPlots[addr];
    }


    //assigns a coordinate's availability, true means unavailable
    mapping(uint => mapping(uint=>bool)) public isOwned;
    //assigns an address to a coordinate
    mapping(uint => mapping(uint=>address)) public ownerOf;
    
  
    

    // ---FUNCTION FIELDS ---//
    //set map dimensions from [0,0] * [_x, _y]
    constructor(uint _x, uint _y) {
        mapDimensions[0] = _x;
        mapDimensions[1] = _y;
        isVoter[msg.sender] = true;
        voters = 1;
        id = 1;
        }

    //returns the most recent proposed coordinates + proposer in array[0].
    function getRecentProposal() public view returns(uint[2][2] memory _coords, address _proposer){
        uint[2][2] memory coords = propList[0].coords;
        address proposer = propList[0].proposer;
        return (coords, proposer);
    }
    
    //adds a proposal to propList to be approved or rejected by the owner.
    function proposePlot(uint x1, uint y1, uint x2, uint y2) public {
        bool check = checkIfOwned(x1,y1,x2,y2);
        require(check == false, "Plots are owned.");
        require(x1 <= mapDimensions[0] && y1 <= mapDimensions[1]);
        require(x2 <= mapDimensions[0] && y2 <= mapDimensions[1]);
        require(x1 >= 0 && y1 >= 0);
        require(x2 >= 0 && y2 >= 0);
        plotProposal[msg.sender].coords = [[x1, y1],[x2,y2]];
        plotProposal[msg.sender].proposer = msg.sender;
        propList.push(Plot([[x1,y1], [x2,y2]], msg.sender));

    }

    function approveOrReject(uint _choice, address _who) public onlyOwner{
        require(_choice == 0 || _choice == 1, "Yes(0) or No(1).");
        //Approve
        if(_choice == 0) {
            assignPlot(
                _who, 
                plotProposal[_who].coords[0][0],
                plotProposal[_who].coords[0][1],
                plotProposal[_who].coords[1][0],
                plotProposal[_who].coords[1][1]
                ); 
                isVoter[_who] = true;
                voters++; 
                plotProposal[_who].coords = [[0,0],[0,0]];
                //moves the proposal to the end and deletes it.  Most recent proposal is next in line.
                uint last = propList.length - 1;
                propList[0] = propList[last];
                propList.pop();
        } else {
            plotProposal[_who].coords = [[0,0],[0,0]];
                uint last = propList.length - 1;
                propList[0] = propList[last];
                propList.pop();
        }
    }
    //assigns the plot of land if approved by the owner account.
    function assignPlot(address who, uint x1, uint y1, uint x2, uint y2) internal onlyOwner {
        plotProposal[who].coords = [[x1, y1],[x2,y2]];
        myPlots[who] = [[x1, y1],[x2,y2]];
        //loop through to make each coordinate owned.
        for(uint num=y1; num <= y2; num++) {
            for(uint i=x1; i <= x2; i++) {
            isOwned[i][num] = true;
            ownerOf[i][num] = who;
        }
    }
    }


    //iterates through each coordinate to ensure none are owned.
    function checkIfOwned(uint x, uint y, uint x2, uint y2) internal view returns(bool) {
          for(uint num=y; num <= y2; num++) {
            for(uint i=x; i <= x2; i++) {
             if(isOwned[i][num] == true) {
                 return true;
             }
        }
    } return false;
    }

    //Propose new coordinates.  Either x or y must be lenghthened.
    //Starts a new vote mapVotesInProgress mapped to current id.
    function proposeMapExpansion(uint x, uint y) public onlyOwner{
        require(voteInProgress == false, "A proposed expansion is in progress.");
        require(x >= mapDimensions[0] && y >= mapDimensions[1], "The map can't be smaller.");
        require(x >= mapDimensions[0] || y >= mapDimensions[1], "The map must be bigger.");
        mapVotesInProgress[id].proposedCoords = [x,y];
        voteInProgress = true;
    }

    function vote(uint _choice) public {
        require(_choice == 0 || _choice == 1, "Yes(0) or No(1).");
        require(isVoter[msg.sender] == true, "You are not allowed.");
        require(hasVoted[msg.sender][id] == false, "You can only vote once.");
        if(_choice == 0) {
            mapVotesInProgress[id].votesFor++;
            mapVotesInProgress[id].voteCount++;
            hasVoted[msg.sender][id] = true;
        } else{
            mapVotesInProgress[id].votesAgainst++;
            mapVotesInProgress[id].voteCount++;
            hasVoted[msg.sender][id] = true;

        }
    }

    //Finalize the vote and increase the id for the next possible round.
    function finalizeMapVote() public onlyOwner {
        //ensure majority has voted.
        require(mapVotesInProgress[id].voteCount > voters / 2);
        if (mapVotesInProgress[id].votesFor > mapVotesInProgress[id].votesAgainst) {
            mapDimensions = mapVotesInProgress[id].proposedCoords;
            voteInProgress = false;
            id++;
        } else {
            voteInProgress = false;
            id++;
        }
    }


}
