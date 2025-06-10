import React, { useRef, useEffect, useCallback } from 'react';

const FlappyCloneGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const birdRef = useRef({ x: 50, y: 200, width: 30, height: 20, velocity: 0, gravity: 0.3, jump: -6, color: '#FFD700' });
  const pipesRef = useRef([]);
  const pipeStateRef = useRef({
    pipeWidth: 50,
    pipeGap: 120,
    pipeSpawnTimer: 0,
    pipeSpawnInterval: 120,
  });
  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);
  const canvasContextRef = useRef(null);

  const drawRect = useCallback((x, y, width, height, color) => {
    if (!canvasContextRef.current) return;
    canvasContextRef.current.fillStyle = color;
    canvasContextRef.current.fillRect(x, y, width, height);
  }, []);

  const drawBird = useCallback(() => {
    if (!canvasContextRef.current) return;
    const bird = birdRef.current;
    canvasContextRef.current.fillStyle = bird.color;
    canvasContextRef.current.beginPath();
    canvasContextRef.current.ellipse(bird.x + bird.width / 2, bird.y + bird.height / 2, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
    canvasContextRef.current.fill();
    
    canvasContextRef.current.fillStyle = 'white';
    canvasContextRef.current.beginPath();
    canvasContextRef.current.ellipse(bird.x + bird.width * 0.7, bird.y + bird.height * 0.3, bird.width * 0.1, bird.width * 0.1, 0, 0, Math.PI * 2);
    canvasContextRef.current.fill();
    
    canvasContextRef.current.fillStyle = '#FFA500';
    canvasContextRef.current.beginPath();
    canvasContextRef.current.moveTo(bird.x + bird.width, bird.y + bird.height / 2);
    canvasContextRef.current.lineTo(bird.x + bird.width + 10, bird.y + bird.height / 2 - 5);
    canvasContextRef.current.lineTo(bird.x + bird.width + 10, bird.y + bird.height / 2 + 5);
    canvasContextRef.current.closePath();
    canvasContextRef.current.fill();
  }, []);
  
  const drawScore = useCallback(() => {
    if (!canvasContextRef.current) return;
    canvasContextRef.current.fillStyle = 'white';
    canvasContextRef.current.font = '20px Arial';
    canvasContextRef.current.fillText('Score: ' + scoreRef.current, 10, 25);
  }, []);

  const spawnPipe = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { pipeWidth, pipeGap } = pipeStateRef.current;
    const topPipeHeight = Math.random() * (canvas.height / 2 - pipeGap / 2) + 50;
    const bottomPipeY = topPipeHeight + pipeGap;
    pipesRef.current.push({ x: canvas.width, y: 0, width: pipeWidth, height: topPipeHeight, color: '#2E8B57', passed: false });
    pipesRef.current.push({ x: canvas.width, y: bottomPipeY, width: pipeWidth, height: canvas.height - bottomPipeY, color: '#2E8B57', passed: false });
  }, []);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasContextRef.current) return;

    if (gameOverRef.current) {
      canvasContextRef.current.fillStyle = 'rgba(0,0,0,0.7)';
      canvasContextRef.current.fillRect(0,0,canvas.width, canvas.height);
      canvasContextRef.current.fillStyle = 'white';
      canvasContextRef.current.font = '40px Arial';
      canvasContextRef.current.textAlign = 'center';
      canvasContextRef.current.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
      canvasContextRef.current.font = '20px Arial';
      canvasContextRef.current.fillText('Final Score: ' + scoreRef.current, canvas.width / 2, canvas.height / 2 + 20);
      canvasContextRef.current.fillText('Click or Space to Restart', canvas.width / 2, canvas.height / 2 + 50);
      return;
    }

    canvasContextRef.current.clearRect(0, 0, canvas.width, canvas.height);

    const bird = birdRef.current;
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
      gameOverRef.current = true;
    }
    
    drawBird();

    const pipeState = pipeStateRef.current;
    pipeState.pipeSpawnTimer++;
    if (pipeState.pipeSpawnTimer >= pipeState.pipeSpawnInterval) {
      spawnPipe();
      pipeState.pipeSpawnTimer = 0;
    }

    pipesRef.current = pipesRef.current.filter(pipe => pipe.x + pipe.width > 0);

    pipesRef.current.forEach((pipe, index) => {
      pipe.x -= 2; 
      drawRect(pipe.x, pipe.y, pipe.width, pipe.height, pipe.color);
      
      if (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        bird.y < pipe.y + pipe.height &&
        bird.y + bird.height > pipe.y
      ) {
        gameOverRef.current = true;
      }
      
      if (pipe.x + pipe.width < bird.x && !pipe.passed && index % 2 === 0) {
        pipe.passed = true;
        scoreRef.current++;
      }
    });
    
    drawScore();
    gameLoopRef.current = requestAnimationFrame(updateGame);
  }, [drawBird, drawRect, drawScore, spawnPipe]);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    birdRef.current = { x: 50, y: canvas.height / 2 - 10, width: 30, height: 20, velocity: 0, gravity: 0.3, jump: -6, color: '#FFD700' };
    pipesRef.current = [];
    pipeStateRef.current.pipeSpawnTimer = 0;
    scoreRef.current = 0;
    gameOverRef.current = false; // Ensure game over is false on reset
    if (pipesRef.current.length === 0) { // Spawn initial pipe only if none exist
        spawnPipe();
    }
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    gameLoopRef.current = requestAnimationFrame(updateGame);
  }, [spawnPipe, updateGame]);

  const jump = useCallback(() => {
    if (gameOverRef.current) {
      resetGame();
      return;
    }
    birdRef.current.velocity = birdRef.current.jump;
  }, [resetGame]);
  
  const handleKeyPress = useCallback((e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
          e.preventDefault(); // Prevent page scroll
          jump();
      }
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvasContextRef.current = canvas.getContext('2d');
    canvas.width = Math.min(window.innerWidth * 0.8, 600);
    canvas.height = 400;
    
    birdRef.current.y = canvas.height / 2 - 10;

    resetGame();

    canvas.addEventListener('click', jump);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      canvas.removeEventListener('click', jump);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump, handleKeyPress, resetGame]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="border border-green-500 rounded-lg shadow-lg bg-sky-400/70"></canvas>
      <p className="mt-4 text-sm text-white/70">Click or Press Space/Arrow Up to Jump.</p>
    </div>
  );
};

export default FlappyCloneGame;