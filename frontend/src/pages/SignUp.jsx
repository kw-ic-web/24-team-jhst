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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("회원가입 성공", formData);
  
    navigate('/login');
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
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-customGreen"
            required
          />
        </div>
        
        <div className="mb-4">
          <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-customGreen"
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
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-customGreen"
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
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-customGreen"
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
            className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-customGreen"
            required
          />
        </div>

        <button type="submit" className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 transition duration-200">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignUp;
