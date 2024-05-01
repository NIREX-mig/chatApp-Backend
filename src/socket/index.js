const mountUserInSocket = (chatId) => {

}

const initialiseSocket = (io) => {
    return io.on('connection', (socket) => {

        socket.on("join_chat" , (chatId)=>{
            socket.join(chatId);
            console.log("join user with chat id " + chatId)
        })

        socket.on("private_message", ({message,room}) =>{
            socket.to(room).emit("private_message", { message })
        })  

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    })

}

export { initialiseSocket }