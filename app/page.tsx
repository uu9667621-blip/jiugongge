'use client';

import { useState, useEffect } from 'react';

export default function TicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [isXTurn, setIsXTurn] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState('你先手 (X)');

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(cell => cell !== '');

  function calculateWinner(squares: string[]) {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  }

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

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
      setStatus(isXTurn ? '你先手 (X)' : '电脑思考中...');
    }
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setIsXTurn(true);
    setGameOver(false);
    setStatus('你先手 (X)');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 font-mono">
      <div className="w-full max-w-md">
        <h1 className="text-7xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
          九宫格连线
        </h1>
        <p className="text-center text-zinc-400 mb-10">你 (X) 先手 · 电脑 (O)</p>

        <div className="flex justify-center gap-12 mb-10 text-2xl">
          <div className="text-center">
            <div className="text-blue-400 text-5xl font-bold">X</div>
            <div>你 {scores.X}</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 text-5xl font-bold">O</div>
            <div>电脑 {scores.O}</div>
          </div>
          <div className="text-center">
            <div className="text-zinc-400 text-5xl font-bold">平</div>
            <div>{scores.draw}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-zinc-900 p-6 rounded-3xl mx-auto" style={{width: '380px'}}>
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="h-28 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-2xl text-8xl font-bold transition-all border border-zinc-700"
            >
              {cell}
            </button>
          ))}
        </div>

        <div className="text-center mt-10 text-3xl font-bold min-h-[60px]">{status}</div>

        {gameOver && (
          <button onClick={resetGame} className="mt-8 w-full py-5 bg-white text-black text-xl font-bold rounded-2xl hover:bg-zinc-200">
            再来一局
          </button>
        )}
      </div>
    </div>
  );
}