import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Gacha() {
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false); // 결과 모달
  const [character, setCharacter] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [userPoints, setUserPoints] = useState(0); // 사용자 포인트 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserPoints = async () => {
      const token = localStorage.getItem('token');
      const memberId = localStorage.getItem('memberId');

      if (!token || !memberId) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/users/viewInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserPoints(response.data.point);
      } catch (error) {
        console.error('포인트 가져오기 실패:', error);
        setErrorMessage('포인트 정보를 불러오지 못했습니다.');
      }
    };

    fetchUserPoints();
  }, [navigate]);

  // 🎁 뽑기 상자 클릭 클릭 시 초기 모달 열기
  const handleBoxClick = () => {
    setShowInitialModal(true);
  };

  // 뽑기 버튼 클릭 시
  const handleDrawCharacter = async () => {
    try {
      const memberId = localStorage.getItem('memberId');
      const token = localStorage.getItem('token');
  
      if (!memberId || !token) {
        alert('로그인이 필요합니다.');
        return;
      }
  
      // 추가된 부분: 포인트가 100보다 적을 경우 메시지를 설정하고 종료
      if (userPoints < 100) {
        setErrorMessage('포인트가 부족합니다.');
        setShowResultModal(true); // 결과 모달 열기
        return;
      }
  
      const response = await axios.get(`http://localhost:8000/characters/draw?memberId=${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        const { character } = response.data;
        setCharacter(character); 
        setUserPoints((prevPoints) => prevPoints - 100); // 포인트 차감
        setShowInitialModal(false);
        setShowResultModal(true);
      } else if (response.status === 304) {
        setErrorMessage('포인트가 부족합니다.');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setErrorMessage('뽑을 캐릭터가 없습니다.');
      } else {
        console.error('캐릭터 뽑기 실패:', err);
        setErrorMessage('캐릭터 뽑기 중 문제가 발생했습니다.');
      }
      setShowResultModal(true); // 결과 모달 열기
    }
  };

  const handleCloseInitialModal = () => {
    setShowInitialModal(false);
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setCharacter(null);
  };

  const handleGoToShop = () => {
    navigate('/shop');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-black">캐릭터 뽑기</h1>

      {/* 뽑기 상자 */}
      <div
        className="w-64 h-64 bg-customWhite flex items-center justify-center rounded-lg cursor-pointer transition-transform duration-500 hover:scale-105 shadow-lg"
        onClick={handleBoxClick}
      >
        <span className="text-xl text-white font-medium">🎁 뽑기 상자 클릭 !</span>
      </div>

      {/* 초기 모달 */}
      {showInitialModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-80 text-center">
            <h2 className="text-lg mb-6">내 보유 포인트: <strong>{userPoints} </strong></h2>
            <h2 className="text-xl mb-8"><strong>100</strong> 포인트 차감됩니다</h2>
            <div className="flex justify-around mt-4">
              <button
                className="bg-main02 text-white py-2 px-6 rounded"
                onClick={handleDrawCharacter}
              >
                뽑기
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-6 rounded"
                onClick={handleCloseInitialModal}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 결과 모달 */}
      {showResultModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-80 text-center">
            {character ? (
              <>
                <h2 className="text-2xl mb-4">축하합니다!</h2>
                <img
                  src={character.image} 
                  alt={character.name}
                  className="w-32 h-32 object-contain mx-auto mb-4"
                />
                <p className="text-xl mb-4">{character.name}</p>
              </>
            ) : (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}
            <div className="flex justify-around mt-4">
              <button
                className="bg-gray-500 text-white py-2 w-full rounded"
                onClick={handleCloseResultModal}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 보유 캐릭터 확인하기 버튼 */}
      <button
        onClick={handleGoToShop}
        className="mt-8 bg-main01 text-white py-3 px-16 rounded-lg"
      >
        보유 캐릭터 확인하기
      </button>
    </div>
  );
}

export default Gacha;
