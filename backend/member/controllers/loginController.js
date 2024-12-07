const jwt = require('jsonwebtoken'); // 토큰
require('dotenv').config(); // .env
const member_game = require('../../db/memberdb');
const MemberGame = member_game.MemberGame; 
const bcrypt = require('bcrypt');

// 토큰 검증 미들웨어
verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET); 
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.',
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    });
  }
};

// 비밀번호 검증
const verifyPwd = async (pwd, hashedPwd) => {
  const isMatch = await bcrypt.compare(pwd, hashedPwd);
  return isMatch;
};

// 로그인 로직
const login = async (req, res) => {
  const { id, pw } = req.body;

  if (!id || !pw) {
    res.status(400).send('아이디 또는 비밀번호를 입력해주세요.');
  } else {
    try {
      const memberGame = await MemberGame.findOne({
        where: {
          member_id: id,
        },
      });

      const verifyPw = await verifyPwd(pw, memberGame.pwd);

      if (memberGame && verifyPw) {
        const token = jwt.sign(
          {
            id: memberGame.member_id,
            name: memberGame.name,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '3h',
            issuer: 'jhst',
          }
        );
        return res.json({
          code: 200,
          message: '로그인되었습니다. 환영합니다.',
          token,
          memberId: memberGame.member_id, // memberId 추가
          redirectTo: '/main',
        });
      } else {
        // 사용자 정보가 일치하지 않을 경우
        return res.status(401).json({
          code: 401,
          message: '아이디 또는 비밀번호가 일치하지 않습니다.',
          redirectTo: '/login',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    } // 이게  try
    //   }
    // });
  } // 이게 원래 else
}; // 이거 함수

module.exports = { login, verifyToken, verifyPwd };
