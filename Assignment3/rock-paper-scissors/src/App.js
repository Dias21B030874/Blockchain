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
  const [totalFee, setTotalFee] = useState(0); // Стейт для отображения общей суммы
  const [transactionHistory, setTransactionHistory] = useState([]); // История транзакций

  const userBackground = "https://catherineasquithgallery.com/uploads/posts/2021-02/1614344313_56-p-svetlie-anime-foni-73.jpg";
  const userCover = "https://images8.alphacoders.com/434/thumb-1920-434443.jpg";

  const appStyles = {
    background: `url(${userBackground}) no-repeat center center fixed`,
    backgroundSize: "cover",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  };

  const profileCoverStyle = {
    background: `url(${userCover}) no-repeat center center`,
    backgroundSize: "cover",
    height: "300px",
    borderRadius: "15px",
    marginBottom: "20px",
  };

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

  // Функция для расчета общей стоимости (сумма + газ)
  const calculateTotalFee = async (amountInWei, method) => {
    const estimateGas = await method.estimateGas({ from: account, value: amountInWei });
    const gasPrice = await web3.eth.getGasPrice();
    
    const gasFee = web3.utils.toBN(estimateGas).mul(web3.utils.toBN(gasPrice));
    const total = web3.utils.toBN(amountInWei).add(gasFee);

    return web3.utils.fromWei(total, "ether"); // возвращаем в эфире для отображения
  };

  // Функция для пополнения контракта
  const fundContract = async () => {
    if (contract && fundAmount) {
      try {
        const amountInWei = web3.utils.toWei(fundAmount, "ether");

        // Рассчитаем общую стоимость (сумма + газ)
        const total = await calculateTotalFee(amountInWei, contract.methods.fundContract);
        setTotalFee(total);

        // Проверим баланс на счете, чтобы убедиться, что достаточно средств для транзакции
        const balance = await web3.eth.getBalance(account);
        if (web3.utils.toBN(balance).lt(web3.utils.toBN(total))) {
          alert("Недостаточно средств для транзакции и платы за газ.");
          return;
        }

        const tx = await contract.methods.fundContract().send({
          from: account,
          value: amountInWei,
          gas: await contract.methods.fundContract().estimateGas({ from: account, value: amountInWei }),
          gasPrice: web3.utils.toBN(await web3.eth.getGasPrice()),
        });

        await tx.wait();

        // Добавляем транзакцию в историю
        addTransactionToHistory({
          type: "Fund Contract",
          amount: fundAmount,
          status: "Success",
          transactionHash: tx.transactionHash,
        });

        alert(`Контракт успешно пополнен на ${fundAmount} ETH!`);
        setFundAmount("");
      } catch (error) {
        console.error("Ошибка при пополнении контракта:", error.message);
        alert("Не удалось пополнить контракт.");
      }
    } else {
      alert("Введите правильную сумму для пополнения.");
    }
  };

  // Функция для добавления транзакции в историю
  const addTransactionToHistory = (transactionDetails) => {
    setTransactionHistory((prevHistory) => [
      ...prevHistory,
      { ...transactionDetails, timestamp: new Date().toLocaleString() },
    ]);
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

        // Добавляем транзакцию в историю
        addTransactionToHistory({
          type: "Join Game",
          amount: 0,
          status: "Success",
          transactionHash: tx.transactionHash,
        });
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
          value: web3.utils.toWei("0.001", "ether"),
        });
        await tx.wait();
        alert(`Played against computer with move: ${["Rock", "Paper", "Scissors"][selectedMove - 1]}`);

        // Добавляем транзакцию в историю
        addTransactionToHistory({
          type: "Play Against Computer",
          amount: "0.001 ETH",
          status: "Success",
          transactionHash: tx.transactionHash,
        });
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

        // Добавляем транзакцию в историю
        addTransactionToHistory({
          type: "Play Move",
          amount: 0,
          status: "Success",
          transactionHash: tx.transactionHash,
        });
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

        // Рассчитаем общую стоимость (сумма + газ)
        const total = await calculateTotalFee(amountInWei, contract.methods.startGameToken);
        setTotalFee(total);

        const tx = await contract.methods.startGameToken(move).send({
          from: account,
          value: amountInWei,
        });
        await tx.wait();
        alert("Started game with tokens successfully!");

        // Добавляем транзакцию в историю
        addTransactionToHistory({
          type: "Start Game with Tokens",
          amount: fundAmount,
          status: "Success",
          transactionHash: tx.transactionHash,
        });
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

        // Добавляем транзакцию в историю
        addTransactionToHistory({
          type: "Withdraw",
          amount: 0,
          status: "Success",
          transactionHash: tx.transactionHash,
        });
      } catch (error) {
        console.error("Error withdrawing funds:", error.message);
        alert("Failed to withdraw funds.");
      }
    }
  };

  // Отображение истории транзакций
  const TransactionHistory = ({ history }) => {
    return (
      <div>
        <h3>Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {history.map((txn, index) => (
              <tr key={index}>
                <td>{txn.type}</td>
                <td>{txn.amount} ETH</td>
                <td>{txn.status}</td>
                <td>{txn.timestamp}</td>
                <td>
                  <a
                    href={`https://testnet.bscscan.com/tx/${txn.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {txn.transactionHash}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="App" style={appStyles}>
      <header className="App-header" style={profileCoverStyle}> {}
	  <h1>Rock Paper Scissors Game</h1>
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
          totalFee={totalFee}
        />
        <TransactionHistory history={transactionHistory} />
      </header>
    </div>
  );
}

export default App;
