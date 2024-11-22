const { Game } = require('../../../db/gamedb'); 


let queues={
    'english-hard':[],
    'english-easy':[],
    'korea-hard':[],
    'korea-easy':[]
};

async function matching (socket,mode,difficulty,member_id,io){
    const queueKey=`${mode}-${difficulty}`;
    const queue= queues[queueKey];

    socket.member_id=member_id;

    if(queue.length>0){
        //대기열에 다른 클라언트 존재
        const matchedClient = queue.shift();
        const roomName = `${socket.id}-${matchedClient.id}`;

        //나와 상대방 위치 정보
        const myPlayer = { id: socket.id, member_id, x: 100, y: 100};
        const otherPlayer = { id: matchedClient.id,member_id:matchedClient.member_id, x: 300, y: 300};-

        //매칭된 client를 room에 조인
        matchedClient.join(roomName);
        socket.join(roomName);

        matchedClient.roomName = roomName;
        socket.roomName = roomName;

        // Game 테이블에 데이터 저장
        try {
            await Game.create({
             member_id: member_id,
             opposite_player: matchedClient.member_id,
             game_mode: mode,
             easy_or_hard: difficulty
            });
            console.log(`Game 데이터 저장 성공: ${member_id} vs ${matchedClient.member_id}`);
            console.log(`저장된 game_id: ${newGame.game_id}`);
        } catch (error) {
            console.error('Game 데이터 저장 중 오류 발생:', error);
        }

        // 상대방에게 초기 데이터 전송
        matchedClient.emit("matched", roomName, { myPlayer: otherPlayer, otherPlayer: myPlayer, game_id: newGame.game_id });
        socket.emit("matched", roomName, { myPlayer, otherPlayer , game_id: newGame.game_id});

        console.log(`매칭 성공: ${socket.id} <-> ${matchedClient.id}`);

        // 양쪽 클라이언트에 플레이어 정보 전송
        io.to(roomName).emit("updatePlayers", { myPlayer, otherPlayer });
    }
    else{
        //대기열에 클라이언트 없음
        queue.push(socket);
        console.log(`${queueKey}에 ${socket.id}추가`);
        socket.emit("msg","대기중....");
    }


    // 각 큐의 상태를 로그에 출력
    console.log("현재 큐 상태:");
    for (const key in queues) {
        const clientIds = queues[key].map(client => client.id); // 각 큐에 있는 클라이언트의 ID 목록
        console.log(`${key} 큐:`, clientIds);
    }
};

//대기열에서 client지움
function removeFromQueue(clientId) {
    for (const key in queues) {
        queues[key] = queues[key].filter(client => client.id !== clientId);
    }
}
module.exports={matching,removeFromQueue};