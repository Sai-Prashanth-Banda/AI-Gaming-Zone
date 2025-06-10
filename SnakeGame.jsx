
import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20; 
const INITIAL_SPEED = 200; 

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Start moving up
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('snakeHighScore')) || 0);

  const getRandomPosition = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition());
    setDirection({ x: 0, y: -1 });
    setSpeed(INITIAL_SPEED);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const drawCell = (ctx, pos, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(pos.x * CELL_SIZE, pos.y * CELL_SIZE, CELL_SIZE -1 , CELL_SIZE -1);
  };
  
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const color = isHead ? 'hsl(120, 100%, 35%)' : `hsl(120, 100%, ${50 - index * 2}%)`;
      drawCell(ctx, segment, color);
      if (isHead) {
        ctx.fillStyle = 'white';
        const eyeSize = CELL_SIZE / 5;
        const eyeOffset = CELL_SIZE / 4;
        if (direction.x === 1) { // Right
          ctx.fillRect((segment.x + 0.6) * CELL_SIZE, (segment.y + 0.2) * CELL_SIZE, eyeSize, eyeSize);
          ctx.fillRect((segment.x + 0.6) * CELL_SIZE, (segment.y + 0.6) * CELL_SIZE, eyeSize, eyeSize);
        } else if (direction.x === -1) { // Left
          ctx.fillRect((segment.x + 0.2) * CELL_SIZE, (segment.y + 0.2) * CELL_SIZE, eyeSize, eyeSize);
          ctx.fillRect((segment.x + 0.2) * CELL_SIZE, (segment.y + 0.6) * CELL_SIZE, eyeSize, eyeSize);
        } else if (direction.y === 1) { // Down
          ctx.fillRect((segment.x + 0.2) * CELL_SIZE, (segment.y + 0.6) * CELL_SIZE, eyeSize, eyeSize);
          ctx.fillRect((segment.x + 0.6) * CELL_SIZE, (segment.y + 0.6) * CELL_SIZE, eyeSize, eyeSize);
        } else { // Up
          ctx.fillRect((segment.x + 0.2) * CELL_SIZE, (segment.y + 0.2) * CELL_SIZE, eyeSize, eyeSize);
          ctx.fillRect((segment.x + 0.6) * CELL_SIZE, (segment.y + 0.2) * CELL_SIZE, eyeSize, eyeSize);
        }
      }
    });
    
    ctx.fillStyle = 'hsl(0, 100%, 50%)';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2.5,
      0,
      2 * Math.PI
    );
    ctx.fill();
    
    ctx.fillStyle = 'hsl(0, 100%, 30%)';
    ctx.beginPath();
    ctx.moveTo(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE);
    ctx.lineTo(food.x * CELL_SIZE + CELL_SIZE / 2 + CELL_SIZE / 5, food.y * CELL_SIZE + CELL_SIZE / 5);
    ctx.stroke();


    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 40);
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
      ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 30);
      ctx.font = '16px Arial';
      ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 70);
    }
  }, [snake, food, gameOver, score, highScore, direction]);


  useEffect(() => {
    drawGame();
  }, [drawGame]);

  useEffect(() => {
    if (gameOver) return;

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score.toString());
          }
          return prevSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          setFood(getRandomPosition());
          setSpeed(s => Math.max(50, s - 5)); // Increase speed
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, speed, score, highScore]);

  const handleKeyDown = useCallback((e) => {
    if (gameOver) {
      if (e.key === ' ') {
        resetGame();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  }, [direction, gameOver, resetGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.width = GRID_SIZE * CELL_SIZE;
        canvas.height = GRID_SIZE * CELL_SIZE;
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <p className="text-xl text-white">Score: <span className="font-bold text-yellow-400">{score}</span></p>
        <p className="text-md text-white/70">High Score: <span className="font-bold text-green-400">{highScore}</span></p>
      </div>
      <canvas 
        ref={canvasRef} 
        className="border-2 border-green-600 rounded-lg shadow-2xl bg-slate-800/70"
      ></canvas>
      <p className="mt-4 text-sm text-white/70">Use Arrow Keys or WASD to control the snake.</p>
    </div>
  );
};

export default SnakeGame;
