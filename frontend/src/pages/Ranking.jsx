import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa"; 

const Ranking = () => {
  const [myRanking, setMyRanking] = useState(null);
  const [globalRanking, setGlobalRanking] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRankings = async () => {
      const userRank = { rank: 10, name: "나" };
      const rankings = [
        { rank: 1, name: "플레이어 이름" },
        { rank: 2, name: "플레이어 이름" },
        { rank: 3, name: "플레이어 이름" },
        { rank: 4, name: "플레이어 이름" },
        { rank: 5, name: "플레이어 이름" },
        { rank: 6, name: "플레이어 이름" },
        { rank: 7, name: "플레이어 이름" },
        { rank: 8, name: "플레이어 이름" },
        { rank: 9, name: "플레이어 이름" },
        { rank: 10, name: "플레이어 이름" },
      ];

      setMyRanking(userRank);
      setGlobalRanking(rankings);
    };

    fetchRankings();
  }, []);

  const handleBack = () => {
    navigate("/main");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4">
      {/* 내 랭킹 */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-lg shadow-lg mb-6 text-white">
        {myRanking ? (
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-xl">{myRanking.rank}</span>
            <span>{myRanking.name}</span>
          </div>
        ) : (
          <div>Loading my ranking...</div>
        )}
      </div>

      {/* 전체 랭킹 */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Global Ranking</h2>
        <div className="h-96 overflow-y-auto"> 
          <ul className="space-y-3">
            {globalRanking.length > 0 ? (
              globalRanking.map((player, index) => (
                <li
                  key={player.rank}
                  className={`flex justify-between items-center p-3 rounded-md shadow-md ${
                    player.rank === 1 ? "bg-yellow-300" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {player.rank === 1 && <FaCrown className="text-yellow-500" />}
                    <span className={`font-semibold text-lg ${player.rank === 1 ? "text-yellow-700" : "text-gray-700"}`}>
                      {player.rank}
                    </span>
                  </div>
                  <span className="text-gray-600">{player.name}</span>
                </li>
              ))
            ) : (
              <li>Loading global rankings...</li>
            )}
          </ul>
        </div>
      </div>

      {/* 뒤로가기 */}
      <div className="mt-6">
        <button
          onClick={handleBack}
          className="bg-indigo-500 text-white py-3 rounded-lg w-full font-semibold transition transform hover:scale-105"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default Ranking;
