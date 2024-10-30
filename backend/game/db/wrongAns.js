const sequelize = require('../../config/db'); // sequelize 인스턴스 가져오기
const { DataTypes } = require('sequelize');

// wrongAns 테이블 정의
const WrongAns = sequelize.define('wrongAns', {
  wrong_ans_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  word_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'word',
      key: 'word_id',
    },
    onDelete: 'CASCADE',
  },
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'game',
      key: 'game_id',
    },
    onDelete: 'CASCADE',
  },
  member_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'member_game',
      key: 'member_id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'wrongAns',
  timestamps: false,
});
const insertExampleData = async () => {
    try {
      await WrongAns.bulkCreate([
        { word_id: 1, game_id: 1, member_id: 'user1' },
        { word_id: 2, game_id: 1, member_id: 'user2' },
        { word_id: 3, game_id: 2, member_id: 'user3' },
        { word_id: 4, game_id: 3, member_id: 'user1' },
        { word_id: 5, game_id: 2, member_id: 'user4' }
      ]);
      console.log('WrongAns 테이블에 예시 데이터 삽입 완료');
    } catch (error) {
      console.error('예시 데이터 삽입 중 오류 발생:', error);
    }
  };
  module.exports = { WrongAns, insertExampleData };