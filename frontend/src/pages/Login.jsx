import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    if (id && password) {
      alert(`ID: ${id}, Password: ${password}`);
      // 로그인 성공 시 /main 페이지로 이동
      navigate('/main');
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };

  const handleKakaoLogin = () => {
    alert('카카오톡 로그인');
  };

  const handleSignUp = () => {
    navigate('/signup');
    alert('회원가입 페이지로 이동합니다.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customWhite">
      <div className="bg-white p-8  w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

        <div className="mb-4">
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">아이디</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디를 입력하세요"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-customGreen sm:text-sm"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-customGreen sm:text-sm"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-customGreen text-white py-2 px-4 rounded hover:bg-customBlue transition duration-200"
        >
          로그인
        </button>

        <button
          onClick={handleKakaoLogin}
          className="w-full bg-yellow-400 text-black py-2 px-4 rounded mt-4 flex items-center justify-center hover:bg-customBlue transition duration-200"
        >
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/kakaotalk.svg" alt="KakaoTalk" className="w-5 h-5 mr-2" />
          카카오톡으로 로그인
        </button>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">계정이 없으신가요?</span>
          <button
            onClick={handleSignUp}
            className="ml-2 text-blue-500 text-sm hover:underline"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
