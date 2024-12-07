import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 아이디 중복 확인 
  const checkUsernameAvailability = async () => {
    try {
      const response = await axios.post('https://team10.kwweb.duckdns.org/users/checkid', {
        id: formData.username,
      });
      setIsUsernameAvailable(response.data.available); 
      alert(response.data.message); 
    } catch (error) {
      console.error("아이디 중복 확인 중 오류:", error.response?.data);
      alert("아이디 중복 확인에 실패했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (isUsernameAvailable === false) {
      alert("이미 사용 중인 아이디입니다. 다른 아이디를 사용하세요.");
      return;
    }

    try {
      const response = await axios.post('https://team10.kwweb.duckdns.org/users/register', {
        id: formData.username,
        pwd: formData.password,
        name: formData.name,
        email: formData.email,
      });
      console.log("회원가입 성공:", response.data);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error("회원가입 중 오류:", error.response?.data);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

        <div className="mb-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="아이디"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-main01"
            required
          />
          <button
            type="button"
            onClick={checkUsernameAvailability}
            className="w-full py-3 bg-main02 text-white rounded hover:bg-blue-600 transition duration-200 mt-2"
          >
            아이디 중복 확인
          </button>
          {isUsernameAvailable === false && (
            <p className="text-red-500 text-sm mt-1">이미 사용 중인 아이디입니다.</p>
          )}
          {isUsernameAvailable === true && (
            <p className="text-green-500 text-sm mt-1">사용 가능한 아이디입니다.</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-main01"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-main01"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-main01"
            required
          />
        </div>

        <div className="mb-6">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-main01"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-main01 text-white py-3 rounded hover:bg-green-800 transition duration-200"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignUp;
