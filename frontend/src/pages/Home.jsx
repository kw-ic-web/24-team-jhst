import React from 'react';
import { useNavigate } from 'react-router-dom';
import meow1 from '../assets/images/meow1.png';
import meow2 from '../assets/images/meow2.png';
import meow3 from '../assets/images/meow3.png';



function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-whitee flex-col">
      <div className= "flex">
      <img src={meow1} alt="cat image" style={{ width: '300px', height: '300px' }} />
      <img src={meow2} alt="cat image" style={{ width: '300px', height: '300px' }} />
      <img src={meow3} alt="cat image" style={{ width: '300px', height: '300px' }} />
      </div>
      <h1 className="text-2xl mb-4">Spell Meow</h1>
      <button onClick={handleLogin} className="bg-customGreen text-white px-8 py-2 rounded">
        로그인
      </button>
    </div>
  );
}

export default Home;
