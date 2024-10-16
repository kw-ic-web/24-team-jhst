import React, { useState } from 'react';

function GameMulti() {
  const [round, setRound] = useState(1); // 라운드 수 상태
  const [word, setWord] = useState('APPLE'); // 제시 단어 상태
  const [player1Score, setPlayer1Score] = useState(50); // Player 1 점수
  const [player2Score, setPlayer2Score] = useState(10); // Player 2 점수

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* 상단 라운드와 제시 단어 */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-8">
        <div className="text-center bg-gray-300 p-4 rounded-md">
          <p>플레이어 이름</p>
          <p>{player1Score}점</p>
        </div>
        <div className="text-center bg-gray-300 p-4 rounded-md">
          <p>라운드</p>
          <p>{round}</p>
        </div>
        <div className="text-center bg-gray-300 p-4 rounded-md">
          <p>플레이어 이름</p>
          <p>{player2Score}점</p>
        </div>
      </div>

      {/* 제시 단어 */}
      <div className="text-center bg-gray-300 p-4 rounded-md text-2xl mb-8">
        {word}
      </div>

      {/* 플레이어 영역 */}
      <div className="flex justify-around w-full max-w-4xl">
        <div className="flex flex-col items-center">
          <div className="bg-gray-400 p-8 mb-4">A</div>
          <p>player1</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-gray-400 p-8 mb-4">A P P</div>
          <p>player2</p>
        </div>
      </div>
    </div>
  );
}

export default GameMulti;
