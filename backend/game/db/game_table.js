const sequelize = require('../../config/db'); // sequelize 인스턴스 가져오기
const { DataTypes } = require('sequelize');

const Game = sequelize.define('Game', {
  game_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  opposite_player: {
    type: DataTypes.STRING(20),
  },
  create_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  game_mode: {
    type: DataTypes.STRING(10),
  },
  easy_or_hard: {
    type: DataTypes.STRING(10),
  },
  winner: {
    type: DataTypes.STRING(20),
  },
}, {
  tableName: 'game',
  timestamps: false,
});


const createGameTableAndInsertData = async () => {
  try {
    await sequelize.sync();
    await Game.bulkCreate([
      { member_id: 'user1', opposite_player: 'user2', game_mode: 'english', easy_or_hard: 'easy', winner: 'user1' },
      { member_id: 'user3', opposite_player: 'user4', game_mode: 'english', easy_or_hard: 'hard', winner: 'user3' },
      { member_id: 'user5', opposite_player: 'user1', game_mode: 'korean', easy_or_hard: 'easy', winner: 'user5' },
      { member_id: 'user2', opposite_player: 'user3', game_mode: 'korean', easy_or_hard: 'hard', winner: 'user3' },
      { member_id: 'user4', opposite_player: 'user5', game_mode: 'korean', easy_or_hard: 'easy', winner: 'user4' }
    ]);
    console.log('Game 테이블 초기화 및 데이터 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

module.exports = { Game, createGameTableAndInsertData };
