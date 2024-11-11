const { Server } = require("socket.io");
const { matching,removeFromQueue } =require("../matchings/controller/matchingsController");

const socketHandler=(server)=>{
    const io = new Server(server);
    let user={}; //접속한 유저 관리?

    io.on("connection",(socket)=>{
        const socket_id=socket.id;
        console.log("connection!",socket_id);

        user[socket.id]={member_id:"member_id"}; //연결된 회원을 user에 추가

        socket.on("disconnect",()=>{
            console.log(socket_id,"가 접속 종료");
            delete user[socket.id];
            removeFromQueue(socket.id);
        });

        socket.on("showID",(msg)=>{ 
            console.log(msg);
            socket.emit("getID",socket.id); //소켓 아이디를 넘겨줌
        });

        socket.on("matching",(data)=>{
            //data에 모드와 난이도 정보 받아와
            const {mode,difficulty}=data;
            console.log("모드:",mode,"난이도:",difficulty);
            matching(socket,mode,difficulty,io);
            //io는 room에서 소통하려고
            //socket.emit("msg","여기에 매칭정보 넣을꺼임...");
        });

        
        //페이지 로드로 인한 재참여
        socket.on("joinRoom", (roomName) => {
            socket.join(roomName);
            console.log(`${socket.id} joined room: ${roomName}`);
        });

        

        // //룸에서 메시지 전달
        // socket.on("sendGreeting",(roomName,message)=>{
        //     io.to(roomName).emit("msg",message);
        // });
    });
    

};

module.exports=socketHandler;