import React, { useState, useEffect } from 'react';

const PlayerScore = ({ name, score }) => (
  <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
    <p>{name}</p>
    <p>{score}점</p>
  </div>
);

const GameMulti = () => {
  const [round, setRound] = useState(1);
  const [word, setWord] = useState('APPLE');
  const [players, setPlayers] = useState([
    { name: 'Player 1', score: 50, position: { x: 0, y: 0 } },
    { name: 'Player 2', score: 10 },
  ]);

  const handleKeyPress = (event) => {
    const moveDistance = 20;
    setPlayers((prevPlayers) => {
      const newPosition = { ...prevPlayers[0].position };
      switch (event.key) {
        case 'w':
          newPosition.y -= moveDistance;
          break;
        case 's':
          newPosition.y += moveDistance;
          break;
        case 'a':
          newPosition.x -= moveDistance;
          break;
        case 'd':
          newPosition.x += moveDistance;
          break;
        default:
          return prevPlayers;
      }

      const updatedPlayers = [...prevPlayers];
      updatedPlayers[0] = { ...updatedPlayers[0], position: newPosition };
      return updatedPlayers;
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* 상단 라운드와 제시 단어 */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-8 space-x-4">
        <PlayerScore name={players[0].name} score={players[0].score} />
        <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
          <p>라운드</p>
          <p>{round}</p>
        </div>
        <PlayerScore name={players[1].name} score={players[1].score} />
      </div>

      {/* 제시 단어 */}
      <div className="text-center bg-gray-300 p-4 rounded-md text-2xl mb-8 max-w-2xl w-full">
        {word}
      </div>

      {/* 플레이어 영역 */}
      <div className="relative w-full max-w-4xl h-96 bg-white rounded-md">
        <div
          className="bg-blue-500 w-12 h-12 rounded-full absolute"
          style={{
            left: `${players[0].position.x}px`,
            top: `${players[0].position.y}px`,
          }}
        ></div>
        <div className="flex flex-col items-center absolute right-10 bottom-10">
          <div className="bg-gray-400 p-8 mb-4 rounded-md text-2xl">A P P</div>
          <p>{players[1].name}</p>
        </div>
      </div>
    </div>
  );
};

export default GameMulti;
