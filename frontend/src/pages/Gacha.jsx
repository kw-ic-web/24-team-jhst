import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Gacha() {
  const [isOpened, setIsOpened] = useState(false); 
  const [character, setCharacter] = useState(null); 
  const [showCharacter, setShowCharacter] = useState(false); 

  const navigate = useNavigate();

  const handleOpenBox = async () => {
    try {
      const response = await axios.get('http://localhost:8000/characters/draw', {
        params: { memberId: 1 }, 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const { character } = response.data;
      setCharacter(character.name); 
      setIsOpened(true);
      
      // 서서히 나타나도록
      setTimeout(() => {
        setShowCharacter(true);
      }, 500); // 0.5초 후 캐릭터 등장
    } catch (err) {
      console.error('캐릭터 뽑기 실패:', err);
      alert('캐릭터 뽑기 중 문제가 발생했습니다.');
    }
  };

  const handleClose = () => {
    navigate('/shop');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-customWhite">
      <h1 className="text-4xl font-medium mb-8 text-black">캐릭터 뽑기</h1>

      {/* 선물 상자 */}
      {!isOpened ? (
        <div
          className="w-64 h-64 bg-yellow-300 flex items-center justify-center rounded-lg cursor-pointer transition-transform duration-500 hover:scale-105 shadow-lg"
          onClick={handleOpenBox}
        >
          <span className="text-xl">🎁 뽑기 상자 클릭!</span>
        </div>
      ) : (
        <div className="w-64 h-64 bg-customGreen flex items-center justify-center rounded-lg transition-opacity duration-1000 opacity-0"
             style={{ opacity: showCharacter ? 1 : 0 }}>
          <span className="text-2xl text-black">{character}</span> 
        </div>
      )}

      {isOpened && (
        <button
          onClick={handleClose}
          className="mt-8 bg-red-500 text-white py-2 px-4 rounded-lg transition-transform duration-300 hover:scale-105"
        >
          닫기
        </button>
      )}
    </div>
  );
}

export default Gacha;
