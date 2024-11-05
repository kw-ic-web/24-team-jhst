const sequelize = require('../../config/db');
const { DataTypes, Sequelize } = require('sequelize');

const MemberGame = sequelize.define(
  'MemberGame',
  {
    member_id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    pwd: {
      type: DataTypes.STRING(20),
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

const createTableAndInsertData = async () => {
  try {
    await sequelize.sync();
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
        {
          member_id: 'user3',
          pwd: 'password789',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          point: 120,
          win: 12,
          lose: 6,
        },
        {
          member_id: 'user4',
          pwd: 'password321',
          name: 'Bob Brown',
          email: 'bob@example.com',
          point: 80,
          win: 8,
          lose: 9,
        },
        {
          member_id: 'user5',
          pwd: 'password654',
          name: 'Charlie Black',
          email: 'charlie@example.com',
          point: 60,
          win: 6,
          lose: 3,
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

module.exports = { MemberGame, createTableAndInsertData };
