
import React, { useState, useEffect, useCallback } from 'react';

const SIZE = 4;
const EMPTY = 0;

export const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGame = useCallback(() => {
    let newGrid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(EMPTY));
    newGrid = addRandom(addRandom(newGrid));
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
    const savedBest = localStorage.getItem('2048-best');
    if (savedBest) setBest(parseInt(savedBest));
  }, [initGame]);

  useEffect(() => {
    if (score > best) {
      setBest(score);
      localStorage.setItem('2048-best', score.toString());
    }
  }, [score, best]);

  function addRandom(currentGrid: number[][]) {
    const emptyCells = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (currentGrid[r][c] === EMPTY) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return currentGrid;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }

  const move = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameOver) return;
    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const rotate = (matrix: number[][]) => matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    
    let rotations = 0;
    if (direction === 'UP') rotations = 1;
    if (direction === 'RIGHT') rotations = 2;
    if (direction === 'DOWN') rotations = 3;

    for (let i = 0; i < rotations; i++) newGrid = rotate(newGrid);

    for (let r = 0; r < SIZE; r++) {
      let row = newGrid[r].filter(val => val !== EMPTY);
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          newScore += row[i];
          row.splice(i + 1, 1);
          moved = true;
        }
      }
      while (row.length < SIZE) row.push(EMPTY);
      if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) moved = true;
      newGrid[r] = row;
    }

    for (let i = 0; i < (4 - rotations) % 4; i++) newGrid = rotate(newGrid);

    if (moved) {
      const finalGrid = addRandom(newGrid);
      setGrid(finalGrid);
      setScore(newScore);
      checkGameOver(finalGrid);
    }
  };

  const checkGameOver = (currentGrid: number[][]) => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (currentGrid[r][c] === EMPTY) return;
        if (r < SIZE - 1 && currentGrid[r][c] === currentGrid[r + 1][c]) return;
        if (c < SIZE - 1 && currentGrid[r][c] === currentGrid[r][c + 1]) return;
      }
    }
    setGameOver(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('UP');
      if (e.key === 'ArrowDown') move('DOWN');
      if (e.key === 'ArrowLeft') move('LEFT');
      if (e.key === 'ArrowRight') move('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, score, gameOver]);

  const getTileColor = (val: number) => {
    const colors: Record<number, string> = {
      2: 'bg-zinc-200 text-zinc-800',
      4: 'bg-zinc-300 text-zinc-800',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-500 text-white',
      32: 'bg-rose-400 text-white',
      64: 'bg-rose-600 text-white',
      128: 'bg-yellow-200 text-zinc-800 text-xl',
      256: 'bg-yellow-300 text-zinc-800 text-xl',
      512: 'bg-yellow-400 text-white text-xl',
      1024: 'bg-yellow-500 text-white text-lg',
      2048: 'bg-yellow-600 text-white text-lg shadow-[0_0_15px_rgba(234,179,8,0.5)]',
    };
    return colors[val] || 'bg-zinc-800 text-white';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 select-none">
      <div className="flex justify-between w-full max-w-[400px] mb-6">
        <div className="text-4xl font-black text-white">2048</div>
        <div className="flex gap-2">
          <div className="bg-zinc-800 rounded-xl px-4 py-2 text-center min-w-[80px]">
            <div className="text-[10px] uppercase text-zinc-500 font-bold">Score</div>
            <div className="text-xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-zinc-800 rounded-xl px-4 py-2 text-center min-w-[80px]">
            <div className="text-[10px] uppercase text-zinc-500 font-bold">Best</div>
            <div className="text-xl font-bold text-white">{best}</div>
          </div>
        </div>
      </div>

      <div className="relative bg-zinc-800/50 p-3 rounded-2xl grid grid-cols-4 gap-3 aspect-square w-full max-w-[400px] shadow-2xl border border-white/5">
        {grid.flat().map((val, i) => (
          <div key={i} className={`aspect-square rounded-xl flex items-center justify-center font-black text-2xl transition-all duration-100 ${val === 0 ? 'bg-zinc-900/40' : getTileColor(val)}`}>
            {val !== 0 && val}
          </div>
        ))}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 animate-in fade-in duration-500">
            <div className="text-4xl font-black text-white mb-4">Game Over!</div>
            <button onClick={initGame} className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl">
              Tentar Novamente
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2 w-full max-w-[200px] md:hidden">
        <div />
        <button onClick={() => move('UP')} className="h-12 bg-zinc-800 rounded-xl flex items-center justify-center"><div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-white"/></button>
        <div />
        <button onClick={() => move('LEFT')} className="h-12 bg-zinc-800 rounded-xl flex items-center justify-center"><div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-white"/></button>
        <button onClick={() => move('DOWN')} className="h-12 bg-zinc-800 rounded-xl flex items-center justify-center"><div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-white"/></button>
        <button onClick={() => move('RIGHT')} className="h-12 bg-zinc-800 rounded-xl flex items-center justify-center"><div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-white"/></button>
      </div>

      <p className="mt-6 text-zinc-500 text-xs text-center uppercase tracking-widest font-medium">
        Use as setas do teclado ou os controles acima
      </p>
    </div>
  );
};
