const { MemberGame } = require('../../config/db'); // Import the MemberGame model

// 회원 정보 조회
exports.viewInfo = async (req, res) => {
  const memberId = req.user.id;

  try {
    const result = await MemberGame.findOne({
      attributes: ['name', 'email', 'point'],
      where: { member_id: memberId },
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: '회원 정보를 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ error: '회원 정보 조회에 실패했습니다.' });
  }
};

// 회원 탈퇴
exports.deleteMember = async (req, res) => {
  const memberId = req.user.id;

  try {
    const result = await MemberGame.destroy({
      where: { member_id: memberId },
    });
    if (result > 0) {
      res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
    } else {
      res.status(404).json({ message: '회원 정보를 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ error: '회원 탈퇴에 실패했습니다.' });
  }
};

// 회원 정보 수정
exports.updateMember = async (req, res) => {
  const memberId = req.user.id;
  const { name, email, pwd } = req.body;

  try {
    const result = await MemberGame.update({ name, email, pwd }, { where: { member_id: memberId } });
    if (result[0] > 0) {
      // Sequelize returns an array; the first element indicates the number of affected rows
      res.status(200).json({ message: '회원 정보가 성공적으로 수정되었습니다.' });
    } else {
      res.status(404).json({ message: '회원 정보를 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ error: '회원 정보 수정에 실패했습니다.' });
  }
};
