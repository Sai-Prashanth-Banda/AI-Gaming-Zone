
import React, { useRef, useEffect, useCallback, useState } from 'react';

const SpaceShooterGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const playerRef = useRef(null);
  const bulletsRef = useRef([]);
  const enemiesRef = useRef([]);
  const scoreRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const enemySpawnIntervalRef = useRef(null);
  const canvasContextRef = useRef(null);

  const drawRect = useCallback((x, y, width, height, color) => {
    if (!canvasContextRef.current) return;
    canvasContextRef.current.fillStyle = color;
    canvasContextRef.current.fillRect(x, y, width, height);
  }, []);

  const drawPlayer = useCallback(() => {
    if (!canvasContextRef.current || !playerRef.current) return;
    const player = playerRef.current;
    drawRect(player.x, player.y, player.width, player.height, player.color);
    canvasContextRef.current.beginPath();
    canvasContextRef.current.moveTo(player.x + player.width / 2, player.y);
    canvasContextRef.current.lineTo(player.x, player.y + player.height);
    canvasContextRef.current.lineTo(player.x + player.width, player.y + player.height);
    canvasContextRef.current.closePath();
    canvasContextRef.current.fillStyle = '#00AFFF';
    canvasContextRef.current.fill();
  }, [drawRect]);

  const drawBullet = useCallback((bullet) => {
    drawRect(bullet.x, bullet.y, bullet.width, bullet.height, bullet.color);
  }, [drawRect]);

  const drawEnemy = useCallback((enemy) => {
    drawRect(enemy.x, enemy.y, enemy.width, enemy.height, enemy.color);
  }, [drawRect]);
  
  const drawScore = useCallback(() => {
    if (!canvasContextRef.current) return;
    canvasContextRef.current.fillStyle = 'white';
    canvasContextRef.current.font = '20px Arial';
    canvasContextRef.current.fillText('Score: ' + scoreRef.current, 10, 25);
  }, []);

  const spawnEnemy = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = 20 + Math.random() * 20;
    const x = Math.random() * (canvas.width - size);
    const y = -size;
    const speed = 1 + Math.random() * 2;
    enemiesRef.current.push({ x, y, width: size, height: size, speed, color: `hsl(${Math.random() * 360}, 70%, 50%)` });
  }, []);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvasContextRef.current || !canvas || !playerRef.current) {
      if (!gameOver) gameLoopRef.current = requestAnimationFrame(updateGame);
      return;
    }

    if (gameOver) {
      canvasContextRef.current.fillStyle = 'rgba(0,0,0,0.7)';
      canvasContextRef.current.fillRect(0,0,canvas.width, canvas.height);
      canvasContextRef.current.fillStyle = 'white';
      canvasContextRef.current.font = '40px Arial';
      canvasContextRef.current.textAlign = 'center';
      canvasContextRef.current.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
      canvasContextRef.current.font = '20px Arial';
      canvasContextRef.current.fillText('Final Score: ' + scoreRef.current, canvas.width / 2, canvas.height / 2 + 20);
      canvasContextRef.current.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 50);
      if (enemySpawnIntervalRef.current) clearInterval(enemySpawnIntervalRef.current);
      return;
    }

    canvasContextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPlayer();

    bulletsRef.current.forEach((bullet, index) => {
      bullet.y -= bullet.speed;
      if (bullet.y < 0) {
        bulletsRef.current.splice(index, 1);
      }
      drawBullet(bullet);
    });

    enemiesRef.current.forEach((enemy, enemyIndex) => {
      if (!enemy) return; 
      enemy.y += enemy.speed;
      if (enemy.y > canvas.height) {
        enemiesRef.current.splice(enemyIndex, 1);
      }
      drawEnemy(enemy);

      if (
        playerRef.current &&
        playerRef.current.x < enemy.x + enemy.width &&
        playerRef.current.x + playerRef.current.width > enemy.x &&
        playerRef.current.y < enemy.y + enemy.height &&
        playerRef.current.y + playerRef.current.height > enemy.y
      ) {
        setGameOver(true);
      }

      bulletsRef.current.forEach((bullet, bulletIndex) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          enemiesRef.current.splice(enemyIndex, 1);
          bulletsRef.current.splice(bulletIndex, 1);
          scoreRef.current += 10;
        }
      });
    });
    
    drawScore();
    if (!gameOver) {
        gameLoopRef.current = requestAnimationFrame(updateGame);
    }
  }, [drawPlayer, drawBullet, drawEnemy, drawScore, gameOver, setGameOver]);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playerRef.current = { x: canvas.width / 2 - 15, y: canvas.height - 40, width: 30, height: 30, speed: 5, color: '#00FFFF' };
    bulletsRef.current = [];
    enemiesRef.current = [];
    scoreRef.current = 0;
    setGameOver(false);

    if (enemySpawnIntervalRef.current) clearInterval(enemySpawnIntervalRef.current);
    enemySpawnIntervalRef.current = setInterval(spawnEnemy, 1500);
    
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    gameLoopRef.current = requestAnimationFrame(updateGame);
  }, [spawnEnemy, updateGame]);

  const movePlayer = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas || !playerRef.current) return;

    if (gameOver) {
      if (e.key === ' ' || e.code === 'Space') {
        resetGame();
      }
      return;
    }

    if (e.key === 'ArrowLeft' && playerRef.current.x > 0) {
      playerRef.current.x -= playerRef.current.speed * 3;
    }
    if (e.key === 'ArrowRight' && playerRef.current.x < canvas.width - playerRef.current.width) {
      playerRef.current.x += playerRef.current.speed * 3;
    }
    if (e.key === ' ' || e.code === 'Space') { 
      bulletsRef.current.push({ 
        x: playerRef.current.x + playerRef.current.width / 2 - 2.5, 
        y: playerRef.current.y, 
        width: 5, height: 10, speed: 7, color: '#FFFF00' 
      });
    }
  }, [resetGame, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvasContextRef.current = canvas.getContext('2d');
    
    const setCanvasSize = () => {
        canvas.width = Math.min(window.innerWidth > 768 ? 600 : window.innerWidth * 0.9, 600);
        canvas.height = 400;
        if (playerRef.current) {
            playerRef.current.x = canvas.width / 2 - 15;
            playerRef.current.y = canvas.height - 40;
        }
    }
    
    setCanvasSize();
    resetGame();

    window.addEventListener('keydown', movePlayer);
    window.addEventListener('resize', setCanvasSize);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (enemySpawnIntervalRef.current) clearInterval(enemySpawnIntervalRef.current);
      window.removeEventListener('keydown', movePlayer);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [resetGame, movePlayer]);

  useEffect(() => {
    if (gameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      updateGame(); 
    } else {
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = requestAnimationFrame(updateGame);
    }
  }, [gameOver, updateGame]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="border border-purple-500 rounded-lg shadow-lg bg-slate-800/50"></canvas>
      <p className="mt-4 text-sm text-white/70">Use Arrow Keys to move, Space to shoot.</p>
      {gameOver && <p className="mt-2 text-lg text-yellow-400">Game Over! Press Space to restart.</p>}
    </div>
  );
};

export default SpaceShooterGame;
