import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/main');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header
      className="fixed top-0 left-0 w-full flex justify-between items-center h-16 bg-white z-50 px-24"
      style={{ boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
    >
      <h1
        className=" text-2xl cursor-pointer"
        onClick={handleLogoClick}
      >
        Spell Meow
      </h1>
      <button
        onClick={handleLoginClick}
        className=" px-4 py-2 rounded"
      >
        로그인
      </button>
    </header>
  );
};

export default Header;
