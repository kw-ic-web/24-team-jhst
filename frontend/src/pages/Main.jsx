import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import meow3 from '../assets/images/meow3.png';

function Main() {
  const [showSelection, setShowSelection] = useState(false); 
  const [selectedMode, setSelectedMode] = useState(''); 
  const [selectedDifficulty, setSelectedDifficulty] = useState(''); 
  const navigate = useNavigate(); 

  const handleGameStartClick = () => {
    setShowSelection(true);
  };

  const handleGameStart = () => {
    if (selectedMode && selectedDifficulty) {
      alert(`모드: ${selectedMode}, 난이도: ${selectedDifficulty}`);
      setShowSelection(false); 
      navigate('/game-multi');
    } else {
      alert('모드와 난이도를 선택하세요.');
    }
  };

  const handleCloseModal = () => {
    setShowSelection(false); 
  };

  return (
    <div className="min-h-screen bg-customWhite text-white flex p-8">
      {/* 왼쪽 사이드바 */}
      <div className="flex flex-col space-y-4">
        <button
          className="bg-gray-200 text-black py-2 px-4 rounded"
          onClick={() => navigate('/wrong-note')}
        >
          오답노트
        </button>
        <button
          className="bg-gray-200 text-black py-2 px-4 rounded"
          onClick={() => navigate('/ranking')} 
        >
          랭킹
        </button>
        <button
          className="bg-gray-200 text-black py-2 px-4 rounded"
          onClick={() => navigate('/setting')} 
        >
          설정
        </button>
      </div>

      {/* 가운데 캐릭터와 게임 시작 버튼 */}
      <div className="flex flex-col items-center flex-grow">
      <img src={meow3} alt="cat image" style={{ width: '300px', height: '300px' }} />
        <button
          onClick={handleGameStartClick}
          className="bg-gray-200 text-black py-2 px-4 rounded"
        >
          게임 시작
        </button>
      </div>

      {/* 오른쪽 상단 코인 및 상점 버튼 */}
      <div className="flex flex-col items-end space-y-4">
      {/* 보유 금액*/}
      <div className=" bg-yellow-300 text-black py-2 px-4 rounded-lg">
        보유 금액: 1000원
      </div>
        <button
          className="bg-gray-200 text-black py-2 px-4 rounded"
          onClick={() => navigate('/shop')} 
        >
          상점
        </button>
      </div>

      {/* 모드 및 난이도 선택 모달 */}
      {showSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black relative">
            {/* 모달창 닫기 버튼 */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              &times; {/* X 문자로 닫기 아이콘 대체 */}
            </button>

            <h2 className="text-xl font-bold mb-4">모드와 난이도를 선택하세요</h2>

            {/* 모드 선택 */}
            <div className="mb-4">
              <h3 className="text-lg mb-2">모드 선택</h3>
              <button
                onClick={() => setSelectedMode('영어 모드')}
                className={`py-2 px-4 rounded-md mr-2 ${
                  selectedMode === '영어 모드' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                영어 모드
              </button>
              <button
                onClick={() => setSelectedMode('한글 모드')}
                className={`py-2 px-4 rounded-md ${
                  selectedMode === '한글 모드' ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}
              >
                한글 모드
              </button>
            </div>

            {/* 난이도 선택 */}
            <div className="mb-4">
              <h3 className="text-lg mb-2">난이도 선택</h3>
              <button
                onClick={() => setSelectedDifficulty('easy')}
                className={`py-2 px-4 rounded-md mr-2 ${
                  selectedDifficulty === 'easy' ? 'bg-yellow-500 text-black' : 'bg-gray-200'
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setSelectedDifficulty('hard')}
                className={`py-2 px-4 rounded-md ${
                  selectedDifficulty === 'hard' ? 'bg-red-500 text-white' : 'bg-gray-200'
                }`}
              >
                Hard
              </button>
            </div>

            {/* 게임 시작 버튼 */}
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
  );
}

export default Main;
