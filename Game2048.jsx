import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 4;

const Game2048 = () => {
  const [board, setBoard] = useState(() => Array(GRID_SIZE * GRID_SIZE).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const getRandomEmptyCell = (currentBoard) => {
    const emptyCells = [];
    currentBoard.forEach((cell, index) => {
      if (cell === 0) emptyCells.push(index);
    });
    if (emptyCells.length === 0) return -1;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const addRandomTile = useCallback((currentBoard) => {
    const newBoard = [...currentBoard];
    const emptyCellIndex = getRandomEmptyCell(newBoard);
    if (emptyCellIndex !== -1) {
      newBoard[emptyCellIndex] = Math.random() < 0.9 ? 2 : 4;
    }
    return newBoard;
  }, []);
  
  const initializeBoard = useCallback(() => {
    let newBoard = Array(GRID_SIZE * GRID_SIZE).fill(0);
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWin(false);
  }, [addRandomTile]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  const getTileColor = (value) => {
    const colors = {
      0: 'bg-slate-700',
      2: 'bg-yellow-200 text-slate-800',
      4: 'bg-yellow-300 text-slate-800',
      8: 'bg-orange-400 text-white',
      16: 'bg-orange-500 text-white',
      32: 'bg-red-500 text-white',
      64: 'bg-red-600 text-white',
      128: 'bg-purple-400 text-white',
      256: 'bg-purple-500 text-white',
      512: 'bg-indigo-500 text-white',
      1024: 'bg-indigo-600 text-white',
      2048: 'bg-teal-500 text-white',
    };
    return colors[value] || 'bg-pink-500 text-white';
  };
  
  const canMove = (currentBoard) => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (currentBoard[r * GRID_SIZE + c] === 0) return true; 
        if (c + 1 < GRID_SIZE && currentBoard[r * GRID_SIZE + c] === currentBoard[r * GRID_SIZE + c + 1]) return true;
        if (r + 1 < GRID_SIZE && currentBoard[r * GRID_SIZE + c] === currentBoard[(r + 1) * GRID_SIZE + c]) return true;
      }
    }
    return false;
  };

  const transformBoard = useCallback((currentBoard, direction) => {
    let newBoard = JSON.parse(JSON.stringify(currentBoard)); // Deep copy
    let tempScore = 0;
    let moved = false;

    const getRow = (r, b) => b.slice(r * GRID_SIZE, r * GRID_SIZE + GRID_SIZE);
    const getCol = (c, b) => Array.from({ length: GRID_SIZE }, (_, r) => b[r * GRID_SIZE + c]);
    const setRow = (r, row, b) => row.forEach((val, c) => (b[r * GRID_SIZE + c] = val));
    const setCol = (c, col, b) => col.forEach((val, r) => (b[r * GRID_SIZE + c] = val));

    const slideAndMerge = (line) => {
      let filteredLine = line.filter(val => val !== 0);
      let newLine = [];
      for (let i = 0; i < filteredLine.length; i++) {
        if (i + 1 < filteredLine.length && filteredLine[i] === filteredLine[i + 1]) {
          const mergedValue = filteredLine[i] * 2;
          newLine.push(mergedValue);
          tempScore += mergedValue;
          if (mergedValue === 2048) setWin(true);
          i++; 
        } else {
          newLine.push(filteredLine[i]);
        }
      }
      const resultLine = newLine.concat(Array(GRID_SIZE - newLine.length).fill(0));
      if (line.join(',') !== resultLine.join(',')) {
          moved = true;
      }
      return resultLine;
    };
    
    const reverseLine = (line) => line.reverse();

    for (let i = 0; i < GRID_SIZE; i++) {
      if (direction === 'left') {
        let row = getRow(i, newBoard);
        setRow(i, slideAndMerge(row), newBoard);
      } else if (direction === 'right') {
        let row = getRow(i, newBoard);
        setRow(i, reverseLine(slideAndMerge(reverseLine(row))), newBoard);
      } else if (direction === 'up') {
        let col = getCol(i, newBoard);
        setCol(i, slideAndMerge(col), newBoard);
      } else if (direction === 'down') {
        let col = getCol(i, newBoard);
        setCol(i, reverseLine(slideAndMerge(reverseLine(col))), newBoard);
      }
    }
    
    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(prevScore => prevScore + tempScore);
      if (!canMove(newBoard)) {
        setGameOver(true);
      }
    }
  }, [addRandomTile]);

  const handleKeyDown = useCallback((e) => {
    if (gameOver || win) return;
    let direction = null;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        direction = 'up';
        break;
      case 'ArrowDown':
      case 's':
        direction = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
        direction = 'left';
        break;
      case 'ArrowRight':
      case 'd':
        direction = 'right';
        break;
      default:
        break;
    }
    if (direction) {
      e.preventDefault();
      transformBoard(board, direction);
    }
  }, [board, gameOver, win, transformBoard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center p-4 rounded-lg relative">
      <div className="flex justify-between items-center w-full max-w-md mb-4">
        <div className="text-xl font-bold text-white">Score: {score}</div>
        <button 
          onClick={initializeBoard} 
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
        >
          New Game
        </button>
      </div>
      
      {(gameOver || win) && (
        <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center z-10 rounded-lg m-1" style={{top: '60px'}}>
          <p className="text-4xl font-bold mb-4 text-white">
            {win ? "You Win!" : "Game Over!"}
          </p>
          <p className="text-xl mb-4 text-white">Final Score: {score}</p>
          <button 
            onClick={initializeBoard} 
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-md hover:opacity-90 transition-opacity text-lg"
          >
            Play Again
          </button>
        </div>
      )}

      <div 
        className="grid grid-cols-4 gap-2 p-3 bg-slate-600 rounded-lg shadow-xl"
        style={{ width: '100%', maxWidth: '400px', aspectRatio: '1 / 1' }}
      >
        {board.map((value, index) => (
          <div
            key={index}
            className={`flex items-center justify-center text-2xl md:text-3xl font-bold rounded-md transition-all duration-100 ${getTileColor(value)}`}
            style={{ aspectRatio: '1 / 1' }}
          >
            {value > 0 ? value : ''}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-white/70">Use Arrow Keys or WASD to play.</p>
    </div>
  );
};

export default Game2048;