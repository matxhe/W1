// import logo from './logo.svg';
import { useState, React } from 'react';
import Tabs from "./components/Tabs";
import './App.css';
import { ethers } from 'ethers';
import GGToken from './artifacts/contracts/GGToken.sol/GGToken.json';
import Vault from './artifacts/contracts/Vault.sol/Vault.json';
import GGNFT from './artifacts/contracts/GGNFT.sol/GGNFT.json';

const tokenContractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
const vaultContractAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";
const erc721ContractAddress = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";


function App() {

  let [balance,setBalance] = useState(0);
  let [currentAccountBalance,setCurrentAccountBalance] = useState(0);
  let [strTokens,setTokens] = useState(0);
  let [currentAccount,setCurrentAccount] = useState('');

  let [strNFTId,setNFTId] = useState(1);

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

  // setInterval(function (){
  //   showBalance();
  //   getAccountTokenBalance();
  // }, 3000);


  async function mintGGNFT(){
    if(typeof window.ethereum !== 'undefined'){
      initAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        
        const nftContract = new ethers.Contract(erc721ContractAddress, GGNFT.abi, signer);
        const trx = await nftContract.mintOneNFT(strNFTId);
        await trx.wait();
        console.log('mint trancation:', trx);
      } catch (error) {
        console.log('error:',error);
      }
      
    }
  }

  async function transferEventListener(){
    if(typeof window.ethereum !== 'undefined'){


      try {
        
        initAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const owner = provider.getSigner();
        const nftContract = new ethers.Contract(erc721ContractAddress, GGNFT.abi, owner);
        const filter = nftContract.filters.Transfer();
        // let filter = nftContract.filters.Transfer(owner.address)
        // let filter = nftContract.filters.Transfer(null, owner.address)

        // logsFrom = await erc20.queryFilter(filter, -10, "latest");

        // filter = {
        //     address: ERC20Addr.address,
        //     topics: [
        //         ethers.utils.id("Transfer(address,address,uint256)")
        //     ]
        // }

        nftContract.provider.on(filter, (event) => {

              console.log(event)

              // const decodedEvent = myerc20.interface.decodeEventLog(
              //     "Transfer", //
              //     event.data,
              //     event.topics
              // );
              // console.log(decodedEvent);

              parseTransferEvent(event);
          });


      } catch (error) {
        console.log('error:',error);
      }
    }
  }

  async function parseTransferEvent(event) {
  
      const TransferEvent = new ethers.utils.Interface(["event Transfer(address indexed from,address indexed to,uint256 indexed tokenId)"]);
      let decodedData = TransferEvent.parseLog(event);
      console.log("from:" + decodedData.args.from);
      console.log("to:" + decodedData.args.to);
      console.log("tokenId:" + decodedData.args.tokenId.toString());
  }

  return (
    <div className="App">
      <Tabs>
        <div label="ERC20">
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
        <div label="ERC721">
            <header className="App-header">
              <p>
                GG NFT(ERC721) demo 
              </p>
              <p>
                Current Account Address:{currentAccount} 
              </p>
              <label>Please input NFT Id want to Mint:
              
              <input id='nftInput' placeholder="0" onChange={e => setNFTId(e.target.value)} value={strNFTId}></input>
              </label>
              <button onClick={mintGGNFT}>Mint new GG NFT</button><br/>

              <button onClick={transferEventListener}> Activate Transfer Event Listener</button>
            </header>
        </div>
        {/* <div label="Sarcosuchus">
          Nothing to see here, this tab is <em>extinct</em>!
        </div> */}
     </Tabs>

    </div>
  );
}

export default App;
