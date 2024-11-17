require('dotenv').config(); //.env

const { MemberGame } = require('../../db/memberdb');

const { Words } = require('../../db/assets/word');

// 멤버 조회
// exports.getAllMembers = async (req, res) => {
//   try {
//     const records = await MemberGame.findAll();
//     res.status(200).json(records);
//   } catch (error) {
//     res.status(500).json({ error: '서버오류' });
//   }
// };

exports.getAllMembers = async (req, res) => {
  try {
    console.log('MemberGame 모델:', MemberGame); // 모델 확인
    const records = await MemberGame.findAll();
    console.log('조회된 데이터:', records); // 데이터 확인
    res.status(200).json(records);
  } catch (error) {
    console.error('데이터 조회 중 오류:', error);
    res.status(500).json({ error: '서버 오류', details: error.message });
  }
};

// member id로 찾기
exports.getMembersById = async (req, res) => {
  try {
    const { member_id } = req.params;
    const records = await MemberGame.findAll({ where: { member_id } });
    if (!records.length) {
      return res.status(404).json({ error: '일치하는 member가 없습니다' });
    }
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: '서버오류' });
  }
};

// 새로운 멤버 생성
exports.createMembers = async (req, res) => {
  try {
    const newRecord = await MemberGame.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: '서버오류' });
  }
};

// 멤버 업데이트
exports.updateMembers = async (req, res) => {
  try {
    const { member_id } = req.params;
    const updatedMember = await MemberGame.update(req.body, { where: { member_id } });
    if (updatedMember[0] === 0) {
      return res.status(404).json({ error: '회원이 없습니다' });
    }
    res.status(200).json({ message: '수정 완료' });
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 멤버 삭제
exports.deleteMembers = async (req, res) => {
  try {
    const { member_id } = req.params;
    const deletedMember = await MemberGame.destroy({ where: { member_id } });

    if (!deletedMember) {
      return res.status(404).json({ error: '삭제할 회원이 없습니다' });
    }
    res.status(200).json({ message: '삭제 완료' });
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};

///////////////////////

// WrongAns 가져오기
exports.getAllWords = async (req, res) => {
  try {
    const records = await Words.findAll();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

// 특정 word_id에 맞는 단어 가져오기
exports.getWordsById = async (req, res) => {
  try {
    const { word_id } = req.params;
    const records = await Words.findAll({ where: { word_id } });
    if (!records.length) {
      return res.status(404).json({ error: '해당되는 단어가 없습니다' });
    }
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 새 단어 생성
exports.createWords = async (req, res) => {
  try {
    const newRecord = await Words.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: '단어 생성 성공' });
  }
};

// 단어 업데이트
exports.updateWords = async (req, res) => {
  try {
    const { word_id } = req.params;
    const updatedRecord = await Words.update(req.body, { where: { word_id } });
    if (updatedRecord[0] === 0) {
      return res.status(404).json({ error: '해당되는 단어가 없습니다' });
    }
    res.status(200).json({ message: '단어 수정 완료' });
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 단어 삭제
exports.deleteWords = async (req, res) => {
  try {
    const { word_id } = req.params;
    const deleted = await Words.destroy({ where: { word_id } });
    if (!deleted) {
      return res.status(404).json({ error: '삭제할 단어가 없습니다' });
    }
    res.status(200).json({ message: '단어 삭제 성공' });
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};
