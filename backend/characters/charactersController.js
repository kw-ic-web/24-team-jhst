const db = require('../config/db');

// 캐릭터 추가
exports.addCharacter = (req, res) => {
  const { name, imageFile } = req.body;

  console.log("name:", name);
  console.log("imageFile:", imageFile);

  if (!imageFile) {
    return res.status(400).json({ message: '이미지 파일이 없습니다.' });
  }

  try {
    // 이미지 파일을 Base64에서 Buffer로 변환
    const imageBuffer = Buffer.from(imageFile, 'base64');

    const query = 'INSERT INTO characters (name, image) VALUES (?, ?)';
    db.query(query, [name, imageBuffer], (err, result) => {
      if (err) {
        console.error('데이터베이스 저장 오류:', err);
        return res.status(500).json({ message: '캐릭터 추가 실패', error: err });
      }
      return res.status(201).json({ message: '캐릭터 추가 성공', characterId: result.insertId });
    });
  } catch (err) {
    console.error('이미지 변환 오류:', err);
    res.status(500).json({ message: '서버 오류 발생', error: err });
  }
};

// 캐릭터 선택 
exports.selectCharacter = (req, res) => {
  const { memberId, characterId } = req.body;

  // 모든 캐릭터 is_active 값 false
  const deactivateQuery = 'UPDATE member_characters SET is_active = 0 WHERE member_id = ?';

  db.query(deactivateQuery, [memberId], (err) => {
    if (err) {
      console.error('캐릭터 비활성화 오류:', err);
      return res.status(500).json({ message: '캐릭터 선택 실패', error: err });
    }

    // 선택 캐릭터 is_active 값 true
    const activateQuery = 'UPDATE member_characters SET is_active = 1 WHERE member_id = ? AND character_id = ?';
    db.query(activateQuery, [memberId, characterId], (err, result) => {
      if (err) {
        console.error('캐릭터 활성화 오류:', err);
        return res.status(500).json({ message: '캐릭터 선택 실패', error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '캐릭터가 없습니다.' });
      }
      return res.status(200).json({ message: '캐릭터 선택 성공' });
    });
  });
};

// 랜덤 캐릭터 뽑기 및 저장
exports.drawCharacter = (req, res) => {
  const { memberId } = req.body;

  const characterQuery = 'SELECT * FROM characters';
  db.query(characterQuery, (err, characters) => {
    if (err) {
      console.error('캐릭터 목록 불러오기 오류:', err);
      return res.status(500).json({ message: '캐릭터 목록을 불러오는 데 실패했습니다.', error: err });
    }
    if (characters.length === 0) {
      return res.status(404).json({ message: '등록된 캐릭터가 없습니다.' });
    }

    // 랜덤 캐릭터 뽑기
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomIndex];

    // 뽑은 캐릭터를 보유 캐릭터 목록에 저장
    const insertQuery = 'INSERT INTO member_characters (member_id, character_id, is_active) VALUES (?, ?, 0)';
    db.query(insertQuery, [memberId, randomCharacter.character_id], (err, result) => {
      if (err) {
        console.error('랜덤 캐릭터 저장 오류:', err);
        return res.status(500).json({ message: '캐릭터를 보유 캐릭터 목록에 저장하는 데 실패했습니다.', error: err });
      }
      return res.status(200).json({ message: '랜덤 캐릭터 뽑기 성공', character: randomCharacter });
    });
  });
};
