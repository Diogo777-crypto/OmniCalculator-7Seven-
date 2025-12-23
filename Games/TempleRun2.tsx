
import React, { useEffect, useRef, useState } from 'react';

export const TempleRun2: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const state = useRef({
    playerLane: 1, // 0: Left, 1: Middle, 2: Right
    currentX: 150,
    jumpY: 0,
    isJumping: false,
    speed: 6,
    obstacles: [] as any[],
    frameCount: 0,
    cameraShake: 0
  });

  const LANE_WIDTH = 100;
  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 500;

  const resetGame = () => {
    state.current = {
      playerLane: 1,
      currentX: LANE_WIDTH + LANE_WIDTH / 2,
      jumpY: 0,
      isJumping: false,
      speed: 6,
      obstacles: [],
      frameCount: 0,
      cameraShake: 0
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
      state.current.speed = 6 + Math.floor(state.current.frameCount / 400) * 0.4;
      state.current.cameraShake = Math.sin(state.current.frameCount * 0.2) * 2;

      // Player Movement
      const targetX = state.current.playerLane * LANE_WIDTH + LANE_WIDTH / 2;
      state.current.currentX += (targetX - state.current.currentX) * 0.15;

      if (state.current.isJumping) {
        state.current.jumpY -= 7;
        if (state.current.jumpY < -90) state.current.isJumping = false;
      } else if (state.current.jumpY < 0) {
        state.current.jumpY += 5;
      }

      // Obstacle Logic
      if (state.current.frameCount % 50 === 0) {
        const lane = Math.floor(Math.random() * 3);
        const type = Math.random() > 0.4 ? 'log' : 'fire';
        state.current.obstacles.push({ lane, y: -50, type, h: 40 });
      }

      state.current.obstacles.forEach(obs => {
        obs.y += state.current.speed;
        const obsX = obs.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const distX = Math.abs(obsX - state.current.currentX);
        const distY = Math.abs(obs.y - (CANVAS_HEIGHT - 100));

        if (distX < 40 && distY < 30) {
          if (!(obs.type === 'log' && state.current.jumpY < -30)) {
             setGameOver(true);
          }
        }
      });

      state.current.obstacles = state.current.obstacles.filter(o => o.y < CANVAS_HEIGHT + 50);

      // Render
      ctx.save();
      ctx.translate(state.current.cameraShake, 0);
      
      // Background (Dirt Road)
      ctx.fillStyle = '#4d3319';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Path edges
      ctx.fillStyle = '#2d1e0f';
      ctx.fillRect(0, 0, 10, CANVAS_HEIGHT);
      ctx.fillRect(CANVAS_WIDTH - 10, 0, 10, CANVAS_HEIGHT);

      // Draw Obstacles
      state.current.obstacles.forEach(obs => {
        const x = obs.lane * LANE_WIDTH + 20;
        if (obs.type === 'log') {
          ctx.fillStyle = '#8b4513';
          ctx.fillRect(x, obs.y, 60, 30);
          ctx.strokeStyle = '#5d2e0c';
          ctx.strokeRect(x, obs.y, 60, 30);
        } else {
          ctx.fillStyle = '#ff4500';
          ctx.beginPath();
          ctx.moveTo(x + 30, obs.y);
          ctx.lineTo(x + 60, obs.y + 40);
          ctx.lineTo(x, obs.y + 40);
          ctx.fill();
        }
      });

      // Draw Player
      ctx.fillStyle = '#deb887';
      ctx.beginPath();
      ctx.arc(state.current.currentX, CANVAS_HEIGHT - 100 + state.current.jumpY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#333'; // Explorer Hat
      ctx.fillRect(state.current.currentX - 15, CANVAS_HEIGHT - 125 + state.current.jumpY, 30, 10);

      ctx.restore();
      setScore(Math.floor(state.current.frameCount / 10));
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isStarted, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-zinc-950">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-black text-amber-500 tracking-tighter uppercase">TEMPLE RUN 2 (LOCAL)</h2>
        <div className="text-white font-mono">PONTOS: {score}</div>
      </div>
      <div className="relative border-4 border-amber-900 rounded-xl overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-[#3e2723]" />
        {!isStarted && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6">
            <button onClick={resetGame} className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full font-black text-xl shadow-lg transition-transform active:scale-90">JOGAR AGORA</button>
            <p className="text-amber-200/50 text-[10px] mt-4 uppercase">Setas para mover e Espaço para pular</p>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 bg-red-900/40 backdrop-blur-sm flex flex-col items-center justify-center">
            <h3 className="text-white text-3xl font-black mb-4">VOCÊ CAIU!</h3>
            <button onClick={resetGame} className="bg-white text-red-900 px-6 py-2 rounded-full font-bold">RECORRER</button>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-4 md:hidden">
         <button onTouchStart={() => state.current.playerLane > 0 && state.current.playerLane--} className="w-16 h-16 bg-amber-900 rounded-full text-white font-bold">L</button>
         <button onTouchStart={() => !state.current.isJumping && (state.current.isJumping = true)} className="w-16 h-16 bg-amber-700 rounded-full text-white font-bold">J</button>
         <button onTouchStart={() => state.current.playerLane < 2 && state.current.playerLane++} className="w-16 h-16 bg-amber-900 rounded-full text-white font-bold">R</button>
      </div>
    </div>
  );
};
