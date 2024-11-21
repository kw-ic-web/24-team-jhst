import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlayerScore = ({ name, timer }) => (
  <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
    <p>{name}</p>
    <p>{timer}초</p>
  </div>
);

const GameSingle = () => {
  const TOTAL_ROUNDS = 5; // 총 라운드 수
  const INITIAL_TIMER = 30; // 초기 타이머 값
  const [round, setRound] = useState(1);
  const [word, setWord] = useState('');
  const [words, setWords] = useState([]); // 단어 리스트 상태 추가
  const [player, setPlayer] = useState({
    name: localStorage.getItem('memberId'), // 현재 로그인한 사용자
    timer: INITIAL_TIMER,
    position: { x: 100, y: 100 },
    collectedLetters: [],
  });
  const [letters, setLetters] = useState([]);
  const [gameStatus, setGameStatus] = useState('ongoing'); // 'ongoing', 'win', 'lose', 'complete'

  const fetchWordsFromBackend = async () => {
    try {
      const memberId = localStorage.getItem('memberId');
      const response = await axios.get('http://localhost:8000/game/singleplay', {
        params: { member_id: memberId },
      });

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response data structure');
      }

      // 단어 리스트 추출
      const fetchedWords = response.data.map((item) => {
        if (item.en_word) {
          return item.en_word; // en_word만 추출
        } else {
          console.warn('Invalid item structure:', item);
          return null;
        }
      }).filter(Boolean);

      if (fetchedWords.length === 0) {
        throw new Error('No valid words found in the response');
      }

      setWords(fetchedWords); 
      setWord(fetchedWords[0]); 

      // 단어 목록 콘솔 출력
      console.log('Fetched Words:', fetchedWords);
    } catch (error) {
      console.error('Failed to fetch words:', error);
    }
  };

  const generateRandomLetters = (currentWord) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const wordLetters = [...currentWord].sort(() => Math.random() - 0.5);
    const randomLetters = Array.from({ length: 10 }, () =>
      alphabet[Math.floor(Math.random() * alphabet.length)]
    );
    const allLetters = [...wordLetters, ...randomLetters].sort(
      () => Math.random() - 0.5
    );
    return allLetters.map((letter) => ({
      letter,
      x: Math.random() * 700 + 50, // 랜덤 X 위치
      y: Math.random() * 300 + 50, // 랜덤 Y 위치
    }));
  };

  const startNextRound = () => {
    if (round < TOTAL_ROUNDS) {
      const nextRound = round + 1;

      if (words[nextRound - 1]) {
        setRound(nextRound);
        setWord(words[nextRound - 1]); 
        setPlayer((prevPlayer) => ({
          ...prevPlayer,
          timer: INITIAL_TIMER,
          collectedLetters: [],
          position: { x: 100, y: 100 },
        }));
        setLetters(generateRandomLetters(words[nextRound - 1])); 
        setGameStatus('ongoing');
      } else {
        console.error('No word found for the next round');
      }
    } else {
      setGameStatus('complete'); // 모든 라운드 완료
    }
  };

  const handleKeyPress = (event) => {
    const moveDistance = 20;

    // 알파벳 획득 처리
    if (event.key === 'Enter') {
      setLetters((prevLetters) => {
        const playerPos = player.position;
        let closestIndex = -1;
        let minDistance = Infinity;

        prevLetters.forEach((letterObj, index) => {
          const dx = letterObj.x - playerPos.x;
          const dy = letterObj.y - playerPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 30 && distance < minDistance) {
            closestIndex = index;
            minDistance = distance;
          }
        });

        if (closestIndex !== -1) {
          const collectedLetter = prevLetters[closestIndex];
          setPlayer((prevPlayer) => ({
            ...prevPlayer,
            collectedLetters: [...prevPlayer.collectedLetters, collectedLetter.letter],
          }));
          return prevLetters.filter((_, index) => index !== closestIndex);
        }
        return prevLetters;
      });
    }

    // 알파벳 버리기
    else if (event.key === 'Backspace') {
      setPlayer((prevPlayer) => {
        if (prevPlayer.collectedLetters.length > 0) {
          const droppedLetter = prevPlayer.collectedLetters.slice(-1)[0];
          setLetters((prevLetters) => [
            ...prevLetters,
            {
              letter: droppedLetter,
              x: prevPlayer.position.x,
              y: prevPlayer.position.y,
            },
          ]);
          return {
            ...prevPlayer,
            collectedLetters: prevPlayer.collectedLetters.slice(0, -1),
          };
        }
        return prevPlayer;
      });
    }

    // 플레이어 이동 처리
    else {
      setPlayer((prevPlayer) => {
        const newPosition = { ...prevPlayer.position };
        switch (event.key) {
          case 'w':
            newPosition.y = Math.max(newPosition.y - moveDistance, 0);
            break;
          case 's':
            newPosition.y = Math.min(newPosition.y + moveDistance, 350);
            break;
          case 'a':
            newPosition.x = Math.max(newPosition.x - moveDistance, 0);
            break;
          case 'd':
            newPosition.x = Math.min(newPosition.x + moveDistance, 750);
            break;
          default:
            return prevPlayer;
        }
        return { ...prevPlayer, position: newPosition };
      });
    }
  };

  useEffect(() => {
    fetchWordsFromBackend();
  }, []);

  useEffect(() => {
    if (gameStatus !== 'ongoing') return; 
  
    const timerInterval = setInterval(() => {
      setPlayer((prevPlayer) => {
        if (prevPlayer.timer > 0) {
          return { ...prevPlayer, timer: prevPlayer.timer - 1 };
        } else {
          clearInterval(timerInterval);
          setGameStatus('lose'); 
          return prevPlayer;
        }
      });
    }, 1000);
  
    return () => clearInterval(timerInterval); 
  }, [gameStatus]);

  
  useEffect(() => {
    if (word) {
      setLetters(generateRandomLetters(word)); 
    }
  }, [word]);

  useEffect(() => {
    // 플레이어가 만든 단어와 제시된 단어가 일치하는지 확인
    if (player.collectedLetters.length === 0 || !word) return;

    const collectedWord = player.collectedLetters.join('');
    if (collectedWord === word) {
      setGameStatus('win'); 
    }
  }, [player.collectedLetters, word]);

  useEffect(() => {
    if (gameStatus === 'win') {
      setTimeout(startNextRound, 2000); // 2초 후에 다음 라운드 시작
    }
  }, [gameStatus]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player, letters]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex justify-between items-center w-full max-w-4xl mb-8 space-x-4">
        <PlayerScore name={player.name} timer={player.timer} />
        <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
          <p className="text-sm">라운드</p>
          <p>{round} / {TOTAL_ROUNDS}</p>
        </div>
      </div>
      <div className="text-center bg-gray-300 p-4 rounded-md text-2xl mb-8 max-w-2xl w-full">
        <p>제시 단어</p>
        <p>{word}</p>
      </div>
      <div className="relative w-full max-w-4xl h-96 bg-white rounded-md">
        <div
          className="bg-blue-500 w-12 h-12 rounded-full absolute flex items-center justify-center"
          style={{
            left: `${player.position.x}px`,
            top: `${player.position.y}px`,
          }}
        >
          <div className="absolute top-[-30px] left-0 flex gap-2">
            {player.collectedLetters.map((letter, index) => (
              <div
                key={index}
                className="bg-white text-black text-sm font-bold px-2 py-1 border rounded"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
        {letters.map((letterObj, index) => (
          <div
            key={index}
            className="absolute text-black text-xl font-bold"
            style={{
              left: `${letterObj.x}px`,
              top: `${letterObj.y}px`,
            }}
          >
            {letterObj.letter}
          </div>
        ))}
      </div>
      {gameStatus === 'win' && (
        <div className="text-green-500 text-2xl mt-4">승리! 다음 라운드로 이동합니다.</div>
      )}
      {gameStatus === 'lose' && (
        <div className="text-red-500 text-2xl mt-4">패배! 게임 종료</div>
      )}
      {gameStatus === 'complete' && (
        <div className="text-blue-500 text-2xl mt-4">축하합니다! 모든 라운드를 완료했습니다.</div>
      )}
    </div>
  );
};

export default GameSingle;
