import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import meow3 from '../assets/images/meow3.png'; // Ensure the path is correct

const ResultMulti = () => {
  const winScore = 70;
  const loseScore = 30;
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
    // 비동기 작업을 처리하는 함수 정의
    const fetchData = async () => {
      if (dataSent) return; // 이미 전송된 경우 중단

      try {
        // 승리 데이터 전송
        await sendWinnerData();
        // 잘못된 답안 데이터 전송
        await sendWrongAnsData();

        console.log("모든 데이터 전송 완료");
        setDataSent(true); // 전송 상태 업데이트
      } catch (error) {
        console.error("데이터 전송 중 오류 발생:", error);
      }
    };
  
    // 함수 호출
    fetchData();
  
    // 의존성 배열을 빈 배열로 설정하여 첫 렌더링에서만 실행되도록 설정
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
    console.log("승리 데이터 전송 완료");
  } catch (error) {
    console.error("승리 데이터 전송 실패:", error);
  }
};

// sendWrongAnsData 함수
const sendWrongAnsData = async () => {
  try {
    const wrongRounds = players[0].wrong || [];
    console.log(`잘못된 라운드: ${wrongRounds}`);

    for (const roundNum of wrongRounds) {
      const en_word = rounds[`round${roundNum}`]?.en_word;
      if (en_word) {
        await axios.post('http://localhost:8000/multiplay/wrongans', {
          member_id: players[0].member_id,
          en_word: en_word,
          game_id: game_id,
        });
        console.log(`잘못된 답안 전송 완료 (라운드: ${roundNum}, 단어: ${en_word})`);
      }
    }
  } catch (error) {
    console.error("잘못된 답안 전송 실패:", error);
  }
};
  // useEffect(() => {
  //   const sendWinnerData = async () => {
  //     // console.log(`winner: ${winner.member_id} `);
  //     // console.log(`game_id: ${game_id}`);
  //     // console.log(`loser: ${loser.member_id}`);
  //     // console.log(`winnPoint: ${winner.score}`);
  //     // console.log(`losePoint: ${loser.score}`)
  //     try {
  //       await axios.post('http://localhost:8000/multiplay/winner', {
  //         game_id: game_id,
  //         winner: winner.member_id,
  //         loser: loser.member_id,
  //         winPoint: winner.score,
  //         losePoint:loser.score,
  //       });
  //       console.log('Results successfully sent to the server');
  //     } catch (error) {
  //       console.error('Failed to send results:', error);
  //     }
  //   };
    
  //   const sendWrongAnsData = async () => {
  //     try {
  //       const wrongRounds = players[0].wrong || []; // wrong 배열
  //       console.log(`wrong배열: ${wrongRounds}`);
        
  //       // loser의 wrong 배열을 순회하며 각 라운드의 en_word를 찾아 전송
  //       for (const roundNum of wrongRounds) {
  //         const en_word = rounds[`round${roundNum}`]?.en_word;
  //         if (en_word) {
  //           console.log(`id: ${players[0].member_id}, en_word: ${en_word}`);
  //           await axios.post('http://localhost:8000/multiplay/wrongans', {
  //             member_id: players[0].member_id,
  //             en_word: en_word,
  //             game_id: game_id,
  //           });
  //           console.log(`Wrong answer sent for round ${roundNum}: ${en_word}`);
  //         } else {
  //           console.error(`Failed to find en_word for round ${roundNum}`);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Failed to send wrong answers:', error);
  //     }
  //   };
  
  
  //   sendWinnerData(); // 비동기 함수 호출
  //   sendWrongAnsData();

  // }, []); 


  const handleBack = () => {
    navigate("/main");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="flex items-center w-full max-w-6xl space-x-8">

        {/* 상대방*/}
        <div className="w-1/3 flex flex-col items-center justify-center bg-blue-500 p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 text-white">WIN</h1>
          <h2 className="text-xl font-bold mb-4 text-white">{winner?.name}</h2>
          <img src={meow3} alt="Cat Icon" className="w-28 h-28 mb-6" />
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

        {/* 나*/}
        <div className="w-1/3 flex flex-col items-center justify-center bg-red-500 p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 text-white">LOSE</h1>
          <h2 className="text-xl font-bold mb-4 text-white">{loser?.name}</h2>
          <img src={meow3} alt="Cat Icon" className="w-28 h-28 mb-6" />
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
