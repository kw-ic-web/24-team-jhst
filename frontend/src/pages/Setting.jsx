import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 

function Setting({ audioRef }) {
  const navigate = useNavigate(); 
  const [userInfo] = useState({
    name: '홍길동',
    email: 'hong@example.com',
  });
  const [isSoundOn, setIsSoundOn] = useState(true); 

  // // 소리 끄기/켜기
  // const handleToggleSound = () => {
  //   if (isSoundOn) {
  //     audioRef.current.pause();  // 음악 멈춤
  //   } else {
  //     audioRef.current.play();   // 음악 재생
  //   }
  //   setIsSoundOn(!isSoundOn); 
  // };

  // 회원 탈퇴
  const handleDeleteAccount = () => {
    if (window.confirm('정말로 회원탈퇴를 하시겠습니까?')) {
      alert('회원탈퇴가 완료되었습니다.');
    }
  };

  // 돌아가기
  const handleBack = () => {
    navigate("/main");  
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-8">설정</h1>

      {/* 카드 */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* 사용자 정보 */}
        <div className="mb-4">
          <label className="block text-xl font-medium text-gray-700">이름</label>
          <p className="mt-1 text-gray-900">{userInfo.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-xl font-medium text-gray-700">이메일</label>
          <p className="mt-1 text-gray-900">{userInfo.email}</p>
        </div>

        {/* 소리 설정 */}
        <div className="mb-4">
          <h2 className="text-xl font-medium mb-2">소리 설정</h2>
          <button
            // onClick={handleToggleSound}
            className={`w-full py-2 px-4 rounded text-white ${isSoundOn ? 'bg-red-500' : 'bg-green-500'}`}
          >
            {isSoundOn ? '소리 끄기' : '소리 켜기'}
          </button>
        </div>

        {/* 회원 탈퇴 */}
        <div className="mb-4">
          <h2 className="text-xl font-medium mb-2">회원 탈퇴</h2>
          <button
            onClick={handleDeleteAccount}
            className="w-full py-2 px-4 rounded bg-red-500 text-white"
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleBack}
          className="bg-customGreen text-white py-2 px-8 rounded w-full"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default Setting;
