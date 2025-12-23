
import React, { useEffect, useRef, useState } from 'react';

export const SubwaySurfers: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Game state refs to avoid re-renders in the loop
  const state = useRef({
    playerLane: 1, // 0: Left, 1: Middle, 2: Right
    targetX: 0,
    currentX: 0,
    playerY: 0,
    jumpY: 0,
    isJumping: false,
    speed: 5,
    obstacles: [] as any[],
    frameCount: 0,
    coins: 0,
  });

  const LANE_WIDTH = 100;
  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 500;

  const resetGame = () => {
    state.current = {
      playerLane: 1,
      targetX: LANE_WIDTH + LANE_WIDTH / 2,
      currentX: LANE_WIDTH + LANE_WIDTH / 2,
      playerY: CANVAS_HEIGHT - 100,
      jumpY: 0,
      isJumping: false,
      speed: 5,
      obstacles: [],
      frameCount: 0,
      coins: 0
    };
    setScore(0);
    setGameOver(false);
    setIsStarted(true);
  };

  useEffect(() => {
    if (!isStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = () => {
      state.current.frameCount++;
      state.current.speed = 5 + Math.floor(state.current.frameCount / 500) * 0.5;

      // Update Player Position
      const targetX = state.current.playerLane * LANE_WIDTH + LANE_WIDTH / 2;
      state.current.currentX += (targetX - state.current.currentX) * 0.2;

      if (state.current.isJumping) {
        state.current.jumpY -= 8;
        if (state.current.jumpY < -80) state.current.isJumping = false;
      } else if (state.current.jumpY < 0) {
        state.current.jumpY += 6;
        if (state.current.jumpY > 0) state.current.jumpY = 0;
      }

      // Obstacle Generation
      if (state.current.frameCount % 60 === 0) {
        const lane = Math.floor(Math.random() * 3);
        const type = Math.random() > 0.3 ? 'train' : 'barrier';
        state.current.obstacles.push({
          lane,
          y: -100,
          type,
          width: 60,
          height: type === 'train' ? 120 : 40
        });
      }

      // Movement & Collision
      state.current.obstacles.forEach((obs, index) => {
        obs.y += state.current.speed;
        
        // Collision Detection
        const obsX = obs.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const distY = Math.abs(obs.y + obs.height/2 - state.current.playerY);
        const distX = Math.abs(obsX - state.current.currentX);

        if (distX < 40 && distY < obs.height/2 + 20) {
          if (!(obs.type === 'barrier' && state.current.jumpY < -40)) {
            setGameOver(true);
          }
        }
      });

      // Cleanup
      state.current.obstacles = state.current.obstacles.filter(o => o.y < CANVAS_HEIGHT + 100);

      // Rendering
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Rails
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 4;
      for (let i = 0; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * LANE_WIDTH, 0);
        ctx.lineTo(i * LANE_WIDTH, CANVAS_HEIGHT);
        ctx.stroke();
      }

      // Draw Obstacles
      state.current.obstacles.forEach(obs => {
        const x = obs.lane * LANE_WIDTH + (LANE_WIDTH - obs.width) / 2;
        if (obs.type === 'train') {
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(x, obs.y, obs.width, obs.height);
          ctx.fillStyle = '#60a5fa';
          ctx.fillRect(x + 5, obs.y + 10, obs.width - 10, 20); // Window
        } else {
          ctx.fillStyle = '#facc15';
          ctx.fillRect(x, obs.y, obs.width, obs.height);
          ctx.fillStyle = '#000';
          ctx.fillRect(x, obs.y + obs.height - 5, obs.width, 5);
        }
      });

      // Draw Player (Jake)
      const playerY = state.current.playerY + state.current.jumpY;
      ctx.fillStyle = '#f87171'; // Hoodie
      ctx.beginPath();
      ctx.arc(state.current.currentX, playerY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24'; // Hair/Cap
      ctx.fillRect(state.current.currentX - 10, playerY - 25, 20, 10);

      setScore(Math.floor(state.current.frameCount / 10));
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isStarted, gameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && state.current.playerLane > 0) state.current.playerLane--;
      if (e.key === 'ArrowRight' && state.current.playerLane < 2) state.current.playerLane++;
      if ((e.key === 'ArrowUp' || e.key === ' ') && !state.current.isJumping && state.current.jumpY === 0) {
        state.current.isJumping = true;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-zinc-900 select-none">
      <div className="flex justify-between w-full max-w-[300px] mb-4">
        <div className="text-2xl font-black text-emerald-400">SURF RUNNER</div>
        <div className="bg-zinc-800 rounded-lg px-3 py-1 font-bold text-white">Score: {score}</div>
      </div>

      <div className="relative border-4 border-zinc-700 rounded-2xl overflow-hidden shadow-2xl bg-[#222]">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
          className="block"
        />

        {!isStarted && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-3xl font-black text-white mb-2">PRONTO?</h2>
            <p className="text-zinc-400 text-sm mb-6">Use as Setas para mover e Espaço para pular!</p>
            <button onClick={resetGame} className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl">
              COMEÇAR JOGO
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-rose-500/20 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-4xl font-black text-white mb-2">BATIDÃO!</h2>
            <div className="text-zinc-200 font-bold mb-6">Sua Pontuação: {score}</div>
            <button onClick={resetGame} className="bg-white text-rose-600 px-8 py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl">
              Tentar De Novo
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-[240px] md:hidden">
        <button onTouchStart={() => state.current.playerLane > 0 && state.current.playerLane--} className="h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-white font-bold">ESQ</button>
        <button onTouchStart={() => !state.current.isJumping && state.current.jumpY === 0 && (state.current.isJumping = true)} className="h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-white font-bold">PULO</button>
        <button onTouchStart={() => state.current.playerLane < 2 && state.current.playerLane++} className="h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-white font-bold">DIR</button>
      </div>
    </div>
  );
};
