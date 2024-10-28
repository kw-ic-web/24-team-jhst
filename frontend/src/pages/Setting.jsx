import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 

function Setting({ audioRef }) {
  const navigate = useNavigate(); 
  const [userInfo, setUserInfo] = useState({
    name: '홍길동',
    email: 'test@naver.com',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = () => {
    alert('수정이 완료되었습니다.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 회원탈퇴를 하시겠습니까?')) {
      alert('회원탈퇴가 완료되었습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">설정</h2>

        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            placeholder="이름"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-customGreen"
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            placeholder="이메일"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-customGreen"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={userInfo.password}
            onChange={handleChange}
            placeholder="새 비밀번호"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-customGreen"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            name="confirmPassword"
            value={userInfo.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-customGreen"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-green-700 text-white py-3 rounded mb-4 hover:bg-green-800 transition duration-200"
        >
          수정 완료
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition duration-200"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}

export default Setting;
