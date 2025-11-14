import { useState } from "react";
import meowcatImg from './assets/meowlcat.jpeg';
import dawgImg from './assets/dawg.jpeg';
import labubuImg from './assets/labubu.jpg';
import dubaiImg from './assets/dubai.jpg';

function isImage(token) {
  if (typeof token !== 'string') return false;
  return token.includes('/') || token.includes('.png') || token.includes('.jpg') || token.includes('http');
}

function Square({ value, onSquareClick, playerTokens }) {
  let displayValue = null;

  if (value === "X") {
    const tokenX = playerTokens.X;
    displayValue = isImage(tokenX)
      ? <img src={tokenX} alt="X" />
      : tokenX;
  } else if (value === "O") {
    const tokenO = playerTokens.O;
    displayValue = isImage(tokenO)
      ? <img src={tokenO} alt="O" />
      : tokenO;
  }

  return (
    <button className="square" onClick={onSquareClick}>
      {displayValue}
    </button>
  );
}


function Board({ xIsNext, squares, onPlay, boardSize, playerTokens }) {
  function handleClick(i) {
    if (calculateWinner(squares, boardSize) || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const renderBoard = () => {
    let board = [];

    for (let row = 0; row < boardSize; row++) {
      let boardRow = [];

      for (let col = 0; col < boardSize; col++) {
        const i = row * boardSize + col;

        boardRow.push(
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            playerTokens={playerTokens}
          />
        );
      }

      board.push(
        <div key={row} className="board-row">
          {boardRow}
        </div>
      );
    }

    return board;
  };

  return <>{renderBoard()}</>;
}


export default function Game() {
  const [boardSize, setBoardSize] = useState(3);
  const [playerTokens, setPlayerTokens] = useState({ X: "X", O: "O" });
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  
  function handleConfigChange(size, tokens) {
    let newSize = boardSize;

    if (size) {
      newSize = size;
      setBoardSize(size);
    }

    if (tokens) {
      if (tokens === "classic") {
        setPlayerTokens({ X: "X", O: "O" });
      } else if (tokens === "meowcat") {
        setPlayerTokens({
          X: meowcatImg,
          O: dawgImg,
        });
      } else if (tokens === "labubu") {
        setPlayerTokens({
          X: labubuImg,
          O: dubaiImg,
        });
      }
    }

    setHistory([Array(newSize * newSize).fill(null)]);
    setCurrentMove(0);
  }

 
  const winner = calculateWinner(currentSquares, boardSize);

  const playerXName = isImage(playerTokens.X) ? "Player X" : playerTokens.X;
  const playerOName = isImage(playerTokens.O) ? "Player O" : playerTokens.O;

  let status;
  if (winner) {
    status = "Winner: " + (winner === "X" ? playerXName : playerOName);
  } else if (currentMove === boardSize * boardSize) {
    status = "¡Empate!";
  } else {
    status = "Next player: " + (xIsNext ? playerXName : playerOName);
  }

  return (
    <>
      <h1 className="title" onClick={() => setShowEasterEgg(!showEasterEgg)}>
        Tic Tac Toe
      </h1>

      {showEasterEgg && (
        <div className="easter-egg-overlay" onClick={() => setShowEasterEgg(false)}>
          <div className="easter-egg-modal" onClick={(e) => e.stopPropagation()}>
            <h3>EASTER EGGGG!!!!</h3>
            <p><strong>Nombre:</strong> Miranda Amaro Hernández</p>
            <p><strong>Matrícula:</strong>73319</p>
            <button onClick={() => setShowEasterEgg(false)}>Cerrar</button>
          </div>
        </div>
      )}

      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            boardSize={boardSize}
            playerTokens={playerTokens}
          />
        </div>

        <div className="game-info">
          <div className="status">{status}</div>

          <h3>Configuración</h3>
          <button onClick={() => handleConfigChange(3, null)}>Tablero 3x3</button>
          <button onClick={() => handleConfigChange(4, null)}>Tablero 4x4</button>
          <button onClick={() => handleConfigChange(5, null)}>Tablero 5x5</button>

          <h3>Modos de juego</h3>
          <button onClick={() => handleConfigChange(null, "classic")}>Clásicos</button>
          <button onClick={() => handleConfigChange(null, "meowcat")}>meowcat vs dawg</button>
          <button onClick={() => handleConfigChange(null, "labubu")}>labubu vs dubai</button>

          <div className="game-controls">
            <button onClick={() => jumpTo(0)}>Reiniciar</button>
            {currentMove > 0 && (
              <button onClick={() => jumpTo(0)}>Go to game start</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


function calculateWinner(squares, boardSize) {
  const lines = [];

  
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) row.push(i * boardSize + j);
    lines.push(row);
  }

  for (let i = 0; i < boardSize; i++) {
    const col = [];
    for (let j = 0; j < boardSize; j++) col.push(j * boardSize + i);
    lines.push(col);
  }

  const diag1 = [];
  const diag2 = [];
  for (let i = 0; i < boardSize; i++) {
    diag1.push(i * boardSize + i);
    diag2.push(i * boardSize + (boardSize - 1 - i));
  }

  lines.push(diag1, diag2);


  for (let line of lines) {
    const first = squares[line[0]];
    if (!first) continue;

    if (line.every((idx) => squares[idx] === first)) {
      return first;
    }
  }

  return null;
}
