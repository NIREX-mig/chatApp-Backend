import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import { createServer } from "node:http"
import { Server } from "socket.io";

const app = express();



const httpServer = createServer(app);

const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.SOCKET_CORS_ORIGIN,
        credentials: true,
    },
});

app.set("io", io);

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// import routes 
import authRouter from "../src/routes/auth.routes.js"
import userRouter from "../src/routes/user.routes.js"

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
// app.use("/api/v1/chat", chatRouter)
// app.use("/api/v1/message", messageRouter)

export { httpServer }