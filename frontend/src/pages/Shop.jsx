import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Shop() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0); // 보유 포인트 상태 추가
  const [characters, setCharacters] = useState([]); // 보유 캐릭터 상태 추가
  const [selectedCharacter, setSelectedCharacter] = useState(null); // 선택된 캐릭터
  const [showModal, setShowModal] = useState(false); // 모달 상태

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 보유 금액 조회
      axios
        .get('http://localhost:8000/users/viewInfo', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setBalance(response.data.point); // 포인트 설정
        })
        .catch((error) => {
          console.error('Error fetching balance:', error);
        });

      // 보유 캐릭터 조회
      axios
        .get('http://localhost:8000/characters/owned', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCharacters(response.data); // 보유 캐릭터 설정
        })
        .catch((error) => {
          console.error('Error fetching owned characters:', error);
        });
    } else {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    const token = localStorage.getItem('token');
    const memberId = localStorage.getItem('memberId'); // memberId 가져오기

    if (!memberId) {
      alert('회원 정보가 유효하지 않습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }

    if (token && selectedCharacter) {
      console.log('전송 데이터:', {
        memberId: memberId,
        characterId: selectedCharacter.characterId,
      });

      axios
        .post(
          'http://localhost:8000/characters/select',
          {
            memberId: memberId,
            characterId: selectedCharacter.characterId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          alert('캐릭터가 변경되었습니다.');
          setShowModal(false);
          setCharacters((prevCharacters) =>
            prevCharacters.map((char) =>
              char.characterId === selectedCharacter.characterId
                ? { ...char, isActive: true }
                : { ...char, isActive: false }
            )
          );
        })
        .catch((error) => {
          console.error('Error updating character:', error.response?.data);
          alert('캐릭터 변경에 실패했습니다.');
        });
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setSelectedCharacter(null);
  };

  const handleGachaClick = () => {
    navigate('/gacha');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-10 p-8 bg-white">
      <h1 className="text-2xl font-bold mb-8">내 캐릭터</h1>

      <div className="absolute top-32 right-8 bg-yellow-300 text-black py-2 px-4 rounded-lg">
        보유 포인트: {balance}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-4 w-full max-w-5xl">
        {characters.map((character, index) => (
          <div
            key={index}
            onClick={() => handleCharacterClick(character)}
            className={`flex flex-col items-center justify-between w-full h-56 bg-white shadow-md rounded-lg p-4 cursor-pointer transition-transform transform hover:scale-105 ${
              character.isActive ? 'border-4 border-blue-500' : 'border border-gray-300'
            }`}
          >
            {character.image ? (
              <img
                src={`data:image/png;base64,${btoa(
                  String.fromCharCode(...new Uint8Array(character.image.data))
                )}`}
                alt={character.name}
                className="w-32 h-32 object-contain"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-lg">{character.name}</span>
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">{character.name}</p>
            </div>
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

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">캐릭터를 변경하시겠습니까?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleModalConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                예
              </button>
              <button
                onClick={handleModalCancel}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;