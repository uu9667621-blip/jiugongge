'use client';

import { useState, useEffect } from 'react';

type Player = 'X' | 'O' | null;
type Difficulty = 'easy' | 'medium' | 'hard';

export default function TicTacToe() {
  const [mode, setMode] = useState<'menu' | 'pvp' | 'ai'>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState('');

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);

  function calculateWinner(squares: Player[]) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw || (mode === 'ai' && !isXTurn)) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  // AI 下子
  useEffect(() => {
    if (mode !== 'ai' || isXTurn || winner || isDraw) return;

    setTimeout(() => {
      let move: number;

      if (difficulty === 'easy') {
        // 简单：随机
        const empty = board.map((v,i) => v === null ? i : -1).filter(i => i !== -1);
        move = empty[Math.floor(Math.random() * empty.length)];
      } else if (difficulty === 'medium') {
        // 中等：随机 + 简单防守
        move = getBestMove(board, 'O', false);
      } else {
        // 困难：完美Minimax
        move = getBestMove(board, 'O', true);
      }

      if (move !== -1) {
        const newBoard = [...board];
        newBoard[move] = 'O';
        setBoard(newBoard);
        setIsXTurn(true);
      }
    }, 500);
  }, [isXTurn, board, mode, difficulty]);

  // Minimax算法
  function getBestMove(board: Player[], player: 'X' | 'O', isHard: boolean): number {
    let bestScore = player === 'O' ? -Infinity : Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = player;

        const score = minimax(newBoard, player === 'O' ? 'X' : 'O', !isHard ? 2 : 9);

        if (player === 'O') {
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        } else {
          if (score < bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
    }
    return move;
  }

  function minimax(board: Player[], player: 'X' | 'O', depth: number): number {
    const win = calculateWinner(board);
    if (win === 'O') return 10;
    if (win === 'X') return -10;
    if (board.every(cell => cell !== null)) return 0;

    if (depth === 0) return 0;

    let best = player === 'O' ? -Infinity : Infinity;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = player;
        const score = minimax(newBoard, player === 'O' ? 'X' : 'O', depth - 1);
        best = player === 'O' ? Math.max(best, score) : Math.min(best, score);
      }
    }
    return best;
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setGameOver(false);
  };

  const returnToMenu = () => {
    setMode('menu');
    resetGame();
  };

  // 更新状态
  useEffect(() => {
    if (winner) {
      setGameOver(true);
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
      setStatus(`${winner} 获胜！`);
    } else if (isDraw) {
      setGameOver(true);
      setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
      setStatus('平局！');
    } else {
      setStatus(mode === 'ai' && !isXTurn ? '电脑思考中...' : `当前轮到：${isXTurn ? '你 (X)' : '电脑 (O)'}`);
    }
  }, [board, winner, isDraw, mode, isXTurn]);

  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            九宫格连线
          </h1>
          <div className="space-y-6">
            <button onClick={() => setMode('pvp')} className="block w-80 mx-auto py-6 text-2xl font-bold bg-white text-black rounded-3xl hover:bg-zinc-200">
              双人对战
            </button>
            <button onClick={() => setMode('ai')} className="block w-80 mx-auto py-6 text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl hover:brightness-110">
              单人 vs 电脑
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 font-mono">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={returnToMenu} className="text-cyan-400 hover:text-white text-xl">← 返回菜单</button>
          <div className="text-3xl font-bold">九宫格连线</div>
          {mode === 'ai' && <div className="text-sm text-zinc-400">难度: {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}</div>}
        </div>

        {/* 计分板 */}
        <div className="flex justify-center gap-12 mb-10 text-2xl">
          <div className="text-center">
            <div className="text-blue-400 text-5xl">X</div>
            <div>你 {scores.X}</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 text-5xl">O</div>
            <div>电脑 {scores.O}</div>
          </div>
          <div className="text-center">
            <div className="text-zinc-400 text-5xl">平</div>
            <div>{scores.draw}</div>
          </div>
        </div>

        {/* 棋盘 */}
        <div className="grid grid-cols-3 gap-3 bg-zinc-900 p-6 rounded-3xl mx-auto" style={{maxWidth: '380px'}}>
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="h-28 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-2xl text-8xl font-bold transition-all border border-zinc-700 flex items-center justify-center"
            >
              {cell}
            </button>
          ))}
        </div>

        <div className="text-center mt-10 text-3xl font-bold min-h-[60px]">{status}</div>

        {gameOver && (
          <button onClick={resetGame} className="mt-6 w-full py-5 bg-white text-black text-xl font-bold rounded-2xl hover:bg-zinc-200">
            再来一局
          </button>
        )}

        {mode === 'ai' && !gameOver && (
          <div className="flex justify-center gap-3 mt-6">
            <button onClick={() => setDifficulty('easy')} className={`px-6 py-2 rounded-xl ${difficulty === 'easy' ? 'bg-green-600' : 'bg-zinc-800'}`}>简单</button>
            <button onClick={() => setDifficulty('medium')} className={`px-6 py-2 rounded-xl ${difficulty === 'medium' ? 'bg-green-600' : 'bg-zinc-800'}`}>中等</button>
            <button onClick={() => setDifficulty('hard')} className={`px-6 py-2 rounded-xl ${difficulty === 'hard' ? 'bg-green-600' : 'bg-zinc-800'}`}>困难</button>
          </div>
        )}
      </div>
    </div>
  );
}