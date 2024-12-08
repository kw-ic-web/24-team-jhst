import React from 'react';
import { useNavigate } from 'react-router-dom';
import profmeow from '../assets/images/prof.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faGithub } from '@fortawesome/free-brands-svg-icons';

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
        <h2 className="text-2xl font-bold mt-2 mb-4">SpellMeow</h2>
        <p className="mb-8">재미있게 영어 단어 철자를 배우고 실력을 키워보세요! <br />
          글자를 모아 단어를 완성하고 친구들과 대결을 펼치세요</p>
        <button onClick={handlePlay} className="w-full font-semibold bg-main01 text-white py-3 rounded hover:bg-green-800 transition duration-200">
          플레이 하기
        </button>
        {/* 플레이 방법 버튼 추가 */}
        <button onClick={handleHowToPlay} className="mt-4 w-full font-semibold bg-main02 text-white py-3 rounded hover:bg-blue-800 transition duration-200">
          게임 방법
        </button>
      </div>

      <div className="mt-5">
        <div className="flex justify-center">
          <p className="text-2xl font-bold mr-4">S P E L L</p>
          <img src={profmeow} alt="Game Cat" className="w-24 mb-2" />
        </div>
        <div className="grid grid-cols-5 gap-4 mt-2">
          <span>A</span>
          <span className='text-xl' > <strong>E</strong></span>
          <span>K</span>
          <span>U</span>
          <span className='text-xl'> <strong>M</strong></span>
          <span className='text-xl' > <strong>W</strong></span>
          <span>B</span>
          <span className='text-xl' > <strong>O</strong></span>
          <span> P</span>
          <span className='mb-10'>C</span>
        </div>
      </div>
      <footer className="border-t border-gray-300 text-gray-700 pt-6 w-full">
        <div className="container mx-auto text-center">
          <h2 className="text-sm font-bold mb-4">Follow Us on GitHub</h2>
          <ul className="flex justify-center space-x-6 mb-4">
            {[
              { label: '김수민', url: 'https://github.com/sunninz' },
              { label: '오기택', url: 'https://github.com/user2' },
              { label: '주세원', url: 'joosewon@naver.com' },
              { label: '황세연', url: 'https://github.com/SYEONIH' }
            ].map((link, index) => (
              <li key={index} className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faGithub} />
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-main02 transition">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm">&copy; {new Date().getFullYear()} SPELLMEOW. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
