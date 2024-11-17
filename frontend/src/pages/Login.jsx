import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (id && password) {
      try {
        const response = await axios.post('http://localhost:8000/login', {
          id: id,
          pw: password,
        });
  
        console.log("로그인 응답 데이터:", response.data);
  
        // 토큰 및 memberId 저장
        localStorage.setItem('token', response.data.token);
        if (response.data.memberId) {
          localStorage.setItem('memberId', response.data.memberId);
        } else {
          alert("memberId를 저장하지 못했습니다. 관리자에게 문의하세요.");
        }
  
        alert(response.data.message);
        navigate('/main');
      } catch (error) {
        console.error("로그인 중 오류:", error.response?.data);
        alert("로그인에 실패했습니다.");
      }
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

        <div className="mb-4">
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-customGreen"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="block w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-customGreen"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-customGreen text-white py-3 rounded hover:bg-customBlue transition duration-200"
        >
          로그인
        </button>

        <div className="mt-6 text-center text-sm">
          <a href="/signup" className="text-gray-600 hover:text-gray-800">회원가입</a>
          <span className="mx-2">|</span>
          <a href="/forgot-password" className="text-gray-600 hover:text-gray-800">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
