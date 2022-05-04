import logo from './logo.svg';
import React, { useState, useHook, useEffect } from "react";
import { Contract, ethers } from "ethers";
import './App.css';
import getWeb3dos from './getWeb3dos.js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';

const resourceABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_pixel",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "chopWood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "harvestFood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "lootSkeleton",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "makeDualPotion",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "makeHealthPotion",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "makeStaminaPotion",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mineStone",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amounts",
				"type": "uint256[]"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeBatchTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			},
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "values",
				"type": "uint256[]"
			}
		],
		"name": "TransferBatch",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "TransferSingle",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "value",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "URI",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "accounts",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			}
		],
		"name": "balanceOfBatch",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DUAL_POTIONS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "FOOD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "HEALTH_POTIONS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pixel",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SKELETON_BONES",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "STAMINA_POTIONS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "STONE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "uri",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WOOD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const pixelABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "authorize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "unAuthorize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

function Slider() {
  return (
    <AwesomeSlider>
      <div><ShowRecipes/></div>
      <div><ShowRecipes2/></div>
      <div><ShowRecipes3/></div>
      <div>4</div>
    </AwesomeSlider>
  );
} 
function SkullTile() {
  return(
  <Card sx={{ width: 120, height: 120, margin: 2 }}>
  <CardContent>
    <img className='centerpic recipeIcon' src='skull0000.png'/>
  </CardContent>
</Card>
  )

}
function FoodTile() {
  return(
  <Card sx={{ width: 120, height: 120, margin: 2 }}>
  <CardContent>
    <img className='centerpic recipeIcon' src='07_bread.png'/>
  </CardContent>
</Card>
  )

}
function WoodTile() {
  return(
  <Card sx={{ width: 120, height: 120 , margin: 2}}>
  <CardContent>
    <img className='centerpic recipeIcon' src='wood.jpg'/>
  </CardContent>
</Card>
  )

}
function StoneTile() {
  return(
  <Card sx={{ width: 120, height: 120, margin: 2 }}>
  <CardContent>
    <img className='centerpic recipeIcon' src='Rock0002.png'/>
  </CardContent>
</Card>
  )
}
function HealthTile() {
  return(
  <Card sx={{ width: 120, height: 120, margin: 2 }}>
  <CardContent>
    <img className='centerpic recipeIcon' src='bottlePotionHealth0000.png'/>
  </CardContent>
</Card>
  )
}
function StaminaTile() {
  return(
  <Card sx={{ width: 120, height: 120, margin: 2 }}>
  <CardContent>
    <img className='centerpic recipeIcon' src='bottlePotionPoison0001.png'/>
  </CardContent>
</Card>
  )
}
function DualTile() {
  return(
  <Card sx={{ width: 120, height: 120, margin: 2 }}>
  <CardContent>
    <img className='centerpic recipeIcon' src='chalice0001.png'/>
  </CardContent>
</Card>
  )
}
function RingTile() {
  return(
  <Card sx={{ width: 120, height: 120, margin: 2 }}>
  <CardContent>
    <img className='centerpic recipeIcon' src='Item__42.png'/>
  </CardContent>
 
</Card>
  )
}
function MetalTile() {
  return(
  <Card sx={{ width: 120, height: 120, margin: 2 }}>
  <CardContent>
    <img className='centerpic recipeIcon' src='metal.jpg'/>
  </CardContent>
</Card>
  )
}
function Tile() {
  return(
  <Card sx={{ width: 120, height: 120, margin: 2 }}>
  <CardContent>
    <h2>add</h2>
  </CardContent>
</Card>
  )
}

function ShowRecipes() {
  return(
    <div className='cookbook'>
      <h2>Recipes - Potions</h2>
    <div className='row rowSpecial'>
      <div className='column'>
      <img className='recipeIcon' src='bottlePotionHealth0000.png' />
      Health Potion
      </div>
       = 
       <div className='column'> <img className='recipeIcon' src='07_bread.png' /> 10x</div>
       + 
       <div className='column'><img className='recipeIcon'src='Rock0002.png' /> 5x</div>
      </div>
    <div className='row rowSpecial'>
      <div className='column'>
     
      <img className='recipeIcon'src='bottlePotionPoison0001.png' />
      Stamina Potion
      </div> = 
      <div className='column'><img className='recipeIcon' src='07_bread.png' />  10x </div>
      +
      <div className='column'>
      <img className='recipeIcon'src='wood.jpg' /> 5x</div> </div>
    <div className='row rowSpecial'>
      <div className='column'>
      
      <img className='recipeIcon'src='chalice0001.png' />
      Dual Potion
      </div> = 
      <div className='column'><img  className='recipeIcon'src='07_bread.png' /> 10x </div> 
      + 
      <div className='column'>
      <img className='recipeIcon'src='wood.jpg' /> 10x</div> + 
      <div className='column'><img className='recipeIcon'src='skull0000.png' /> 5x</div></div>
      
      
    </div>
  )
 
}
function ShowRecipes2() {
  return(
    <div className='cookbook'>
      <h2>Recipes - Weapons</h2>
    <div className='row rowSpecial'>
      <div className='column'>
      <img className='recipeIcon' src='bottlePotionHealth0000.png' />
      Health Potion
      </div>
       = 
       <div className='column'> <img className='recipeIcon' src='07_bread.png' /> 10x</div>
       + 
       <div className='column'><img className='recipeIcon'src='Rock0002.png' /> 5x</div>
      </div>
    <div className='row rowSpecial'>
      <div className='column'>
     
      <img className='recipeIcon'src='bottlePotionPoison0001.png' />
      Stamina Potion
      </div> = 
      <div className='column'><img className='recipeIcon' src='07_bread.png' />  10x </div>
      +
      <div className='column'>
      <img className='recipeIcon'src='wood.jpg' /> 5x</div> </div>
    <div className='row rowSpecial'>
      <div className='column'>
      
      <img className='recipeIcon'src='chalice0001.png' />
      Dual Potion
      </div> = 
      <div className='column'><img  className='recipeIcon'src='07_bread.png' /> 10x </div> 
      + 
      <div className='column'>
      <img className='recipeIcon'src='wood.jpg' /> 10x</div> + 
      <div className='column'><img className='recipeIcon'src='skull0000.png' /> 5x</div></div>
      
      
    </div>
  )
 
}
function ShowRecipes3() {
  return(
    <div className='cookbook'>
      <h2>Recipes - Armor</h2>
    <div className='row rowSpecial'>
      <div className='column'>
      <img className='recipeIcon' src='bottlePotionHealth0000.png' />
      Health Potion
      </div>
       = 
       <div className='column'> <img className='recipeIcon' src='07_bread.png' /> 10x</div>
       + 
       <div className='column'><img className='recipeIcon'src='Rock0002.png' /> 5x</div>
      </div>
    <div className='row rowSpecial'>
      <div className='column'>
     
      <img className='recipeIcon'src='bottlePotionPoison0001.png' />
      Stamina Potion
      </div> = 
      <div className='column'><img className='recipeIcon' src='07_bread.png' />  10x </div>
      +
      <div className='column'>
      <img className='recipeIcon'src='wood.jpg' /> 5x</div> </div>
    <div className='row rowSpecial'>
      <div className='column'>
      
      <img className='recipeIcon'src='chalice0001.png' />
      Dual Potion
      </div> = 
      <div className='column'><img  className='recipeIcon'src='07_bread.png' /> 10x </div> 
      + 
      <div className='column'>
      <img className='recipeIcon'src='wood.jpg' /> 10x</div> + 
      <div className='column'><img className='recipeIcon'src='skull0000.png' /> 5x</div></div>
      
      
    </div>
  )
 
}

function App() {
  const [connected, setConnected] = useState();
  const [accounts, setAccounts] = useState(['0xAccount']);
  const [pixelBal, setPixelBal] = useState();
  const [pixel, setPixel] = useState();
  const [resources, setResources] = useState();            // 0         1        2          3                  4               5                   6
  const [resourceBalances, setResourceBalances] = useState(['Wood', 'Stone', 'Food','Health Potions', 'Stamina Potions','Skeleton Bones', 'Dual Potions']);
  const [amount, setAmount] = useState(1);
  const [item1, setItem1] = useState(<FoodTile/>);
  const [item2, setItem2] = useState(<Tile/>);
  const [item3, setItem3] = useState(<Tile />);
  const [pair, setPair] = useState('a');
  const [tracker, setTracker] = useState(10);
  const [type, setType] = useState('potions');

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  const handleType = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      connect();
   
    }, 2000);
  
    return () => clearInterval(interval);
   
  }, []);

  async function connect() {
      const web3 = await getWeb3dos();
      const accounts = await web3.eth.getAccounts();

      const pixel = new web3.eth.Contract(
        pixelABI,
        "0x83Bd62421f7E09036040e3FC0F2f9225394D9F03"
        //"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        
      );
      const resources = new web3.eth.Contract(
        resourceABI,
        "0xbaf20020eeE36d137E55959fC03d56555D149Ce9"
       // "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        );
     /// updateBalances();
     let pixelBal = await pixel.methods.balanceOf(accounts[0]).call({from: accounts[0]});
     let wood = await resources.methods.balanceOf(accounts[0], 0).call({from: accounts[0]});
     let stone = await resources.methods.balanceOf(accounts[0], 1).call({from: accounts[0]});
     let food = await resources.methods.balanceOf(accounts[0], 2).call({from: accounts[0]});
     let healthPotions = await resources.methods.balanceOf(accounts[0], 3).call({from: accounts[0]});
     let staminaPotions = await resources.methods.balanceOf(accounts[0], 4).call({from: accounts[0]});
     let skeletonBones = await resources.methods.balanceOf(accounts[0], 5).call({from: accounts[0]});
     let dualPotions = await resources.methods.balanceOf(accounts[0], 6).call({from: accounts[0]});

      setPixelBal(pixelBal);
      setPixel(pixel);
      setResources(resources);
      setAccounts(accounts);
      setConnected(true);
      setResourceBalances([wood, stone, food, healthPotions, staminaPotions, skeletonBones, dualPotions]);
      findCreation4Real();
  }
 

  async function makeHp() {
      await resources.methods.makeHealthPotion(amount).send({from: accounts[0]});
      console.log("You created a health potion");
  }
  async function makeStam() {
    await resources.methods.makeStaminaPotion(amount).send({from: accounts[0]});
    console.log("You created a Stamina potion");
  }
  async function makeDual() {
    await resources.methods.makeDualPotion(amount).send({from: accounts[0]});
    console.log("You created a Dual potion");
  }

  async function makeItem() {
    if(tracker == 1) {
      makeHp();
      setItem3(<HealthTile />);
      console.log("You created a Health Potion.");
    } else if (tracker == 0) {
      makeStam();
      setItem3(<StaminaTile />);
      console.log("You created a Stamina Potion.");
    } else if (tracker == 22) {
      makeDual();
      setItem3(<DualTile />);
      console.log("You created a Dual Potion.");
    }
    return;
  }

  function selectItem() {
    if (pair == null) {
      setItem1(<WoodTile />);
      setPair('a');
    } else {
      setItem2(<WoodTile />);
      setTracker(0);
    }
  }
  function selectItem2() {
    if (pair == null) {
      setItem1(<FoodTile />);
      setPair('a');
    } else {
      setItem2(<FoodTile />);
      setTracker(2);
    }
  }
  function selectItem3() {
    if (pair == null) {
      setItem1(<StoneTile />);
      setPair('a');
    } else {
      setItem2(<StoneTile />);
      setTracker(1);
    }
  }
  function selectItem4() {
    if (pair == null) {
      setItem1(<SkullTile />);
      setPair('a');
    } else {
      setItem2(<SkullTile />);
      setTracker(22);
    }
  }



  async function findCreation4Real() {
    if(tracker == 1) {
      //await resources.methods.makeHealthPotion(1).send({from: accounts[0]});
      setItem3(<HealthTile />);
      //console.log("You created a Health Potion.");
    } else if (tracker == 0) {
     // await resources.methods.makeStaminaPotion(1).send({from: accounts[0]});
      setItem3(<StaminaTile />);
    //  console.log("You created a Stamina Potion.");
    } else if (tracker == 22) {
      // await resources.methods.makeStaminaPotion(1).send({from: accounts[0]});
       setItem3(<DualTile />);
     //  console.log("You created a Stamina Potion.");
     }
    return;
  }

  function clear() {
    setItem1(<Tile />);
    setItem2(<Tile />);
    setItem3(<Tile />);
    setPair(null);
  }


  return (
      <div className="App">
          <img src='title.png' className='title' />
          <div className='Container'>
            <div className='row'>
              <div className='profile'>
                
                  <img src='wizard.png' className='profilePic' /> 
                  <h3>{accounts[0]}</h3>
                  <h5><img className='recipeIcon' src='coin0000.png'/>{pixelBal} PIXEL</h5>
                  <button onClick={connect}>Connect</button>
              </div>
              <div className='profile cookbook'>
              <Slider />
        
                

              </div>
              </div>
              <div className='row'>
                  <div className='crafting'>
                      <h2>Crafting</h2> 
                      
                      <div className='rowSpecial'>
                      
                      <div className='rowOfThree'>{item1}+{item2} = {item3}</div>
                      <div className='column'>
                      <FormControl>
                       <FormLabel id="demo-controlled-radio-buttons-group">Amount</FormLabel>
                             <RadioGroup
                             aria-labelledby="demo-controlled-radio-buttons-group"
                             name="controlled-radio-buttons-group"
                             value={amount}
                             onChange={handleChange}
                             >
                      <FormControlLabel value="1" control={<Radio />} label="1" />
                      <FormControlLabel value="5" control={<Radio />} label="5" />
                       <FormControlLabel value="20" control={<Radio />} label="20" />
                      </RadioGroup>
                       </FormControl>
                       </div>
                        </div>
                      <div className='column'>
                      <button onClick={makeItem}>GO</button>
                      <button onClick={findCreation4Real}>Check</button>
                      <button onClick={clear}>Clear</button>
                      </div>
      
                  </div>
                  <div className='inventory'>
                  <h2>Inventory</h2> 
                      <div className='rowOfThree'>
                      <div className='column'> <button onClick={selectItem} ><WoodTile/></button>
                      {resourceBalances[0]}
                      </div>
                      <div className='column'> <button onClick={selectItem2} ><FoodTile /></button>
                      {resourceBalances[2]}
                      </div>
                      <div className='column'> <button onClick={selectItem3} ><StoneTile /></button>
                      {resourceBalances[1]}
                      </div>   
                        </div>
                      <div className='rowOfThree'>
                        <div className='column'><button onClick={selectItem} ><HealthTile/>
                        </button>
                        {resourceBalances[3]}
                        </div>
                        <div className='column'><button onClick={selectItem} ><StaminaTile /></button>
                        {resourceBalances[4]}
                        </div>
                        <div className='column'><button onClick={selectItem} ><DualTile /></button>
                        {resourceBalances[6]}
                        </div>     
                      </div>
                      <div className='rowOfThree'>
                        <div className='column'><button onClick={selectItem} ><RingTile/></button></div>
                        <div className='column'><button onClick={selectItem} ><MetalTile /></button></div>
                        <div className='column'><button onClick={selectItem4} ><SkullTile /></button>
                        {resourceBalances[5]}
                        </div>      
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default App;
