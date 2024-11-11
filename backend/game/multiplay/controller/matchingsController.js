let queues={
    'english-hard':[],
    'english-easy':[],
    'korea-hard':[],
    'korea-easy':[]
};

function matching (socket,mode,difficulty,io){
    const queueKey=`${mode}-${difficulty}`;
    const queue= queues[queueKey];

    if(queue.length>0){
        //대기열에 다른 클라언트 존재
        const matchedClient = queue.shift();
        const roomName = `${socket.id}-${matchedClient.id}`;

        //매칭된 client를 room에 조인
        matchedClient.join(roomName);
        socket.join(roomName);

        matchedClient.roomName = roomName;
        socket.roomName = roomName;

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