
import React, { useEffect, useRef, useState } from 'react';

export const Hextris: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const state = useRef({
    rotation: 0,
    blocks: [] as any[],
    frameCount: 0,
    sides: [ [] as any[], [] as any[], [] as any[], [] as any[], [] as any[], [] as any[] ],
    colors: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
  });

  const CANVAS_SIZE = 400;
  const HEX_RADIUS = 50;

  const resetGame = () => {
    state.current.blocks = [];
    state.current.sides = [[],[],[],[],[],[]];
    state.current.rotation = 0;
    state.current.frameCount = 0;
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
      
      // Spawn block
      if (state.current.frameCount % 100 === 0) {
        const side = Math.floor(Math.random() * 6);
        const color = state.current.colors[Math.floor(Math.random() * state.current.colors.length)];
        state.current.blocks.push({ dist: 200, side, color });
      }

      // Update blocks
      state.current.blocks.forEach((b, i) => {
        b.dist -= 1.5;
        if (b.dist <= HEX_RADIUS + (state.current.sides[b.side].length * 10)) {
          // Landed! Adjust for current rotation
          const landingSide = (b.side - Math.round(state.current.rotation / (Math.PI/3)) + 12) % 6;
          state.current.sides[landingSide].push(b.color);
          state.current.blocks.splice(i, 1);
          
          // Check for matches
          const currentSide = state.current.sides[landingSide];
          if (currentSide.length >= 3) {
            const lastColor = currentSide[currentSide.length-1];
            if (currentSide[currentSide.length-2] === lastColor && currentSide[currentSide.length-3] === lastColor) {
               currentSide.splice(-3);
               setScore(s => s + 30);
            }
          }

          if (currentSide.length > 8) setGameOver(true);
        }
      });

      // Clear
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.translate(CANVAS_SIZE/2, CANVAS_SIZE/2);
      ctx.rotate(state.current.rotation);

      // Draw Hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = HEX_RADIUS * Math.cos(angle);
        const y = HEX_RADIUS * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Stacked Sides
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        state.current.sides[i].forEach((color: string, idx: number) => {
          ctx.save();
          ctx.rotate(angle);
          ctx.fillStyle = color;
          ctx.fillRect(HEX_RADIUS + (idx * 10), -20, 8, 40);
          ctx.restore();
        });
      }

      ctx.rotate(-state.current.rotation);

      // Draw Falling Blocks
      state.current.blocks.forEach(b => {
        ctx.save();
        const angle = (b.side * Math.PI) / 3;
        ctx.rotate(angle + state.current.rotation);
        ctx.fillStyle = b.color;
        ctx.fillRect(b.dist, -20, 10, 40);
        ctx.restore();
      });

      ctx.translate(-CANVAS_SIZE/2, -CANVAS_SIZE/2);
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isStarted, gameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') state.current.rotation -= Math.PI / 3;
      if (e.key === 'ArrowRight') state.current.rotation += Math.PI / 3;
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-zinc-950">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-black text-fuchsia-500 uppercase">HEXTRIS LOCAL</h2>
        <div className="text-white font-mono text-xl">SCORE: {score}</div>
      </div>
      <div className="relative border-4 border-fuchsia-900 rounded-full overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.2)]">
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} />
        {!isStarted && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8">
             <button onClick={resetGame} className="bg-fuchsia-600 text-white px-10 py-4 rounded-2xl font-black text-2xl animate-pulse">START</button>
             <p className="text-fuchsia-300/50 text-xs mt-6">SETAS PARA GIRAR</p>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center">
             <div className="text-white text-4xl font-black mb-6">FIM DE JOGO</div>
             <button onClick={resetGame} className="bg-white text-black px-8 py-2 rounded-xl font-bold">RECARREGAR</button>
          </div>
        )}
      </div>
    </div>
  );
};
