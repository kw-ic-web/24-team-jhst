import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faGithub } from '@fortawesome/free-brands-svg-icons';

function Setting() {
  const navigate = useNavigate(); 
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://team10.kwweb.duckdns.org/users/viewInfo', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
    .then((response) => {
      const { name, email } = response.data;
      setUserInfo((prevInfo) => ({ ...prevInfo, name, email }));
    })
    .catch((error) => {
      console.error("Error fetching member info:", error);
      alert("회원 정보를 가져오지 못했습니다.");
    });
  }, []);

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = () => {
    if (userInfo.password !== userInfo.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const token = localStorage.getItem('token');
    axios.put('https://team10.kwweb.duckdns.org/users/updateMember', {
      name: userInfo.name,
      email: userInfo.email,
      pwd: userInfo.password,
    }, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
    .then(() => {
      alert('수정이 완료되었습니다.');
    })
    .catch((error) => {
      console.error("Error updating member info:", error);
      alert("회원 정보 수정에 실패했습니다.");
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 회원탈퇴를 하시겠습니까?')) {
      const token = localStorage.getItem('token');
      axios.delete('https://team10.kwweb.duckdns.org/users/deleteMember', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      })
      .then(() => {
        alert('회원탈퇴가 완료되었습니다.');
        navigate('/'); 
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        alert("회원 탈퇴에 실패했습니다.");
      });
    }
  };

  const handleHowToPlay = () => {
    navigate('/how-to-play');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-white flex items-center justify-center">
        <div className="bg-white p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 mt-14 text-center">설정</h2>

          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              placeholder="이름"
              className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-main01"
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              placeholder="이메일"
              className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-main01"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={userInfo.password}
              onChange={handleChange}
              placeholder="새 비밀번호"
              className="block w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-main01"
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
            className="w-full bg-main01 text-white py-3 rounded mb-4 hover:bg-green-800 transition duration-200"
          >
            수정 완료
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition duration-200 mb-4"
          >
            회원 탈퇴
          </button>
          <button
            onClick={handleHowToPlay}
            className="w-full bg-main02 text-white py-3 rounded hover:bg--600 transition duration-200"
          >
            게임 방법
          </button>
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
          <p className="text-sm mb-6">&copy; {new Date().getFullYear()} SPELLMEOW. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Setting;
