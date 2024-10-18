import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import SignUp from './pages/SignUp.jsx';
import Main from './pages/Main.jsx';
import Gacha from './pages/Gacha.jsx';
import Shop from './pages/Shop.jsx';
import Setting from './pages/Setting.jsx';
import Ranking from './pages/Ranking.jsx';
import Header from './components/Header.jsx';  
import GameMulti from './pages/GameMulti.jsx';

function App() {
  return (
    <Router>
      <div className="pt-4"></div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Main />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/gacha" element={<Gacha />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/game-multi" element={<GameMulti />} />
      </Routes>
    </Router>
  );
}

export default App;
