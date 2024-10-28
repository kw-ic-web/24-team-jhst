import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import meow3 from '../assets/images/meow3.png';

const ResultSingle = () => {
  const wordList = ["apple", "apple", "apple", "apple", "apple"];
  const score = 505;
  const totalStars = 5864651;
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/main");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white relative">
      <div className="w-full flex justify-between items-center mb-8">
        <button
          onClick={handleBack}
          className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
        >
          홈으로 돌아가기
        </button>
        <div className="bg-gray-800 p-2 rounded text-white flex items-center">
          <FaStar className="text-yellow-500 mr-2" />
          <span>{totalStars}</span>
        </div>
      </div>

      <div className="flex items-center w-full max-w-4xl space-x-8">
        {/* 왼쪽 */}
        <div className="flex flex-col items-center justify-center w-1/2 bg-transparent">
          <h1 className="text-4xl font-bold mb-6">WIN</h1>
          <img src={meow3} alt="Cat Icon" className="w-28 h-28 mb-6" />
          <div className="flex items-center bg-gray-200 py-2 px-4 rounded-md">
            <FaStar className="text-yellow-500 mr-2" />
            <span className="text-xl font-bold">+{score}</span>
          </div>
        </div>

        {/* Word list */}
        <div className="w-1/2 bg-gray-500 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-center text-white">단어 리스트</h2>
          <ul className="space-y-2 text-center text-white">
            {wordList.map((word, index) => (
              <li key={index} className="text-lg">
                {index + 1}. {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultSingle;
