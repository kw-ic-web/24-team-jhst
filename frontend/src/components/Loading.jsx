import React from 'react';

const Loading = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-500 mb-8"></div>
      <button className="bg-gray-400 text-white py-2 px-4 rounded-lg">
        플레이어를 찾고 있습니다
      </button>
    </div>
  );
};

export default Loading;
