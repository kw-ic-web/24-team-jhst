const express = require('express');
const router = express.Router();
const { Game } = require('../../../db/gamedb');
const Sequelize = require('sequelize');


router.post("/winner", async (req, res, next) => {
    const { member_id, opposite_player, game_mode, easy_or_hard, winner } = req.body;

    try {
        // Sequelize를 사용하여 Game 테이블에 데이터 삽입
        const game = await Game.create({
            member_id,
            opposite_player,
            game_mode,
            easy_or_hard,
            winner,
        });

        console.log(`Game 데이터 저장 성공: ${game.member_id} vs ${game.opposite_player}`);
        res.status(200).json({ message: "Game 데이터 저장 성공", data: game });
    } catch (error) {
        console.error("Game 데이터 저장 중 오류 발생:", error.message);
        res.status(500).json({ message: "Game 데이터 저장 실패", error: error.message });
    }
});


module.exports = router;