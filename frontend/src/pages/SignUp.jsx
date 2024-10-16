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
    <div className="min-h-screen flex items-center justify-center bg-customWhite">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            className=" focus:outline-none focus:ring-indigo-500 focus:border-customGreen mt-1 block w-full text-sm px-3 py-2 border rounded shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">아이디</label>
          <input 
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
            className=" focus:outline-none focus:ring-indigo-500 focus:border-customGreen mt-1 block w-full text-sm px-3 py-2 border rounded shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            className=" focus:outline-none focus:ring-indigo-500 focus:border-customGreen mt-1 block w-full px-3 py-2 border text-sm rounded shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input 
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
            className=" focus:outline-none focus:ring-indigo-500 focus:border-customGreen mt-1 block w-full px-3 py-2 border text-sm roundedl shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            className=" focus:outline-none focus:ring-indigo-500 focus:border-customGreen mt-1 block w-full px-3 py-2  text-sm border rounded shadow-sm"
            required
          />
        </div>
        <button type="submit" className="w-full bg-customGreen text-white py-2 px-4 rounded  hover:bg-customBlue transition duration-200">
          완료
        </button>
      </form>
    </div>
  );
}

export default SignUp;
