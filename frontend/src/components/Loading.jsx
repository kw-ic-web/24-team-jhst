import React from 'react';

const Loading = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="text-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 mb-4"></div>
        <h2 className="text-white text-xl font-semibold">게임을 준비 중입니다...</h2>
      </div>
    </div>
  );
};

export default Loading;
