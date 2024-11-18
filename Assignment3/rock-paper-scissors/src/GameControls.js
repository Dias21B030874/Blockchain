import React, { useState } from "react";

const GameControls = ({
  web3,
  account,
  contract,
  addTransactionToHistory,
  updateContractBalance,
  gameId,
  setGameId,
  setLastGameResult,
  getGameData,
  setLoading,
}) => {
  const [move, setMove] = useState("");
  const [joinMove, setJoinMove] = useState("");
  const [joinGameId, setJoinGameId] = useState("");
  const [fundAmount, setFundAmount] = useState("");

  const createGame = async () => {
    if (move === "" || !contract || !account) return alert("Select a valid move!");
    try {
      setLoading(true);
      const selectedMove = parseInt(move);

      const tx = await contract.methods.startGame(selectedMove).send({
        from: account,
        value: web3.utils.toWei("0.0001", "ether"),
      });

      addTransactionToHistory({
        type: "Create Game",
        status: "Success",
        transactionHash: tx.transactionHash,
      });

      alert("Game created successfully!");

      // Get the new gameIdCounter from the contract
      const gameIdCounter = await contract.methods.gameIdCounter().call();
      setGameId(gameIdCounter);

      // Fetch and display game data
      await getGameData(gameIdCounter);
    } catch (error) {
      console.error(error);
      alert("Failed to create game.");
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async () => {
    if (!joinGameId || joinMove === "" || !contract || !account)
      return alert("Select a valid move and game!");
    try {
      setLoading(true);

      const tx = await contract.methods
        .joinGame(joinGameId, parseInt(joinMove))
        .send({
          from: account,
          value: web3.utils.toWei("0.0001", "ether"),
        });

      addTransactionToHistory({
        type: "Join Game",
        status: "Success",
        transactionHash: tx.transactionHash,
      });

      alert("Joined the game successfully!");

      // Fetch and display game data
      await getGameData(joinGameId);
      setGameId(joinGameId);
    } catch (error) {
      console.error(error);
      alert("Failed to join the game.");
    } finally {
      setLoading(false);
    }
  };

  const playAgainstComputer = async () => {
    if (move === "" || !contract || !account) return alert("Select a valid move!");
    try {
      setLoading(true);
      const selectedMove = parseInt(move);

      const tx = await contract.methods.playAgainstComputer(selectedMove).send({
        from: account,
        value: web3.utils.toWei("0.0001", "ether"),
      });

      addTransactionToHistory({
        type: "Play Against Computer",
        status: "Success",
        transactionHash: tx.transactionHash,
      });

      alert("You played against the computer successfully!");

      // Get the new gameIdCounter from the contract
      const gameIdCounter = await contract.methods.gameIdCounter().call();
      setGameId(gameIdCounter);

      // Fetch and display game data
      await getGameData(gameIdCounter);
    } catch (error) {
      console.error(error);
      alert("Failed to play against the computer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-controls">
      <div>
        <h3>Create Game</h3>
        <select value={move} onChange={(e) => setMove(e.target.value)}>
          <option value="">Select Move</option>
          <option value="0">Rock</option>
          <option value="1">Paper</option>
          <option value="2">Scissors</option>
        </select>
        <button onClick={createGame} className="btn">
          Create Game
        </button>
      </div>

      <div>
        <h3>Join Game</h3>
        <input
          type="number"
          value={joinGameId}
          onChange={(e) => setJoinGameId(e.target.value)}
          placeholder="Enter Game ID"
        />
        <select value={joinMove} onChange={(e) => setJoinMove(e.target.value)}>
          <option value="">Select Move</option>
          <option value="0">Rock</option>
          <option value="1">Paper</option>
          <option value="2">Scissors</option>
        </select>
        <button onClick={joinGame} className="btn">
          Join Game
        </button>
      </div>

      <div>
        <h3>Play Against Computer</h3>
        <select value={move} onChange={(e) => setMove(e.target.value)}>
          <option value="">Select Move</option>
          <option value="0">Rock</option>
          <option value="1">Paper</option>
          <option value="2">Scissors</option>
        </select>
        <button onClick={playAgainstComputer} className="btn">
          Play
        </button>
      </div>
    </div>
  );
};

export default GameControls;
