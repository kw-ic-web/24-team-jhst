import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

function Main() {
  const socket = useSocket();
  const [isRoundStarting, setIsRoundStarting] = useState(false); // 라운드 시작 상태
  const [showSelection, setShowSelection] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [point, setPoint] = useState(0);
  const [isMatching, setIsMatching] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const navigate = useNavigate();
  const [catPosition, setCatPosition] = useState(0); // 고양이 위치 상태
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate('/login');
    } else {
      axios
        .get('https://team10.kwweb.duckdns.org/login/verifyToken', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          return axios.get('https://team10.kwweb.duckdns.org/users/viewInfo', {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
        .then((response) => {
          setPoint(response.data.point);
        })
        .catch(() => {
          alert("로그인이 만료되었습니다.");
          localStorage.removeItem('token');
          navigate('/login');
        });
    }
  }, [navigate]);

  // 활성화된 캐릭터 정보 가져오기
  useEffect(() => {
    const fetchActiveCharacter = async () => {
      const token = localStorage.getItem('token');
      const memberId = localStorage.getItem('memberId');
      if (!token || !memberId) {
        console.error('토큰 또는 memberId가 없습니다.');
        return;
      }

      try {
        const response = await axios.get(`https://team10.kwweb.duckdns.org/characters/active?memberId=${memberId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActiveCharacter(response.data);
      } catch (error) {
        console.error('활성 캐릭터 로드 오류:', error);
      }
    };

    fetchActiveCharacter();
  }, []);

  // 매칭 완료 이벤트
  useEffect(() => {
    socket.on('matched', (roomName, { myPlayer, otherPlayer,game_id, rounds }) => {
      setIsMatching(false);
      navigate('/game-multi', { state: { myPlayer, otherPlayer, roomName,game_id, rounds, selectedMode } }); // 게임 화면으로 이동
    });

    socket.on('msg', (message) => {
      console.log(message); // 대기 중 메시지 로그
    });

    socket.on('opponentDisconnected', () => {
      alert('상대방이 접속을 종료했습니다.');
      setIsMatching(false);
    });

    return () => {
      socket.off('matched');
      socket.off('msg');
      socket.off('opponentDisconnected');
    };
  }, [navigate, selectedMode]);

  const handleGameStartClick = () => {
    setShowSelection(true);
  };

  const handleGameStart = () => {
    if (selectedMode && selectedDifficulty) {
      const token = localStorage.getItem('token');
      const member_id = token; 

      alert(`모드: ${selectedMode}, 난이도: ${selectedDifficulty}`);
      setShowSelection(false);
      setIsMatching(true);

      // 서버로 매칭 요청
      socket.emit('matching', {
        mode: selectedMode,
        difficulty: selectedDifficulty,
        member_id,
      });
    } else {
      alert('모드와 난이도를 선택하세요.');
    }
  };

  const handleCancelMatching = () => {
    // 매칭 취소 요청
    socket.emit('cancelMatching');
    setIsMatching(false);
    alert('매칭이 취소되었습니다.');
  };

  const handleCloseModal = () => {
    setShowSelection(false);
  };

  useEffect(() => {
    const moveCat = () => {
      setCatPosition((prevPosition) => {
        const newPosition = prevPosition + direction * 5; 
        if (newPosition > 300 || newPosition < -300) {
          setDirection((prevDirection) => -prevDirection); 
        }
        return newPosition;
      });
    };

    const intervalId = setInterval(moveCat, 50);
    return () => clearInterval(intervalId);
  }, [direction]);
 
 
  return (
    <div className="min-h-screen flex flex-col max-w-6xl mx-auto pt-24 bg-white">
      {/*  상단 바  */}
      <div className="h-16 bg-white flex justify-between items-center px-8 ">
        {/* 설정 버튼 */}
        <button
          className=" w-1/5 bg-customWhite text-white py-3 text-xl rounded-lg px-6  hover:bg-gray-400 transition duration-200 shadow-sm"
          onClick={() => navigate('/setting')}
        >
          ⚙️ 설정
        </button>
  
        <div className="flex space-x-4 items-center">
          {/* 상점 버튼 */}
          <button
            className=" bg-customWhite text-white py-3 text-xl rounded-lg px-6  hover:bg-gray-400 transition duration-200 shadow-sm"
            onClick={() => navigate('/shop')}
          >
            🛒 상점
          </button>
          {/* 보유 포인트 */}
          <div className="bg-yellow-400 text-black  py-3 text-xl rounded-lg px-6  hover:bg-gray-400 transition duration-200 shadow-sm">
            포인트 : {point}
          </div>
        </div>
      </div>
  
      {/*  메인 콘텐츠  */}
      <div className="flex flex-1 p-8">
        {/* 왼쪽 사이드바 */}
        <div className="flex flex-col space-y-6 w-1/5">
          <button
            className="w-full  bg-main02 text-white py-3 text-xl rounded-lg hover:bg-gray-400 transition duration-200 shadow-sm"
            onClick={() => navigate('/ranking')}
          >
            🏆 랭킹
          </button>
          <button
            className="w-full bg-main02 text-white py-3 text-xl rounded-lg hover:bg-gray-400 transition duration-200 shadow-sm"
            onClick={() => navigate('/wrong-note')}
          >
            ✏️ 오답노트
          </button>
        </div>
  
        {/* 중앙 콘텐츠 */}
        <div className="w-3/4 flex flex-col items-center justify-center">
          {activeCharacter ? (
            <img
              src={activeCharacter.image}
              alt={activeCharacter.name}
              className="w-52 h-52 mb-8 object-contain relative"
              style={{ left: `${catPosition}px`, transition: 'left 0.05s linear' }}
            />
          ) : (
            <p className="font-bold text-xl mb-8 text-red-500">
              선택된 캐릭터가 없습니다. 상점에서 선택해주세요.
            </p>
          )}
          {!isMatching ? (
            <button
              onClick={handleGameStartClick}
              className="w-full bg-main01 text-white py-4 text-xl rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
            >
              🚀 멀티플레이 시작
            </button>
          ) : (
            <div className="w-full">
              <p className="text-center text-lg font-bold text-gray-700 mb-4">매칭 중입니다...</p>
              <button
                onClick={handleCancelMatching}
                className="w-full bg-red-400 text-white py-4 text-xl rounded-lg hover:bg-red-700 transition duration-200 shadow-md"
              >
                ❌ 매칭 취소
              </button>
            </div>
          )}
        </div>
      </div>
  
      {/* 모드 및 난이도 선택 모달 */}
      {showSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg text-black relative w-full max-w-sm">
              <button
                onClick={handleCloseModal}
              className="absolute font-bold top-3 right-4 text-gray-500 hover:text-black text-3xl"
            >
              &times;
            </button>
  
            <h2 className="text-xl mt-2 font-bold mb-4 text-center">📍 모드와 난이도를 선택하세요</h2>
  
            <div className="mb-4">
              <h3 className="text-lg mb-4 text-center"> 1️⃣ 모드 선택</h3>
              <div className="flex justify-between">
                <button
                  onClick={() => setSelectedMode('english')}
                  className={`py-2 px-4 w-1/2 rounded-md mr-2 border-2 ${
                    selectedMode === 'english' ? 'bg-main01 text-white border-main01' : 'bg-gray-200 border-gray-300'
                  }`}
                >
                  영어
                </button>
                <button
                  onClick={() => setSelectedMode('korea')}
                  className={`py-2 px-4 w-1/2 rounded-md border-2 ${
                    selectedMode === 'korea' ? 'bg-main01 text-white border-main01' : 'bg-gray-200 border-gray-300'
                  }`}
                >
                  한글
                </button>
              </div>
            </div>
  
            <div className="mb-4">
              <h3 className="text-lg mb-4 text-center"> 2️⃣ 난이도 선택</h3>
              <div className="flex justify-between">
                <button
                  onClick={() => setSelectedDifficulty('easy')}
                  className={`py-2 px-4 w-1/2 rounded-md mr-2 border-2 ${
                    selectedDifficulty === 'easy' ? 'bg-main01 text-white border-main01' : 'bg-gray-200 border-gray-300'
                  }`}
                >
                  EASY
                </button>
                <button
                  onClick={() => setSelectedDifficulty('hard')}
                  className={`py-2 px-4 w-1/2 rounded-md border-2 ${
                    selectedDifficulty === 'hard' ? 'bg-main01 text-white border-main01' : 'bg-gray-200 border-gray-300'
                  }`}
                >
                  HARD
                </button>
              </div>
            </div>
  
            <button
              onClick={handleGameStart}
              className="w-full bg-main02 text-white py-3 px-4 rounded-md mt-1 border-2 border-main02"
            >
              게임 시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  
}

export default Main;
