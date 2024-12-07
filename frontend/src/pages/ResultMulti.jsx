import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import meow3 from '../assets/images/meow3.png'; // Ensure the path is correct

const ResultMulti = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { players = [], rounds = {}, game_id } = location.state || {};
  const wordList = Array.from({ length: 5 }, (_, i) => {
    const roundKey = `round${i + 1}`;
    return rounds[roundKey]?.en_word || rounds[roundKey]?.ko_word || "N/A";
  });

  const winner = players.find((player) => player.score >= 60) || {};
  const loser = players.find((player) => player.score < 60) || {};

  const [dataSent, setDataSent] = useState(false);
  useEffect(() => {
    
    const fetchData = async () => {
      if (dataSent) return; // 이미 전송된 경우 중단

      try {
        // Game 데이터 전송
        await sendWinnerData();
        // WrongAns 데이터 전송
        await sendWrongAnsData();

        setDataSent(true); // 전송 상태 업데이트
      } catch (error) {
        console.error("데이터 전송 중 오류 발생:", error);
      }
    };
  
    // 함수 호출
    fetchData();
  
  }, [dataSent, game_id, winner.member_id]);

// sendWinnerData 함수
const sendWinnerData = async () => {
  try {
    await axios.post('http://localhost:8000/multiplay/winner', {
      game_id: game_id,
      winner: winner.member_id,
      loser: loser.member_id,
      winPoint: winner.score,
      losePoint: loser.score,
    });
  } catch (error) {
    console.error("승리 데이터 전송 실패:", error);
  }
};

// sendWrongAnsData 함수
const sendWrongAnsData = async () => {
  try {
    const wrongRounds = players[0].wrong || [];

    for (const roundNum of wrongRounds) {
      const en_word = rounds[`round${roundNum}`]?.en_word;
      if (en_word) {
        await axios.post('http://localhost:8000/multiplay/wrongans', {
          member_id: players[0].member_id,
          en_word: en_word,
          game_id: game_id,
        });
      }
    }
  } catch (error) {
    console.error("잘못된 답안 전송 실패:", error);
  }
};



  const handleBack = () => {
    navigate("/main");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="flex items-center w-full max-w-6xl space-x-8">

        {/* winner */}
        <div className="w-1/3 flex flex-col items-center justify-center bg-blue-500 p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 text-white">WIN</h1>
          <h2 className="text-xl font-bold mb-4 text-white">{winner?.name}</h2>
          {winner?.character?.image ? (
            <img
              src={winner.character.image}
              alt={winner.character.name || 'Character'}
              className="w-28 h-28 mb-6"
            />
          ) : (
            <img src={meow3} alt="Default Icon" className="w-28 h-28 mb-6" />
          )}
          
          <div className="flex items-center bg-gray-200 py-2 px-4 rounded-md">
            <FaStar className="text-yellow-500 mr-2" />
            <span className="text-xl font-bold">+{winner.score}</span>
          </div>
        </div>

        {/* Word list */}
        <div className="w-1/3 bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-center text-white">단어 리스트</h2>
          <ul className="space-y-2 text-center text-white">
            {wordList.map((word, index) => (
              <li key={index} className="text-lg">
                {index + 1}. {word}
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <button
              onClick={handleBack}
              className="bg-green-500 text-white py-3 px-6 rounded hover:bg-green-600 transition duration-200"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>

        {/* loser*/}
        <div className="w-1/3 flex flex-col items-center justify-center bg-red-500 p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 text-white">LOSE</h1>
          <h2 className="text-xl font-bold mb-4 text-white">{loser?.name}</h2>
          {loser?.character?.image ? (
            <img
              src={loser.character.image}
              alt={loser.character.name || 'Character'}
              className="w-28 h-28 mb-6"
            />
          ) : (
            <img src={meow3} alt="Default Icon" className="w-28 h-28 mb-6" />
          )}
          <div className="flex items-center bg-gray-200 py-2 px-4 rounded-md">
            <FaStar className="text-yellow-500 mr-2" />
            <span className="text-xl font-bold">+{loser.score}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultMulti;
