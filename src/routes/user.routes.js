import express from "express";
import { updateprofilepic} from "../controllers/user.controllers.js";
import {verifyJwt} from "../middlewares/auth.middlewares.js";
import {upload} from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.route("/updateprofilepic").post(
    verifyJwt,
    upload.single("avatar"),
    updateprofilepic
)


export default router;