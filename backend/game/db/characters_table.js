const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

// 모델 정의
const Characters = sequelize.define('Characters', {
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
    type: DataTypes.BLOB,
  },
}, {
  tableName: 'characters',
  timestamps: false,
});


// 생성
const createCharactersTableAndInsertData = async () => {
  try {
    await sequelize.sync();
    await Characters.bulkCreate([
      { name: 'Character1', image: null },
      { name: 'Character2', image: null },
      { name: 'Character3', image: null },
    ]);
    console.log('Characters 테이블 초기화 및 데이터 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

module.exports = { Characters, createCharactersTableAndInsertData };
