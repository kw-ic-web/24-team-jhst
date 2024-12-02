//const express = require('express'); // express
//const router = express.Router(); // 라우터 설정
require('dotenv').config(); // .env 파일 로드

const bcrypt = require('bcrypt'); //비밀번호 암호화

const { MemberCharacters, MemberGame } = require('../../db/memberdb');

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

// 비밀번호 암호화
const hashPwd = async (pwd) => {
  const saltRounds = parseInt(process.env.SALT);
  const hashedPwd = await bcrypt.hash(pwd, saltRounds);
  return hashedPwd;
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

    const hashedPwd = await hashPwd(pwd);

    await MemberGame.create({
      member_id: id,
      pwd: hashedPwd, // 비밀번호 해시화
      name,
      email,
      point: 100, // 기본 포인트 100
    });

    await MemberCharacters.create({
      member_id: id,
      character_id: 91, // 로컬db의 character_id 에 맞게 바꿔야 함.
      is_active: true,
    });

    res.status(201).json({ message: '새로운 회원 등록 성공' });
    console.log('멤버게임테이블에 새로운 회원 삽입 성공');
  } catch (error) {
    console.error('회원 등록 중 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};
// 모듈 내보내기
module.exports = { checkid, insertMemberTableData, hashPwd };
