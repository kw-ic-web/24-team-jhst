import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultSingle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], character = null, score = 0 } = location.state || {};

  const currentUser = localStorage.getItem('memberId') || '플레이어';

  if (!results || results.length === 0) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg gap-6">
        {/* 사용자 정보 */}
        <div className="w-1/2 bg-gray-200 p-6 rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">WELL DONE !</h2>
          <div className="mb-2 flex flex-col items-center">
            <img
              src={character?.image || 'default-character.png'}
              alt="Character"
              className="w-32 h-32 mb-4 object-contain"
            />
            <p className="text-lg font-bold">플레이어 : {currentUser}</p>
          </div>
          <p className="text-lg font-bold">획득 포인트: {score}점</p>
        </div>
  
        {/* 단어 결과 홈 버튼 */}
        <div className="w-1/2 bg-gray-200 p-6 rounded-lg flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-black">단어 리스트</h2>
          <ul className="flex-1 space-y-2 overflow-auto text-white font-medium">
            {results.map((result, index) => (
              <li
                key={index}
                className={`p-2 rounded-md ${
                  result.status === 'success' ? 'bg-main02' : 'bg-red-400'
                }`}
              >
                {index + 1}. {result.word} -{' '}
                {result.status === 'success' ? '성공' : '실패'}
              </li>
            ))}
          </ul>
          <button
            className="mt-6 bg-main01 hover:bg-green-600 text-white py-2 px-4 rounded"
            onClick={() => navigate('/main')}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );    
};

export default ResultSingle;
