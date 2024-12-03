import React from 'react';
import { useNavigate } from 'react-router-dom';
import meow3 from '../assets/images/meow3.png';

function Home() {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate('/login');
  };

  const handleHowToPlay = () => {
    navigate('/how-to-play'); // How to Play 페이지로 이동
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      {/* 메인 */}
      <div className="bg-white p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">SpellMeow</h2>
        <p className="mb-8">재미있게 영어 단어 철자를 배우고 실력을 키워보세요! <br />
          글자를 모아 단어를 완성하고 친구들과 대결을 펼치세요</p>
        <button onClick={handlePlay} className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 transition duration-200">
          플레이 하기
        </button>
        {/* 플레이 방법 버튼 추가 */}
        <button onClick={handleHowToPlay} className="mt-4 w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-200">
          게임 방법
        </button>
      </div>

      <div className="mt-16">
        <div className="flex justify-center">
          <p className="text-2xl font-bold mr-4">SPELL</p>
          <img src={meow3} alt="Game Cat" className="w-32 h-32" />
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
          <span>A</span>
          <span>E</span>
          <span>W</span>
          <span>D</span>
          <span>M</span>
          <span>L</span>
          <span>B</span>
          <span>O</span>
          <span>C</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
