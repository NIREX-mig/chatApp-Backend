import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import { createServer } from "node:http"
import { Server } from "socket.io";
import cors from "cors";

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
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
))

initialiseSocket(io);

// import routes 
import authRouter from "../src/routes/auth.routes.js"
import userRouter from "../src/routes/user.routes.js"
import chatRouter from "../src/routes/chat.routes.js"
import messageRouter from "../src/routes/message.routes.js"
import { initialiseSocket } from "./socket/index.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/message", messageRouter)

export { httpServer }