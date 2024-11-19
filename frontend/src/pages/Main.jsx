import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import meow3 from '../assets/images/meow3.png';
import axios from 'axios';

// 소켓 서버 연결
const socket = io('http://localhost:8000');

function Main() {
  const [showSelection, setShowSelection] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [point, setPoint] = useState(0);
  const [isMatching, setIsMatching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate('/login');
    } else {
      axios
        .get('http://localhost:8000/login/verifyToken', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          return axios.get('http://localhost:8000/users/viewInfo', {
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

  // 매칭 완료 이벤트
  useEffect(() => {
    socket.on('matched', (roomName, { myPlayer, otherPlayer }) => {
      alert(`매칭 성공! 방 이름: ${roomName}`);
      setIsMatching(false);
      navigate('/game-multi', { state: { myPlayer, otherPlayer, roomName } }); // 게임 화면으로 이동
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
  }, [navigate]);

  const handleGameStartClick = () => {
    setShowSelection(true);
  };

  const handleGameStart = () => {
    if (selectedMode && selectedDifficulty) {
      const token = localStorage.getItem('token');
      const member_id = token; // 사용자 ID (토큰 활용)

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

  return (
    <div className="min-h-screen bg-customWhite flex items-center justify-center p-8">
      <div className="bg-white p-8 w-full max-w-md">
        {/* 왼쪽 사이드바 */}
        <div className="flex flex-col space-y-4 mb-6">
          <button
            className="w-full bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition duration-200"
            onClick={() => navigate('/game-single')}
          >
            오답노트
          </button>
          <button
            className="w-full bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition duration-200"
            onClick={() => navigate('/ranking')}
          >
            랭킹
          </button>
          <button
            className="w-full bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition duration-200"
            onClick={() => navigate('/setting')}
          >
            설정
          </button>
        </div>

        {/* 가운데 캐릭터와 게임 시작/매칭 취소 버튼 */}
        <div className="flex flex-col items-center mb-6">
          <img src={meow3} alt="cat image" className="w-48 h-48 mb-6" />
          {!isMatching ? (
            <button
              onClick={handleGameStartClick}
              className="w-full bg-customGreen text-white py-3 rounded hover:bg-customBlue transition duration-200"
            >
              게임 시작
            </button>
          ) : (
            <div className="w-full">
              <p className="text-center text-gray-700 mb-2">매칭 중입니다...</p>
              <button
                onClick={handleCancelMatching}
                className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-700 transition duration-200"
              >
                매칭 취소
              </button>
            </div>
          )}
        </div>

        {/* 오른쪽 상단 코인 및 상점 버튼 */}
        <div className="flex flex-col items-end space-y-4">
          <div className="w-full bg-yellow-300 text-black py-3 px-4 rounded-lg text-center mb-4">
            보유 금액: {point}
          </div>
          <button
            className="w-full bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition duration-200"
            onClick={() => navigate('/shop')}
          >
            상점
          </button>
        </div>

        {/* 모드 및 난이도 선택 모달 */}
        {showSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg text-black relative w-full max-w-sm">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                &times;
              </button>

              <h2 className="text-xl font-bold mb-4 text-center">모드와 난이도를 선택하세요</h2>

              <div className="mb-6">
                <h3 className="text-lg mb-4 text-center">모드 선택</h3>
                <div className="flex justify-between">
                  <button
                    onClick={() => setSelectedMode('english')}
                    className={`py-2 px-4 w-1/2 rounded-md mr-2 ${
                      selectedMode === 'english' ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    영어
                  </button>
                  <button
                    onClick={() => setSelectedMode('korea')}
                    className={`py-2 px-4 w-1/2 rounded-md ${
                      selectedMode === 'korea' ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    한글
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg mb-4 text-center">난이도 선택</h3>
                <div className="flex justify-between">
                  <button
                    onClick={() => setSelectedDifficulty('easy')}
                    className={`py-2 px-4 w-1/2 rounded-md mr-2 ${
                      selectedDifficulty === 'easy' ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    EASY
                  </button>
                  <button
                    onClick={() => setSelectedDifficulty('hard')}
                    className={`py-2 px-4 w-1/2 rounded-md ${
                      selectedDifficulty === 'hard' ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    HARD
                  </button>
                </div>
              </div>

              <button
                onClick={handleGameStart}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
              >
                게임 시작
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
