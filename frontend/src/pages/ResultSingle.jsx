import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || []; // state에서 results를 가져오고 기본값 설정

  if (results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-bold">결과를 찾을 수 없습니다.</h2>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate('/')}
        >
          메인 화면으로
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold">게임 결과</h2>
      <ul className="mt-4">
        {results.map((result, index) => (
          <li key={index} className="text-lg">
            단어: {result.word}, 결과: {result.status === 'success' ? '성공' : '실패'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultSingle;
