import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app)

const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    },
});

app.set("io" , io);

app.use(express.json({ limit : "16kb"}));
app.use(urlencoded({extended : true, limit : "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

export {httpServer}