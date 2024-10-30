const { Sequelize } = require('../../config/db');
const { MemberGame } = require('../db/member_game');

const getRankings = async () => {
  try {
    const results = await MemberGame.findAll({
      attributes: [
        'member_id',
        'win',
        'lose',
        [Sequelize.literal('(win / (win + lose)) * 100'), 'win_rate'],
        [
          Sequelize.literal(
            'RANK() OVER (ORDER BY (win / (win + lose)) * 100 DESC)'
          ),
          'ranking'
        ]
      ],
      where: {
        [Sequelize.Op.and]: [
          { win: { [Sequelize.Op.gt]: 0 } },
          { lose: { [Sequelize.Op.gt]: 0 } }
        ]
      },
      order: [Sequelize.literal('ranking')],
      raw: true
    });
    return results;
  } catch (err) {
    throw err;
  }
};

module.exports = { getRankings };
