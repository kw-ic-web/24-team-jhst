const express = require('express'); // express
const jwt = require('jsonwebtoken'); //토큰
const mysql = require('mysql2/promise');
require('dotenv').config(); //.env
const router = express.Router(); // 라우터 설정 why?
//const db = '../../config/db';
const member_game = require('../../db/memberdb');

const MemberGame = member_game.MemberGame; // member_Game 테이블로 변경

verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
    }

    req.decoded = jwt.verify(token, process.env.JWT_SECRET);
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


//토큰

const login = async (req, res) => {
  const { id, pw } = req.body;

  if (!id || !pw) {
    res.status(400).send('아이디또는 비밀번호를 입력해주세요.');
  } else {
    try {
      const memberGame = await MemberGame.findOne({
        where: {
          member_id: id,
          pwd: pw,
        },
      });

      if (memberGame) {
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
          message: '토큰이 발급되었습니다.',
          token,
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
    }
  }
};

module.exports = { login, verifyToken };

// 예비코드 sequelize 사용x

// const login = async (req, res) => {
//   const { id, pw } = req.body;

//   if (!id || !pw) {
//     res.status(400).send('아이디또는 비밀번호를 입력해주세요.');
//   } else {
//     try {
//       const [rows] = await db.execute('SELECT * FROM member_table WHERE member_id = ? AND pwd = ?', [id, pw]);

//       if (rows.length > 0) {
//         const token = jwt.sign(
//           {
//             id: rows[0].member_id,
//             name: rows[0].name,
//           },
//           process.env.JWT_SECRET,
//           {
//             expiresIn: '3h',
//             issuer: 'jhst',
//           }
//         );
//         return res.json({
//           code: 200,
//           message: '토큰이 발급되었습니다.',
//           token,
//           redirectTo: '/main',
//         });
//       } else {
//         // 사용자 정보가 일치하지 않을 경우
//         return res.status(401).json({
//           code: 401,
//           message: '아이디 또는 비밀번호가 일치하지 않습니다.',
//           redirectTo: '/login', // 프론트에서 /login에 머물 수 있도록 경로 포함
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({
//         code: 500,
//         message: '서버 에러',
//       });
//     }
//   }
// };

// router.get('/test', verifyToken, (req, res) => {
//   res.json(req.decoded);
// });
