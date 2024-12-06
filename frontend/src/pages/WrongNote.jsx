import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WrongNote = () => {
  const [wrongWords, setWrongWords] = useState([]);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [playerName, setPlayerName] = useState(''); // 플레이어 이름 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWrongWords = async () => {
      try {
        const memberId = localStorage.getItem('memberId');
        const response = await axios.get(`http://localhost:8000/game/wrong-words?member_id=${memberId}`);
        setWrongWords(response.data.data);
      } catch (error) {
        console.error('Failed to fetch wrong words:', error);
      }
    };

    const fetchActiveCharacterAndPlayer = async () => {
      try {
        const memberId = localStorage.getItem('memberId');
        const token = localStorage.getItem('token');

        // 활성 캐릭터 
        const characterResponse = await axios.get('http://localhost:8000/characters/active', {
          headers: { Authorization: `Bearer ${token}` },
          params: { memberId },
        });
        setActiveCharacter(characterResponse.data);

        // 플레이어 이름
        const playerResponse = await axios.get('http://localhost:8000/users/viewInfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayerName(playerResponse.data.name);
      } catch (error) {
        console.error('Failed to fetch character or player information:', error);
      }
    };

    fetchWrongWords();
    fetchActiveCharacterAndPlayer();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="flex justify-between w-full max-w-4xl mb-8 gap-3">
        {/* 플레이어 정보 */}
        <div className="bg-white p-4 rounded-lg shadow-md w-1/3 text-center">
          {activeCharacter ? (
            <>
              <img
                src={activeCharacter.image || 'default-character.png'}
                alt="Character"
                className="w-32 h-32 mx-auto mb-4 object-contain"
              />
              <p>플레이어 : {playerName || '플레이어 이름'}</p>
              {/* 싱글플레이 버튼 */}
              <button
                onClick={() => navigate('/game-single')}
                className="mt-4 bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-700"
              >
                싱글플레이 시작
              </button>
            </>
          ) : (
            <p>상점에 가서 게임 캐릭터를 선택해주세요!</p>
          )}
        </div>

        {/* 틀린 단어 목록 */}
        <div className="bg-white p-4 rounded-lg shadow-md w-2/3">
          <h2 className="text-lg font-bold mb-4">틀린 단어 목록</h2>
          <div className="grid grid-cols-2 gap-4">
            {wrongWords.length > 0 ? (
              wrongWords.map((word) => (
                <div key={word.word_id} className="p-2 bg-gray-100 rounded-md shadow-sm">
                  <p><strong>단어 :</strong> {word.en_word}</p>
                  <p><strong>뜻 :</strong> {word.ko_word}</p>
                </div>
              ))
            ) : (
              <p>틀린 단어가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrongNote;
