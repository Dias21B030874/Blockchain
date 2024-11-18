import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractAddress, abi } from "./config";
import TransactionHistory from "./TransactionHistory";
import GameControls from "./GameControls";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [contractBalance, setContractBalance] = useState(0);
  const [gameId, setGameId] = useState(null);
  const [lastGameResult, setLastGameResult] = useState(null);

  useEffect(() => {
    if (web3 && account) {
      const instance = new web3.eth.Contract(abi, contractAddress);
      setContract(instance);
      updateContractBalance();
    }
  }, [web3, account]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  const updateContractBalance = async () => {
    if (!web3 || !contract) return;
    const balance = await web3.eth.getBalance(contractAddress);
    setContractBalance(web3.utils.fromWei(balance, "ether"));
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setIsConnected(true);
        alert(`Wallet connected: ${accounts[0]}`);
      } catch (error) {
        console.error(error);
        alert("Failed to connect wallet.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setContract(null);
    setIsConnected(false);
  };

  const addTransactionToHistory = (transactionDetails) => {
    setTransactionHistory((prevHistory) => [
      ...prevHistory,
      { ...transactionDetails, timestamp: new Date().toLocaleString() },
    ]);
  };

  const getGameData = async (gameId) => {
    if (!contract || !gameId) return;
    try {
      const gameData = await contract.methods.games(gameId).call();
      setLastGameResult(gameData);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch game data.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rock Paper Scissors Game</h1>
        {isConnected ? (
          <button onClick={disconnectWallet} className="btn">
            Disconnect Wallet
          </button>
        ) : (
          <button onClick={connectWallet} className="btn">
            Connect Wallet
          </button>
        )}

        {loading && <p>Loading...</p>}

        <p>Contract Balance: {contractBalance} BNB</p>
        <p>Connected Account: {account}</p>

        {lastGameResult && (
          <div>
            <h3>Last Game Details:</h3>
            <p>Game ID: {gameId}</p>
            <p>Player 1: {lastGameResult.player1}</p>
            <p>Player 2: {lastGameResult.player2}</p>
            <p>Winner: {lastGameResult.winner}</p>
            <p>Finished: {lastGameResult.finished ? "Yes" : "No"}</p>
          </div>
        )}

        <GameControls
          web3={web3}
          account={account}
          contract={contract}
          addTransactionToHistory={addTransactionToHistory}
          updateContractBalance={updateContractBalance}
          gameId={gameId}
          setGameId={setGameId}
          setLastGameResult={setLastGameResult}
          getGameData={getGameData}
          setLoading={setLoading}
        />

        <TransactionHistory history={transactionHistory} />
      </header>
    </div>
  );
}

export default App;
