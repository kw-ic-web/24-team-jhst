const express = require('express'); // express
const router = express.Router(); // 라우터 설정
require('dotenv').config(); // .env 파일 로드

const crypto = require('crypto'); // 암호화 도전

const member_game = require('../../db/memberdb');

const MemberGame = member_game.MemberGame; // membergame으로 변경

// checkid 함수: 아이디 중복 확인
const checkid = async (req, res) => {
  try {
    const { id } = req.body;

    // Sequelize를 사용하여 사용자 아이디 중복 확인
    const user = await MemberGame.findOne({
      where: { member_id: id },
    });

    if (user) {
      res.json({ available: false, message: '이미 사용 중인 아이디에요' });
    } else {
      res.json({ available: true, message: '사용 가능한 아이디에요' });
    }
  } catch (error) {
    console.error('아이디 확인 중 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 회원가입 기능
const insertMemberTableData = async (req, res) => {
  const { id, pwd, name, email } = req.body;

  try {
    // 먼저 member_id 중복 체크
    const existingMember = await MemberGame.findOne({
      where: { member_id: id },
    });

    if (existingMember) {
      return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
    }

    // crypto.randomBytes(64, async (err, buf) => {
    //   const salt = buf.toString('base64');

    //   crypto.pbkdf2(pwd, salt, 100000, 64, 'sha512', async (err, key) => {
    //     user.password = key.toString('base64');

    const result = await MemberGame.create({
      member_id: id,
      pwd,
      name,
      email,
      //salt,
    });

    res.status(201).json({ message: '새로운 회원 등록 성공' });
    console.log('멤버게임테이블에 새로운 회원 삽입 성공');
    //   });
    // });
  } catch (error) {
    console.error('회원 등록 중 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};
// 모듈 내보내기
module.exports = { checkid, insertMemberTableData };

//
//
//
//

//예비코드

// 쿼리문 버전, sequelize오류뜨면 이걸로.

// // checkid 함수: 아이디 중복 확인
// const checkid = async (req, res) => {
//   try {
//     const { id } = req.body;

//     // MySQL 쿼리를 사용하여 사용자 아이디 확인
//     const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);

//     if (rows.length > 0) {
//       res.json({ available: false, message: '이미 사용 중인 아이디에요' });
//     } else {
//       res.json({ available: true, message: '사용 가능한 아이디에요' });
//     }
//   } catch (error) {
//     console.error('아이디 확인 중 오류:', error);
//     res.status(500).json({ error: '서버 오류' });
//   }
// };

// // 회원가입 sequelize 으로 구현
// const register = async (req, res) => {
//   try {
//     const { id, pwd, name, email } = req.body; // 회원가입페이지에서 받아오는 회원가입정보

//     // MySQL 쿼리를 사용하여 새로운 사용자 추가
//     await db.execute('INSERT INTO member_table (member_id, pwd,name,email) VALUES (?, ?,?,?)', [id, pwd, name, email]);

//     console.log(`User created: ID = ${id}`);
//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error('회원가입 중 오류:', error);
//     res.status(500).json({ error: '서버 오류, 유저 생성 오류' });
//   }
// };

// // 모듈 내보내기
// module.exports = { checkid, insertMemberTableData };
