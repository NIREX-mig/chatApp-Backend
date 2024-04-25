import express from "express";
import { jwtVerify } from "../middlewares/auth.middlewares.js";
import { createOneToOnechat, searchAvailableUsers, fetchAllChats } from "../controllers/chat.controllers.js";


const router = express.Router();

router.route("/createOneToOnechat/:receiverId").post(
    jwtVerify,
    createOneToOnechat
);

router.route("/fetchchats").get(
    jwtVerify,
    fetchAllChats
)

router.route("/search").get(
    jwtVerify,
    searchAvailableUsers
);

export default router;