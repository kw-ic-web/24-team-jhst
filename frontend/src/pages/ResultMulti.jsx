import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import meow3 from '../assets/images/meow3.png'; // Ensure the path is correct

const ResultMulti = () => {
  const wordList = ["apple", "apple", "apple", "apple", "apple"];
  const winScore = 505;
  const loseScore = 105;
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/main");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="flex items-center w-full max-w-6xl space-x-8">

        {/* 상대방*/}
        <div className="w-1/3 flex flex-col items-center justify-center bg-blue-500 p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 text-white">WIN</h1>
          <h2 className="text-xl font-bold mb-4 text-white">상대방</h2>
          <img src={meow3} alt="Cat Icon" className="w-28 h-28 mb-6" />
          <div className="flex items-center bg-gray-200 py-2 px-4 rounded-md">
            <FaStar className="text-yellow-500 mr-2" />
            <span className="text-xl font-bold">+{winScore}</span>
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
          <h2 className="text-xl font-bold mb-4 text-white">나</h2>
          <img src={meow3} alt="Cat Icon" className="w-28 h-28 mb-6" />
          <div className="flex items-center bg-gray-200 py-2 px-4 rounded-md">
            <FaStar className="text-yellow-500 mr-2" />
            <span className="text-xl font-bold">+{loseScore}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultMulti;
