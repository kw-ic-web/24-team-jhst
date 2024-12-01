import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

const PlayerScore = ({ name, score }) => (
  <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
    <p>{name}</p>
    <p>{score}점</p>
  </div>
);

const GameMulti = () => {
  const socket = useSocket();
  const location = useLocation();
  const { myPlayer, otherPlayer, roomName, rounds, selectedMode} = location.state || {}; // 전달된 상태 받기

  const [round, setRound] = useState(1);
  const [word, setWord] = useState('');
  const [roundWords, setRoundWords] = useState([]);
  const [letters, setLetters] = useState([]); // 추가된 상태
  const [players, setPlayers] = useState([]);
  const [collectedLetters, setCollectedLetters] = useState([]);

  // const generateRandomLetters = (currentWord) => {
  //   const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  //   const wordLetters = [...curredlntWord].sort(() => Math.random() - 0.5);
  //   const randomLetters = Array.from({ length: 10 }, () =>
  //     alphabet[Math.floor(Math.random() * alphabet.length)]
  //   );
  //   const allLetters = [...wordLetters, ...randomLetters].sort(
  //     () => Math.random() - 0.5
  //   );
  //   return allLetters.map((letter) => ({
  //     letter,
  //     x: Math.random() * 700 + 50, // 랜덤 X 위치
  //     y: Math.random() * 300 + 50, // 랜덤 Y 위치
  //   }));
    
  // };






  // /multiplay API 호출
  // useEffect(() => {
  //   const fetchWords = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8000/multiplay');

  //       const words = response.data;
  //       console.log('5라운드 단어:', words); // 단어 콘솔 출력
  //       setRoundWords(Object.values(words)); // 라운드 단어 설정
  //       setWord(Object.values(words)[0]?.en_word || ''); // 첫 라운드 단어 설정

  //       console.log('socket으로 가져온거',rounds);
  //     } catch (error) {
  //       console.error('단어를 가져오는 중 오류 발생:', error);
  //     }
  //   };

  //   fetchWords();
  // }, []);

  //단어 받아오기


  useEffect(() => {
    if (rounds && rounds[`round${round}`]) {
        if (selectedMode === 'english') {
            setWord(rounds[`round${round}`].en_word); // 영어 단어 설정
        } else if (selectedMode === 'korea') {
            setWord(rounds[`round${round}`].ko_word); // 한국어 단어 설정
        }
    }
}, [rounds, round, selectedMode]);

useEffect(() => {
  if (word) {
    // 서버에 랜덤 알파벳 요청
    socket.emit('requestLetters', { word, roomName });

    // 서버로부터 랜덤 알파벳 수신
    socket.on('updateLetters', (sharedLetters) => {
      setLetters(sharedLetters); // 수신한 알파벳으로 상태 업데이트
    });

    return () => {
      socket.off('updateLetters'); // 이벤트 클린업
    };
  }
}, [word, socket, roomName]);


  useEffect(() => {
    if (myPlayer && otherPlayer) {
      setPlayers([
        { name: `플레이어 1: ${myPlayer.member_id}`, socket_id: myPlayer.id, score: 0, position: { x: myPlayer.x, y: myPlayer.y },},
        { name: `플레이어 2: ${otherPlayer.member_id}`, socket_id: otherPlayer.id, score: 0, position: { x: otherPlayer.x, y: otherPlayer.y },},
      ]);
    }
  }, [myPlayer, otherPlayer]);

  // useEffect(() => {
  //   if (word) {
  //     setLetters(generateRandomLetters(word)); // 알파벳 무작위 배치
  //   }
  // }, [word]);

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
        case 'Enter':{
          setLetters((prevLetters)=>{
            const playerPos = newPosition;
            let closestIndex =-1;
            let minDistance = Infinity;

            //가장 가까운 알파벳
            prevLetters.forEach((letterObj,index)=>{
              const dx = letterObj.x - playerPos.x;
              const dy = letterObj.y - playerPos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < 30 && distance < minDistance) {
                closestIndex = index;
                minDistance = distance;
              }
            });

            if (closestIndex !== -1) {
              const collectedLetter = prevLetters[closestIndex].letter;
        
              setCollectedLetters((prevCollected) => {
                const updatedCollected = [...prevCollected, collectedLetter];
                console.log('Enter로 추가된 알파벳:', updatedCollected);
                return updatedCollected;
              });
        
              return prevLetters.filter((_, index) => index !== closestIndex);
            }
            return prevLetters;
          });
          break;
        }
        case 'Backspace':{
          setCollectedLetters((prevCollectedLetters) => {
            if (prevCollectedLetters.length > 0) {
              const droppedLetter = prevCollectedLetters[prevCollectedLetters.length - 1];
              console.log('Backspace로 제거된 알파벳:', droppedLetter);
        
              setLetters((prevLetters) => [
                ...prevLetters,
                { letter: droppedLetter, x: newPosition.x, y: newPosition.y },
              ]);
        
              return prevCollectedLetters.slice(0, -1);
            }
            console.log('Backspace를 눌렀지만 수집된 알파벳이 없습니다.');
            return prevCollectedLetters;
          });
          break;
        }
        default:
          return prevPlayers;
      }
  
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[0] = { ...updatedPlayers[0], position: newPosition };

      socket.emit('updatePosition', {
        roomName,
        player: {
          id: socket.id,
          position: newPosition,
        },
      });

      return updatedPlayers;
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    socket.on('updatePlayers', ({ id, x, y }) => {
      setPlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers];
        const playerIndex = updatedPlayers.findIndex(
          (player) => player.socket_id === id
        );
        if (playerIndex !== -1) {
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            position: { x, y },
          };
        }
        return updatedPlayers;
      });
    });

    return () => {
      socket.off('updatePlayers');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
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
      <div className="text-center bg-gray-300 p-4 rounded-md text-2xl mb-8 max-w-2xl w-full">
        {word || '로딩 중...'}
      </div>
      <div className="relative w-full max-w-4xl h-96 bg-white rounded-md">
        <div
          className="bg-blue-500 w-12 h-12 rounded-full absolute"
          style={{
            left: `${players[0]?.position.x || 0}px`,
            top: `${players[0]?.position.y || 0}px`,
          }}
        ></div>
        <div
          className="bg-red-500 w-12 h-12 rounded-full absolute"
          style={{
            left: `${players[1]?.position.x || 0}px`,
            top: `${players[1]?.position.y || 0}px`,
          }}
        ></div>
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

export default GameMulti;
