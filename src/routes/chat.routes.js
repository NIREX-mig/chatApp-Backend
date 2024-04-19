import express from "express";
import { verifyJwt } from "../middlewares/auth.middlewares";
import { addToChat } from "../controllers/chat.controllers";


const router = express.Router();

router.route("/addtochat").post(
    verifyJwt,
    addToChat
)

export default router;