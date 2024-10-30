const sequelize = require('../../config/db'); 
const { DataTypes,Sequelize  } = require('sequelize');


// Round 모델 정의
const Round = sequelize.define('Round', {
  round_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  game_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'game',
      key: 'game_id',
    },
    onDelete: 'CASCADE',
  },
  word_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'word',
      key: 'word_id',
    },
    onDelete: 'CASCADE',
  },
  round_num: {
    type: DataTypes.INTEGER,
  },
  winner: {
    type: DataTypes.STRING(20),
  },
  loser: {
    type: DataTypes.STRING(20),
  },
}, {
  tableName: 'round',
  timestamps: false,
});


const createRoundTableAndInsertData = async () => {
  try {
    await sequelize.sync();
    const gameIds = await sequelize.query('SELECT game_id FROM game', { type: Sequelize.QueryTypes.SELECT });

    if (gameIds.length > 0) {
      await Round.bulkCreate([
        { game_id: gameIds[0].game_id, word_id: 1, round_num: 1, winner: 'user1', loser: 'user2' },
        { game_id: gameIds[0].game_id, word_id: 2, round_num: 2, winner: 'user1', loser: 'user2' },
        { game_id: gameIds[1].game_id, word_id: 3, round_num: 1, winner: 'user3', loser: 'user4' },
        { game_id: gameIds[1].game_id, word_id: 4, round_num: 2, winner: 'user3', loser: 'user4' },
        { game_id: gameIds[2].game_id, word_id: 5, round_num: 1, winner: 'user5', loser: 'user1' }
      ]);
    }
    console.log('round 테이블 생성 및 데이터 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

module.exports = { Round, createRoundTableAndInsertData };
