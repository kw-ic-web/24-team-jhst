const { Characters } = require('../../../db/assets/characters_table');
const { MemberCharacters } = require('../../../db/memberdb');

// 캐릭터 추가
exports.addCharacter = async (req, res) => {
  const { name, imageFile } = req.body;

  console.log("name:", name);
  console.log("imageFile:", imageFile);

  if (!imageFile) {
    return res.status(400).json({ message: '이미지 파일이 없습니다.' });
  }

  try {
    const imageBuffer = Buffer.from(imageFile, 'base64');
    const newCharacter = await Characters.create({
      name: name,
      image: imageBuffer,
    });

    return res.status(201).json({ message: '캐릭터 추가 성공', characterId: newCharacter.character_id });
  } catch (err) {
    console.error('데이터베이스 저장 오류:', err);
    res.status(500).json({ message: '캐릭터 추가 실패', error: err });
  }
};

// 캐릭터 선택 
exports.selectCharacter = async (req, res) => {
  const { memberId, characterId } = req.body;

  console.log("요청 데이터:", { memberId, characterId });

  if (!memberId || !characterId) {
    return res.status(400).json({ message: 'memberId 또는 characterId가 누락되었습니다.' });
  }

  try {
    // 모든 캐릭터 비활성화
    await MemberCharacters.update({ is_active: false }, { where: { member_id: memberId } });

    // 선택한 캐릭터 활성화
    const [updatedRows] = await MemberCharacters.update(
      { is_active: true },
      { where: { member_id: memberId, character_id: characterId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: '캐릭터를 찾을 수 없습니다.' });
    }

    return res.status(200).json({ message: '캐릭터 선택 성공' });
  } catch (err) {
    console.error('캐릭터 활성화 오류:', err);
    res.status(500).json({ message: '캐릭터 선택 실패', error: err });
  }
};

// 랜덤 캐릭터 뽑기 및 저장
exports.drawCharacter = async (req, res) => {
  const { memberId } = req.query; // req.query로 memberId 받아오기

  try {
    // 모든 캐릭터 조회
    const characters = await Characters.findAll();
    if (characters.length === 0) {
      return res.status(404).json({ message: '등록된 캐릭터가 없습니다.' });
    }

    // 랜덤 캐릭터 선택
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomIndex];

    // 선택한 캐릭터를 MemberCharacters 테이블에 추가
    await MemberCharacters.create({
      member_id: memberId,
      character_id: randomCharacter.character_id,
      is_active: false,
    });

    return res.status(200).json({ message: '랜덤 캐릭터 뽑기 성공', character: randomCharacter });
  } catch (err) {
    console.error('랜덤 캐릭터 저장 오류:', err);
    res.status(500).json({ message: '캐릭터를 보유 캐릭터 목록에 저장하는 데 실패했습니다.', error: err });
  }
};

// 보유 캐릭터 조회
exports.getOwnedCharacters = async (req, res) => {
  const memberId = req.user.id; 

  try {
    const ownedCharacters = await MemberCharacters.findAll({
      where: { member_id: memberId },
      include: [{
        model: Characters,
        attributes: ['character_id', 'name', 'image'],
      }],
    });

    const characters = ownedCharacters.map((record) => ({
      characterId: record.Character.character_id,
      name: record.Character.name,
      image: record.Character.image,
      isActive: record.is_active,
    }));

    res.status(200).json(characters);
  } catch (err) {
    console.error('캐릭터 조회 오류:', err);
    res.status(500).json({ message: '보유 캐릭터 조회에 실패했습니다.', error: err });
  }
};
