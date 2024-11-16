let queues={
    'english-hard':[],
    'english-easy':[],
    'korea-hard':[],
    'korea-easy':[]
};

async function matching (socket,mode,difficulty,member_id,io){
    const queueKey=`${mode}-${difficulty}`;
    const queue= queues[queueKey];

    //member_id저장
    socket.member_id=member_id;

    if(queue.length>0){
        //대기열에 다른 클라언트 존재
        const matchedClient = queue.shift();
        const roomName = `${socket.id}-${matchedClient.id}`;

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
        } catch (error) {
            console.error('Game 데이터 저장 중 오류 발생:', error);
        }

        matchedClient.emit("matched", roomName);
        socket.emit("matched", roomName);
        console.log(`매칭 성공: ${socket.id} <-> ${matchedClient.id}`);
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