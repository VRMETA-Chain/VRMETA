import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";



const getWeb3dos = async () => {
        
const providerOptions = {
 
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "3a32d121ce824fc6be26b402c7342378",
          local: `http://127.0.0.1:8545/`,
          bsc: "https://data-seed-prebsc-1-s1.binance.org:8545/" // required
        }
      }
};

const web3Modal = new Web3Modal({
  network: "bsc", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

const provider = await web3Modal.connect();
const web3Provider = new providers.Web3Provider(provider);
const web3 = new Web3(provider);
return web3;
}

export default getWeb3dos;