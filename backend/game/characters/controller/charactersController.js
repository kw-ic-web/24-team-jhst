const { Characters } = require('../../../db/assets/characters_table');
const { MemberCharacters, MemberGame } = require('../../../db/memberdb');
const { Op } = require('sequelize');

// 캐릭터 추가
exports.addCharacter = async (req, res) => {
  const { name, imageFile } = req.body;

  console.log('name:', name);
  console.log('imageFile:', imageFile);

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

  console.log('요청 데이터:', { memberId, characterId });

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
  const { memberId } = req.query;

  try {
    const member = await MemberGame.findOne({ where: { member_id: memberId } });
    const characterCost = 100;

    if (member.point < characterCost) {
      return res.status(304).json({ message: '포인트가 부족합니다.' });
    }

    const ownedCharacterIds = await MemberCharacters.findAll({
      where: { member_id: memberId },
      attributes: ['character_id'],
    });
    const ownedIds = ownedCharacterIds.map((record) => record.character_id);

    const availableCharacters = await Characters.findAll({
      where: {
        character_id: { [Op.notIn]: ownedIds },
      },
    });

    if (availableCharacters.length === 0) {
      return res.status(404).json({ message: '뽑을 수 있는 캐릭터가 없습니다.' });
    }

    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    const randomCharacter = availableCharacters[randomIndex];

    // 이미지 Base64 변환
    const base64Image = randomCharacter.image
      ? `data:image/png;base64,${randomCharacter.image.toString('base64')}`
      : null;

    await MemberCharacters.create({
      member_id: memberId,
      character_id: randomCharacter.character_id,
      is_active: false,
    });

    member.point -= characterCost;
    await member.save();

    return res.status(200).json({
      message: '랜덤 캐릭터 뽑기 성공',
      character: {
        name: randomCharacter.name,
        image: base64Image,
      },
    });
  } catch (err) {
    console.error('랜덤 캐릭터 저장 오류:', err);
    res.status(500).json({ message: '캐릭터 뽑기 실패', error: err });
  }
};

// 보유 캐릭터 조회
exports.getOwnedCharacters = async (req, res) => {
  const memberId = req.user.id;

  try {
    const ownedCharacters = await MemberCharacters.findAll({
      where: { member_id: memberId },
      include: [
        {
          model: Characters,
          attributes: ['character_id', 'name', 'image'],
        },
      ],
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

// 활성화된 캐릭터를 반환
exports.getActiveCharacter = async (req, res) => {
  const { memberId } = req.query;

  if (!memberId) {
    return res.status(400).json({ message: 'memberId가 누락되었습니다.' });
  }

  try {
    const activeCharacter = await MemberCharacters.findOne({
      where: { member_id: memberId, is_active: true },
      include: [
        {
          model: Characters,
          attributes: ['name', 'image'],
        },
      ],
    });

    if (!activeCharacter) {
      return res.status(404).json({ message: '활성화된 캐릭터가 없습니다.' });
    }

    const character = {
      name: activeCharacter.Character.name,
      image: `data:image/png;base64,${activeCharacter.Character.image.toString('base64')}`,
    };

    res.status(200).json(character);
  } catch (err) {
    console.error('활성 캐릭터 조회 오류:', err);
    res.status(500).json({ message: '활성 캐릭터 조회 실패', error: err });
  }
};
