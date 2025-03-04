const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

// 모델 정의
const Characters = sequelize.define(
  'Characters',
  {
    character_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    image: {
      type: DataTypes.BLOB('long'),
    },
  },
  {
    tableName: 'characters',
    timestamps: false,
  }
);

// 생성
const createCharactersTableAndInsertData = async () => {
  try {
    // 테이블에 데이터가 이미 있는지 확인
    const count = await Characters.count();
    if (count > 0) {
      console.log('Characters 테이블에 데이터가 이미 존재합니다.');
      return;
    }
    await sequelize.sync();
    await Characters.bulkCreate([
      { name: '꽝!!', image: null },
    ]);
    console.log('Characters 테이블 초기화 및 데이터 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

module.exports = { Characters, createCharactersTableAndInsertData };
