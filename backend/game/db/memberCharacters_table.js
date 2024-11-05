const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

// 모델 정의
const MemberCharacters = sequelize.define('MemberCharacters', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  member_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  character_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'member_characters',
  timestamps: false,
});

// 생성
const createMemberCharactersTableAndInsertData = async () => {
  try {
    await sequelize.sync();
    await MemberCharacters.bulkCreate([
      { member_id: 'user1', character_id: 1, is_active: true },
      { member_id: 'user2', character_id: 2, is_active: false },
      { member_id: 'user3', character_id: 3, is_active: true },
    ]);
    console.log('MemberCharacters 테이블 초기화 및 데이터 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

module.exports = { MemberCharacters, createMemberCharactersTableAndInsertData };
