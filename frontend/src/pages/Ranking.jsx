import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import meow3 from '../assets/images/meow3.png';

const Ranking = () => {
  const [myRanking, setMyRanking] = useState(16); 
  const [globalRanking, setGlobalRanking] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the global rankings and update the state
    const rankings = [
      { rank: 1, name: "플레이어 이름", score: 123123 },
      { rank: 2, name: "플레이어 이름", score: 123123 },
      { rank: 3, name: "플레이어 이름", score: 123123 },
      { rank: 4, name: "플레이어 이름", score: 123123 },
      { rank: 5, name: "플레이어 이름", score: 123123 },
      { rank: 16, name: "플레이어 이름", score: 123123 },
    ];

    setGlobalRanking(rankings);
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
                player.rank === myRanking ? "bg-blue-300" : "bg-gray-300"
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">{player.rank}</span>
                <span>{player.name}</span>
              </span>
              <span className="flex items-center space-x-1">
                <FaStar className="text-yellow-500" />
                <span>{player.score}</span>
              </span>
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
