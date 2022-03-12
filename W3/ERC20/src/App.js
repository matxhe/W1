// import logo from './logo.svg';
import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import GGToken from './artifacts/contracts/GGToken.sol/GGToken.json';
import Vault from './artifacts/contracts/Vault.sol/Vault.json';

const tokenContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const vaultContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";


function App() {

  let [balance,setBalance] = useState(0);
  let [currentAccountBalance,setCurrentAccountBalance] = useState(0);
  let [strTokens,setTokens] = useState(0);
  let [currentAccount,setCurrentAccount] = useState('');

  async function initAccount(){
    let account = await window.ethereum.request({method:'eth_requestAccounts'});
    setCurrentAccount(account[0]);
  }


  async function mint(){
    if(typeof window.ethereum !== 'undefined'){
      initAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        
        const tokens = ethers.utils.parseUnits(strTokens,18);
        const tokenContract = new ethers.Contract(tokenContractAddress, GGToken.abi, signer);
        const trx = await tokenContract.mint(tokens);
        await trx.wait();
        console.log('mint trancation:', trx);
      } catch (error) {
        console.log('error:',error);
      }
      
    }
  }

  async function approve(){
    if(typeof window.ethereum !== 'undefined'){
      initAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(tokenContractAddress, GGToken.abi, signer);
      const tokens = ethers.utils.parseUnits(strTokens,18);
      const trx = await tokenContract.approve(vaultContractAddress,tokens);
      await trx.wait();
      
    }
  }

  async function deposit(){
    if(typeof window.ethereum !== 'undefined'){
      initAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const vaultContract = new ethers.Contract(vaultContractAddress, Vault.abi, signer);


      try {
        
        const tokens = ethers.utils.parseUnits(strTokens,18);
        const trx = await vaultContract.deposit(tokens,{
          gasLimit:2100000
        });
        await trx.wait();
        console.log('deposit trancation:', trx);
      } catch (error) {
        console.log('error:',error);
      }
      
    }
  }

  async function withDraw(){
    if(typeof window.ethereum !== 'undefined'){
      initAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const vaultContract = new ethers.Contract(vaultContractAddress, Vault.abi, signer);


      try {
        
        const tokens = ethers.utils.parseUnits(strTokens,18);
        const trx = await vaultContract.withdraw(tokens,{
          gasLimit:2100000
        });
        await trx.wait();
        console.log('withDraw trancation:', trx);
      } catch (error) {
        console.log('error:',error);
      }
      
    }
  }

  async function showBalance(){
    if(typeof window.ethereum !== 'undefined'){
      initAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const vaultContract = new ethers.Contract(vaultContractAddress, Vault.abi, signer);
      try {
        const data = await vaultContract.getBalance();
        setBalance(ethers.utils.formatUnits(data));
        console.log('data:', data);
      } catch (error) {
        console.log('error:',error);
      }
    }
  }

  
  async function getAccountTokenBalance(){
    if(typeof window.ethereum !== 'undefined'){
      initAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      try {
        
        const tokenContract = new ethers.Contract(tokenContractAddress, GGToken.abi, provider);
        console.log('currentAccount is:', currentAccount);
        const trx = await tokenContract.balanceOf(currentAccount);
        console.log('balanceOf result:', trx);
        currentAccountBalance = ethers.utils.formatUnits(trx, 18);
        console.log('getAccountTokenBalance trancation result:', currentAccountBalance);
        setCurrentAccountBalance(currentAccountBalance);
      } catch (error) {
        console.log('error:',error);
      }
      
    }
  }

  setInterval(function (){
    showBalance();
    getAccountTokenBalance();
  }, 1000);


  return (
    <div className="App">
      <header className="App-header">
        <p>
          GG(ERC20) Dapp demo 
        </p>
        <p>
          Current Account Address:{currentAccount} 
        </p>
        <label>Please input tokens want to Mint/Approve/Deposit/WithDraw:
        
        <input id='tokenInput' placeholder="0" onChange={e => setTokens(e.target.value)} value={strTokens}></input>
        </label>
        <button onClick={mint}>Mint Tokens</button>
        <button onClick={approve}>Approve</button>
        <button onClick={deposit}>Deposit</button>
        <button onClick={withDraw}>WithDraw</button>
        <br/><br/>

        <button onClick={showBalance}>Show Balance</button>
        <label>GG Token in Vault Balance: {balance}</label><br/><br/>

        <button onClick={getAccountTokenBalance}>Check Wallet Balance</button>
        <label>GG Token in MetaMask Balance: {currentAccountBalance}</label><br/><br/>
        <a
          className="App-link"
          href={"https://ropsten.etherscan.io/address/" + tokenContractAddress}  target="_blank"
          rel="noopener noreferrer"
        >
          view on block explorer
        </a>
      </header>
    </div>
  );
}

export default App;
