import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Shop() {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState(null); 
  const [balance, setBalance] = useState(1000);

  const characters = [
    { id: 1, name: '캐릭터 1' },
    { id: 2, name: '캐릭터 2' },
    { id: 3, name: '캐릭터 3' },
    { id: 4, name: '캐릭터 4' },
    { id: 5, name: '캐릭터 5' },
    { id: 6, name: '캐릭터 6' },
    { id: 7, name: '캐릭터 7' },
    { id: 8, name: '캐릭터 8' },
    { id: 9, name: '캐릭터 9' },
    { id: 10, name: '캐릭터 10' },
  ];

  const handleSelect = (character) => {
    setSelectedCharacter(character); 
  };

  const handleGachaClick = () => {
    navigate('/gacha');
  };

  const handleClose = () => {
    navigate('/main'); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      <h1 className="text-2xl font-bold mb-8">캐릭터 선택</h1>

      <div className="absolute top-4 right-8 bg-yellow-300 text-black py-2 px-4 rounded-lg">
        보유 금액: {balance}원
      </div>

      {/* 캐릭터 리스트 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 p-4 w-full max-w-6xl">
        {characters.map((character) => (
          <div
            key={character.id}
            onClick={() => handleSelect(character)}
            className={`w-60 h-60 bg-customWhite flex items-center justify-center rounded-lg cursor-pointer transition-transform duration-200 transform hover:scale-105 ${
              selectedCharacter?.id === character.id ? 'border-2 border-customGreen' : ''
            }`}
          >
            {character.name}
          </div>
        ))}

        {/* ??? 카드 추가 */}
        <div className="w-60 h-60 bg-gray-300 flex items-center justify-center rounded-lg">
          ???
        </div>
      </div>

      <div className="flex space-x-4 mt-8">
        <button
          onClick={handleGachaClick}
          className="bg-customGreen text-white py-2 px-4 rounded-lg"
        >
          뽑기
        </button>
        <button
          onClick={() => alert(`선택된 캐릭터: ${selectedCharacter ? selectedCharacter.name : '없음'}`)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          선택
        </button>
        <button
          onClick={handleClose}
          className="bg-red-500 text-white py-2 px-4 rounded-lg"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default Shop;
