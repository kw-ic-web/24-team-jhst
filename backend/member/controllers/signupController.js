const express = require('express'); // express
const jwt = require('jsonwebtoken'); // 토큰
const mysql = require('mysql2/promise'); // mysql2를 통해 MySQL과 연결
require('dotenv').config(); // .env 파일 로드
const router = express.Router(); // 라우터 설정
const db = require('../../game/db/member_table'); // MySQL 데이터베이스 연결 설정
const member_table = require('../../game/db/member_table');

member = member_table.Member;

// checkid 함수: 아이디 중복 확인
const checkid = async (req, res) => {
  try {
    const { id } = req.body;

    // MySQL 쿼리를 사용하여 사용자 아이디 확인
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);

    if (rows.length > 0) {
      res.json({ available: false, message: '이미 사용 중인 아이디에요' });
    } else {
      res.json({ available: true, message: '사용 가능한 아이디에요' });
    }
  } catch (error) {
    console.error('아이디 확인 중 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 회원가입 sequelize 으로 구현
const insertMemberTableData = async () => {
  try {
    await sequelize.sync();
    await member.bulkCreate([{ member_id: id, pwd: pwd, name: name, email: email }]);

    res.status(201).json({ message: '새로운 회원 등록 성공' });
    console.log('멤버테이블에 새로운 회원 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

// 모듈 내보내기
module.exports = { checkid, insertMemberTableData };

//
//
//
//

//예비코드

// register 함수 : 쿼리문 버전, sequelize오류뜨면 이걸로.

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
//
// module.exports = { checkid, register, insertMemberTableData };
