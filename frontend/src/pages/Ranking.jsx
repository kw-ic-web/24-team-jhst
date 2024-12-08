import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const Ranking = () => {
  const [myRanking, setMyRanking] = useState(null);  // 내 랭킹 정보
  const [globalRanking, setGlobalRanking] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const memberId = localStorage.getItem('memberId'); 
    axios.get(`https://team10.kwweb.duckdns.org/rankings?member_id=${memberId}`)
      .then((response) => {
        setMyRanking(response.data.myRanking); // 내 랭킹 정보 저장
        setGlobalRanking(response.data.globalRanking); // 전체 랭킹 정보 저장
      })
      .catch((error) => {
        console.error("Error fetching rankings:", error);
      });
  }, []);

  const handleBack = () => {
    navigate("/main");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="mt-10 text-3xl font-bold mb-6 text-center">
        RANKING
      </h1>

      {/*내 랭킹 */}
      <div className="bg-customWhite p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <h2 className="text-xl text-white font-medium text-center mb-4">내 랭킹</h2>
        {myRanking ? (
          <li className="flex justify-between items-center p-3 rounded bg-main02">
            <span className="flex items-center space-x-2">
              <span className="text-lg">{myRanking.ranking}위</span>
              <span className="pl-2">{myRanking.member_id || myRanking.name}</span>
            </span>
            <span className="flex items-center space-x-1">
              <FaStar className="text-yellow-500" />
              <span> {myRanking.win}승 {myRanking.lose}패</span> 
            </span>
            <span className="flex items-center space-x-1">
              승률: {myRanking.win_rate ? ` ${parseFloat(myRanking.win_rate).toFixed(2)}%` : ' 0.00%'}
            </span>
          </li>
        ) : (
          <p>내 랭킹 정보를 불러오는 중...</p>
        )}
      </div>

      {/* 전체 랭킹 표시 */}
      <div className="bg-customWhite p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <ul className="space-y-4">
          {globalRanking.map((player, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-3 rounded ${
                myRanking && player.ranking === myRanking.ranking ? "bg-main02" : "bg-gray-200"
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">{player.ranking}위</span>
                <span className="pl-2">{player.member_id || player.name}</span>
              </span>
              <span className="flex items-center space-x-1">
                <FaStar className="text-yellow-500" />
                <span>{player.win} 승 {player.lose} 패</span> 
              </span>
              <span className="flex items-center space-x-1">
                승률 : {player.win_rate ? ` ${parseFloat(player.win_rate).toFixed(2)}%` : ' 0.00%'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-md">
        <button
          onClick={handleBack}
          className="w-full bg-main01 text-white py-3 rounded hover:bg-green-600 transition duration-200"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Ranking;
