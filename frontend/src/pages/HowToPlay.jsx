import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faGithub } from '@fortawesome/free-brands-svg-icons';


const HowToPlay = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 메인 콘텐츠 */}
      <div className="flex-grow p-8 flex flex-col items-center">
        <div className="mt-10 max-w-4xl w-full bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-main01">게임 설명</h1>

          {/* 게임 플레이 방법 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">게임 플레이 방법</h2>
            <p className="text-gray-700">
              이 게임은 WASD 키로 캐릭터를 이동하고, <strong>Enter 키</strong>로 알파벳을 획득하며, 
              <strong>Backspace 키</strong>로 획득한 알파벳을 버릴 수 있습니다.
            </p>
          </section>

          {/* 게임 룰 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">게임 룰</h2>
            <p className="text-gray-700">
              게임은 총 5라운드로 구성되어 있습니다. 각 라운드에서 승리할 때마다 <strong>20 포인트</strong>를 받을 수 있습니다.
            </p>
          </section>

          {/* 메인 화면 설명 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">메인 화면 설명</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>게임 시작</strong>: 모드와 난이도를 선택할 수 있습니다. 
                <ul className="list-disc ml-6">
                  <li>모드: <strong>영어</strong> , <strong>한글</strong></li>
                  <li>
                    영어 모드: 제시된 영어 알파벳을 조합하여 단어를 만듭니다.
                  </li>
                  <li>
                    한글 모드: 제시된 한글 단어를 통해 연상되는 영어 단어의 알파벳을 조합합니다.
                  </li>
                  <li>난이도: <strong>Easy</strong> , <strong>Hard</strong></li>
                </ul>
              </li>
              <li>
                <strong>오답노트</strong>: 게임 중 틀린 단어를 모아서 연습할 수 있는 모드입니다.
              </li>
              <li>
                <strong>랭킹</strong>: 전 세계 이용자의 랭킹을 확인할 수 있습니다. 자신의 순위도 확인 가능합니다.
              </li>
              <li>
                <strong>상점</strong>: 보유한 캐릭터를 확인하고, 새로운 캐릭터를 뽑을 수 있습니다.
              </li>
            </ul>
          </section>

          {/* 돌아가기 */}
          <div className="text-center">
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-main01 text-white px-10 py-3 rounded-lg hover:bg-green-700"
            >
              뒤로가기
            </button>
          </div>
        </div>
      </div>

      {/* 푸터 */}
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
          <p className="text-sm mb-6">&copy; {new Date().getFullYear()} SPELLMEOW. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HowToPlay;
