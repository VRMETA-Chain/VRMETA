var express = require('express');
const Web3 = require("web3");
var app = express();

app.use(require('morgan')('dev'));
app.use(express.static(__dirname + '/public'));

const address = '0xC570214c3A924cEaE0559710dc4B2A3DB451d111';
const privateKey = 'a9dd7820fe5b2f5a5faf3d67955e91ecfd98e65a49411c9e653f4f36ca71c68e';
const infuraUrl = 'https://polygon-mumbai.infura.io/v3/7f020208b8cc49ac9e3d1a15ae1909ca'; 


let web3 = new Web3(infuraUrl);
const MyContract = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_who",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_num",
				"type": "uint256"
			}
		],
		"name": "NumChanged",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getNum",
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
		"name": "num",
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
				"name": "_num",
				"type": "uint256"
			}
		],
		"name": "setNum",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const myContract = new web3.eth.Contract(
    MyContract,
    "0x68929bC3BeE202bCFB3c625FBCE09C3843e611dB"
  );

 


async function setNum() {

    const tx = myContract.methods.setNum(100);
    const gas = await tx.estimateGas({from: address});
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(address);
  
    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: myContract.options.address, 
        data,
        gas,
        gasPrice,
        nonce, 
        chainId: 80001
      },
      privateKey
    );
    console.log(`Old data value: ${await myContract.methods.num().call()}`);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`New data value: ${await myContract.methods.num().call()}`);
  
    console.log(tx);
}

//setNum();

async function getNum() {
    let result = await myContract.methods.getNum().call();
    console.log(result);
}

getNum();



app.listen(process.env.PORT || 80);