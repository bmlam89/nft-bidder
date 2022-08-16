import React, { useEffect, useState, useContext, useCallback } from 'react';
import Web3 from 'web3';
import { cyrb53 } from '../utils/helpers';
import axios from 'axios';
const { ethereum } = window;
let web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/6f81495740124909a660eaa5f72961d7'));

const UserContext = React.createContext();

export const useUser = () => {
  return useContext(UserContext);
}

export const UserProvider = (props) => {
  const [currentAccount, setCurrentAccount] = useState({ address: false, ethBalance: false, wEthBalance: false, watchlist: {} });
  const [collectionChoices, setCollectionChoices] = useState(false);
  const [pendingConfigs, setPendingConfigs] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [main, setMain] = useState('');
  const [proxy, setProxy] = useState('');
  const [proxyPK, setProxyPK] = useState('');
  const [activeSweepers, setActiveSweepers] = useState(false);
  const [registeredSweeperWallet, setRegisteredSweeperWallet] = useState(false);

  

  const addCollectionToWatchlist = (updatedAccount) => {
    const hashAddress = cyrb53( currentAccount.address, currentAccount.address.slice(-4));
    localStorage.setItem(hashAddress, JSON.stringify(updatedAccount.watchlist));
    setCurrentAccount(updatedAccount);
  };

  const isConnected = async () => {
    try {
      //if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        const address = accounts[0];
        const ethBalance = Number(web3.utils.fromWei((await web3.eth.getBalance(address))+'','ether')).toFixed(3);
        const wEthABI = [ {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        }]
        const wEthAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        const wEthContract = new web3.eth.Contract(wEthABI, wEthAddress);
        let wEthBalance = await wEthContract.methods.balanceOf(address).call();
        wEthBalance = Web3.utils.fromWei(wEthBalance+'','ether');
        const hashAddress = cyrb53( address, address.slice(-4));
        const watchlist = JSON.parse(localStorage.getItem(hashAddress));

        if(watchlist) Object.values(watchlist).sort((c1,c2) => c1.floor_price - c2.floor_price);

        setCurrentAccount( { address: address, ethBalance: ethBalance, wEthBalance: wEthBalance, watchlist: watchlist ? watchlist : {} });
      } else {
        console.log("No accounts found");
        setCurrentAccount( { address: false, ethBalance: false, watchlist: {} } );
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const connectWallet = async () => {
    try {
      //if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
      setCurrentAccount( { address: accounts[0], ethBalance: '', watchlist: {} } );
      window.location.reload();

    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    isConnected();
  }, []);

  return (
    <UserContext.Provider
      value={{
        isConnected,
        currentAccount,
        setCurrentAccount,
        connectWallet,
        addCollectionToWatchlist,
        collectionChoices,
        setCollectionChoices,
        pendingConfigs,
        setPendingConfigs,
        pendingCount,
        setPendingCount,
        main,
        setMain,
        proxy,
        setProxy,
        proxyPK,
        setProxyPK,
        activeSweepers,
        setActiveSweepers,
        registeredSweeperWallet,
        setRegisteredSweeperWallet,
      }}
    >
      { props.children }
    </UserContext.Provider>
  );
};