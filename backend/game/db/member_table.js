const sequelize = require('../../config/db'); // sequelize
const { DataTypes } = require('sequelize');

// 멤버테이블 생성

const Member = sequelize.define(
  'Member',
  {
    member_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
      onDelete: 'CASCADE',
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
      allowNull: true,
      defaultValue: 0,
    },
    win: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    lose: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    create_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'member',
    timestamps: false,
  }
);

// 함수 멤버 테이블 추가, 관리자 계정

const createMemberTableAndInsertData = async () => {
  try {
    await sequelize.sync();
    await Member.bulkCreate([
      { member_id: 'jhst', pwd: 'jhst', name: 'jhst', email: 'jhst@gmail.com', point: 9999999 },
    ]);
    console.log('멤버 테이블 초기화 및 데이터 삽입 성공');
  } catch (err) {
    console.error('오류 발생: ', err);
  }
};

module.exports = { Member, createMemberTableAndInsertData };
