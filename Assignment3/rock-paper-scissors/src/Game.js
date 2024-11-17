import React from "react";
import './App.css';

function Game({
  isConnected, account, fundAmount, gameId, move, secondAccount,
  connectWallet, connectSecondWallet, disconnectWallet,
  setFundAmount, setGameId, setMove, fundContract, joinGame,
  playAgainstComputer, playMove, startGameToken, withdraw
}) {
  return (
    <div className="game-ui">
      {isConnected ? (
        <>
          <p>Connected: {account}</p>
          <div className="game-actions">
            <button className="game-button" onClick={connectSecondWallet}>
              Connect Second Wallet
            </button>

            <div className="game-actions">
              <button className="game-button" onClick={() => playMove(1)}>
                Rock
              </button>
              <button className="game-button" onClick={() => playMove(2)}>
                Paper
              </button>
              <button className="game-button" onClick={() => playMove(3)}>
                Scissors
              </button>
            </div>

            <div className="game-actions">
              <input
                type="number"
                placeholder="Amount to fund contract"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="input-field"
              />
              <button className="game-button" onClick={fundContract}>
                Fund Contract
              </button>
            </div>

            <div className="game-actions">
              <input
                type="number"
                placeholder="Game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Your Move (1-3)"
                value={move}
                onChange={(e) => setMove(e.target.value)}
                className="input-field"
              />
              <button className="game-button" onClick={joinGame}>
                Join Game
              </button>
            </div>

            <div className="game-actions">
              <button
                className="game-button"
                onClick={() => playAgainstComputer(1)}
              >
                Play Against Computer: Rock
              </button>
              <button
                className="game-button"
                onClick={() => playAgainstComputer(2)}
              >
                Play Against Computer: Paper
              </button>
              <button
                className="game-button"
                onClick={() => playAgainstComputer(3)}
              >
                Play Against Computer: Scissors
              </button>
            </div>

            <div className="game-actions">
              <input
                type="number"
                placeholder="Bet Amount"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="input-field"
              />
              <button className="game-button" onClick={startGameToken}>
                Start Game with Token
              </button>
            </div>

            <div className="game-actions">
              <button className="game-button" onClick={withdraw}>
                Withdraw
              </button>
            </div>

            <div className="game-actions">
              <button className="disconnectButton" onClick={disconnectWallet}>
                Disconnect Wallet
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="connect-wallet">
          <button className="game-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;
