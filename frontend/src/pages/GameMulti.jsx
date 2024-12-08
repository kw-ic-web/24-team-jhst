import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlayerScore = ({ name, score }) => (
  <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
    <p >{name}</p>
    <p className='text-lg font-semibold'>{score} 점</p>
  </div>
);

const GameMulti = () => {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { myPlayer, otherPlayer, roomName, game_id, rounds, selectedMode } = location.state || {};
  const [showRoundModal, setShowRoundModal] = useState(false); //라운드 모달창
  const [isGameOverModal, setIsGameOverModal] = useState(false); // 게임 종료 모달
  const [round, setRound] = useState(1);
  const [word, setWord] = useState('');
  const [mode, setMode] = useState('');
  const [letters, setLetters] = useState([]);
  const [players, setPlayers] = useState([
    { name: '',member_id:'', socket_id: '', score: 0, position: { x: 0, y: 0 }, collectedLetters: [], wrong:[], },
    { name: '',member_id:'', socket_id: '', score: 0, position: { x: 0, y: 0 }, collectedLetters: [], wrong:[], },
  ]);

  const [activeCharacter, setActiveCharacter] = useState(null);
   // 내 캐릭터 데이터
   const fetchActiveCharacter = async () => {
    try {
      const memberId = localStorage.getItem('memberId');
      const token = localStorage.getItem('token');

      const response = await axios.get('https://team10.kwweb.duckdns.org/characters/active', {
        headers: { Authorization: `Bearer ${token}` },
        params: { memberId },
      });

      if (response.data) {
        setActiveCharacter(response.data);

        // 내 캐릭터 데이터를 players[0]에 추가
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          updatedPlayers[0] = {
            ...updatedPlayers[0],
            character: response.data,
          };
          return updatedPlayers;
        });

        socket.emit('shareCharacter', {
          roomName,
          character: response.data,
          playerId: socket.id, // 내 소켓 ID
        });
      }
    } catch (error) {
      console.error('Failed to fetch active character:', error.message);
    }
  };

  useEffect(() => {
    fetchActiveCharacter();
  }, []);

  // 플레이어 초기화
 /* useEffect(() => {
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
  }, [myPlayer, otherPlayer]); */ //코드 중복

  // 새로고침 및 페이지 이동 차단
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // 경고 메시지 표시
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 라운드 단어 설정
  useEffect(() => {
    if (rounds && rounds[`round${round}`]) {
      // 모달 표시
      setShowRoundModal(true);
      setWord(rounds[`round${round}`].en_word);
      if (selectedMode === 'english') {
        setMode(rounds[`round${round}`].en_word)
      } else if (selectedMode === 'korea') {
        setMode(rounds[`round${round}`].ko_word);
      }
      // 3초 후 모달 닫기
      const timer = setTimeout(() => {
        setShowRoundModal(false);
      }, 2000);

      // 타이머 정리
      return () => clearTimeout(timer);
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
          name: `나 : ${myPlayer.member_id}`,
          member_id: myPlayer.member_id,
          socket_id: myPlayer.id,
          score: 0,
          position: { x: myPlayer.x, y: myPlayer.y },
        },
        {
          name: `상대방 : ${otherPlayer.member_id}`,
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
        }
  
        return updatedPlayers;
      });
    };
  
    socket.on('receiveWord', handleReceiveWord);
  
    return () => {
      socket.off('receiveWord', handleReceiveWord);
    };
  }, [socket]);


//캐릭터 소켓
  useEffect(() => {
    const handleReceiveCharacter = ({ playerId, character }) => {
  
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.socket_id === playerId ? { ...player, character } : player
        )
      );
    };
  
    socket.on('receiveCharacter', handleReceiveCharacter);
  
    return () => {
      socket.off('receiveCharacter', handleReceiveCharacter);
    };
  }, [socket]);

   //정답확인 승리처리
   useEffect(()=>{

    //정답확인
    if (players[0]?.collectedLetters?.length>0 && 
      players[0].collectedLetters.join('') === rounds[`round${round}`]?.en_word) {
      socket.emit("answer",{
        roomName,
        playerId: players[0].socket_id});

      
    }

    //winner수신
    const handleAlertWinner = (winnerId) => {
      const winner = players.find((player) => player.socket_id === winnerId)?.name;
      if (winner) {

        // 이긴 사람의 점수 20점 증가
        setPlayers((prevPlayers) =>{
        
          const updatedPlayers = prevPlayers.map((player) => {
            if (player.socket_id === winnerId) {
              // 이긴 사람 처리
              return { ...player, score: player.score + 20 };
            } else {
              // 진 사람 처리 - 중복 값 방지
              const updatedWrong =  (player.wrong || []).includes(round)
                ? player.wrong // 이미 있으면 그대로 유지
                :[...(player.wrong || []), round]; // 없으면 추가
              return { ...player, wrong: updatedWrong };
            }
          });
          

          
          
          // 라운드 넘기기
          if (round >= 5) {
            setIsGameOverModal(true);
            setTimeout(()=>{
              setIsGameOverModal(false);
              navigate("/result-multi", {
                state: { players: updatedPlayers, rounds, game_id },
              });
            }, 2000); 
          } else {
            setRound((prevRound) => prevRound + 1);
          }


          // player의 단어 초기화
          return updatedPlayers.map((player) => ({
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

  //상대가 접속을 종료했을때
  useEffect(() => {
    const handleOpponentDisconnected = () => {
      alert('상대방이 접속을 종료하였습니다.');
      navigate('/main');
    };
  
    socket.on('opponentDisconnected', handleOpponentDisconnected);
  
    return () => {
      socket.off('opponentDisconnected', handleOpponentDisconnected);
    };
  }, [socket, navigate]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      
      {/* 라운드 모달 */}
      {showRoundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-120 p-8 rounded-lg shadow-lg text-center text-black h-40 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">
              {`Round : ${round}`}
            </h2>
            <p className="text-xl font-bold">😸 준비하세요 !</p>
          </div>
        </div>
      )}
      {/* 게임 종료 모달 */}
      {isGameOverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-120 p-8 rounded-lg shadow-lg text-center text-black h-40 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">게임 종료 !</h2>
            <p className="text-xl font-bold"> 😸 결과를 확인하세요 !</p>
          </div>
        </div>
      )}

      
      {/* 게임 화면 */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-4 space-x-4">
        <PlayerScore name={players[0]?.name} score={players[0]?.score || 0} />
        
        {/* 라운드 정보 */}
        <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
          <p className="text-md">라운드</p>
          <p className="text-lg font-semibold">{round} / 5</p>
        </div>
        <PlayerScore name={players[1]?.name} score={players[1]?.score || 0} />
      </div>
      <div className="text-center bg-main01 text-white p-4 rounded-md mb-4 max-w-4xl w-full">
        <span className='text-md'>제시 단어 :</span> <span className=' text-lg font-semibold'>{mode || '로딩 중...'}</span>
      </div>
      <div className="relative w-full max-w-4xl h-96 bg-white rounded-md">
         {/* 내 캐릭터 */}
         <div
          className="absolute"
          style={{
            left: `${players[0]?.position.x || 0}px`,
            top: `${players[0]?.position.y || 0}px`,
          }}
        >
          {activeCharacter ? (
            <img
              src={activeCharacter.image || 'default-character.png'}
              alt={activeCharacter.name || 'Player'}
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div 
              className="w-16 h-16 bg-main01 rounded-full" 
              style={{ width: '56px', height: '56px' }} 
            />
          )}

            {/* 내 알파벳 표시 */}
            <div
            className="absolute top-[-30px] left-0 flex gap-1"
            style={{ whiteSpace: 'nowrap' }}
          >
            {players[0]?.collectedLetters?.map((letter, index) => (
              <span
                key={index}
                className="text-white bg-black text-sm font-bold px-2 py-1 rounded"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>


        {/* 상대방 캐릭터 */}
        <div
          className="absolute"
          style={{
            left: `${players[1]?.position.x || 0}px`,
            top: `${players[1]?.position.y || 0}px`,
          }}
        >
            {players[1]?.character ? (
            <img
              src={players[1].character.image || 'default-character.png'}
              alt={players[1].character.name || 'Opponent'}
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div 
              className="w-16 h-16 bg-main02 rounded-full" 
              style={{ width: '56px', height: '56px' }} 
            />
          )}
          {/* 상대방의 알파벳 표시 */}
          <div
            className="absolute top-[-30px] left-0 flex gap-1"
            style={{ whiteSpace: 'nowrap' }}
          >
            {players[1]?.collectedLetters?.map((letter, index) => (
              <span
                key={index}
                className="text-white bg-black text-sm font-bold px-2 py-1 rounded"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
        {letters.map((letterObj, index) => (
          <div
            key={index}
            className="absolute text-black text-2xl font-bold"
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