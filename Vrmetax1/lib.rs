import React, { useState, createRef, useEffect } from 'react'
import './App.css';
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Generate from './Generate.js'
import Swal from 'sweetalert2'

import { mnemonicGenerate, mnemonicValidate, mnemonicToMiniSecret, sr25519PairFromSeed } from '@polkadot/util-crypto';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { SubstrateContextProvider, useSubstrateState, connect } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'
import { ContractPromise } from '@polkadot/api-contract'
import { Keyring } from '@polkadot/api'
import AccountSelector from './AccountSelector'
import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import Transfer from './Transfer'
import Upgrade from './Upgrade'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { createPolkadotJsScClient } from '@substrate/connect';
import mySubstrateChainSpec from './myCustomSpec.json';

const myChainSpec = JSON.stringify(mySubstrateChainSpec);
const contractADDR = "5Gbi7ztUs5NZGFv67dUxPud6cu3s94nNCyyGYBGG5N87BxdC";
const abi = {
  "source": {
    "hash": "0xb431a70daeebcbc31b521d1bc5a091aac565104ffb92fbd3e50d07da91fefd04",
    "language": "ink! 3.0.0-rc9",
    "compiler": "rustc 1.61.0-nightly"
  },
  "contract": {
    "name": "vrmetaxfps",
    "version": "0.1.0",
    "authors": [
      "[your_name] <[your_email]>"
    ]
  },
  "V3": {
    "spec": {
      "constructors": [
        {
          "args": [],
          "docs": [],
          "label": "new",
          "payable": true,
          "selector": "0x9bae9d5e"
        }
      ],
      "docs": [],
      "events": [],
      "messages": [
        {
          "args": [],
          "docs": [],
          "label": "buy_ammo",
          "mutates": true,
          "payable": true,
          "returnType": null,
          "selector": "0x2b867bd0"
        },
        {
          "args": [],
          "docs": [],
          "label": "buy_missiles",
          "mutates": true,
          "payable": true,
          "returnType": null,
          "selector": "0x67056a47"
        },
        {
          "args": [],
          "docs": [],
          "label": "buy_gun_rights",
          "mutates": true,
          "payable": true,
          "returnType": null,
          "selector": "0x07dc73ab"
        },
        {
          "args": [],
          "docs": [],
          "label": "buy_nft_skin",
          "mutates": true,
          "payable": true,
          "returnType": null,
          "selector": "0xbbe18393"
        },
        {
          "args": [
            {
              "label": "amount_bullets",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 7
              }
            }
          ],
          "docs": [],
          "label": "shoot_ammo",
          "mutates": true,
          "payable": false,
          "returnType": null,
          "selector": "0x0b035174"
        },
        {
          "args": [],
          "docs": [],
          "label": "give_two_hundred_vrmeta",
          "mutates": true,
          "payable": false,
          "returnType": null,
          "selector": "0x19306721"
        },
        {
          "args": [
            {
              "label": "account",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 1
              }
            }
          ],
          "docs": [
            " Return ammo"
          ],
          "label": "get_ammo",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "u128"
            ],
            "type": 7
          },
          "selector": "0x880133dc"
        },
        {
          "args": [
            {
              "label": "account",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 1
              }
            }
          ],
          "docs": [
            " Return ammo"
          ],
          "label": "get_missiles",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "Balance"
            ],
            "type": 7
          },
          "selector": "0x49bbed78"
        },
        {
          "args": [],
          "docs": [],
          "label": "get_gun_rights",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "bool"
            ],
            "type": 9
          },
          "selector": "0xf66010dc"
        },
        {
          "args": [],
          "docs": [],
          "label": "get_owns_nft_skin",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "bool"
            ],
            "type": 9
          },
          "selector": "0x8a9bbfea"
        },
        {
          "args": [
            {
              "label": "ammo_price",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 7
              }
            },
            {
              "label": "missile_price",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 7
              }
            }
          ],
          "docs": [],
          "label": "set_ammo_missile_prices",
          "mutates": true,
          "payable": false,
          "returnType": null,
          "selector": "0x7db5f410"
        }
      ]
    },
    "storage": {
      "struct": {
        "fields": [
          {
            "layout": {
              "cell": {
                "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
                "ty": 0
              }
            },
            "name": "points"
          },
          {
            "layout": {
              "cell": {
                "key": "0x0100000000000000000000000000000000000000000000000000000000000000",
                "ty": 1
              }
            },
            "name": "master_address"
          },
          {
            "layout": {
              "cell": {
                "key": "0x0200000000000000000000000000000000000000000000000000000000000000",
                "ty": 6
              }
            },
            "name": "ammo"
          },
          {
            "layout": {
              "cell": {
                "key": "0x0300000000000000000000000000000000000000000000000000000000000000",
                "ty": 7
              }
            },
            "name": "ammo_price"
          },
          {
            "layout": {
              "cell": {
                "key": "0x0400000000000000000000000000000000000000000000000000000000000000",
                "ty": 6
              }
            },
            "name": "missiles"
          },
          {
            "layout": {
              "cell": {
                "key": "0x0500000000000000000000000000000000000000000000000000000000000000",
                "ty": 7
              }
            },
            "name": "missiles_price"
          },
          {
            "layout": {
              "cell": {
                "key": "0x0600000000000000000000000000000000000000000000000000000000000000",
                "ty": 8
              }
            },
            "name": "gun_rights"
          },
          {
            "layout": {
              "cell": {
                "key": "0x0700000000000000000000000000000000000000000000000000000000000000",
                "ty": 8
              }
            },
            "name": "nft_skins"
          }
        ]
      }
    },
    "types": [
      {
        "id": 0,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "offset_key",
                  "type": 5,
                  "typeName": "Key"
                }
              ]
            }
          },
          "params": [
            {
              "name": "K",
              "type": 1
            },
            {
              "name": "V",
              "type": 4
            }
          ],
          "path": [
            "ink_storage",
            "lazy",
            "mapping",
            "Mapping"
          ]
        }
      },
      {
        "id": 1,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "type": 2,
                  "typeName": "[u8; 32]"
                }
              ]
            }
          },
          "path": [
            "ink_env",
            "types",
            "AccountId"
          ]
        }
      },
      {
        "id": 2,
        "type": {
          "def": {
            "array": {
              "len": 32,
              "type": 3
            }
          }
        }
      },
      {
        "id": 3,
        "type": {
          "def": {
            "primitive": "u8"
          }
        }
      },
      {
        "id": 4,
        "type": {
          "def": {
            "primitive": "u32"
          }
        }
      },
      {
        "id": 5,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "type": 2,
                  "typeName": "[u8; 32]"
                }
              ]
            }
          },
          "path": [
            "ink_primitives",
            "Key"
          ]
        }
      },
      {
        "id": 6,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "offset_key",
                  "type": 5,
                  "typeName": "Key"
                }
              ]
            }
          },
          "params": [
            {
              "name": "K",
              "type": 1
            },
            {
              "name": "V",
              "type": 7
            }
          ],
          "path": [
            "ink_storage",
            "lazy",
            "mapping",
            "Mapping"
          ]
        }
      },
      {
        "id": 7,
        "type": {
          "def": {
            "primitive": "u128"
          }
        }
      },
      {
        "id": 8,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "offset_key",
                  "type": 5,
                  "typeName": "Key"
                }
              ]
            }
          },
          "params": [
            {
              "name": "K",
              "type": 1
            },
            {
              "name": "V",
              "type": 9
            }
          ],
          "path": [
            "ink_storage",
            "lazy",
            "mapping",
            "Mapping"
          ]
        }
      },
      {
        "id": 9,
        "type": {
          "def": {
            "primitive": "bool"
          }
        }
      }
    ]
  }
}

const DECIMALS = 1000000000;

function Main() {
  const {api, apiState, apiError, keyringState } = useSubstrateState()
  const [page, setPage] = useState(false);
  const [store, setStore] = useState(false);
  const [time, setTime] = useState('');
  const [balance, setBalance] = useState('0');
  const [hourlyReward, setHourlyReward] = useState('');
  const [myTimePlayed, setMyTimePlayed] = useState('');
  const [alice, setAlice] = useState('');
  //const [connected, setConnected] = useState("No");
  const [mainAccount, setMainAccount] = useState('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty');
  const [rewardToExpect, setRewardToExpect] = useState('');
  const [amount, setAmount] = useState();
  const [contract, setContract] = useState();
  const [injector, setInjector] = useState();
  const [pubKey, setPubKey] = useState("5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty");
  const [pair, setPair] = useState();
  const [ammo, setAmmo] = useState();
  const [missiles, setMissiles] = useState();

  useEffect(() => {
    
    const interval = setInterval(()=>{
      updateInfo();
      
    },2500)
      
    return()=>clearInterval(interval)
  })
  
  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )


  const getChain = async() => {
     const scClient = createPolkadotJsScClient();
     const myChain = await scClient.addChain(myChainSpec);
     const api = await ApiPromise.create({ provider: myChain });
     await api.rpc.chain.subscribeNewHeads((lastHeader) => {
      console.log(lastHeader.hash);
     });


     const contractADDR = '5CB4SGYK6UjXm8ijhuBtTvv3ofy1pnuxzQLHDU5UiMZPP1gz';
   //  await web3Enable('VRMETA');
    // const allAccounts = await web3Accounts();
     const mainAddr = "5FsmSneL485oVhoa1Ye3VhDdo4z8Y5nugcP1i9po1j5FE7UN";
   

     // Retrieve the last timestamp
     const now = await api.query.timestamp.now();
     console.log(now);
 
     // Retrieve the account balance & nonce via the system module
     const balance  = await api.query.system.account(mainAddr);
     let readableBalance = balance.data.free.toNumber();
     
 
    // const contract = new ContractPromise(api, abi, contractADDR);
    // const timePlayed = await (await contract.query.getTimePlayed(mainAddr, {value: 0, gasLimit: -1})).output.toNumber();
  
   //  let readableTimePlayed = (Math.round((timePlayed / 60000) * 100) / 100).toFixed(2);
    
     const callValue = await (await contract.query.getRewardHourly(mainAddr, {value: 0, gasLimit: -1})).output.toJSON();
     setHourlyReward(callValue);
     setTime(now.toNumber());
     setBalance(readableBalance / DECIMALS);
  //   setAlice(alice);
     setMainAccount(mainAddr);
    // setApi(api);
    // setContract(contract);
     setInjector(injector);
    // setMyTimePlayed(readableTimePlayed);
    // setRewardToExpect((Math.round((timePlayed / 3600000) * 100) / 100).toFixed(2)); //3,600,000 seconds in an hour in blocktime.
    
  }
  function handleInputChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setAmount(value);
  }

  const updateInfo = async() => {
// we are now informed that the user has at least one extension and that we
// will be able to show and use accounts
// Import
    
 // await web3Enable('VRMETA');
  //const allAccounts = await web3Accounts();
   // const mainAddr = pubKey;
   // const scClient = createPolkadotJsScClient();
  //  const myChain = await scClient.addChain(myChainSpec);
   // const api = await ApiPromise.create({ provider: myChain });
    //Retrieve last block timestamp, account nonce & balances
    const now = (await api.query.timestamp.now()).toNumber().toLocaleString('en-US');;
    const { data: balance } = await api.query.system.account(pubKey);

    const chain = await api.rpc.system.chain();

// Retrieve the latest header
  const lastHeader = await api.rpc.chain.getHeader();

  console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
   // const contractADDR = '5Chdhpc28DKm1YjCqjDgrcSogK8fQErUiZFDCFKcDKdRnAd7';
  
   

    const contract = new ContractPromise(api, abi, contractADDR);
    let ammo_bal = await (await contract.query.getAmmo(pair.address, {value: 0, gasLimit: -1}, pair.address)).output.toJSON();
    let missile_bal = await (await contract.query.getMissiles(pair.address, {value: 0, gasLimit: -1}, pair.address)).output.toJSON();
  
    setAmmo(ammo_bal.toLocaleString('en-US'));
    setMissiles(missile_bal.toLocaleString('en-US'));
   // const timePlayed = await (await contract.query.getTimePlayed(mainAddr, {value: 0, gasLimit: -1})).output;
  
    //let readableTimePlayed = (Math.round((timePlayed / 60000) * 100) / 100).toFixed(2);
   
   // const callValue = await (await contract.query.getRewardHourly(mainAddr, {value: 0, gasLimit: -1})).output.toJSON();
   
   // setHourlyReward(callValue);
    setTime(now);
  
    //setMainAccount(mainAddr);
      let realBal = (balance.free).toNumber();
     // console.log(realBal.free.toNumber());
     const realBalFixed = (realBal / DECIMALS).toLocaleString('en-US');
  
      setBalance(realBalFixed);

   // setMyTimePlayed(readableTimePlayed);
   // setRewardToExpect((Math.round((timePlayed / 3600000) * 100) / 100).toFixed(2)); //3,600,000 seconds in an hour in blocktime.
  
  }

  const connectMeta = async() => {
    ///const contractADDR = '5CB4SGYK6UjXm8ijhuBtTvv3ofy1pnuxzQLHDU5UiMZPP1gz';

    // We will use these values for the execution
    const value = 0; // only useful on isPayable messages

    ///const contract = new ContractPromise(api, abi, contractADDR);
    const injector = await web3FromAddress(mainAccount);
     await api.tx.timestake
    .connect()
    .signAndSend(mainAccount, {signer: mainAccount}, (result) => {
      if (result.status.isInBlock) {
        console.log('in a block');
      } else if (result.status.isFinalized) {
        console.log('finalized');
      }
    });
  }

  const disconnect = async() => {
    ///const contractADDR = '5CB4SGYK6UjXm8ijhuBtTvv3ofy1pnuxzQLHDU5UiMZPP1gz';
    ///const contract = new ContractPromise(api, abi, contractADDR);

    // We will use these values for the execution
    const value = 0; // only useful on isPayable messages

    //const contract = new ContractPromise(api, abi, contractADDR);
    const injector = await web3FromAddress(mainAccount);
     await api.tx.timestake
    .disconnect()
    .signAndSend(mainAccount, {signer: injector.signer}, (result) => {
      if (result.status.isInBlock) {
        console.log('in a block');
      } else if (result.status.isFinalized) {
        console.log('finalized');
        Swal.fire({
          title: 'Disconnected from the Metaverse:',
          text: 'You have mined '+rewardToExpect+" VRMETA.  Come again soon.",
          color: 'black',
        })
        
      }
    });
    
  }

  const buyAmmo = async() => {
    const contract = new ContractPromise(api, abi, contractADDR);
    ///const value = amount; // only useful on isPayable messages
    //const contract = new ContractPromise(api, abi, contractADDR);
    ///const injector = await web3FromAddress(pubKey);
     await contract.tx
    .buyAmmo({ value: amount * DECIMALS, gasLimit: -1 })
    .signAndSend(pair, (result) => {
      if (result.status.isInBlock) {
        console.log('in a block');
      } else if (result.status.isFinalized) {
        console.log('finalized');
      }
  });

}

const buyMissiles = async() => {
  const contract = new ContractPromise(api, abi, contractADDR);
  ///const value = amount; // only useful on isPayable messages
  //const contract = new ContractPromise(api, abi, contractADDR);
  ///const injector = await web3FromAddress(pubKey);
   await contract.tx
  .buyMissiles({ value: amount * 10 * DECIMALS, gasLimit: -1 })
  .signAndSend(pair, (result) => {
    if (result.status.isInBlock) {
      console.log('in a block');
    } else if (result.status.isFinalized) {
      console.log('finalized');
    }
});

}

const faucet = async() => {
  const contract = new ContractPromise(api, abi, contractADDR);
    ///const value = amount; // only useful on isPayable messages
    //const contract = new ContractPromise(api, abi, contractADDR);
    ///const injector = await web3FromAddress(pubKey);
     await contract.tx
    .giveTwoHundredVrmeta({ gasLimit: -1 })
    .signAndSend(pair, (result) => {
      if (result.status.isInBlock) {
        console.log('in a block');
      } else if (result.status.isFinalized) {
        console.log('finalized');
      }
  });
}

function generateMnemonic() {
   

  const mnemonic = mnemonicGenerate(12);

    // Validate the mnemic string that was generated
  const isValidMnemonic = mnemonicValidate(mnemonic);

  console.log(`isValidMnemonic: ${isValidMnemonic}`);

// Create valid Substrate-compatible seed from mnemonic
  const seedUser = mnemonicToMiniSecret(mnemonic);
  const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });

// Generate new public/secret keypair for Alice from the supplied seed
   const { publicKey, secretKey } = sr25519PairFromSeed(seedUser);
  //const publicKey1 = keyring.encodeAddress(publicKey);
  const secretKey1 = secretKey;

//const pair = keyring.createFromUri(mnemonic);
const pair = keyring.addFromUri('//Alice');
const publicKey1 = keyring.encodeAddress(pair.address);



setPubKey(publicKey1);
setPair(pair);

Swal.fire({
title: 'Seed Phrase:',
text: mnemonic ,
color: 'black',
})
}

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  const handlePage = () => {
    if(page == false) {
      setPage(true);
      console.log(api.consts.balances.existentialDeposit.toNumber());
      updateInfo();
    } else {
      setPage(false);
      updateInfo();
    }
  }

  const handleStore = () => {
    if(store == false) {
      setStore(true);
    } else {
      setStore(false);
    }
  }

  const setToMain = async() => {
    await web3Enable('VRMETA');
    const allAccounts = await web3Accounts();
    setMainAccount(allAccounts[0].address);
  }

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

if (!page) {

    if (store) {
      return (
        <div className='blocknumber'ref={contextRef}>
        <BlockNumber />
        <div>
            <button className='vrbutton2' onClick={generateMnemonic}>New Account</button>
            <p className='address'>Account: <br></br>{pubKey}</p>
            <button onClick={handleStore} >Store</button>
        </div>
       </div>
      )
    } else {
      return (
        <div className='blocknumber'ref={contextRef}>
        <h2>Star Alliance Store</h2>
        <p>VRMETA: {balance}<br></br>
          Ammo: {ammo} <br></br>
          Missiles: {missiles}</p>
          <div className='column'>
            <div className='row'>
            <input type='text' name='amount' value={amount} onChange={handleInputChange}/>
        <button  onClick={buyAmmo}> Buy Ammo (1 VRMETA) </button>
        <button  onClick={buyMissiles}> Buy Missiles (10 VRMETA) </button>
            </div>
        </div>
        <div className='row'>
        <button onClick={faucet}> Get 200 VRMETA</button>
        <button className='vrbutton2' onClick={handleStore} >Account</button>
        </div>
      
       </div>
        )
    }

} else {
  return (
    <div className='vrmeta'>
      <button onClick={handlePage} >Page</button>
    <h1 className='title'>VRMETA Chain</h1>
    <Container className='container'>
      <div className='info'>
        <div className='row'>
        <div className='column stats'>
          <h5>Logged in: {mainAccount}</h5>
         <p>VRMETA balance: {balance}</p>
         <p>VRMETA Timestamp: {time}</p>
         <p>Reward Rate:  {hourlyReward / 1000000000} VRMETA per hour</p>
         <p>Time Played: {myTimePlayed} minutes</p>
         <p>Mining Reward: {rewardToExpect} VRMETA</p>
       
          </div>
      
      <div className='column'>
      <BlockNumber/>
      <Generate />
        </div>
        </div>
      
      <button className='vrbutton' onClick={connectMeta} >Connect to the Metaverse</button>
      <button className='vrbutton' onClick={disconnect} >Disconnect from the Metaverse</button>
      </div>
     
    <Grid stackable columns="equal">
      <Grid.Row stretched>    
        
      </Grid.Row>
      <Grid.Row>
        <Transfer />
        <Interactor />
      </Grid.Row>
      <Grid.Row>
        <Events />
      </Grid.Row>
    </Grid>
  </Container>
  </div>
  )
}
};

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
