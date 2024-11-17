const sequelize = require('../config/db'); // Sequelize 인스턴스 가져오기
const { DataTypes, Sequelize } = require('sequelize');

// Game 모델 정의
const Game = sequelize.define(
  'Game',
  {
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
  },
  {
    tableName: 'game',
    timestamps: false,
  }
);

// Round 모델 정의
const Round = sequelize.define(
  'Round',
  {
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
  },
  {
    tableName: 'round',
    timestamps: false,
  }
);

// WrongAns 모델 정의
const WrongAns = sequelize.define(
  'WrongAns',
  {
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
  },
  {
    tableName: 'wrongAns',
    timestamps: false,
  }
);

// Game 테이블 생성 및 데이터 삽입 함수
const createGameTableAndInsertData = async () => {
  try {
    // 테이블에 데이터가 이미 있는지 확인
    const count = await Game.count();
    if (count > 0) {
      console.log('game 테이블에 데이터가 이미 존재합니다.');
      return;
    }
    await sequelize.sync();
    await Game.bulkCreate([
      { member_id: 'user1', opposite_player: 'user2', game_mode: 'english', easy_or_hard: 'easy', winner: 'user1' },
      { member_id: 'user3', opposite_player: 'user4', game_mode: 'english', easy_or_hard: 'hard', winner: 'user3' },
      { member_id: 'user5', opposite_player: 'user1', game_mode: 'korean', easy_or_hard: 'easy', winner: 'user5' },
      { member_id: 'user2', opposite_player: 'user3', game_mode: 'korean', easy_or_hard: 'hard', winner: 'user3' },
      { member_id: 'user4', opposite_player: 'user5', game_mode: 'korean', easy_or_hard: 'easy', winner: 'user4' },
    ]);
    console.log('Game 테이블 초기화 및 데이터 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

// Round 테이블 생성 및 데이터 삽입 함수
const createRoundTableAndInsertData = async () => {
  try {
    // 테이블에 데이터가 이미 있는지 확인
    const count = await Round.count();
    if (count > 0) {
      console.log('Round 테이블에 데이터가 이미 존재합니다.');
      return;
    }
    await sequelize.sync();
    const gameIds = await sequelize.query('SELECT game_id FROM game', { type: Sequelize.QueryTypes.SELECT });

    if (gameIds.length > 0) {
      await Round.bulkCreate([
        { game_id: gameIds[0].game_id, word_id: 1, round_num: 1, winner: 'user1', loser: 'user2' },
        { game_id: gameIds[0].game_id, word_id: 2, round_num: 2, winner: 'user1', loser: 'user2' },
        { game_id: gameIds[1].game_id, word_id: 3, round_num: 1, winner: 'user3', loser: 'user4' },
        { game_id: gameIds[1].game_id, word_id: 4, round_num: 2, winner: 'user3', loser: 'user4' },
        { game_id: gameIds[2].game_id, word_id: 5, round_num: 1, winner: 'user5', loser: 'user1' },
      ]);
    }
    console.log('Round 테이블 생성 및 데이터 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

// WrongAns 테이블 예시 데이터 삽입 함수
const insertExampleData = async () => {
  try {
    // 테이블에 데이터가 이미 있는지 확인
    const count = await WrongAns.count();
    if (count > 0) {
      console.log('WrongAns 테이블에 데이터가 이미 존재합니다.');
      return;
    }
    await WrongAns.bulkCreate([
      { word_id: 1, game_id: 1, member_id: 'user1' },
      { word_id: 2, game_id: 1, member_id: 'user2' },
      { word_id: 3, game_id: 2, member_id: 'user3' },
      { word_id: 4, game_id: 3, member_id: 'user1' },
      { word_id: 5, game_id: 2, member_id: 'user4' },
    ]);
    console.log('WrongAns 테이블에 예시 데이터 삽입 완료');
  } catch (error) {
    console.error('예시 데이터 삽입 중 오류 발생:', error);
  }
};

module.exports = {
  Game,
  createGameTableAndInsertData,
  Round,
  createRoundTableAndInsertData,
  WrongAns,
  insertExampleData,
};
