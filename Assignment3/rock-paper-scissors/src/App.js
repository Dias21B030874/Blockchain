import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractAddress, abi } from './config';
import Game from './Game';  // Импортируем компонент Game
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [fundAmount, setFundAmount] = useState("");
  const [gameId, setGameId] = useState("");
  const [move, setMove] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [secondAccount, setSecondAccount] = useState(null);

  // Инициализация Web3 и контракта
  useEffect(() => {
    if (web3 && account) {
      const instance = new web3.eth.Contract(abi, contractAddress);
      setContract(instance);
    }
  }, [web3, account]);

  // Подключение кошелька
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setIsConnected(true);
        alert(`Wallet connected: ${accounts[0]}`);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Подключение второго кошелька
  const connectSecondWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();
        setSecondAccount(accounts[1]);
        alert(`Second Wallet connected: ${accounts[1]}`);
      } catch (error) {
        console.error("Error connecting second wallet:", error);
        alert("Failed to connect second wallet.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Отключение кошелька
  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setContract(null);
    setIsConnected(false);
    alert("Wallet disconnected.");
  };

  // Функция для пополнения контракта
  const fundContract = async () => {
    if (contract && fundAmount) {
      try {
        const amountInWei = web3.utils.toWei(fundAmount, "ether");
        const tx = await contract.methods.fundContract().send({ from: account, value: amountInWei });
        await tx.wait();
        alert(`Contract funded with ${fundAmount} ETH successfully!`);
        setFundAmount("");
      } catch (error) {
        console.error("Error funding contract:", error.message);
        alert("Failed to fund contract.");
      }
    } else {
      alert("Enter a valid amount to fund.");
    }
  };

  // Присоединение к игре
  const joinGame = async () => {
    if (contract && gameId && move && secondAccount) {
      try {
        const tx = await contract.methods.joinGame(gameId, move).send({ from: secondAccount });
        await tx.wait();
        alert(`Joined game ${gameId} successfully with move ${move}!`);
        setGameId("");
        setMove("");
      } catch (error) {
        console.error("Error joining game:", error.message);
        alert("Failed to join game.");
      }
    } else {
      alert("Enter valid Game ID and Move.");
    }
  };

  // Игра с компьютером
  const playAgainstComputer = async (selectedMove) => {
    if (contract) {
      try {
        if (![1, 2, 3].includes(selectedMove)) {
          alert("Invalid move selected.");
          return;
        }

        const tx = await contract.methods.playAgainstComputer(selectedMove).send({
          from: account,
          value: web3.utils.toWei("0.01", "ether"),
        });
        await tx.wait();
        alert(`Played against computer with move: ${["Rock", "Paper", "Scissors"][selectedMove - 1]}`);
      } catch (error) {
        console.error("Error playing against computer:", error.message);
        alert("Failed to play against computer.");
      }
    }
  };

  // Внесение хода в игру
  const playMove = async (selectedMove) => {
    if (contract) {
      try {
        const tx = await contract.methods.startGame(selectedMove).send({ from: account });
        await tx.wait();
        alert(`You played: ${["Rock", "Paper", "Scissors"][selectedMove - 1]}`);
      } catch (error) {
        console.error("Error making move:", error.message);
        alert("Failed to make move.");
      }
    }
  };

  // Запуск игры с токенами
  const startGameToken = async () => {
    if (contract && move && fundAmount) {
      try {
        const amountInWei = web3.utils.toWei(fundAmount, "ether");
        const tx = await contract.methods.startGameToken(move).send({
          from: account,
          value: amountInWei,
        });
        await tx.wait();
        alert("Started game with tokens successfully!");
      } catch (error) {
        console.error("Error starting game with tokens:", error.message);
        alert("Failed to start game with tokens.");
      }
    } else {
      alert("Enter a valid move and amount.");
    }
  };

  // Вывод средств
  const withdraw = async () => {
    if (contract) {
      try {
        const tx = await contract.methods.withdraw().send({ from: account });
        await tx.wait();
        alert("Withdrawal successful!");
      } catch (error) {
        console.error("Error withdrawing funds:", error.message);
        alert("Failed to withdraw funds.");
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rock Paper Scissors</h1>
        <Game
          isConnected={isConnected}
          account={account}
          fundAmount={fundAmount}
          gameId={gameId}
          move={move}
          secondAccount={secondAccount}
          connectWallet={connectWallet}
          connectSecondWallet={connectSecondWallet}
          disconnectWallet={disconnectWallet}
          setFundAmount={setFundAmount}
          setGameId={setGameId}
          setMove={setMove}
          fundContract={fundContract}
          joinGame={joinGame}
          playAgainstComputer={playAgainstComputer}
          playMove={playMove}
          startGameToken={startGameToken}
          withdraw={withdraw}
        />
      </header>
    </div>
  );
}

export default App;
