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
  const [words, setWords] = useState([]);
  const [player, setPlayer] = useState({
    name: localStorage.getItem('memberId'), // 현재 로그인한 사용자
    timer: INITIAL_TIMER,
    position: { x: 100, y: 100 },
    collectedLetters: [],
  });
  const [letters, setLetters] = useState([]);
  const [gameStatus, setGameStatus] = useState('ongoing'); // 'ongoing', 'win', 'lose', 'complete'
  const [results, setResults] = useState([]);
  const [activeCharacter, setActiveCharacter] = useState(null); // 활성 캐릭터
  const [popupMessage, setPopupMessage] = useState(null); // 팝업 메시지 상태
  const navigate = useNavigate();

  const fetchWordsFromBackend = async () => {
    try {
      const memberId = localStorage.getItem('memberId');
      const response = await axios.get('http://localhost:8000/game/singleplay', {
        params: { member_id: memberId },
      });

      if (response.data && response.data.words && Array.isArray(response.data.words)) {
        const fetchedWords = response.data.words.map((item) => ({
          id: item.word_id, // word_id 포함
          word: item.en_word,
        }));
        if (fetchedWords.length === 0) {
          throw new Error('No valid words found in the response');
        }

        setWords(fetchedWords.slice(0, TOTAL_ROUNDS));
        setWord(fetchedWords[0].word);

        // 게임 ID 저장
        localStorage.setItem('gameId', response.data.game_id);

        console.log('Fetched Words:', fetchedWords);
      } else {
        throw new Error('Invalid response data structure');
      }
    } catch (error) {
      console.error('Failed to fetch words:', error.message);
    }
  };

  const fetchActiveCharacter = async () => {
    try {
      const memberId = localStorage.getItem('memberId');
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:8000/characters/active', {
        headers: { Authorization: `Bearer ${token}` },
        params: { memberId },
      });

      if (response.data) {
        setActiveCharacter(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch active character:', error.message);
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
      x: Math.random() * 700 + 50,
      y: Math.random() * 300 + 50,
    }));
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
          const droppedLetter = prevPlayer.collectedLetters.pop();
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
            collectedLetters: [...prevPlayer.collectedLetters],
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
            newPosition.x = Math.min(newPosition.x+ moveDistance, 750);
            break;
          default:
            return prevPlayer;
        }
        return { ...prevPlayer, position: newPosition };
      });
    }
  };

  const calculateScore = (results) => {
    return results.reduce((score, result) => {
      return score + (result.status === 'success' ? 20 : 0);
    }, 0);
  };

  const startNextRound = async () => {
    const currentResult = gameStatus === 'win' ? 'success' : 'fail';
    const updatedResults = [
      ...results,
      {
        word_id: words[round - 1]?.id || null,
        word,
        status: currentResult,
      },
    ];

    setResults(updatedResults);

    const nextRound = round + 1;

    if (nextRound <= TOTAL_ROUNDS) {
      setRound(nextRound);
      setWord(words[nextRound - 1].word);
      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        timer: INITIAL_TIMER,
        collectedLetters: [],
        position: { x: 100, y: 100 },
      }));
      setLetters(generateRandomLetters(words[nextRound - 1].word));
      setGameStatus('ongoing');
    } else {
      try {
        const memberId = localStorage.getItem('memberId');
        const gameId = localStorage.getItem('gameId');
        await axios.post('http://localhost:8000/game/roundplay/result', {
          member_id: memberId,
          results: updatedResults,
          game_id: gameId,
        });
        console.log('Results successfully sent to the server');
      } catch (error) {
        console.error('Failed to send results:', error);
      }
      navigate('/result-single', {
        state: { results: updatedResults, character: activeCharacter, score: calculateScore(updatedResults) },
      });
    }
  };

  useEffect(() => {
    fetchWordsFromBackend();
    fetchActiveCharacter();
  }, []);

  useEffect(() => {
    if (word) {
      setLetters(generateRandomLetters(word));
    }
  }, [word]);

  useEffect(() => {
    if (gameStatus === 'ongoing') {
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
    }
  }, [gameStatus]);

  useEffect(() => {
    if (player.collectedLetters.length === 0 || !word) return;

    const collectedWord = player.collectedLetters.join('');
    if (collectedWord === word) {
      setGameStatus('win');
    }
  }, [player.collectedLetters, word]);

  useEffect(() => {
    if (gameStatus === 'win') {
      setPopupMessage('승리!');
      setTimeout(() => {
        setPopupMessage(null);
        startNextRound();
      }, 2000);
    } else if (gameStatus === 'lose') {
      setPopupMessage('실패!');
      setTimeout(() => {
        setPopupMessage(null);
        startNextRound();
      }, 2000);
    }
  }, [gameStatus]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player, letters]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {popupMessage && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-6 rounded-lg shadow-lg text-center z-50"
        >
          <p className="text-xl font-bold">{popupMessage}</p>
        </div>
      )}
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
        <img
          src={activeCharacter?.image || 'default-character.png'}
          alt={activeCharacter?.name || 'Player'}
          className="w-14 h-14 absolute object-contain"
          style={{
            left: `${player.position.x}px`,
            top: `${player.position.y}px`,
          }}
        />
        {player.collectedLetters.map((letter, index) => (
          <div
            key={index}
            className="absolute bg-white text-black text-sm font-bold px-2 py-1 border rounded"
            style={{
              left: `${player.position.x + index * 30}px`,
              top: `${player.position.y - 30}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {letter}
          </div>
        ))}
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
    </div>
  );
};

export default GameSingle;
