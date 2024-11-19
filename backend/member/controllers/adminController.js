require('dotenv').config();
const { MemberGame } = require('../../db/memberdb');
const { Characters } = require('../../db/assets/characters_table');
const { Word } = require('../../db/assets/word');

// 1. 특정 회원 탈퇴
exports.deleteMember = async (req, res) => {
  const { member_id } = req.body;

  try {
    const member = await MemberGame.destroy({ where: { member_id } });
    if (!member) {
      return res.status(404).json({ message: '회원이 존재하지 않습니다.' });
    }
    return res.status(200).json({ message: '회원 탈퇴 성공' });
  } catch (err) {
    console.error('회원 탈퇴 오류:', err);
    res.status(500).json({ message: '회원 탈퇴 실패', error: err });
  }
};

// 2. 특정 회원 포인트 수정
exports.updateMemberPoint = async (req, res) => {
  const { member_id, point } = req.body;

  try {
    const member = await MemberGame.findOne({ where: { member_id } });
    if (!member) {
      return res.status(404).json({ message: '회원이 존재하지 않습니다.' });
    }

    member.point = point;
    await member.save();

    return res.status(200).json({ message: '포인트 수정 성공', updatedPoint: member.point });
  } catch (err) {
    console.error('포인트 수정 오류:', err);
    res.status(500).json({ message: '포인트 수정 실패', error: err });
  }
};

// 3. 캐릭터 추가
exports.addCharacter = async (req, res) => {
  const { name, imageFile } = req.body;

  if (!imageFile) {
    return res.status(400).json({ message: '이미지 파일이 없습니다.' });
  }

  try {
    const imageBuffer = Buffer.from(imageFile, 'base64');
    const newCharacter = await Characters.create({ name, image: imageBuffer });

    return res.status(201).json({ message: '캐릭터 추가 성공', characterId: newCharacter.character_id });
  } catch (err) {
    console.error('캐릭터 추가 오류:', err);
    res.status(500).json({ message: '캐릭터 추가 실패', error: err });
  }
};

// 4. 캐릭터 삭제
exports.deleteCharacter = async (req, res) => {
  const { character_id } = req.body;

  try {
    const character = await Characters.destroy({ where: { character_id } });
    if (!character) {
      return res.status(404).json({ message: '캐릭터가 존재하지 않습니다.' });
    }
    return res.status(200).json({ message: '캐릭터 삭제 성공' });
  } catch (err) {
    console.error('캐릭터 삭제 오류:', err);
    res.status(500).json({ message: '캐릭터 삭제 실패', error: err });
  }
};

// 5. 새 단어 추가
exports.addWord = async (req, res) => {
  const { en_word, ko_word, difficulty } = req.body;

  if (!['easy', 'hard'].includes(difficulty)) {
    return res.status(400).json({ message: '올바른 난이도를 입력하세요 (easy 또는 hard)' });
  }

  try {
    const newWord = await Word.create({ en_word, ko_word, easy_or_hard: difficulty });

    return res.status(201).json({ message: '단어 추가 성공', wordId: newWord.word_id });
  } catch (err) {
    console.error('단어 추가 오류:', err);
    res.status(500).json({ message: '단어 추가 실패', error: err });
  }
};

// 6. 단어 수정 (word_id로 조회 후 영단어와 뜻 수정)
exports.updateWord = async (req, res) => {
  const { word_id, en_word, ko_word } = req.body;

  try {
    const word = await Word.findOne({ where: { word_id } });
    if (!word) {
      return res.status(404).json({ message: '단어가 존재하지 않습니다.' });
    }

    word.en_word = en_word || word.en_word; // 입력된 값이 없으면 기존 값 유지
    word.ko_word = ko_word || word.ko_word; // 입력된 값이 없으면 기존 값 유지
    await word.save();

    return res.status(200).json({ message: '단어 수정 성공', updatedWord: word });
  } catch (err) {
    console.error('단어 수정 오류:', err);
    res.status(500).json({ message: '단어 수정 실패', error: err });
  }
};
