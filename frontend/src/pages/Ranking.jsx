import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import meow3 from '../assets/images/meow3.png';

const Ranking = () => {
  const [myRanking, setMyRanking] = useState(16);  // 현재 사용자의 랭킹 (임시 값)
  const [globalRanking, setGlobalRanking] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/rankings", {
    })
    .then((response) => {
      setGlobalRanking(response.data);
    })
    .catch((error) => {
      console.error("Error fetching rankings:", error);
    });
  }, []);

  const handleBack = () => {
    navigate("/main");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        <img src={meow3} alt="Cat Icon" className=" w-10 inline mr-2" />
        RANKING
      </h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
        <ul className="space-y-4">
          {globalRanking.map((player, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-3 rounded ${
                player.ranking === myRanking ? "bg-blue-300" : "bg-gray-300"
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">{player.ranking}</span>
                <span>{player.member_id || player.name}</span>
              </span>
              <span className="flex items-center space-x-1">
                <FaStar className="text-yellow-500" />
                <span>{player.win}승 {player.lose}패</span> 
              </span>
              <span className="flex items-center space-x-1">
                승률: {player.win_rate ? ` ${parseFloat(player.win_rate).toFixed(2)}%` : ' 0.00%'}</span>

            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-md">
        <button
          onClick={handleBack}
          className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition duration-200"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Ranking;
