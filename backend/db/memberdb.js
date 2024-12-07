const sequelize = require('../config/db'); // Sequelize 인스턴스 가져오기
const { DataTypes, Sequelize } = require('sequelize');

// MemberCharacters 모델 정의
const MemberCharacters = sequelize.define(
  'MemberCharacters',
  {
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
  },
  {
    tableName: 'member_characters',
    timestamps: false,
  }
);

// MemberGame 모델 정의
const MemberGame = sequelize.define(
  'MemberGame',
  {
    member_id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    pwd: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    win: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lose: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    create_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'member_game',
    timestamps: false,
  }
);

// MemberCharacters 테이블 생성 및 데이터 삽입 함수
const createMemberCharactersTableAndInsertData = async () => {
  try {
    // 테이블에 데이터가 이미 있는지 확인
    const count = await MemberCharacters.count();
    if (count > 0) {
      console.log('member_characters 테이블에 데이터가 이미 존재합니다.');
      return;
    }
    await sequelize.sync(); // 테이블 생성
    await MemberCharacters.bulkCreate([
      { member_id: 'user1', character_id: 1, is_active: true },
      { member_id: 'user2', character_id: 2, is_active: false },
    ]);
    console.log('MemberCharacters 테이블 초기화 및 데이터 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

// MemberGame 테이블 생성 및 데이터 삽입 함수
const createTableAndInsertData = async () => {
  try {
    // 테이블에 데이터가 이미 있는지 확인
    const count = await MemberGame.count();
    if (count > 0) {
      console.log('member_game 테이블에 데이터가 이미 존재합니다.');
      return;
    }
    await sequelize.sync(); // 테이블 생성
    await MemberGame.bulkCreate(
      [
        { member_id: 'jhst', pwd: 'jhst', name: 'jhst', email: 'jhst@gmail.com', point: 9999999 },
        {
          member_id: 'user1',
          pwd: 'password123',
          name: 'John Doe',
          email: 'john@example.com',
          point: 100,
          win: 10,
          lose: 5,
        },
        {
          member_id: 'user2',
          pwd: 'password456',
          name: 'Jane Smith',
          email: 'jane@example.com',
          point: 150,
          win: 15,
          lose: 7,
        },
      ],
      {
        updateOnDuplicate: ['member_id'],
      }
    );
    console.log('MemberGame 테이블 생성 및 데이터 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

module.exports = {
  MemberCharacters,
  createMemberCharactersTableAndInsertData,
  MemberGame,
  createTableAndInsertData,
};
