import express from "express";
import { updateprofilepic} from "../controllers/user.controllers.js";
import {verifyJwt} from "../middlewares/auth.middlewares.js"


const router = express.Router();

router.route("/updateprofilepic").post(
    verifyJwt,
    updateprofilepic
)


export default router;