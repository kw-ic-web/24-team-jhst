import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PlayerScore = ({ name, score }) => (
  <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
    <p>{name}</p>
    <p>{score}점</p>
  </div>
);

const GameMulti = () => {
  const location = useLocation();
  const { myPlayer, otherPlayer, roomName } = location.state || {}; // 전달된 상태 받기

  const [round, setRound] = useState(1);
  const [word, setWord] = useState('');
  const [roundWords, setRoundWords] = useState([]); // 5라운드 단어 저장
  const [players, setPlayers] = useState([]);

  // /multiplay API 호출
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get('http://localhost:8000/multiplay');

        const words = response.data;
        console.log('5라운드 단어:', words); // 단어 콘솔 출력
        setRoundWords(Object.values(words)); // 라운드 단어 설정
        setWord(Object.values(words)[0]?.en_word || ''); // 첫 라운드 단어 설정
      } catch (error) {
        console.error('단어를 가져오는 중 오류 발생:', error);
      }
    };

    fetchWords();
  }, []);

  // 플레이어 정보 설정
  useEffect(() => {
    if (myPlayer && otherPlayer) {
      setPlayers([
        { name: `플레이어 1: ${myPlayer.member_id}`, score: 0, position: { x: 0, y: 0 } },
        { name: `플레이어 2: ${otherPlayer.member_id}`, score: 0, position: { x: 0, y: 0 } },
      ]);
    }
  }, [myPlayer, otherPlayer]);

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
      <div>
        <h1>게임 멀티플레이 화면</h1>
        <p>방 이름: {roomName}</p>
        <p>플레이어1: {myPlayer?.member_id}</p>
        <p>플레이어2: {otherPlayer?.member_id}</p>
      </div>
      <div className="flex justify-between items-center w-full max-w-4xl mb-8 space-x-4">
        <PlayerScore name={players[0]?.name} score={players[0]?.score || 0} />
        <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
          <p>라운드</p>
          <p>{round}</p>
        </div>
        <PlayerScore name={players[1]?.name} score={players[1]?.score || 0} />
      </div>

      {/* 제시 단어 */}
      <div className="text-center bg-gray-300 p-4 rounded-md text-2xl mb-8 max-w-2xl w-full">
        {word || '로딩 중...'}
      </div>

      {/* 플레이어 영역 */}
      <div className="relative w-full max-w-4xl h-96 bg-white rounded-md">
        <div
          className="bg-blue-500 w-12 h-12 rounded-full absolute"
          style={{
            left: `${players[0]?.position.x || 0}px`,
            top: `${players[0]?.position.y || 0}px`,
          }}
        ></div>
        <div className="flex flex-col items-center absolute right-10 bottom-10">
          <div className="bg-gray-400 p-8 mb-4 rounded-md text-2xl">{players[1]?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default GameMulti;
