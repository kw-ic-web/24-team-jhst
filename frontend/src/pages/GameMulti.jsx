import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useCallback,useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PlayerScore = ({ name, score }) => (
  <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
    <p>{name}</p>
    <p>{score}점</p>
  </div>
);

const GameMulti = () => {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { myPlayer, otherPlayer, roomName, game_id, rounds, selectedMode } = location.state || {};

  const [round, setRound] = useState(5);
  const [word, setWord] = useState('');
  const [letters, setLetters] = useState([]);
  const [players, setPlayers] = useState([
    { name: '',member_id:'', socket_id: '', score: 0, position: { x: 0, y: 0 }, collectedLetters: [], wrong:[], },
    { name: '',member_id:'', socket_id: '', score: 0, position: { x: 0, y: 0 }, collectedLetters: [], wrong:[], },
  ]);


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
          name: `나: ${myPlayer.member_id}`,
          member_id: myPlayer.member_id,
          socket_id: myPlayer.id,
          score: 0,
          position: { x: myPlayer.x, y: myPlayer.y },
        },
        {
          name: `상대방: ${otherPlayer.member_id}`,
          member_id: otherPlayer.member_id,
          socket_id: otherPlayer.id,
          score: 0,
          position: { x: otherPlayer.x, y: otherPlayer.y },
        },
      ]);
    }
  }, [myPlayer, otherPlayer]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isBackspaceProcessing, setIsBackspaceProcessing] = useState(false);

  // 키 입력 처리
  const handleKeyPress = useCallback(
    (event) => {
      console.log('Key pressed:', event.key);
      const moveDistance = 20;
  
      if (event.key === 'Enter' && !isProcessing) {
        setIsProcessing(true); // enter 
      } else if (event.key === 'Backspace' && !isBackspaceProcessing) {
        setIsBackspaceProcessing(true); //backspace
      } else {
        setPlayers((prevPlayers) => {
          const newPosition = { ...prevPlayers[0]?.position };
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
    },
    [isProcessing, isBackspaceProcessing, players, socket, roomName]
  );
  
  //enter
  useEffect(() => {
    if (isProcessing) {
      
        const playerPos = players[0]?.position;
        if (!playerPos) {
            setIsProcessing(false);
            return;
        }

        let closestIndex = -1;
        let minDistance = Infinity;

        letters.forEach((letterObj, index) => {
            const dx = letterObj.x - playerPos.x;
            const dy = letterObj.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 30 && distance < minDistance) {
                closestIndex = index;
                minDistance = distance;
            }
        });

        if (closestIndex !== -1) {
            const collectedLetter = letters[closestIndex];
            const updatedLetters = letters.filter((_, index) => index !== closestIndex);
            setLetters(updatedLetters); // 알파벳 리스트 업데이트


    // 소켓을 통해 업데이트된 알파벳 리스트 전송
            socket.emit('updateLetters', {
              roomName,
              updatedLetters,
          });
      

            setPlayers((prevPlayers) => {
                const updatedPlayers = [...prevPlayers];
                updatedPlayers[0] = {
                    ...updatedPlayers[0],
                    collectedLetters: [
                        ...(updatedPlayers[0]?.collectedLetters || []),
                        collectedLetter.letter,
                    ],
                };
                console.log("보유단어",updatedPlayers[0]?.collectedLetters);
                // 소켓으로 업데이트된 데이터 전송
                socket.emit('updateWord', {
                    roomName,
                    letter: updatedPlayers[0].collectedLetters.join(''),
                    playerId: updatedPlayers[0].socket_id,
                });

                return updatedPlayers;
            });
        }

        setIsProcessing(false); // 상태 업데이트 완료 후 처리 해제
    }
}, [isProcessing, letters, players, roomName, socket]);

// Backspace
useEffect(() => {
  if (isBackspaceProcessing) {
    console.log("backspace 호출");
    setPlayers((prevPlayers) => {
      if (prevPlayers[0]?.collectedLetters.length > 0) {
        const droppedLetter = prevPlayers[0].collectedLetters.slice(-1)[0];

        // 새로운 알파벳 추가 후 업데이트
        const updatedLetters = [
          ...letters,
          {
            letter: droppedLetter,
            x: prevPlayers[0].position.x,
            y: prevPlayers[0].position.y,
          },
        ];

        setLetters(updatedLetters); // 알파벳 리스트 업데이트

        // 소켓을 통해 알파벳 리스트 전송
        socket.emit('updateLetters', {
          roomName,
          updatedLetters,
        });

        const updatedPlayers = [...prevPlayers];
        updatedPlayers[0] = {
          ...updatedPlayers[0],
          collectedLetters: updatedPlayers[0].collectedLetters.slice(0, -1),
        };

        // 소켓을 통해 업데이트된 단어 전송
        socket.emit('updateWord', {
          roomName,
          letter: updatedPlayers[0].collectedLetters.join(''),
          playerId: updatedPlayers[0].socket_id,
        });

        return updatedPlayers;
      }

      return prevPlayers;
    });
    setIsBackspaceProcessing(false);
  }
}, [isBackspaceProcessing, letters, players, roomName, socket]);

  

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

  useEffect(() => {
    // 서버로부터 업데이트된 알파벳 리스트 수신
    socket.on('receiveUpdatedLetters', ({ updatedLetters }) => {
        setLetters(updatedLetters); // 상대방의 화면에서 알파벳 리스트 업데이트
    });

    return () => {
        socket.off('receiveUpdatedLetters'); // 이벤트 정리
    };
}, [socket]);


  // 다른 플레이어 단어 업데이트 수신
  useEffect(() => {
    const handleReceiveWord = ({  updateLetter = '', playerId }) => {
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
  
    return () => {
      socket.off('receiveWord', handleReceiveWord);
    };
  }, [socket]);

   //정답확인 승리처리
   useEffect(()=>{
    console.log(`내 collectedLetters ${players[0].collectedLetters?.join('')}`)

    //정답확인
    if (players[0]?.collectedLetters?.length>0 && 
      players[0].collectedLetters.join('') === rounds[`round${round}`]?.en_word) {
      console.log("정답 맞춤!");
      socket.emit("answer",{
        roomName,
        playerId: players[0].socket_id});
    }

    //winner수신
    const handleAlertWinner = (winnerId) => {
      const winner = players.find((player) => player.socket_id === winnerId)?.name;
      if (winner) {
        alert(`이긴사람 is ${winner}`);

        // 이긴 사람의 점수 20점 증가
        setPlayers((prevPlayers) =>{
        
          const updatedPlayers = prevPlayers.map((player) => ({
            ...player,
            score: player.socket_id === winnerId ? player.score + 60 : player.score,
            wrong: player.socket_id === winnerId
              ? player.wrong // 이긴 사람은 변경 없음
              : [...(player.wrong || []), round], // 지는 사람은 wrong 배열에 round 추가
          }));
          
          console.log("Updated Players:", updatedPlayers);
          console.log("Player 0 wrong list:", updatedPlayers[0]?.wrong);
          console.log("Player 1 wrong list:", updatedPlayers[1]?.wrong);

          
          
          // 5라운드가 끝난 후 navigate
          if (round >= 5) {
            navigate("/result-multi", {
              state: { players: updatedPlayers, rounds ,game_id,},
            });
          }
          return updatedPlayers;
        });

      // 라운드 넘기기
      setTimeout(() => {
        if (round < 5) {
          setRound((prevRound) => prevRound + 1);
        }
      }, 2000); 

        //player의 단어 초기화
        setPlayers((prevPlayers) => {
          return prevPlayers.map((player) => ({
            ...player,
            collectedLetters: [], 
          }));
        });

      }
    };

    socket.on('alertWinner', handleAlertWinner);

    return () => {
      socket.off("alertWinner"); 
    };
  },[players, rounds, round, socket, roomName,navigate]);


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
            {players[0]?.collectedLetters?.map((letter, index) => (
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