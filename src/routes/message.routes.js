import express from "express";
import {jwtVerify} from "../middlewares/auth.middlewares.js"
import { sendMessage, getAllMessage } from "../controllers/message.controllers.js";

const router = express.Router();

router.route("/:chatId").post(
    jwtVerify,
    sendMessage
)

router.route("/:chatId").get(
    jwtVerify,
    getAllMessage
)



export default router;