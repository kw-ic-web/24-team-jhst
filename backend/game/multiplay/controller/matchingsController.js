const { Game } = require('../../../db/gamedb'); 
const jwt = require('jsonwebtoken');

let queues = {
    'english-hard': [],
    'english-easy': [],
    'korea-hard': [],
    'korea-easy': []
};

async function matching(socket, mode, difficulty, token, io) {
    const queueKey = `${mode}-${difficulty}`;
    const queue = queues[queueKey];

    // JWT 토큰에서 사용자 ID 추출
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 시크릿 키 사용
    const member_id = decoded.id; // 토큰에서 사용자 ID 가져오기

    socket.member_id = member_id;

    if (queue.length > 0) {
        const matchedClient = queue.shift();
        const roomName = `${socket.id}-${matchedClient.id}`;

        const myPlayer = { id: socket.id, member_id, x: 100, y: 100 };
        const otherPlayer = { id: matchedClient.id, member_id: matchedClient.member_id, x: 300, y: 300 };

        matchedClient.join(roomName);
        socket.join(roomName);

        matchedClient.roomName = roomName;
        socket.roomName = roomName;

        try {
            const newGame = await Game.create({
                member_id: member_id,
                opposite_player: matchedClient.member_id,
                game_mode: mode,
                easy_or_hard: difficulty,
            });

            matchedClient.emit('matched', roomName, { myPlayer: otherPlayer, otherPlayer: myPlayer, game_id: newGame.game_id });
            socket.emit('matched', roomName, { myPlayer, otherPlayer, game_id: newGame.game_id });
        } catch (error) {
            console.error('Game 데이터 저장 중 오류 발생:', error);
        }
    } else {
        queue.push(socket);
        socket.emit('msg', '대기중....');
    }
}
    // 각 큐의 상태를 로그에 출력
    console.log("현재 큐 상태:");
    for (const key in queues) {
        const clientIds = queues[key].map(client => client.id); // 각 큐에 있는 클라이언트의 ID 목록
        console.log(`${key} 큐:`, clientIds);
    }


// 대기열에서 client 제거
function removeFromQueue(clientId) {
    for (const key in queues) {
        queues[key] = queues[key].filter(client => client.id !== clientId);
    }
}

module.exports = { matching, removeFromQueue };
