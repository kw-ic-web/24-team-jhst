import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Shop() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0); // 보유 포인트 상태 추가
  const [characters, setCharacters] = useState([]); // 보유 캐릭터 상태 추가

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 보유 금액 조회
      axios.get('http://localhost:8000/users/viewInfo', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setBalance(response.data.point); // 포인트 설정
      })
      .catch((error) => {
        console.error("Error fetching balance:", error);
      });

      // 보유 캐릭터 조회
      axios.get('http://localhost:8000/characters/owned', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setCharacters(response.data); // 보유 캐릭터 설정
      })
      .catch((error) => {
        console.error("Error fetching owned characters:", error);
      });
    } else {
      alert("로그인이 필요합니다.");
      navigate('/login');
    }
  }, [navigate]);

  const handleGachaClick = () => {
    navigate('/gacha');
  };

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
            {character.image ? (
              <img
                src={`data:image/png;base64,${Buffer.from(character.image).toString('base64')}`}
                alt={character.name}
                className="w-24 h-24"
              />
            ) : (
              <div>{character.name}</div>
            )}
          </div>
        ))}
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
