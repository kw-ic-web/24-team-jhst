import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const [results, setResults] = useState([]);
  const navigate = useNavigate(); // 라우터 네비게이션 객체

  const fetchWordsFromBackend = async () => {
    try {
      const memberId = localStorage.getItem('memberId');
      const response = await axios.get('http://localhost:8000/game/singleplay', {
        params: { member_id: memberId },
      });

      if (response.data && response.data.words && Array.isArray(response.data.words)) {
        const fetchedWords = response.data.words.map((item) => item.en_word).filter(Boolean);

        if (fetchedWords.length === 0) {
          throw new Error('No valid words found in the response');
        }

        setWords(fetchedWords.slice(0, TOTAL_ROUNDS)); // 총 라운드에 맞춰 단어 제한
        setWord(fetchedWords[0]); // 첫 번째 단어 설정

        console.log('Fetched Words:', fetchedWords);
      } else {
        throw new Error('Invalid response data structure');
      }
    } catch (error) {
      console.error('Failed to fetch words:', error.message);
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
    setResults((prevResults) => [
      ...prevResults,
      {
        word,
        status: gameStatus === 'win' ? 'success' : 'fail',
      },
    ]);

    const nextRound = round + 1;

    if (nextRound <= TOTAL_ROUNDS) {
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
      // 모든 라운드 완료 시 결과 페이지로 이동
      navigate('/result-single', { state: { results } });
    }
  };

  const handleKeyPress = (event) => {
    const moveDistance = 20;

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
    } else if (event.key === 'Backspace') {
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
    } else {
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
    if (words.length === 0) {
      fetchWordsFromBackend();
    }
  }, []);

  useEffect(() => {
    if (gameStatus === 'ongoing') {
      const timerInterval = setInterval(() => {
        setPlayer((prevPlayer) => {
          if (prevPlayer.timer > 0) {
            return { ...prevPlayer, timer: prevPlayer.timer - 1 };
          } else {
            clearInterval(timerInterval);
            setGameStatus('lose'); // 제한 시간 초과로 패배 처리
            return prevPlayer;
          }
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    } else if (gameStatus === 'lose') {
      // 실패 상태에서 2초 후 다음 라운드로 이동
      const timeout = setTimeout(() => {
        startNextRound();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [gameStatus]);

  useEffect(() => {
    if (word) {
      setLetters(generateRandomLetters(word));
    }
  }, [word]);

  useEffect(() => {
    if (player.collectedLetters.length === 0 || !word) return;

    const collectedWord = player.collectedLetters.join('');
    if (collectedWord === word) {
      setGameStatus('win');
      setTimeout(startNextRound, 2000); // 2초 후에 다음 라운드 시작
    }
  }, [player.collectedLetters, word]);

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
      {gameStatus === 'complete' ? (
        <div>
          <h2 className="text-2xl font-bold">게임 결과</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                단어: {result.word}, 결과: {result.status === 'success' ? '성공' : '실패'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default GameSingle;
