import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogoClick = () => {
    navigate('/main');
  };

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      // 로그아웃
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      alert('로그아웃 되었습니다.');
      navigate('/login');
    } else {
      // 로그인 페이지로 이동
      navigate('/login');
    }
  };

  return (
    <header
      className="fixed top-0 left-0 w-full flex justify-between items-center h-16 bg-white z-50 px-24"
      style={{ boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={handleLogoClick}
      >
        SPELL MEOW
      </h1>
      <button
        onClick={handleLoginLogoutClick}
        className="px-6 py-2 text-white bg-main01 rounded-lg"
      >
        {isLoggedIn ? '로그아웃' : '로그인'}
      </button>
    </header>
  );
};

export default Header;
