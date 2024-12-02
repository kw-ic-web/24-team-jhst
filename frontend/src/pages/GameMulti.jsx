import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useCallback } from 'react';

const PlayerScore = ({ name, score }) => (
  <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
    <p>{name}</p>
    <p>{score}점</p>
  </div>
);

const GameMulti = () => {
  const socket = useSocket();
  const location = useLocation();
  const { myPlayer, otherPlayer, roomName, rounds, selectedMode } = location.state || {};

  const [round, setRound] = useState(1);
  const [word, setWord] = useState('');
  const [letters, setLetters] = useState([]);
  const [players, setPlayers] = useState([]);
  const [collectedLetters, setCollectedLetters] = useState([]);

  // 라운드 단어 설정
  useEffect(() => {
    if (rounds && rounds[`round${round}`]) {
      if (selectedMode === 'english') {
        setWord(rounds[`round${round}`].en_word);
      } else if (selectedMode === 'korea') {
        setWord(rounds[`round${round}`].ko_word);
      }
    }
  }, [rounds, round, selectedMode]);

  // 서버로부터 알파벳 요청 및 수신
  useEffect(() => {
    if (word) {
      socket.emit('requestLetters', { word, roomName });

      socket.on('updateLetters', (sharedLetters) => {
        setLetters(sharedLetters);
      });

      return () => {
        socket.off('updateLetters');
      };
    }
  }, [word, socket, roomName]);

  // 플레이어 초기화
  useEffect(() => {
    if (myPlayer && otherPlayer) {
      setPlayers([
        {
          name: `플레이어 1: ${myPlayer.member_id}`,
          socket_id: myPlayer.id,
          score: 0,
          position: { x: myPlayer.x, y: myPlayer.y },
        },
        {
          name: `플레이어 2: ${otherPlayer.member_id}`,
          socket_id: otherPlayer.id,
          score: 0,
          position: { x: otherPlayer.x, y: otherPlayer.y },
        },
      ]);
    }
  }, [myPlayer, otherPlayer]);

  // 키 입력 처리
  const handleKeyPress  = useCallback((event) => {
    console.log('Key pressed:', event.key); 
    const moveDistance = 20;

    if (event.key === 'Enter') {
      setLetters((prevLetters) => {
        const playerPos = players[0].position;
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
          setCollectedLetters((prevCollected) => {
            const updatedCollected = [...prevCollected, collectedLetter.letter];
            console.log(`Enter로 얻은 글자: ${collectedLetter.letter}`);
            console.log(`현재 보유 알파벳: ${updatedCollected.join(', ')}`);
    
            socket.emit('updateWord', {
              roomName,
              letter: updatedCollected.join(''),
              playerId: players[0]?.socket_id,
            });
    
            return updatedCollected;
          });
    
          return prevLetters.filter((_, index) => index !== closestIndex);
        }
        return prevLetters;
      });
    } else if (event.key === 'Backspace') {
      setCollectedLetters((prevCollectedLetters) => {
        if (prevCollectedLetters.length > 0) {
          const droppedLetter = prevCollectedLetters.slice(-1)[0];
          setLetters((prevLetters) => [
            ...prevLetters,
            {
              letter: droppedLetter,
              x: players[0].position.x,
              y: players[0].position.y,
            },
          ]);
          const updatedCollected = prevCollectedLetters.slice(0, -1);
          console.log(`Backspace로 뱉은 글자: ${droppedLetter}`);
          console.log(`현재 보유 알파벳: ${updatedCollected.join(', ')}`);

          // 백엔드로 전송
          socket.emit('updateWord', {
            roomName,
            letter: updatedCollected.join(''), // 문자열로 변환하여 전송
            playerId: players[0]?.socket_id,
          });
          return updatedCollected;
        }

        console.log('Backspace를 눌렀으나 뱉을 글자가 없습니다.');
        return prevCollectedLetters;
      });
    } else {
      setPlayers((prevPlayers) => {
        const newPosition = { ...prevPlayers[0].position };
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
            return prevPlayers;
        }
        const updatedPlayers = [...prevPlayers];
        updatedPlayers[0] = { ...updatedPlayers[0], position: newPosition };

        // 위치 정보를 서버에 전송
        socket.emit('updatePosition', {
          roomName,
          player: {
            id: socket.id,
            position: newPosition,
          },
        });

        return updatedPlayers;
      });
    }
  }, [players, socket, roomName]);

  

  // 키 이벤트 리스너 관리
  useEffect(() => {
    const keyPressHandler = (event) => handleKeyPress(event);
  window.addEventListener('keydown', keyPressHandler);
  return () => window.removeEventListener('keydown', keyPressHandler);
}, [handleKeyPress]);

  // 다른 플레이어 위치 업데이트 수신
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
  }, [socket]);

  // 다른 플레이어 단어 업데이트 수신
  useEffect(() => {
    const handleReceiveWord = ({  updateLetter = '', playerId }) => {
      console.log(`소켓한테  "${updateLetter}" from Player ${playerId}`);
      setPlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers];
        const playerIndex = updatedPlayers.findIndex(
          (player) => player.socket_id === playerId
        );
  
        if (playerIndex !== -1) {
          updatedPlayers[playerIndex].collectedLetters = updateLetter.split(''); // 문자열을 배열로 변환
          console.log(
            `분리한거${playerId}:`,
            updatedPlayers[playerIndex].collectedLetters
          );
        }
  
        return updatedPlayers;
      });
    };
  
    socket.on('receiveWord', handleReceiveWord);
  
    // Cleanup
    return () => {
      socket.off('receiveWord', handleReceiveWord);
    };
  }, [socket]);

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
        >
          {/* 나의 단어 표시 */}
          <div
            className="absolute top-[-30px] left-0 flex gap-1"
            style={{ whiteSpace: 'nowrap' }}
          >
            {collectedLetters.map((letter, index) => (
              <span
                key={index}
                className="text-white bg-black text-sm px-2 py-1 rounded"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
        <div
          className="bg-red-500 w-12 h-12 rounded-full absolute"
          style={{
            left: `${players[1]?.position.x || 0}px`,
            top: `${players[1]?.position.y || 0}px`,
          }}
        >
          {/* 상대방의 단어 표시 */}
          <div
            className="absolute top-[-30px] left-0 flex gap-1"
            style={{ whiteSpace: 'nowrap' }}
          >
            {players[1]?.collectedLetters?.map((letter, index) => (
              <span
                key={index}
                className="text-white bg-black text-sm px-2 py-1 rounded"
              >
                {letter}
              </span>
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
    </div>
  );
};

export default GameMulti;