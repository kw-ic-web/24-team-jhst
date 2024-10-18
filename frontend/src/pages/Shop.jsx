import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import meow1 from '../assets/images/meow1.png';
import meow2 from '../assets/images/meow2.png';
import meow3 from '../assets/images/meow3.png';

function Shop() {
  const navigate = useNavigate();
  const [balance] = useState(5864851);
  const characters = [meow1, meow2, meow3]; 

  const handleGachaClick = () => {
    navigate('/gacha');
  };


  const totalSlots = 4;
  const placeholders = Array.from({ length: totalSlots - characters.length });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <h1 className="text-2xl font-bold mb-8">내 캐릭터</h1>

      <div className="absolute top-32 right-8 bg-yellow-300 text-black py-2 px-4 rounded-lg">
        코인: {balance}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-4 w-full max-w-md">
        {characters.map((character, index) => (
          <div
            key={index}
            className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded-lg p-4"
          >
            <img src={character} alt={`캐릭터 ${index + 1}`} className="w-24 h-24" />
          </div>
        ))}

        {placeholders.map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="w-40 h-40 bg-gray-100 flex items-center justify-center rounded-lg p-4"
          ></div>
        ))}
      </div>

      <div className="text-center mt-4">
        <span className="text-lg">1</span>
        <span className="mx-2">2</span>
        <span className="text-lg">3</span>
      </div>

      <div className="w-full max-w-md">
        <button
          onClick={handleGachaClick}
          className="w-full bg-green-500 text-white py-3 rounded-lg transition duration-200 hover:bg-green-600 mt-6"
        >
          캐릭터 뽑기
        </button>
      </div>
    </div>
  );
}

export default Shop;
