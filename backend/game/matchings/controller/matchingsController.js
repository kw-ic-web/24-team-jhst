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

        matchedClient.emit("redirectToRoom",roomName);
        socket.emit("redirectToRoom",roomName);
        console.log(`매칭 성공: ${socket.id} <-> ${matchedClient.id}`);
    }
    else{
        //대기열에 클라이언트 없음
        queue.push(socket);
        console.log(`${queueKey}에 ${socket.id}추가`);
        socket.emit("msg","대기중....");
    }
};

//대기열에서 client지움
function removeFromQueue(clientId) {
    for (const key in queues) {
        queues[key] = queues[key].filter(client => client.id !== clientId);
    }
}


module.exports={matching,removeFromQueue};