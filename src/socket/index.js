const initialiseSocket = async (io) => {
    return io.on('connection', (socket) => {

        console.log("socked connected....");

        socket.on("join_chat", (chatId) => {
            socket.join(chatId);
            console.log("user Join Room with chatId : " + chatId);
        });

        socket.on("private_message", (newMessage) => {
            const chatId = newMessage.chat;
                socket.in(chatId).emit("received_message", newMessage)
        })

        socket.on("start_typing", (chatId) => {
            socket.in(chatId).emit("start_typing", chatId);
        });

        socket.on("stop_typing", (chatId) => {
            socket.in(chatId).emit("stop_typing", chatId);
        });

        socket.on("add_chat", ({ newChat, receiverId }) => {
            io.emit("add_chat", { newChat });
        })
        socket.on("chat_leave", ({ chatId }) => {
            socket.leave(chatId)
            console.log("leave room " + chatId)
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    })

}

export { initialiseSocket }